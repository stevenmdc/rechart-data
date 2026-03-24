import { ChartKind, DatasetFieldMeta, DatasetRow, ParsedJsonDataset, PrimitiveCell } from '@/types/data';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeCell(value: unknown): PrimitiveCell {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  return JSON.stringify(value);
}

function looksLikeDateString(value: PrimitiveCell): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();

  if (trimmed.length < 7) {
    return false;
  }

  if (!trimmed.includes('-') && !trimmed.includes('/')) {
    return false;
  }

  return Number.isFinite(Date.parse(trimmed));
}

function collectCandidates(value: unknown, path: string, candidates: Array<{ path: string; value: unknown[] }>) {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      candidates.push({ path, value });
    }

    value.forEach((item, index) => {
      if (Array.isArray(item) || isPlainObject(item)) {
        collectCandidates(item, `${path}[${index}]`, candidates);
      }
    });

    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  Object.entries(value).forEach(([key, entry]) => {
    if (Array.isArray(entry) || isPlainObject(entry)) {
      collectCandidates(entry, `${path}.${key}`, candidates);
    }
  });
}

function scoreCandidate(candidate: unknown[]): number {
  const objectCount = candidate.filter((entry) => isPlainObject(entry)).length;
  const primitiveCount = candidate.length - objectCount;
  return candidate.length * 100 + objectCount * 40 + primitiveCount * 10;
}

function createRows(candidate: unknown[]): { rows: DatasetRow[]; keys: string[] } {
  const allObjects = candidate.every((entry) => isPlainObject(entry));

  if (!allObjects) {
    return {
      rows: candidate.map((entry, index) => ({
        index: index + 1,
        value: normalizeCell(entry),
      })),
      keys: ['index', 'value'],
    };
  }

  const keys: string[] = [];

  candidate.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
  });

  return {
    rows: candidate.map((entry) => {
      const row: DatasetRow = {};

      keys.forEach((key) => {
        row[key] = normalizeCell(entry[key]);
      });

      return row;
    }),
    keys,
  };
}

function analyzeFields(rows: DatasetRow[], keys: string[]): {
  emptyValueCount: number;
  fields: DatasetFieldMeta[];
  numericKeys: string[];
  temporalKeys: string[];
} {
  let emptyValueCount = 0;

  const fields = keys.map((key) => {
    const values = rows.map((row) => row[key] ?? null);
    const presentValues = values.filter((value) => value !== null);
    const numberCount = presentValues.filter((value) => typeof value === 'number').length;
    const stringCount = presentValues.filter((value) => typeof value === 'string').length;
    const booleanCount = presentValues.filter((value) => typeof value === 'boolean').length;
    const dateLikeCount = presentValues.filter((value) => looksLikeDateString(value)).length;

    emptyValueCount += values.length - presentValues.length;

    let kind: DatasetFieldMeta['kind'] = 'empty';

    if (numberCount > 0 && stringCount === 0 && booleanCount === 0) {
      kind = 'number';
    } else if (stringCount > 0 && numberCount === 0 && booleanCount === 0) {
      kind = 'string';
    } else if (booleanCount > 0 && numberCount === 0 && stringCount === 0) {
      kind = 'boolean';
    } else if (presentValues.length > 0) {
      kind = 'mixed';
    }

    return {
      key,
      kind,
      distinctCount: new Set(presentValues.map((value) => String(value))).size,
      completeness: rows.length > 0 ? presentValues.length / rows.length : 0,
      dateLike: stringCount > 0 && dateLikeCount / stringCount >= 0.6,
    };
  });

  return {
    emptyValueCount,
    fields,
    numericKeys: fields.filter((field) => field.kind === 'number').map((field) => field.key),
    temporalKeys: fields.filter((field) => field.dateLike).map((field) => field.key),
  };
}

export function analyzeJsonValue(value: unknown, sourceName: string): ParsedJsonDataset {
  const candidates: Array<{ path: string; value: unknown[] }> = [];
  collectCandidates(value, '$', candidates);

  let selectedPath = '$';
  let selectedValue: unknown[] | null = null;

  if (candidates.length > 0) {
    const bestCandidate = [...candidates].sort((left, right) => scoreCandidate(right.value) - scoreCandidate(left.value))[0];
    selectedPath = bestCandidate.path;
    selectedValue = bestCandidate.value;
  } else if (isPlainObject(value)) {
    selectedValue = [value];
  } else if (value !== undefined) {
    selectedValue = [value];
  }

  if (!selectedValue || selectedValue.length === 0) {
    throw new Error('No usable collection was found in this JSON file.');
  }

  const { rows, keys } = createRows(selectedValue);
  const { emptyValueCount, fields, numericKeys, temporalKeys } = analyzeFields(rows, keys);
  const categoryKeys = fields
    .filter((field) => (field.kind === 'string' || field.kind === 'boolean') && !field.dateLike)
    .map((field) => field.key);

  return {
    allKeys: keys,
    categoryKeys,
    datasetPath: selectedPath,
    emptyValueCount,
    fields,
    numericKeys,
    rows,
    sourceName,
    temporalKeys,
  };
}

export function parseJsonText(fileContent: string, sourceName: string): ParsedJsonDataset {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(fileContent);
  } catch {
    throw new Error('The selected file is not valid JSON.');
  }

  return analyzeJsonValue(parsedValue, sourceName);
}

export function getDefaultChartConfig(dataset: ParsedJsonDataset): {
  chartType: ChartKind;
  xKey: string;
  yKeys: string[];
} {
  const preferredXKey =
    dataset.temporalKeys[0] ??
    dataset.categoryKeys[0] ??
    dataset.allKeys.find((key) => !dataset.numericKeys.includes(key)) ??
    dataset.allKeys[0] ??
    '';

  let yKeys = dataset.numericKeys.filter((key) => key !== preferredXKey).slice(0, 2);

  if (yKeys.length === 0 && dataset.numericKeys.length > 0) {
    yKeys = dataset.numericKeys.slice(0, 1);
  }

  return {
    chartType: dataset.temporalKeys.includes(preferredXKey) ? 'line' : 'bar',
    xKey: preferredXKey,
    yKeys,
  };
}

export function getSeriesStats(rows: DatasetRow[], key: string) {
  const numericValues = rows
    .map((row) => row[key])
    .filter((value): value is number => typeof value === 'number');

  if (numericValues.length === 0) {
    return null;
  }

  const total = numericValues.reduce((sum, value) => sum + value, 0);

  return {
    average: total / numericValues.length,
    last: numericValues[numericValues.length - 1],
    max: Math.max(...numericValues),
    min: Math.min(...numericValues),
  };
}

export function formatCellValue(value: PrimitiveCell): string {
  if (value === null) {
    return '--';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return value;
}

function buildTemplateValue(
  field: DatasetFieldMeta,
  rowIndex: number
): PrimitiveCell {
  if (field.dateLike) {
    const month = String((rowIndex % 12) + 1).padStart(2, '0');
    return `2026-${month}`;
  }

  if (field.kind === 'number') {
    return (rowIndex + 1) * 100;
  }

  if (field.kind === 'boolean') {
    return rowIndex % 2 === 0;
  }

  if (field.kind === 'string') {
    return `${field.key}-${rowIndex + 1}`;
  }

  return null;
}

export function buildDatasetTemplate(dataset: ParsedJsonDataset): string {
  const templateRows = Array.from({ length: 3 }, (_, rowIndex) => {
    const row: DatasetRow = {};

    dataset.fields.forEach((field) => {
      row[field.key] = buildTemplateValue(field, rowIndex);
    });

    return row;
  });

  return JSON.stringify(templateRows, null, 2);
}

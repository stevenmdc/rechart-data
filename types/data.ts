export type PrimitiveCell = string | number | boolean | null;
export type DatasetRow = Record<string, PrimitiveCell>;
export type ChartKind = 'line' | 'bar' | 'area';

export interface DatasetFieldMeta {
  key: string;
  kind: 'number' | 'string' | 'boolean' | 'mixed' | 'empty';
  distinctCount: number;
  completeness: number;
  dateLike: boolean;
}

export interface ParsedJsonDataset {
  allKeys: string[];
  categoryKeys: string[];
  datasetPath: string;
  emptyValueCount: number;
  fields: DatasetFieldMeta[];
  numericKeys: string[];
  rows: DatasetRow[];
  sourceName: string;
  temporalKeys: string[];
}

'use client';

import { ParsedJsonDataset } from '@/types/data';
import { formatCellValue } from '@/lib/jsonDataset';

interface DataPreviewTableProps {
  dataset: ParsedJsonDataset;
}

export function DataPreviewTable({ dataset }: DataPreviewTableProps) {
  const previewRows = dataset.rows.slice(0, 8);

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white/75 p-6 shadow-[0_20px_70px_rgba(20,33,61,0.1)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-ink/50">Preview</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Data table</h2>
        </div>
        <span className="rounded-full border border-ink/10 bg-sand px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-ink/65">
          8 rows max
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-ink/8">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-ink text-sand">
              <tr>
                {dataset.allKeys.map((key) => (
                  <th className="px-4 py-3 font-mono text-xs uppercase tracking-[0.18em]" key={key}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8 bg-white/60">
              {previewRows.map((row, rowIndex) => (
                <tr className="align-top" key={`${dataset.sourceName}-${rowIndex}`}>
                  {dataset.allKeys.map((key) => (
                    <td className="max-w-[220px] px-4 py-3 text-ink/78" key={`${rowIndex}-${key}`}>
                      <span className="block truncate">{formatCellValue(row[key])}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

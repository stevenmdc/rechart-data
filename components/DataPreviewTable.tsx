'use client';

import { ParsedJsonDataset } from '@/types/data';
import { formatCellValue } from '@/lib/jsonDataset';

interface DataPreviewTableProps {
  compact?: boolean;
  dataset: ParsedJsonDataset;
}

export function DataPreviewTable({ compact = false, dataset }: DataPreviewTableProps) {
  const previewRows = dataset.rows.slice(0, 8);

  return (
    <section
      className={
        compact
          ? 'rounded-[1.15rem] border border-ink/8 bg-white/55 p-4'
          : 'rounded-[1.75rem] border border-ink/10 bg-white/75 p-6 shadow-[0_20px_70px_rgba(20,33,61,0.1)] backdrop-blur'
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className={`uppercase tracking-[0.24em] text-ink/50 ${compact ? 'text-[10px]' : 'text-sm'}`}>Preview</p>
          <h2 className={`mt-2 font-semibold tracking-[-0.04em] text-ink ${compact ? 'text-lg' : 'text-2xl'}`}>Data table</h2>
        </div>
        <span className="rounded-full border border-ink/10 bg-sand px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/65">
          8 rows max
        </span>
      </div>

      <div className={`overflow-hidden rounded-[1.15rem] border border-ink/8 ${compact ? 'mt-4' : 'mt-6'}`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full border-collapse text-left ${compact ? 'text-xs' : 'text-sm'}`}>
            <thead className="bg-ink text-sand">
              <tr>
                {dataset.allKeys.map((key) => (
                  <th className={`font-mono uppercase tracking-[0.18em] ${compact ? 'px-3 py-2 text-[10px]' : 'px-4 py-3 text-xs'}`} key={key}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8 bg-white/60">
              {previewRows.map((row, rowIndex) => (
                <tr className="align-top" key={`${dataset.sourceName}-${rowIndex}`}>
                  {dataset.allKeys.map((key) => (
                    <td className={`max-w-[220px] text-ink/78 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`} key={`${rowIndex}-${key}`}>
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

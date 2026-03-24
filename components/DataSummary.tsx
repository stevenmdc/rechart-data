'use client';

import { ParsedJsonDataset } from '@/types/data';
import { getSeriesStats } from '@/lib/jsonDataset';

interface DataSummaryProps {
  compact?: boolean;
  dataset: ParsedJsonDataset;
  xKey: string;
  yKeys: string[];
}

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export function DataSummary({ compact = false, dataset, xKey, yKeys }: DataSummaryProps) {
  const xField = dataset.fields.find((field) => field.key === xKey);

  return (
    <section
      className={
        compact
          ? 'rounded-[1.15rem] border border-ink/8 bg-white/55 p-4 text-ink'
          : 'rounded-[1.75rem] border border-ink/10 bg-ink p-6 text-sand shadow-[0_20px_70px_rgba(20,33,61,0.16)]'
      }
    >
      <div>
        <p className={`uppercase tracking-[0.24em] ${compact ? 'text-[10px] text-ink/45' : 'text-sm text-sand/45'}`}>
          Quick read
        </p>
        <h2 className={`mt-2 font-semibold tracking-[-0.04em] ${compact ? 'text-lg text-ink' : 'text-2xl'}`}>
          Dataset summary
        </h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className={`rounded-[1.15rem] p-4 ${compact ? 'border border-ink/8 bg-sand/60' : 'border border-white/10 bg-white/5'}`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Source</p>
          <p className={`mt-2 break-all font-mono ${compact ? 'text-xs text-ink' : 'text-sm text-sand'}`}>{dataset.sourceName}</p>
          <p className={`mt-3 text-xs ${compact ? 'text-ink/55' : 'text-sand/55'}`}>{dataset.datasetPath}</p>
        </article>
        <article className={`rounded-[1.15rem] p-4 ${compact ? 'border border-ink/8 bg-sand/60' : 'border border-white/10 bg-white/5'}`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Volume</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className={`${compact ? 'text-lg' : 'text-2xl'} font-semibold`}>{dataset.rows.length}</p>
              <p className={`text-xs ${compact ? 'text-ink/55' : 'text-sand/55'}`}>rows</p>
            </div>
            <div>
              <p className={`${compact ? 'text-lg' : 'text-2xl'} font-semibold`}>{dataset.allKeys.length}</p>
              <p className={`text-xs ${compact ? 'text-ink/55' : 'text-sand/55'}`}>fields</p>
            </div>
            <div>
              <p className={`${compact ? 'text-lg' : 'text-2xl'} font-semibold`}>{dataset.emptyValueCount}</p>
              <p className={`text-xs ${compact ? 'text-ink/55' : 'text-sand/55'}`}>empty</p>
            </div>
          </div>
        </article>
      </div>

      <article className={`mt-4 rounded-[1.15rem] p-4 ${compact ? 'border border-ink/8 bg-sand/60' : 'border border-white/10 bg-white/5'}`}>
        <p className={`text-xs uppercase tracking-[0.2em] ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Primary axis</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 font-mono ${compact ? 'bg-white text-xs text-ink' : 'bg-white/10 text-sm'}`}>{xKey}</span>
          <span className={`text-sm ${compact ? 'text-ink/60' : 'text-sand/60'}`}>
            {xField?.dateLike ? 'time-like field detected' : `type ${xField?.kind ?? 'unknown'}`}
          </span>
        </div>
      </article>

      <div className="mt-4 space-y-4">
        {yKeys.map((key) => {
          const stats = getSeriesStats(dataset.rows, key);

          return (
            <article
              className={`rounded-[1.15rem] p-4 ${compact ? 'border border-ink/8 bg-sand/60' : 'border border-white/10 bg-white/5'}`}
              key={key}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`text-xs uppercase tracking-[0.2em] ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Active series</p>
                  <h3 className={`mt-1 font-mono ${compact ? 'text-base' : 'text-lg'}`}>{key}</h3>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                    compact ? 'border border-ink/10 text-ink/65' : 'border border-white/10 text-sand/65'
                  }`}
                >
                  metric
                </span>
              </div>

              {stats ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className={`rounded-2xl p-3 ${compact ? 'bg-white' : 'bg-white/6'}`}>
                    <p className={`text-xs ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Min</p>
                    <p className={`mt-2 font-semibold ${compact ? 'text-base' : 'text-xl'}`}>{formatter.format(stats.min)}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${compact ? 'bg-white' : 'bg-white/6'}`}>
                    <p className={`text-xs ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Max</p>
                    <p className={`mt-2 font-semibold ${compact ? 'text-base' : 'text-xl'}`}>{formatter.format(stats.max)}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${compact ? 'bg-white' : 'bg-white/6'}`}>
                    <p className={`text-xs ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Average</p>
                    <p className={`mt-2 font-semibold ${compact ? 'text-base' : 'text-xl'}`}>{formatter.format(stats.average)}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${compact ? 'bg-white' : 'bg-white/6'}`}>
                    <p className={`text-xs ${compact ? 'text-ink/45' : 'text-sand/45'}`}>Last value</p>
                    <p className={`mt-2 font-semibold ${compact ? 'text-base' : 'text-xl'}`}>{formatter.format(stats.last)}</p>
                  </div>
                </div>
              ) : (
                <p className={`mt-4 text-sm ${compact ? 'text-ink/60' : 'text-sand/60'}`}>Unable to compute stats for this metric.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

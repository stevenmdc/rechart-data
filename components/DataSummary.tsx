'use client';

import { ParsedJsonDataset } from '@/types/data';
import { getSeriesStats } from '@/lib/jsonDataset';

interface DataSummaryProps {
  dataset: ParsedJsonDataset;
  xKey: string;
  yKeys: string[];
}

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export function DataSummary({ dataset, xKey, yKeys }: DataSummaryProps) {
  const xField = dataset.fields.find((field) => field.key === xKey);

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-ink p-6 text-sand shadow-[0_20px_70px_rgba(20,33,61,0.16)]">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-sand/45">Quick read</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Dataset summary</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sand/45">Source</p>
          <p className="mt-2 break-all font-mono text-sm text-sand">{dataset.sourceName}</p>
          <p className="mt-3 text-xs text-sand/55">{dataset.datasetPath}</p>
        </article>
        <article className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sand/45">Volume</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-2xl font-semibold">{dataset.rows.length}</p>
              <p className="text-xs text-sand/55">rows</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{dataset.allKeys.length}</p>
              <p className="text-xs text-sand/55">fields</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{dataset.emptyValueCount}</p>
              <p className="text-xs text-sand/55">empty</p>
            </div>
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-sand/45">Primary axis</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm">{xKey}</span>
          <span className="text-sm text-sand/60">
            {xField?.dateLike ? 'time-like field detected' : `type ${xField?.kind ?? 'unknown'}`}
          </span>
        </div>
      </article>

      <div className="mt-4 space-y-4">
        {yKeys.map((key) => {
          const stats = getSeriesStats(dataset.rows, key);

          return (
            <article className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4" key={key}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sand/45">Active series</p>
                  <h3 className="mt-1 font-mono text-lg">{key}</h3>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sand/65">
                  metric
                </span>
              </div>

              {stats ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-sand/45">Min</p>
                    <p className="mt-2 text-xl font-semibold">{formatter.format(stats.min)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-sand/45">Max</p>
                    <p className="mt-2 text-xl font-semibold">{formatter.format(stats.max)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-sand/45">Average</p>
                    <p className="mt-2 text-xl font-semibold">{formatter.format(stats.average)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/6 p-3">
                    <p className="text-xs text-sand/45">Last value</p>
                    <p className="mt-2 text-xl font-semibold">{formatter.format(stats.last)}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-sand/60">Unable to compute stats for this metric.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import { ChartKind, ParsedJsonDataset } from '@/types/data';

interface ChartSettingsModalProps {
  chartType: ChartKind;
  dataset: ParsedJsonDataset;
  isOpen: boolean;
  onChartTypeChange: (value: ChartKind) => void;
  onClose: () => void;
  onExportTemplate: () => void;
  onToggleYKey: (key: string) => void;
  onUseDemo: () => void;
  onXKeyChange: (key: string) => void;
  xKey: string;
  yKeys: string[];
}

const chartKinds: ChartKind[] = ['line', 'bar', 'area'];

export function ChartSettingsModal({
  chartType,
  dataset,
  isOpen,
  onChartTypeChange,
  onClose,
  onExportTemplate,
  onToggleYKey,
  onUseDemo,
  onXKeyChange,
  xKey,
  yKeys,
}: ChartSettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 backdrop-blur sm:items-center">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-ink/10 bg-[#fffaf1] p-6 shadow-[0_28px_120px_rgba(20,33,61,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink/45">Settings</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Chart settings</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Adjust the visual style, the main axis, and the displayed series without leaving the chart view.
            </p>
          </div>
          <button
            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink/70 transition hover:border-ink/25"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="rounded-[1.35rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Dataset</p>
                <p className="mt-2 break-all font-mono text-sm text-ink">{dataset.sourceName}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm text-ink transition hover:border-ink/25"
                  onClick={onExportTemplate}
                  type="button"
                >
                  Export template
                </button>
                <button
                  className="rounded-full border border-ink/10 bg-sand px-4 py-2 text-sm text-ink transition hover:border-ink/25"
                  onClick={onUseDemo}
                  type="button"
                >
                  Load demo
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Chart type</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {chartKinds.map((kind) => (
                <button
                  className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    chartType === kind
                      ? 'bg-ink text-sand shadow-[0_16px_30px_rgba(20,33,61,0.14)]'
                      : 'border border-ink/10 bg-sand text-ink hover:border-ink/25'
                  }`}
                  key={kind}
                  onClick={() => onChartTypeChange(kind)}
                  type="button"
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[1.35rem] border border-ink/10 bg-white/70 p-4">
              <label className="text-xs uppercase tracking-[0.2em] text-ink/45" htmlFor="chart-x-axis">
                X axis
              </label>
              <select
                className="mt-3 w-full rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink outline-none transition focus:border-coral"
                id="chart-x-axis"
                onChange={(event) => onXKeyChange(event.target.value)}
                value={xKey}
              >
                {dataset.allKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-xs leading-5 text-ink/55">
                The app prioritizes dates or readable categories to keep the chart more stable by default.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-ink/10 bg-white/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Y series</p>
                <span className="text-xs text-ink/45">1 to 3 metrics</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {dataset.numericKeys.map((key) => {
                  const isSelected = yKeys.includes(key);
                  const isDisabled = key === xKey || (!isSelected && yKeys.length >= 3);

                  return (
                    <button
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-ink bg-ink text-sand'
                          : isDisabled
                            ? 'cursor-not-allowed border-ink/8 bg-sand/60 text-ink/35'
                            : 'border-ink/10 bg-sand text-ink hover:border-ink/25'
                      }`}
                      disabled={isDisabled}
                      key={key}
                      onClick={() => onToggleYKey(key)}
                      type="button"
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

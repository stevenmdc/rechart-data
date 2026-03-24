'use client';

import dynamic from 'next/dynamic';
import { startTransition, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Settings2, Upload } from 'lucide-react';
import { ChartSettingsModal } from '@/components/ChartSettingsModal';
import { DataSummary } from '@/components/DataSummary';
import { DataPreviewTable } from '@/components/DataPreviewTable';
import { demoDataset } from '@/lib/demoDataset';
import { analyzeJsonValue, buildDatasetTemplate, getDefaultChartConfig, parseJsonText } from '@/lib/jsonDataset';
import { ChartKind, ParsedJsonDataset } from '@/types/data';

const DataChart = dynamic(() => import('@/components/DataChart').then((module) => module.DataChart), {
  ssr: false,
  loading: () => (
    <section className="rounded-[1.75rem] bg-white/80 p-5 shadow-[0_20px_70px_rgba(20,33,61,0.08)] backdrop-blur sm:p-6">
      <div className="flex h-[440px] items-center justify-center rounded-[1.5rem] border border-dashed border-ink/14 bg-white/45 px-6 text-center text-sm text-ink/65 sm:h-[520px]">
        Preparing chart...
      </div>
    </section>
  ),
});

const demoAnalysis = analyzeJsonValue(demoDataset, 'demo-rechart-data.json');
const demoChartConfig = getDefaultChartConfig(demoAnalysis);

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dataset, setDataset] = useState<ParsedJsonDataset>(demoAnalysis);
  const [chartType, setChartType] = useState<ChartKind>(demoChartConfig.chartType);
  const [xKey, setXKey] = useState(demoChartConfig.xKey);
  const [yKeys, setYKeys] = useState<string[]>(demoChartConfig.yKeys);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const applyDataset = (nextDataset: ParsedJsonDataset) => {
    const defaults = getDefaultChartConfig(nextDataset);

    startTransition(() => {
      setDataset(nextDataset);
      setChartType(defaults.chartType);
      setXKey(defaults.xKey);
      setYKeys(defaults.yKeys);
      setError(null);
    });
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);

    try {
      const fileContent = await file.text();
      const parsedDataset = parseJsonText(fileContent, file.name);
      applyDataset(parsedDataset);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to read this JSON file.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    applyDataset(demoAnalysis);
  };

  const handleExportTemplate = () => {
    const template = buildDatasetTemplate(dataset);
    const blob = new Blob([template], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${dataset.sourceName.replace(/\.json$/i, '') || 'dataset'}-template.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleXKeyChange = (nextXKey: string) => {
    setXKey(nextXKey);

    if (!yKeys.includes(nextXKey)) {
      return;
    }

    const filteredYKeys = yKeys.filter((key) => key !== nextXKey);

    if (filteredYKeys.length > 0) {
      setYKeys(filteredYKeys);
      return;
    }

    const fallbackMetric = dataset.numericKeys.find((key) => key !== nextXKey);
    setYKeys(fallbackMetric ? [fallbackMetric] : []);
  };

  const handleToggleYKey = (key: string) => {
    setYKeys((currentKeys) => {
      if (currentKeys.includes(key)) {
        if (currentKeys.length === 1) {
          return currentKeys;
        }

        return currentKeys.filter((currentKey) => currentKey !== key);
      }

      if (currentKeys.length >= 3) {
        return currentKeys;
      }

      return [...currentKeys, key];
    });
  };

  return (
    <div className="min-h-screen">
      <input
        accept=".json,application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleFileSelect(file);
          }

          event.target.value = '';
        }}
        ref={fileInputRef}
        type="file"
      />

      <ChartSettingsModal
        chartType={chartType}
        dataset={dataset}
        isOpen={isSettingsOpen}
        onChartTypeChange={setChartType}
        onClose={() => setIsSettingsOpen(false)}
        onExportTemplate={handleExportTemplate}
        onToggleYKey={handleToggleYKey}
        onUseDemo={handleUseDemo}
        onXKeyChange={handleXKeyChange}
        xKey={xKey}
        yKeys={yKeys}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header aria-label="Application header" className="sr-only">
          <h1>rechart-data</h1>
        </header>

        {error ? (
          <div className="mb-4 rounded-[1.2rem] border border-red-300/70 bg-red-50/90 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <main className="space-y-4">
          <DataChart
            actions={
              <>
                <button
                  aria-label="Upload JSON"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/25 hover:bg-sand"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Upload size={17} />
                </button>
                <button
                  aria-label="Chart settings"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/25 hover:bg-sand"
                  onClick={() => setIsSettingsOpen(true)}
                  type="button"
                >
                  <Settings2 size={17} />
                </button>
              </>
            }
            chartType={chartType}
            rows={dataset.rows}
            sourceName={isLoading ? 'reading file...' : dataset.sourceName}
            xKey={xKey}
            yKeys={yKeys}
          />

          <div className="rounded-[1.35rem] border border-ink/10 bg-white/75 px-4 py-3 shadow-[0_12px_40px_rgba(20,33,61,0.05)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-ink/45">Insights</p>
                <p className="mt-1 text-sm text-ink/58">Summary and table in a single compact panel.</p>
              </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-sand px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ink transition hover:border-ink/25"
              onClick={() => setShowDetails((currentValue) => !currentValue)}
              type="button"
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
              {showDetails ? 'Hide details' : 'Show details'}
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            </div>
          </div>

          {showDetails ? (
            <section className="rounded-[1.35rem] border border-ink/10 bg-white/75 p-4 shadow-[0_12px_40px_rgba(20,33,61,0.05)] backdrop-blur">
              <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <DataSummary compact dataset={dataset} xKey={xKey} yKeys={yKeys} />
                <DataPreviewTable compact dataset={dataset} />
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

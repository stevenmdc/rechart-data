'use client';

import { ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartKind, DatasetRow } from '@/types/data';

interface DataChartProps {
  actions?: ReactNode;
  chartType: ChartKind;
  rows: DatasetRow[];
  sourceName?: string;
  xKey: string;
  yKeys: string[];
}

const palette = ['#ff6b35', '#2a9d8f', '#4f46e5'];
const compactNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
});
const fullNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

function formatXAxis(value: unknown) {
  if (typeof value === 'string' && value.length > 14) {
    return `${value.slice(0, 14)}...`;
  }

  if (typeof value === 'number') {
    return compactNumber.format(value);
  }

  return String(value ?? '');
}

function formatTooltipValue(value: number | string | Array<number | string> | undefined) {
  if (typeof value === 'number') {
    return fullNumber.format(value);
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return String(value ?? '');
}

export function DataChart({ actions, chartType, rows, sourceName, xKey, yKeys }: DataChartProps) {
  const hasSeries = yKeys.length > 0;

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white/80 p-5 shadow-[0_20px_70px_rgba(20,33,61,0.08)] backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-ink/45">Visualization</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-ink">Main chart</h2>
            {sourceName ? (
              <span className="rounded-full border border-ink/10 bg-sand px-3 py-1 font-mono text-[11px] text-ink/65">
                {sourceName}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border border-ink/10 bg-sand px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-ink/65">
            {chartType}
          </div>
          {actions}
        </div>
      </div>

      <div className="mt-5 h-[440px] rounded-[1.5rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,247,234,0.8),rgba(255,255,255,0.35))] p-3 sm:h-[520px]">
        {!hasSeries ? (
          <div className="flex h-full items-center justify-center rounded-[1.25rem] border border-dashed border-ink/14 bg-white/45 px-6 text-center text-sm text-ink/65">
            Select at least one numeric metric to display the chart.
          </div>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <BarChart data={rows} margin={{ top: 8, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#d8d2c7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} stroke="#6b7280" tickFormatter={formatXAxis} tickLine={false} />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value: number) => compactNumber.format(value)}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14213d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  color: '#fff7ea',
                }}
                formatter={formatTooltipValue}
                labelFormatter={(label) => String(label)}
              />
              <Legend />
              {yKeys.map((key, index) => (
                <Bar dataKey={key} fill={palette[index % palette.length]} key={key} radius={[8, 8, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : chartType === 'area' ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <AreaChart data={rows} margin={{ top: 8, right: 18, left: -10, bottom: 0 }}>
              <defs>
                {yKeys.map((key, index) => (
                  <linearGradient id={`gradient-${key}`} key={key} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={palette[index % palette.length]} stopOpacity={0.55} />
                    <stop offset="95%" stopColor={palette[index % palette.length]} stopOpacity={0.06} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="#d8d2c7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} stroke="#6b7280" tickFormatter={formatXAxis} tickLine={false} />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value: number) => compactNumber.format(value)}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14213d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  color: '#fff7ea',
                }}
                formatter={formatTooltipValue}
                labelFormatter={(label) => String(label)}
              />
              <Legend />
              {yKeys.map((key, index) => (
                <Area
                  dataKey={key}
                  fill={`url(#gradient-${key})`}
                  key={key}
                  stroke={palette[index % palette.length]}
                  strokeWidth={2.5}
                  type="monotone"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <LineChart data={rows} margin={{ top: 8, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#d8d2c7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={xKey} stroke="#6b7280" tickFormatter={formatXAxis} tickLine={false} />
              <YAxis
                stroke="#6b7280"
                tickFormatter={(value: number) => compactNumber.format(value)}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14213d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  color: '#fff7ea',
                }}
                formatter={formatTooltipValue}
                labelFormatter={(label) => String(label)}
              />
              <Legend />
              {yKeys.map((key, index) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  stroke={palette[index % palette.length]}
                  strokeWidth={2.75}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

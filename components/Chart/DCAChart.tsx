'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint, CryptoType } from '@/types';

interface DCAChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  cryptoType: CryptoType;
}

export function DCAChart({ data, isLoading, cryptoType }: DCAChartProps) {
  if (isLoading) {
    return (
      <div className="bg-midnight-800/50 border border-slate-700 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Chargement du graphique...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-midnight-800/50 border border-slate-700 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Lancez une simulation pour voir le graphique</div>
      </div>
    );
  }

  const lineColorByCrypto: Record<CryptoType, string> = {
    bitcoin: '#f97316',
    ethereum: '#a855f7',
    solana: '#14f195',
    xrp: '#22d3ee',
  };
  const lineColor = lineColorByCrypto[cryptoType];

  return (
    <div className="bg-midnight-900 border border-slate-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Évolution du portefeuille</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="portfolioValue"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            fill="url(#colorPortfolio)"
            name="Valeur du portefeuille"
          />
          <Line
            type="monotone"
            dataKey="investedCapital"
            stroke="#64748b"
            strokeWidth={2}
            dot={false}
            name="Capital investi"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { CalculationResult, CryptoType } from '@/types';

interface CalculationMethodCardProps {
  result: CalculationResult | null;
  isLoading: boolean;
  selectedCrypto: CryptoType;
  initialCapital: number;
  monthlyAddition: number;
}

function formatEuro(value: number): string {
  return `EUR ${value.toFixed(2)}`;
}

function formatCrypto(value: number, symbol: string): string {
  return `${value.toFixed(8)} ${symbol}`;
}

export function CalculationMethodCard({
  result,
  isLoading,
  selectedCrypto,
  initialCapital,
  monthlyAddition,
}: CalculationMethodCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cryptoSymbolByType: Record<CryptoType, string> = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    solana: 'SOL',
    xrp: 'XRP',
  };
  const cryptoSymbol = cryptoSymbolByType[selectedCrypto];

  const methodValues = useMemo(() => {
    if (!result?.method) {
      return null;
    }

    const totalInvested = result.totalInvested;
    const finalValue = result.finalValue;
    const roi = result.roi;
    const roiPercentage = result.roiPercentage;
    const initialPrice = result.method.initialPrice;
    const finalPrice = result.method.finalPrice;
    const totalCryptoQuantity = result.method.totalCryptoQuantity;
    const monthlyInvestmentsCount = result.method.monthlyInvestmentsCount;
    const initialQuantity = initialPrice > 0 ? initialCapital / initialPrice : 0;

    return {
      totalInvested,
      finalValue,
      roi,
      roiPercentage,
      initialPrice,
      finalPrice,
      totalCryptoQuantity,
      monthlyInvestmentsCount,
      initialQuantity,
    };
  }, [result, initialCapital]);

  if (isLoading) {
    return (
      <div className="bg-midnight-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="h-6 bg-midnight-700 rounded animate-pulse w-1/3" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-midnight-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!result || !methodValues) {
    return (
      <div className="bg-midnight-800/50 border border-slate-700 rounded-lg p-6 text-center text-white">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-midnight-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-sm text-white/50 hover:underline cursor-pointer"
        >
          {isOpen ? 'Hide calcul' : 'Show calcul'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 text-sm text-white">
          <p>
            <code className="text-cyan-200">
              Q0 = C0 / P0 = {formatEuro(initialCapital)} / {formatEuro(methodValues.initialPrice)} ={' '}
              {formatCrypto(methodValues.initialQuantity, cryptoSymbol)}
            </code>
          </p>
          <p>
            <code className="text-cyan-200">
              Q_total = Q0 + sum(M / P_i) = {formatCrypto(methodValues.totalCryptoQuantity, cryptoSymbol)}
            </code>
          </p>
          <p>
            <code className="text-cyan-200">
              C_total = C0 + n * M = {formatEuro(initialCapital)} + {methodValues.monthlyInvestmentsCount} *{' '}
              {formatEuro(monthlyAddition)} = {formatEuro(methodValues.totalInvested)}
            </code>
          </p>
          <p>
            <code className="text-cyan-200">
              V_final = Q_total * P_end = {formatCrypto(methodValues.totalCryptoQuantity, cryptoSymbol)} *{' '}
              {formatEuro(methodValues.finalPrice)} = {formatEuro(methodValues.finalValue)}
            </code>
          </p>
          <p>
            <code className="text-cyan-200">
              ROI = V_final - C_total = {formatEuro(methodValues.roi)}
            </code>
          </p>
          <p>
            <code className="text-cyan-200">
              ROI% = (ROI / C_total) * 100 = {methodValues.roiPercentage.toFixed(2)}%
            </code>
          </p>
          <p className="text-xs text-white/70">
            n = nombre d&apos;achats mensuels ({methodValues.monthlyInvestmentsCount}), M = ajout mensuel (
            {formatEuro(monthlyAddition)}), P_i = prix au moment de chaque achat.
          </p>
        </div>
      )}
    </div>
  );
}

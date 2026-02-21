'use client';

import { CalculationResult, CryptoType } from '@/types';
import { DCAChart } from '@/components/Chart/DCAChart';
import { SummaryCard } from '@/components/Summary/SummaryCard';
import { CalculationMethodCard } from '@/components/Summary/CalculationMethodCard';

interface ResultsSectionProps {
  result: CalculationResult | null;
  isLoading: boolean;
  selectedCrypto: CryptoType;
  initialCapital: number;
  monthlyAddition: number;
}

export function ResultsSection({
  result,
  isLoading,
  selectedCrypto,
  initialCapital,
  monthlyAddition,
}: ResultsSectionProps) {
  return (
    <main className="flex-1 space-y-6">
      <DCAChart data={result?.chartData || []} isLoading={isLoading} cryptoType={selectedCrypto} />
      <SummaryCard result={result} isLoading={isLoading} />
      {result && (
        <CalculationMethodCard
          result={result}
          isLoading={isLoading}
          selectedCrypto={selectedCrypto}
          initialCapital={initialCapital}
          monthlyAddition={monthlyAddition}
        />
      )}
    </main>
  );
}

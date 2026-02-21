'use client';

import { useCallback, useState } from 'react';
import { CalculationResult, CryptoType, FormInputs } from '@/types';
import { fetchHistoricalPrices } from '@/lib/priceApi';
import { calculateDCA, calculateMetrics, prepareChartData } from '@/lib/dcaCalculator';
import { validateFormInputs } from '@/lib/utils';

interface UseDcaCalculationParams {
  selectedCrypto: CryptoType;
  initialCapital: number;
  monthlyAddition: number;
  startDate: string;
  endDate: string;
}

export function useDcaCalculation({
  selectedCrypto,
  initialCapital,
  monthlyAddition,
  startDate,
  endDate,
}: UseDcaCalculationParams) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const formInputs: FormInputs = {
        crypto: selectedCrypto,
        initialCapital,
        monthlyAddition,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      const validation = validateFormInputs(formInputs);
      if (!validation.valid) {
        setError(validation.errors[0]);
        return;
      }

      const prices = await fetchHistoricalPrices(
        selectedCrypto,
        formInputs.startDate,
        formInputs.endDate
      );

      if (prices.length === 0) {
        setError('Aucune donnée de prix disponible pour cette période');
        return;
      }

      const dcaResult = calculateDCA(
        initialCapital,
        monthlyAddition,
        formInputs.startDate,
        formInputs.endDate,
        prices
      );

      const chartData = prepareChartData(
        dcaResult.dates,
        dcaResult.portfolioValues,
        dcaResult.investedCapital
      );

      const finalValue = dcaResult.portfolioValues[dcaResult.portfolioValues.length - 1] || 0;
      const totalInvested = dcaResult.investedCapital[dcaResult.investedCapital.length - 1] || 0;
      const metrics = calculateMetrics(totalInvested, finalValue);

      const finalQuantity = dcaResult.cryptoQuantity[dcaResult.cryptoQuantity.length - 1] || 0;
      const initialPrice = dcaResult.prices[0] || 0;
      const finalPrice = dcaResult.prices[dcaResult.prices.length - 1] || 0;
      const monthlyInvestmentsCount =
        monthlyAddition > 0
          ? Math.max(0, Math.round((totalInvested - initialCapital) / monthlyAddition))
          : 0;

      setResult({
        ...metrics,
        chartData,
        method: {
          initialPrice,
          finalPrice,
          totalCryptoQuantity: finalQuantity,
          monthlyInvestmentsCount,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite lors du calcul');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCrypto, initialCapital, monthlyAddition, startDate, endDate]);

  return {
    result,
    isLoading,
    error,
    handleCalculate,
  };
}

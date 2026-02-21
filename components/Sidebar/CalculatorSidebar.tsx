'use client';

import { DollarSign } from 'lucide-react';
import { CryptoType } from '@/types';
import { MIN_START_DATE_ISO, dateToISOString, getDefaultEndDate } from '@/lib/utils';
import { CryptoSelector } from '@/components/Sidebar/CryptoSelector';
import { InputField } from '@/components/Sidebar/InputField';
import { DatePicker } from '@/components/Sidebar/DatePicker';
import { CalculateButton } from '@/components/Sidebar/CalculateButton';

interface CalculatorSidebarProps {
  selectedCrypto: CryptoType;
  onSelectCrypto: (crypto: CryptoType) => void;
  initialCapital: number;
  onInitialCapitalChange: (value: number) => void;
  monthlyAddition: number;
  onMonthlyAdditionChange: (value: number) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  error: string | null;
  isLoading: boolean;
  onCalculate: () => void;
}

export function CalculatorSidebar({
  selectedCrypto,
  onSelectCrypto,
  initialCapital,
  onInitialCapitalChange,
  monthlyAddition,
  onMonthlyAdditionChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  error,
  isLoading,
  onCalculate,
}: CalculatorSidebarProps) {
  return (
    <aside className="lg:w-80 lg:sticky lg:top-8 h-fit">
      <div className="bg-midnight border border-slate-800 rounded-lg p-6 space-y-4">
        <div>
          <CryptoSelector selectedCrypto={selectedCrypto} onSelectCrypto={onSelectCrypto} />
        </div>

        <div className="space-y-4">
          <InputField
            label="Capital initial (€)"
            value={initialCapital}
            onChange={onInitialCapitalChange}
            icon={DollarSign}
            min={0}
            step={100}
          />
          <InputField
            label="Ajout mensuel (€)"
            value={monthlyAddition}
            onChange={onMonthlyAdditionChange}
            icon={DollarSign}
            min={0}
            step={10}
          />
        </div>

        <div className="space-y-4">
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={onStartDateChange}
            min={MIN_START_DATE_ISO}
            max={endDate}
          />
          <DatePicker
            label="Date de fin"
            value={endDate}
            onChange={onEndDateChange}
            min={startDate}
            max={dateToISOString(getDefaultEndDate())}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <CalculateButton
          onClick={onCalculate}
          isLoading={isLoading}
          isDisabled={initialCapital < 0 || monthlyAddition < 0}
        />
      </div>
    </aside>
  );
}

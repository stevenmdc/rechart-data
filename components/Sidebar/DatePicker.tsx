// components/Sidebar/DatePicker.tsx
'use client';

import { useRef } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative  items-center">
        <button
          type="button"
          onClick={handleOpenPicker}
          aria-label={`Ouvrir le calendrier: ${label}`}
          className="absolute left-2 top-1/2 -translate-y-1/2 hover:text-slate-200 rounded p-1 cursor-pointer z-10"
        >
          <Calendar size={16} />
        </button>
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className="w-full bg-midnight-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
}

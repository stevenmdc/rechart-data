'use client';

import type { ReactNode } from 'react';
import { CryptoType } from '@/types';
import { BitcoinIcon } from '../icons/BitcoinIcon';
import { ETHIcon } from '../icons/ETHIcon';
import { SolanaIcon } from '../icons/SolanaIcon';
import { XRPIcon } from '../icons/XRPIcon';

interface CryptoSelectorProps {
  selectedCrypto: CryptoType;
  onSelectCrypto: (crypto: CryptoType) => void;
}

export function CryptoSelector({
  selectedCrypto,
  onSelectCrypto,
}: CryptoSelectorProps) {
   const options: Array<{
     value: CryptoType;
     label: string;
     activeClass: string;
     icon: ReactNode;
   }> = [
     {
       value: 'bitcoin',
       label: 'Bitcoin',
       activeClass: 'bg-orange-500/80 text-white',
       icon: <BitcoinIcon />,
     },
     {
       value: 'ethereum',
       label: 'Ethereum',
       activeClass: 'bg-purple-500/80 text-white',
       icon: <ETHIcon />,
     },
     {
       value: 'solana',
       label: 'Solana',
       activeClass: 'bg-emerald-500/80 text-white',
       icon: <SolanaIcon />,
     },
     {
       value: 'xrp',
       label: 'XRP',
       activeClass: 'bg-cyan-500/80 text-white',
       icon: <XRPIcon />,
     },
   ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelectCrypto(option.value)}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
            selectedCrypto === option.value
              ? option.activeClass
              : 'bg-midnight-800 text-white hover:bg-midnight-700'
          }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

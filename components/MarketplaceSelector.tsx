'use client';

import React from 'react';
import { MarketplaceId } from '@/types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface MarketplaceSelectorProps {
  selectedMarketplace: MarketplaceId;
  onSelect: (id: MarketplaceId) => void;
}

export default function MarketplaceSelector({
  selectedMarketplace,
  onSelect,
}: MarketplaceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase text-zinc-500 font-semibold tracking-wider block">
        Target Marketplace Policy
      </label>

      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-zinc-900">Amazon</h4>
              <span className="bg-violet-100 text-violet-700 text-[10px] font-mono px-2 py-0.5 rounded-full border border-violet-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-violet-600" /> Active Policy Engine
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Amazon Main Product Image Guidelines (2026)</p>
            <p className="text-[11px] font-mono text-violet-600 mt-1">
              Pure White (RGB 255) • ≥ 1000px Longest Side • ≥ 85% Frame Coverage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

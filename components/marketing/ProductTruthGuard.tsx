'use client';

import React from 'react';
import { Eye, AlertTriangle, ShieldCheck } from 'lucide-react';

type MatchResult = 'MATCH' | 'MISMATCH' | 'UNVERIFIED';

const referenceProduct = {
  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
  name: 'Wireless Earbuds Pro',
  brand: 'TechAudio',
  variant: 'Pro — Active Noise Cancelling',
  color: 'Matte Black',
  quantity: '1 pair + charging case',
};

const candidateProduct = {
  image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop',
};

const matchChecks: { label: string; expected: string; detected: string; result: MatchResult }[] = [
  { label: 'Color', expected: 'Matte Black', detected: 'White / Pearl', result: 'MISMATCH' },
  { label: 'Variant', expected: 'Pro — ANC', detected: 'Standard model', result: 'MISMATCH' },
  { label: 'Quantity', expected: '1 pair + case', detected: 'Pair only — case not visible', result: 'UNVERIFIED' },
  { label: 'Accessories', expected: 'Charging case included', detected: 'Not clearly visible', result: 'UNVERIFIED' },
];

function MatchBadge({ result }: { result: MatchResult }) {
  if (result === 'MATCH') return (
    <span className="text-xs font-bold font-mono text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide">Match</span>
  );
  if (result === 'MISMATCH') return (
    <span className="text-xs font-bold font-mono text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide">Mismatch</span>
  );
  return (
    <span className="text-xs font-bold font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide">Unverified</span>
  );
}

export default function ProductTruthGuard() {
  return (
    <section id="truth-guard" className="bg-[#F8F7F5] border-y border-zinc-200 section-padding">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-violet-700" aria-hidden="true" />
            <span className="text-xs font-semibold text-violet-700 uppercase tracking-widest font-mono">Product Truth Guard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight mb-4">
            Make sure the image<br />is actually the product.
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed">
            Product Truth Guard checks whether the image represents the exact product being sold — not just whether the photo looks good. A technically compliant image can still show the wrong variant, color, or configuration.
          </p>
        </div>

        {/* Comparison UI */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">

          {/* Header bar */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-100 bg-zinc-50">
            <ShieldCheck className="w-4 h-4 text-violet-700" />
            <span className="text-sm font-semibold text-zinc-800 font-mono">Product Truth Guard · Comparison</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start mb-8">

              {/* Reference product */}
              <div className="space-y-4">
                <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Reference Product (Listing Data)</div>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                    <img src={referenceProduct.image} alt="Reference product" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-sm font-semibold text-zinc-900">{referenceProduct.name}</div>
                    <div className="space-y-1">
                      {[
                        ['Brand', referenceProduct.brand],
                        ['Variant', referenceProduct.variant],
                        ['Color', referenceProduct.color],
                        ['Quantity', referenceProduct.quantity],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-1.5 text-xs">
                          <span className="text-zinc-400 w-16 flex-shrink-0">{k}</span>
                          <span className="text-zinc-700 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-px h-12 bg-zinc-200" />
                  <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" aria-label="Mismatch detected" />
                  </div>
                  <div className="w-px h-12 bg-zinc-200" />
                </div>
              </div>

              {/* Candidate image */}
              <div className="space-y-4">
                <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">Candidate Image (Submitted)</div>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 flex-shrink-0 bg-zinc-100 rounded-lg overflow-hidden border border-red-200">
                    <img src={candidateProduct.image} alt="Candidate product image" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Product Mismatch Detected
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      ListReady does not silently approve uncertain product differences.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Match results table */}
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-0 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200 px-4 py-2.5">
                <div>Attribute</div>
                <div>Expected</div>
                <div>Detected</div>
                <div className="text-right">Result</div>
              </div>
              {matchChecks.map((check, i) => (
                <div
                  key={check.label}
                  className={`grid grid-cols-4 gap-0 px-4 py-3 text-xs items-center ${i < matchChecks.length - 1 ? 'border-b border-zinc-100' : ''} ${check.result === 'MISMATCH' ? 'bg-red-50/40' : ''}`}
                >
                  <div className="font-semibold text-zinc-800">{check.label}</div>
                  <div className="text-zinc-600">{check.expected}</div>
                  <div className="text-zinc-600">{check.detected}</div>
                  <div className="flex justify-end"><MatchBadge result={check.result} /></div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
              <strong className="text-zinc-700">Note:</strong> Product Truth Guard analysis is based on available image evidence. Human review is required to verify product identity for listing approval.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

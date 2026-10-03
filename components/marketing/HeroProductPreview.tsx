'use client';

import React from 'react';
import { CheckCircle2, Wrench, UserCheck, ShieldCheck, Eye } from 'lucide-react';

const checks = [
  { label: 'Background', status: 'AUTO_FIX' },
  { label: 'Source Resolution', status: 'PASS' },
  { label: 'File Format', status: 'AUTO_FIX' },
  { label: 'Product Framing', status: 'PASS' },
  { label: 'Text & Badges', status: 'PASS' },
  { label: 'Lifestyle Context', status: 'PASS' },
];

const truthChecks = [
  { label: 'Product identity', result: 'MATCH' },
  { label: 'Primary color', result: 'MATCH' },
  { label: 'Variant', result: 'REVIEW' },
  { label: 'Quantity', result: 'MATCH' },
];

function StatusPill({ status }: { status: string }) {
  if (status === 'PASS') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-[3px] uppercase tracking-wide font-mono">
      <CheckCircle2 className="w-2.5 h-2.5" /> Pass
    </span>
  );
  if (status === 'AUTO_FIX') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-[3px] uppercase tracking-wide font-mono">
      <Wrench className="w-2.5 h-2.5" /> Auto-Fix
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-[3px] uppercase tracking-wide font-mono">
      <UserCheck className="w-2.5 h-2.5" /> Review
    </span>
  );
}

function TruthPill({ result }: { result: string }) {
  if (result === 'MATCH') return (
    <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide font-mono">Match</span>
  );
  return (
    <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-[3px] uppercase tracking-wide font-mono">Review</span>
  );
}

interface HeroProductPreviewProps {
  onPresetSelect?: (sample: any) => void;
}

export default function HeroProductPreview({ onPresetSelect }: HeroProductPreviewProps) {
  return (
    <div
      className="w-full max-w-[480px] bg-white border border-zinc-200 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden select-none"
      aria-label="ListReady product interface preview"
      role="img"
    >
      {/* App title bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] bg-violet-700 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 10l6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-zinc-700">ListReady</span>
          <span className="text-[9px] text-zinc-400 font-mono">· Product Image Review</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-200" />
          <div className="w-2 h-2 rounded-full bg-zinc-200" />
          <div className="w-2 h-2 rounded-full bg-zinc-200" />
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Before / After image comparison */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <div className="text-[9px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">Original</div>
            <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 relative">
              {/* Simulated: colored background product */}
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"
                alt="Original product photo with colored background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end p-1.5">
                <span className="text-[8px] font-mono bg-white/90 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
                  Raw · 1200×1200
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[9px] font-mono font-semibold text-violet-600 uppercase tracking-wider">Cloudinary Fixed</div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-violet-200 relative">
              {/* Simulated: white background product */}
              <img
                src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=200&h=200&fit=crop"
                alt="Product photo after Cloudinary background removal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end p-1.5">
                <span className="text-[8px] font-mono bg-white/90 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                  Ready · 2000×2000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-100" />

        {/* Compliance checks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider font-mono">Amazon Compliance</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-[3px] font-bold">2 Fixes Available</span>
          </div>

          <div className="space-y-1">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-zinc-50 transition">
                <span className="text-[10px] text-zinc-700 font-medium">{check.label}</span>
                <StatusPill status={check.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-100" />

        {/* Product Truth Guard */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[10px] font-semibold text-violet-700 uppercase tracking-wider font-mono">Product Truth Guard</span>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-lg p-2.5 space-y-1.5">
            {truthChecks.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 font-medium">{item.label}</span>
                <TruthPill result={item.result} />
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            className="text-[10px] font-semibold bg-violet-700 text-white py-2 rounded-md font-mono"
            tabIndex={-1}
            aria-hidden="true"
          >
            Apply fixes
          </button>
          <button
            className="text-[10px] font-semibold bg-zinc-100 text-zinc-700 py-2 rounded-md font-mono border border-zinc-200"
            tabIndex={-1}
            aria-hidden="true"
          >
            Review manually
          </button>
        </div>

      </div>
    </div>
  );
}

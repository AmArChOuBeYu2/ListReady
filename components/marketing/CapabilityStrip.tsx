'use client';

import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const capabilities = [
  {
    icon: ShieldCheck,
    title: 'Amazon Main Image Engine',
    subtitle: 'Strict rule checks against official 2026 specs',
  },
  {
    icon: Sparkles,
    title: 'Cloudinary AI Scan',
    subtitle: 'AI Captioning & quality analysis',
  },
  {
    icon: AlertCircle,
    title: 'Product Truth Guard',
    subtitle: 'Flag human-review cases safely',
  },
  {
    icon: RefreshCw,
    title: '1-Click Remediation',
    subtitle: 'SDK-structured URL transformations',
  },
];

export default function CapabilityStrip() {
  return (
    <div className="border-y border-zinc-200 bg-white py-6">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700 flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{cap.title}</div>
                  <div className="text-[11px] text-zinc-500">{cap.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

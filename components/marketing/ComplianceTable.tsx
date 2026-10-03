'use client';

import React from 'react';
import { CheckCircle2, Wrench, UserCheck } from 'lucide-react';

const complianceChecks = [
  {
    check: 'Background Whiteness',
    category: 'Background',
    status: 'AUTO_FIX' as const,
    action: 'Remove background → replace with pure white (RGB 255,255,255)',
  },
  {
    check: 'Source Resolution',
    category: 'Resolution',
    status: 'HUMAN_REVIEW' as const,
    action: 'Replace source image — canvas expansion does not restore detail',
  },
  {
    check: 'File Format',
    category: 'Format',
    status: 'AUTO_FIX' as const,
    action: 'Normalize to sRGB JPEG via Cloudinary',
  },
  {
    check: 'Product Framing Coverage',
    category: 'Framing',
    status: 'AUTO_FIX' as const,
    action: 'Re-center with canvas padding to achieve ≥ 85% coverage',
  },
  {
    check: 'Text & Promotional Badges',
    category: 'Text',
    status: 'HUMAN_REVIEW' as const,
    action: 'Remove external text overlays from source photo',
  },
  {
    check: 'Watermarks & Seller Markings',
    category: 'Watermark',
    status: 'HUMAN_REVIEW' as const,
    action: 'Manual seller inspection required',
  },
  {
    check: 'Lifestyle & Context Scene',
    category: 'Lifestyle',
    status: 'HUMAN_REVIEW' as const,
    action: 'Verify only the product appears after background removal',
  },
  {
    check: 'Multiple Products / Props',
    category: 'Props',
    status: 'HUMAN_REVIEW' as const,
    action: 'Re-photograph showing only the product for sale',
  },
  {
    check: 'Product Boundary Cutoff',
    category: 'Cutoff',
    status: 'HUMAN_REVIEW' as const,
    action: 'Re-photograph with complete product framed within boundaries',
  },
];

function StatusBadge({ status }: { status: 'PASS' | 'AUTO_FIX' | 'HUMAN_REVIEW' }) {
  if (status === 'PASS') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide whitespace-nowrap">
      <CheckCircle2 className="w-2.5 h-2.5" />Pass
    </span>
  );
  if (status === 'AUTO_FIX') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide whitespace-nowrap">
      <Wrench className="w-2.5 h-2.5" />Auto-Fix
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-[4px] uppercase tracking-wide whitespace-nowrap">
      <UserCheck className="w-2.5 h-2.5" />Human Review
    </span>
  );
}

export default function ComplianceTable() {
  return (
    <section id="compliance-engine" className="section-padding">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold text-violet-700 uppercase tracking-widest font-mono mb-3">Compliance Engine</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight mb-4">
            Every check has an action.
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed">
            ListReady does not pretend every problem can be automatically fixed. Each compliance check produces a clear verdict: pass, auto-fix, or human review. The action is always explicit.
          </p>
        </div>

        {/* Table */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_3fr] gap-0 text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200 px-6 py-3">
            <div>Check</div>
            <div>Category</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {complianceChecks.map((item, i) => (
            <div
              key={item.check}
              className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_3fr] gap-2 sm:gap-0 px-5 sm:px-6 py-4 items-start sm:items-center ${
                i < complianceChecks.length - 1 ? 'border-b border-zinc-100' : ''
              } hover:bg-zinc-50/60 transition-colors`}
            >
              {/* Check name */}
              <div className="text-sm font-semibold text-zinc-800">{item.check}</div>

              {/* Category */}
              <div className="text-xs text-zinc-400 font-mono sm:block">{item.category}</div>

              {/* Status badge */}
              <div>
                <StatusBadge status={item.status} />
              </div>

              {/* Action */}
              <div className="text-xs text-zinc-600 leading-relaxed">{item.action}</div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-6 text-xs text-zinc-500 max-w-2xl leading-relaxed">
          <strong className="text-zinc-700">Human Review</strong> items require seller action on the source image. Auto-Fix items are transformed safely through the Cloudinary pipeline. Neither is silently skipped.
        </p>

      </div>
    </section>
  );
}

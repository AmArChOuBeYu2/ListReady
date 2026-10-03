'use client';

import React from 'react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold text-violet-700 tracking-wider uppercase">The Problem & Solution</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-2">
            Marketplace rules are strict.<br />
            Fixing them manually is slow & error-prone.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Marketplaces enforce complex main-image rules: pure white backgrounds, resolution thresholds, single-item framing, no graphics or watermarks. One mistake causes listing rejections or suppressed impressions.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Manual Workflow (Without ListReady) */}
          <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Without ListReady</h3>
            </div>
            
            <ul className="space-y-4 text-xs sm:text-sm text-zinc-600">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>Manual inspection of every photo against 10+ guidelines</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>Hours spent in photo editors removing non-white backgrounds</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>Over-editing leads to altered product logos or inaccurate details</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>High risk of listing suppression or customer returns due to misrepresentation</span>
              </li>
            </ul>
          </div>

          {/* ListReady Workflow */}
          <div className="bg-white border-2 border-violet-600 rounded-2xl p-6 sm:p-8 shadow-sm relative">
            <span className="absolute -top-3 right-6 bg-violet-700 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Automated Standard
            </span>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">With ListReady</h3>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-600">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>Instant automated compliance scanning in seconds</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>Cloudinary AI background removal & pure white canvas insertion</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>Product Truth Guard prevents illegal modification of genuine items</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>Verifiable CDN output ready for Amazon bulk upload</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

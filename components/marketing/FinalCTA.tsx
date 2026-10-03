'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  onCheckClick: () => void;
}

export default function FinalCTA({ onCheckClick }: FinalCTAProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-zinc-100 border-t border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 text-center">
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 px-3.5 py-1 rounded-full text-xs font-semibold text-violet-800">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            Instant Product Photo Compliance
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
            Fix your product photos <br className="hidden sm:inline" />
            before the marketplace does.
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Upload your first photo to evaluate compliance against Amazon rules, trigger automated Cloudinary auto-fix, and download marketplace-ready assets in seconds.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCheckClick}
              className="w-full sm:w-auto bg-violet-700 hover:bg-violet-800 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-violet-700/20 flex items-center justify-center gap-2 transition"
            >
              <span>Check an Image Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="/test-pipeline"
              className="w-full sm:w-auto bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-sm px-6 py-4 rounded-xl border border-zinc-300 flex items-center justify-center gap-2 transition"
            >
              <span>Developer Test Suite</span>
            </a>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> No credit card required
            </span>
            <span>•</span>
            <span>Powered by Cloudinary Node SDK</span>
          </div>

        </div>

      </div>
    </section>
  );
}

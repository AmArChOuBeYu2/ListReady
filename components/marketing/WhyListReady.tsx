'use client';

import React from 'react';
import { ShieldCheck, Cpu, SlidersHorizontal, Award } from 'lucide-react';

const differentiators = [
  {
    icon: ShieldCheck,
    title: 'Product Truth First',
    description: 'We never distort or alter genuine product features. If a photo cannot be fixed safely without risking misrepresentation, ListReady flags it for human review.',
  },
  {
    icon: Cpu,
    title: 'Dual Engine Intelligence',
    description: 'Combines Cloudinary AI Captioning for semantic scene analysis with Sharp deterministic pixel measurement for exact color sampling and dimension evaluation.',
  },
  {
    icon: SlidersHorizontal,
    title: 'SDK-Chained Transformations',
    description: 'Uses official Cloudinary Node SDK transformation structures. All URL transformations are chained cleanly for deterministic, reproducible asset output.',
  },
  {
    icon: Award,
    title: 'Marketplace-Grade Verification',
    description: 'Tested across 10 official Amazon Main Image requirement categories with exact status output (PASS, AUTO-FIX, HUMAN REVIEW).',
  },
];

export default function WhyListReady() {
  return (
    <section className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-xs font-mono font-bold text-violet-700 tracking-wider uppercase">Built For Enterprise Sellers</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-2">
            Why ListReady is Different
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 leading-relaxed">
            Not just another basic background remover. ListReady is an enterprise product-truth & quality compliance engine.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((diff, idx) => {
            const Icon = diff.icon;
            return (
              <div key={idx} className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">{diff.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{diff.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

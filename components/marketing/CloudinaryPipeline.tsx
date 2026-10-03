'use client';

import React from 'react';
import { Cloud, Eye, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const pipelineStages = [
  {
    step: '01',
    icon: Cloud,
    title: 'Upload & Storage',
    description: 'Signed direct upload preserving original master resolution with metadata extraction.',
    techDetails: ['Secure API Signatures', 'Original Asset Safety', 'Instant Asset Storage'],
  },
  {
    step: '02',
    icon: Eye,
    title: 'AI & Color Scanning',
    description: 'Cloudinary AI Captioning and RGB border sampling scan for compliance issues.',
    techDetails: ['AI Captioning Scan', 'RGB Border Sampling', 'Quality Analysis'],
  },
  {
    step: '03',
    icon: Zap,
    title: 'Transformation Chaining',
    description: 'Structured Node SDK transformation chaining for background removal and precise padding.',
    techDetails: ['e_background_removal', 'b_white,c_pad', 'f_auto,q_auto'],
  },
  {
    step: '04',
    icon: ShieldCheck,
    title: 'Global CDN Delivery',
    description: 'Instant delivery of compliant production assets with verifiable hash signatures.',
    techDetails: ['Global CDN Edge', 'Format Auto-Selection', 'Verifiable Hash URLs'],
  },
];

export default function CloudinaryPipeline() {
  return (
    <section id="pipeline" className="py-20 bg-zinc-900 text-white">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-violet-300 font-mono mb-4">
            <Cloud className="w-3.5 h-3.5" />
            Media Infrastructure Layer
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Cloudinary Media Infrastructure
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Intelligent upload, computer-vision scanning, deterministic transformation chaining, and global CDN delivery.
          </p>
        </div>

        {/* 4 Pipeline Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineStages.map((stage) => {
            const IconComponent = stage.icon;
            return (
              <div
                key={stage.step}
                className="bg-zinc-950/80 border border-zinc-800/80 hover:border-violet-500/40 rounded-xl p-6 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-600">PILLAR {stage.step}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{stage.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">{stage.description}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                  {stage.techDetails.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Code / Pipeline Banner */}
        <div className="mt-12 bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-violet-400">SDK INTEGRATION</span>
            <h4 className="text-lg font-bold text-white">Structured Cloudinary Node SDK Transformation Chaining</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every auto-fix generates structured, non-ambiguous transformation components. No manual string concatenation. Fully compliant with Cloudinary SDK standard practices.
            </p>
          </div>

          <a
            href="/test-pipeline"
            className="flex-shrink-0 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 py-3 rounded-lg transition"
          >
            <span>Open Developer Pipeline Test</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

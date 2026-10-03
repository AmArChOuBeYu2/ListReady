'use client';

import React from 'react';
import { Upload, Search, Wand2, CheckCircle2, Cloud, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';

export default function WorkflowDiagram() {
  const primaryFlow = [
    { label: 'UPLOAD', desc: 'Drag & drop product photo', icon: Upload },
    { label: 'ANALYZE', desc: 'Scan against Amazon rules', icon: Search },
    { label: 'FIX', desc: '1-Click Cloudinary auto-remediation', icon: Wand2 },
    { label: 'READY', desc: 'Download marketplace asset', icon: CheckCircle2 },
  ];

  const pipelineSteps = [
    { title: 'Cloudinary Upload', desc: 'Secure asset stream & cloud buffer', icon: Cloud },
    { title: 'Cloudinary AI Captioning', desc: 'Semantic detection of props, text & watermarks', icon: Sparkles },
    { title: 'Cloudinary Quality & Color', desc: 'Focus scores & color histogram analysis', icon: Layers },
    { title: 'Sharp Measurements', desc: 'Deterministic pixel RGB border sampling & dimensions', icon: Sliders },
    { title: 'ListReady Amazon Rules', desc: 'Evaluation into PASS / AUTO-FIX / HUMAN REVIEW', icon: Search },
    { title: 'Cloudinary Transformations', desc: 'Background removal, canvas normalization & padding', icon: Wand2 },
    { title: 'Optimized Delivery', desc: 'High-resolution JPEG Amazon-ready output via CDN', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Workflow: UPLOAD -> ANALYZE -> FIX -> READY */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-mono text-violet-700 font-semibold uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            Streamlined E-Commerce Workflow
          </span>
          <h3 className="text-xl font-extrabold text-zinc-900">From Raw Image to Amazon Listing</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {primaryFlow.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col items-center text-center space-y-2 relative group hover:border-violet-300 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="font-mono font-black text-sm text-zinc-900 tracking-wider">{step.label}</div>
                <p className="text-xs text-zinc-500">{step.desc}</p>

                {idx < primaryFlow.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-zinc-300 z-10">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Transparency: How ListReady Works */}
      <div id="how-it-works" className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Full Pipeline Transparency
          </span>
          <h3 className="text-xl font-extrabold text-zinc-900">How ListReady Works</h3>
          <p className="text-xs text-zinc-500">
            Real backend media pipeline powered by Cloudinary AI & Sharp server-side measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {pipelineSteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2.5 hover:border-zinc-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                    STEP {idx + 1}
                  </span>
                  <IconComponent className="w-4 h-4 text-zinc-400" />
                </div>
                <h4 className="text-xs font-bold text-zinc-800">{step.title}</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

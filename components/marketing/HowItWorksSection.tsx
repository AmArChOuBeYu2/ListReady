'use client';

import React from 'react';
import { Upload, Search, Layers, Wrench, UserCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    label: 'Upload',
    icon: Upload,
    description: 'Product image enters ListReady via direct upload or URL. Cloudinary receives and stores the asset securely.',
    color: 'text-zinc-500',
    bg: 'bg-zinc-100',
  },
  {
    number: '02',
    label: 'Analyze',
    icon: Search,
    description: 'AI Captioning detects scene content. Sharp measures pixel dimensions, background RGB, and coverage. Quality analysis runs in parallel.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    number: '03',
    label: 'Classify',
    icon: Layers,
    description: 'The rule engine evaluates each measurement against Amazon requirements. Every check is classified as PASS, AUTO-FIX, or HUMAN REVIEW.',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    highlight: true,
  },
  {
    number: '04',
    label: 'Fix',
    icon: Wrench,
    description: 'AUTO-FIX issues are transformed via Cloudinary: background removal, canvas normalization, format optimization. HUMAN REVIEW issues are never auto-resolved.',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  {
    number: '05',
    label: 'Approve',
    icon: UserCheck,
    description: 'The seller reviews the before/after result and approves the transformed asset. The original is preserved. No silent approvals.',
    color: 'text-green-700',
    bg: 'bg-green-50',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-xl mb-12">
          <div className="text-xs font-semibold text-violet-700 uppercase tracking-widest font-mono mb-3">How it works</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight mb-4">
            From raw image<br />to marketplace-ready.
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed">
            A five-stage pipeline that checks, classifies, and transforms product images with a clear human handoff at every decision point.
          </p>
        </div>

        {/* Steps — horizontal connected timeline */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-[34px] left-[calc(10%+20px)] right-[calc(10%+20px)] h-px bg-zinc-200 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-start lg:items-center text-left lg:text-center gap-3">

                  {/* Icon circle */}
                  <div className={`relative w-[68px] h-[68px] rounded-full ${step.bg} border-2 ${step.highlight ? 'border-violet-300 shadow-md shadow-violet-100' : 'border-zinc-200'} flex items-center justify-center flex-shrink-0 bg-white`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                    {step.highlight && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-violet-700 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 lg:space-y-2">
                    <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">{step.number}</span>
                      <span className={`text-sm font-bold ${step.highlight ? 'text-violet-800' : 'text-zinc-800'}`}>{step.label}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] lg:max-w-none">
                      {step.description}
                    </p>
                    {step.highlight && (
                      <div className="flex flex-col items-start lg:items-center gap-1 pt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-[3px]">PASS</span>
                          <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-[3px]">AUTO-FIX</span>
                          <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-[3px]">REVIEW</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

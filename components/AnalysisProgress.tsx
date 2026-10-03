'use client';

import React from 'react';
import { Cloud, Sparkles, Sliders, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  currentStage: number; // 1, 2, 3, 4
  stageMessage: string;
}

export default function AnalysisProgress({
  currentStage,
  stageMessage,
}: AnalysisProgressProps) {
  const stages = [
    {
      id: 1,
      title: 'Uploading to Cloudinary',
      subtitle: 'Secure asset stream & cloud buffer storage',
      icon: Cloud,
    },
    {
      id: 2,
      title: 'Analyzing Image',
      subtitle: 'Cloudinary AI Captioning & Quality Analysis',
      icon: Sparkles,
    },
    {
      id: 3,
      title: 'Calculating Measurements',
      subtitle: 'Sharp deterministic RGB border sampling & dimensions',
      icon: Sliders,
    },
    {
      id: 4,
      title: 'Checking Image Requirements',
      subtitle: 'Amazon Main Image Rule Engine evaluation',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center mx-auto">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900">Analyzing Product Image</h3>
        <p className="text-xs font-mono text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200 inline-block">
          {stageMessage || 'Executing Media Pipeline...'}
        </p>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          const isDone = stage.id < currentStage;
          const isCurrent = stage.id === currentStage;
          const IconComp = stage.icon;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition ${
                isDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : isCurrent
                  ? 'bg-violet-50 border-violet-300 text-zinc-900 shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  isDone
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : isCurrent
                    ? 'bg-violet-100 border-violet-300 text-violet-700 animate-pulse'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <IconComp className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold tracking-wide uppercase">{stage.title}</h4>
                  <span className="text-[10px] font-mono">
                    {isDone ? 'COMPLETE' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{stage.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

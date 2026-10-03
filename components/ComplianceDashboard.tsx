'use client';

import React from 'react';
import { ComplianceCheck, ComplianceResult } from '@/types';
import { CheckCircle2, Wrench, UserCheck, AlertTriangle, ArrowRight, ShieldCheck, XCircle, FileSearch } from 'lucide-react';

interface ComplianceDashboardProps {
  complianceResult: ComplianceResult;
  onApplyFix: () => void;
  isFixing?: boolean;
}

export default function ComplianceDashboard({
  complianceResult,
  onApplyFix,
  isFixing = false,
}: ComplianceDashboardProps) {
  const { checks, summary } = complianceResult;

  const getStatusBadge = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
          </span>
        );
      case 'AUTO_FIX':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" /> AUTO-FIX
          </span>
        );
      case 'HUMAN_REVIEW':
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> HUMAN REVIEW
          </span>
        );
    }
  };

  const scrollToChecks = () => {
    const el = document.getElementById('individual-checks');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Compliance Executive Banner */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-700" />
            <span className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider">
              AMAZON IMAGE READINESS
            </span>
          </div>
          
          <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            {summary.overallStatus === 'READY' && (
              <span className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-8 h-8" /> ✅ READY
              </span>
            )}
            {summary.overallStatus === 'FIXES_AVAILABLE' && (
              <span className="text-amber-400 flex items-center gap-2">
                <Wrench className="w-8 h-8" /> 🔧 FIXES AVAILABLE
              </span>
            )}
            {summary.overallStatus === 'MANUAL_REVIEW_REQUIRED' && (
              <span className="text-purple-400 flex items-center gap-2">
                <UserCheck className="w-8 h-8" /> 👤 MANUAL REVIEW REQUIRED
              </span>
            )}
            {summary.overallStatus === 'NOT_READY' && (
              <span className="text-rose-400 flex items-center gap-2">
                <XCircle className="w-8 h-8" /> ❌ NOT READY
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-500 max-w-xl">
            {summary.overallStatus === 'READY'
              ? 'Your product image passes all Amazon main image requirements and is ready for catalog upload.'
              : summary.overallStatus === 'FIXES_AVAILABLE'
              ? `${summary.autoFixCount} fix(es) available to automatically normalize your image for Amazon compliance.`
              : summary.overallStatus === 'MANUAL_REVIEW_REQUIRED'
              ? 'ListReady detected a condition that cannot be safely resolved automatically and requires human review.'
              : 'Image does not meet Amazon main image requirements.'}
          </p>
        </div>

        {/* Summary counts pill group */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 text-center flex-1 md:flex-initial min-w-[75px]">
            <div className="text-xl font-black text-emerald-700">{summary.passCount}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono font-bold">PASS</div>
          </div>
          <div className="bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 text-center flex-1 md:flex-initial min-w-[75px]">
            <div className="text-xl font-black text-amber-700">{summary.autoFixCount}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono font-bold">AUTO-FIX</div>
          </div>
          <div className="bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200 text-center flex-1 md:flex-initial min-w-[75px]">
            <div className="text-xl font-black text-purple-700">{summary.humanReviewCount}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono font-bold">HUMAN REVIEW</div>
          </div>
        </div>
      </div>

      {/* Auto-Fix Callout Banner */}
      {summary.autoFixCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-base font-extrabold text-zinc-900 flex items-center justify-center sm:justify-start gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>{summary.autoFixCount} fix{summary.autoFixCount > 1 ? 'es' : ''} available</span>
            </div>
            <p className="text-xs text-zinc-600">
              Automatically remove non-white background and pad canvas to Amazon sRGB specifications via Cloudinary.
            </p>
          </div>

          <button
            onClick={onApplyFix}
            disabled={isFixing}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <Wrench className="w-4 h-4" />
            <span>{isFixing ? 'Processing Fixes...' : 'Fix Issues'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Human Review Intentional Banner */}
      {summary.humanReviewCount > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>👤 Manual review required</span>
              </div>
              <p className="text-xs text-purple-700">
                "ListReady detected a condition that cannot be safely resolved automatically."
              </p>
            </div>

            <button
              onClick={scrollToChecks}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <FileSearch className="w-4 h-4" />
              <span>Review image manually</span>
            </button>
          </div>

          <div className="text-xs text-zinc-700 bg-white p-3.5 rounded-xl border border-purple-200 space-y-1.5">
            <div className="font-mono text-[11px] text-purple-700 font-bold uppercase">Human Review Flag Triggers:</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-zinc-600">
              <li className="flex items-center gap-1.5">• Multiple distinct products in frame</li>
              <li className="flex items-center gap-1.5">• Environmental lifestyle context</li>
              <li className="flex items-center gap-1.5">• Visible external text overlay</li>
              <li className="flex items-center gap-1.5">• Potential watermark or copyright</li>
              <li className="flex items-center gap-1.5">• Primary product partially cut off</li>
              <li className="flex items-center gap-1.5">• Source resolution below 1000px threshold</li>
            </ul>
          </div>
        </div>
      )}

      {/* Individual Check Cards Grid */}
      <div id="individual-checks" className="space-y-4">
        <h3 className="text-sm font-mono uppercase text-zinc-500 font-bold tracking-wider">
          Individual Compliance Checks ({checks.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`border rounded-xl p-5 space-y-3 transition ${
                check.status === 'PASS'
                  ? 'bg-white border-zinc-200 hover:border-zinc-300'
                  : check.status === 'AUTO_FIX'
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-purple-50 border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                  {check.name}
                </span>
                {getStatusBadge(check.status)}
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[10px] font-mono uppercase block">Observed:</span>
                  <span className="text-zinc-800 font-semibold">{check.observed}</span>
                </div>

                <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
                  <span className="text-zinc-400 text-[10px] font-mono uppercase block">Required:</span>
                  <span className="text-zinc-700 font-semibold">{check.required}</span>
                </div>
              </div>

              <div className="text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 space-y-1">
                <span className="text-zinc-500 text-[10px] font-mono uppercase font-bold block">Why:</span>
                <p className="text-zinc-700 leading-relaxed">{check.reason}</p>
              </div>

              {check.fixDescription && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-mono">
                  <span className="font-bold">Action:</span> {check.fixDescription}
                </div>
              )}

              {check.status === 'HUMAN_REVIEW' && (
                <div className="text-xs text-purple-700 bg-purple-50 p-2.5 rounded-lg border border-purple-200 font-mono">
                  <span className="font-bold">Action:</span> Seller manual inspection & correction required.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

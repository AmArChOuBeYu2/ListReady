'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_TEST_IMAGES, SampleImage } from '@/lib/testData';
import { ComplianceResult, TransformationResult } from '@/types';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Upload,
  ArrowRight,
  Code2,
  RefreshCw,
  Copy,
  Download,
  Check,
  ArrowLeft,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export default function PipelineTestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileDimensions, setFileDimensions] = useState<{ width: number; height: number } | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SampleImage | null>(SAMPLE_TEST_IMAGES[1]);

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<ComplianceResult | null>(null);
  const [fixData, setFixData] = useState<TransformationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Object URL cleanup lifecycle
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileSelect = (file: File) => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setSelectedPreset(null);
    setFilePreview(objectUrl);
    setFileDimensions(null);

    const img = new window.Image();
    img.onload = () => {
      setFileDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;
  };

  const handlePresetSelect = (preset: SampleImage) => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedPreset(preset);
    setSelectedFile(null);
    setFilePreview(preset.url);
    setFileDimensions(null);
  };

  const handleRunPipeline = async () => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);
    setFixData(null);

    try {
      setStatusStep('1/3: Ingesting image stream to Cloudinary...');
      let payload: any;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (selectedPreset) {
          formData.append('presetScenario', selectedPreset.presetScenario);
        }
        payload = formData;
      } else if (selectedPreset) {
        payload = JSON.stringify({
          assetUrl: selectedPreset.url,
          presetScenario: selectedPreset.presetScenario,
        });
      } else {
        throw new Error('Please select an image file or a preset scenario.');
      }

      setStatusStep('2/3: Executing Cloudinary AI Captioning & Deterministic Rule Engine...');
      const headers: Record<string, string> = {};
      if (!(payload instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: payload,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Pipeline analysis failed');
      }

      setAnalysisData(json.data);
      setStatusStep('3/3: Compliance analysis complete!');
    } catch (err: any) {
      setError(err.message || 'An unexpected pipeline error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAutoFix = async () => {
    if (!analysisData) return;
    setLoading(true);
    try {
      setStatusStep('Generating & warming Cloudinary auto-fix transformation pipeline...');
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetUrl: analysisData.assetUrl,
          checks: analysisData.checks,
          publicId: analysisData.publicId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Transformation pipeline failed');
      }

      setFixData(json.data);
    } catch (err: any) {
      setError(err.message || 'Auto-fix failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetPipeline = () => {
    setAnalysisData(null);
    setFixData(null);
    setError(null);
    setStatusStep('');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">

      {/* Developer Tool Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-[5px] bg-violet-700 flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 10l6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-sm text-zinc-900 tracking-tight">ListReady</span>
            <span className="hidden sm:inline text-zinc-300">/</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-sm text-zinc-500 font-medium">Pipeline Verification Lab</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] font-mono bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full font-semibold">
              DEVELOPER MODE
            </span>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 font-medium px-3 py-1.5 rounded-md border border-zinc-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Main App</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 space-y-6">

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Cloudinary AI Pipeline Verification
          </h1>
          <p className="text-sm text-zinc-500">
            Validates the full ListReady media pipeline: Upload → AI Captioning → Amazon Rule Engine → Cloudinary Transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">

          {/* LEFT COLUMN: Input Configuration */}
          <div className="space-y-4">

            {/* Input Panel */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="border-b border-zinc-100 px-4 py-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-800">Input Source</h2>
              </div>

              <div className="p-4 space-y-4">
                {/* File Upload */}
                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Local File Upload
                  </label>
                  <div className="border border-dashed border-zinc-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="lab-file-upload"
                    />

                    {selectedFile && filePreview ? (
                      <div className="space-y-2">
                        <div className="w-20 h-20 mx-auto bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 p-1">
                          <img src={filePreview} alt="Local Upload Preview" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-xs text-zinc-600">
                          <span className="font-bold text-zinc-900 block truncate max-w-[200px] mx-auto">{selectedFile.name}</span>
                          <span className="text-zinc-500 block">{Math.round(selectedFile.size / 1024)} KB</span>
                          {fileDimensions && (
                            <span className="text-violet-700 block font-mono">{fileDimensions.width} × {fileDimensions.height} px</span>
                          )}
                        </div>
                        <label
                          htmlFor="lab-file-upload"
                          className="cursor-pointer inline-block text-[11px] font-medium text-zinc-500 hover:text-zinc-800 underline"
                        >
                          Choose different file
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-400">PNG, JPG, WEBP — up to 20MB</p>
                        <label
                          htmlFor="lab-file-upload"
                          className="cursor-pointer inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded-md border border-zinc-200 transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preset Cases */}
                <div>
                  <label className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                    Preset Acceptance Cases
                  </label>
                  <div className="space-y-1 max-h-[280px] overflow-y-auto pr-0.5">
                    {SAMPLE_TEST_IMAGES.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handlePresetSelect(sample)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition flex items-start justify-between gap-2 ${
                          selectedPreset?.id === sample.id
                            ? 'bg-violet-50 border-violet-300 text-violet-900'
                            : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{sample.name}</div>
                          <div className={`text-[10px] mt-0.5 ${selectedPreset?.id === sample.id ? 'text-violet-600' : 'text-zinc-400'}`}>
                            {sample.description}
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono flex-shrink-0 mt-0.5 ${selectedPreset?.id === sample.id ? 'text-violet-600' : 'text-zinc-400'}`}>
                          {sample.presetScenario}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active mode indicator */}
                <div className="pt-2 border-t border-zinc-100">
                  <div className="text-[11px] text-zinc-500 font-mono mb-3">
                    Active: <span className="text-zinc-800 font-bold">{selectedFile ? selectedFile.name : selectedPreset?.name ?? 'None'}</span>
                  </div>
                  <button
                    onClick={handleRunPipeline}
                    disabled={loading || (!selectedFile && !selectedPreset)}
                    className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-white font-bold px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition text-sm shadow-sm"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {loading ? 'Running Pipeline...' : 'Run Pipeline & Analyze'}
                  </button>

                  {analysisData && (
                    <button
                      onClick={resetPipeline}
                      className="w-full mt-2 text-xs text-zinc-500 hover:text-zinc-800 font-medium py-1.5 rounded-md border border-zinc-200 hover:bg-zinc-50 transition"
                    >
                      Reset Results
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Output */}
          <div className="space-y-4">

            {/* Pipeline Status */}
            {loading && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-center gap-3 text-violet-800 text-sm">
                <RefreshCw className="w-4 h-4 animate-spin text-violet-600 flex-shrink-0" />
                <span className="font-mono">{statusStep}</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && !analysisData && (
              <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-700 mb-1">No pipeline output yet</h3>
                <p className="text-xs text-zinc-400">Select an input source and run the pipeline to see analysis results here.</p>
              </div>
            )}

            {/* ANALYSIS RESULTS */}
            {analysisData && (
              <div className="space-y-4">

                {/* SECTION A: DECISION SUMMARY */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Amazon Image Readiness</div>
                      <div className="text-2xl font-black flex items-center gap-2">
                        {analysisData.summary.overallStatus === 'READY' && (
                          <span className="text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-6 h-6" /> READY
                          </span>
                        )}
                        {analysisData.summary.overallStatus === 'FIXES_AVAILABLE' && (
                          <span className="text-amber-700 flex items-center gap-1.5">
                            <Wrench className="w-6 h-6" /> FIXES AVAILABLE
                          </span>
                        )}
                        {analysisData.summary.overallStatus === 'MANUAL_REVIEW_REQUIRED' && (
                          <span className="text-purple-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-6 h-6" /> MANUAL REVIEW REQUIRED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {[
                        { label: 'PASS', count: analysisData.summary.passCount, color: 'text-emerald-700' },
                        { label: 'AUTO-FIX', count: analysisData.summary.autoFixCount, color: 'text-amber-700' },
                        { label: 'REVIEW', count: analysisData.summary.humanReviewCount, color: 'text-purple-700' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-lg text-center min-w-[64px]">
                          <div className={`text-xl font-black ${stat.color}`}>{stat.count}</div>
                          <div className="text-[10px] text-zinc-400 font-mono font-bold">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysisData.summary.autoFixCount > 0 && !fixData && (
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                      <button
                        onClick={handleRunAutoFix}
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
                      >
                        <Wrench className="w-4 h-4" />
                        Apply Cloudinary Auto-Fix
                      </button>
                    </div>
                  )}
                </div>

                {/* SECTION B: COMPLIANCE CHECKS */}
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-800">Compliance Check Results</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisData.checks.map((check) => (
                      <div
                        key={check.id}
                        className={`p-4 rounded-lg border text-xs space-y-2 ${
                          check.status === 'PASS'
                            ? 'bg-zinc-50 border-zinc-200'
                            : check.status === 'AUTO_FIX'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-purple-50 border-purple-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-zinc-800 text-xs">{check.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-extrabold ${
                              check.status === 'PASS'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : check.status === 'AUTO_FIX'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {check.status === 'AUTO_FIX' ? 'AUTO-FIX' : check.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block font-mono text-[10px] uppercase">Observed:</span>
                          <span className="text-zinc-700 font-medium">{check.observed}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block font-mono text-[10px] uppercase">Required:</span>
                          <span className="text-zinc-600">{check.required}</span>
                        </div>
                        {check.fixDescription && (
                          <div className="pt-1 text-amber-700 border-t border-amber-200 font-mono text-[11px]">
                            Action: {check.fixDescription}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION C: BEFORE/AFTER + DOWNLOAD */}
                {fixData && (
                  <div className="space-y-4">
                    <BeforeAfterSlider transformationResult={fixData} />

                    {fixData.status === 'success' && fixData.transformedUrl && (
                      <div className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="font-semibold text-zinc-900 text-sm">Transformed Asset Delivery URL</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 break-all font-mono leading-relaxed">
                            {fixData.transformedUrl}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => copyToClipboard(fixData.transformedUrl!)}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3.5 py-2 rounded-lg border border-zinc-200 flex items-center gap-1.5 transition"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                          </button>

                          <a
                            href={fixData.transformedUrl}
                            target="_blank"
                            rel="noreferrer"
                            download="listready_fixed_product.jpg"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION D: RAW JSON */}
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-800 font-mono">Raw Pipeline Response (JSON)</h3>
                  </div>
                  <pre className="bg-zinc-950 p-5 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[400px] leading-relaxed">
                    {JSON.stringify(fixData || analysisData, null, 2)}
                  </pre>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

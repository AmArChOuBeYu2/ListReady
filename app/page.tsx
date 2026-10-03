'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MarketplaceSelector from '@/components/MarketplaceSelector';
import AnalysisProgress from '@/components/AnalysisProgress';
import ComplianceDashboard from '@/components/ComplianceDashboard';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import ExportCard from '@/components/ExportCard';
import Footer from '@/components/Footer';

// Marketing components
import HeroProductPreview from '@/components/marketing/HeroProductPreview';
import CapabilityStrip from '@/components/marketing/CapabilityStrip';
import ProblemSection from '@/components/marketing/ProblemSection';
import ProductTruthGuard from '@/components/marketing/ProductTruthGuard';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import ComplianceTable from '@/components/marketing/ComplianceTable';
import CloudinaryPipeline from '@/components/marketing/CloudinaryPipeline';
import WhyListReady from '@/components/marketing/WhyListReady';
import FinalCTA from '@/components/marketing/FinalCTA';

import { SAMPLE_TEST_IMAGES, SampleImage } from '@/lib/testData';
import { ComplianceResult, MarketplaceId, TransformationResult } from '@/types';
import { Upload, Sparkles, ArrowRight, AlertTriangle, X, ChevronRight, Check } from 'lucide-react';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState<'landing' | 'upload' | 'progress' | 'results' | 'before_after' | 'export'>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileDimensions, setFileDimensions] = useState<{ width: number; height: number } | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SampleImage | null>(null);
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceId>('amazon');
  
  const [progressStage, setProgressStage] = useState(1);
  const [progressMessage, setProgressMessage] = useState('');
  
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [transformationResult, setTransformationResult] = useState<TransformationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  // Object URL cleanup lifecycle
  React.useEffect(() => {
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

    setActiveStep('upload');
  };

  const handlePresetSelect = (preset: SampleImage) => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedPreset(preset);
    setSelectedFile(null);
    setFilePreview(preset.url);
    setFileDimensions(null);
    setActiveStep('upload');
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !selectedPreset) {
      setError('Please select or upload a product photo first.');
      return;
    }

    setError(null);
    setActiveStep('progress');
    setProgressStage(1);
    setProgressMessage('Uploading image buffer to Cloudinary...');

    try {
      let bodyData: any;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (selectedPreset) {
          formData.append('presetScenario', selectedPreset.presetScenario);
        }
        bodyData = formData;
      } else if (selectedPreset) {
        bodyData = JSON.stringify({
          assetUrl: selectedPreset.url,
          presetScenario: selectedPreset.presetScenario,
        });
      }

      // Stage 2: AI Captioning & Quality Analysis
      setTimeout(() => {
        setProgressStage(2);
        setProgressMessage('Analyzing image via Cloudinary AI Captioning & Quality Analysis...');
      }, 700);

      // Stage 3: Sharp Deterministic Measurements
      setTimeout(() => {
        setProgressStage(3);
        setProgressMessage('Calculating Sharp deterministic RGB border sampling & dimensions...');
      }, 1400);

      // Stage 4: Amazon Rule Engine Evaluation
      setTimeout(() => {
        setProgressStage(4);
        setProgressMessage('Checking image requirements against Amazon Main Image Rules...');
      }, 2100);

      const headers: Record<string, string> = {};
      if (!(bodyData instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: bodyData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Analysis couldn't be completed. Please try again.");
      }

      setComplianceResult(json.data);
      console.log('[DEBUG LOG - UI]', {
        originalUrl: json.data?.assetUrl,
        transformedUrl: null,
        currentResultState: json.data?.summary?.overallStatus,
      });
      setActiveStep('results');
    } catch (err: any) {
      setError(err.message || "Analysis couldn't be completed. Please try again.");
      setActiveStep('upload');
    }
  };

  const handleApplyFix = async () => {
    if (!complianceResult) return;
    setIsFixing(true);
    setError(null);

    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetUrl: complianceResult.assetUrl,
          checks: complianceResult.checks,
          publicId: complianceResult.publicId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Transformation pipeline failed. Please try again.');
      }

      setTransformationResult(json.data);
      console.log('[DEBUG LOG - UI]', {
        originalUrl: json.data?.originalUrl,
        transformedUrl: json.data?.transformedUrl,
        currentResultState: json.data?.status,
      });
      setActiveStep('before_after');
    } catch (err: any) {
      setError(err.message || 'Failed to generate fix transformations.');
    } finally {
      setIsFixing(false);
    }
  };

  const resetWorkflow = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setSelectedPreset(null);
    setComplianceResult(null);
    setTransformationResult(null);
    setError(null);
    setActiveStep('landing');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      <Navbar onCheckClick={() => setActiveStep('upload')} />

      <main className="flex-1 w-full">
        
        {/* LANDING PAGE VIEW */}
        {activeStep === 'landing' && (
          <div>
            {/* 1. Hero Section */}
            <section className="py-16 md:py-24 bg-white border-b border-zinc-200">
              <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                  
                  {/* Left Column: Product Value Proposition */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-violet-800">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                      Track 1 — AI Media Pipelines • Cloudinary 2026
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.08]">
                      Fix your product photos <br />
                      <span className="text-violet-700">
                        before the marketplace does.
                      </span>
                    </h1>

                    <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-xl">
                      ListReady evaluates product photos against strict marketplace rules, classifies issues safely, automatically remediates non-compliant backgrounds, and preserves genuine product details.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        onClick={() => setActiveStep('upload')}
                        id="hero-check-cta"
                        className="bg-violet-700 hover:bg-violet-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-violet-700/20 flex items-center justify-center gap-2 transition text-base"
                      >
                        <span>Check an image</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const el = document.getElementById('how-it-works');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold px-6 py-3.5 rounded-xl border border-zinc-200 flex items-center justify-center gap-2 transition text-sm"
                      >
                        <span>See how it works</span>
                      </button>
                    </div>

                    <div className="pt-4 flex items-center gap-6 text-xs text-zinc-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" /> Pure white canvas AI fix
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" /> Product Truth Guard
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Hero Product Preview UI */}
                  <div className="lg:col-span-6">
                    <HeroProductPreview onPresetSelect={(sample) => handlePresetSelect(sample)} />
                  </div>

                </div>
              </div>
            </section>

            {/* 2. Capability Strip */}
            <CapabilityStrip />

            {/* 3. Problem Section */}
            <ProblemSection />

            {/* 4. Flagship Feature: Product Truth Guard */}
            <ProductTruthGuard />

            {/* 5. How It Works Section */}
            <HowItWorksSection />

            {/* 6. Compliance Engine Matrix */}
            <ComplianceTable />

            {/* 7. Demo Presets Section */}
            <section id="demo-presets" className="py-20 bg-zinc-50 border-b border-zinc-200">
              <div className="max-w-[1280px] mx-auto px-5 sm:px-8 space-y-10">
                
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono font-bold text-violet-700 tracking-wider uppercase">Interactive Lab</span>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Test 10 Acceptance Categories in 1-Click
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600">
                    Select a pre-configured test photo to run full analysis against Amazon Main Image standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SAMPLE_TEST_IMAGES.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => handlePresetSelect(sample)}
                      className="bg-white border border-zinc-200 hover:border-violet-400 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 group"
                    >
                      <div className="aspect-video bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 relative">
                        <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 right-2 bg-zinc-900/90 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {sample.presetScenario}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 group-hover:text-violet-700 transition-colors">{sample.name}</h3>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{sample.description}</p>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-violet-700 font-semibold">
                        <span>Test this scenario</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* 8. Cloudinary Infrastructure Section */}
            <CloudinaryPipeline />

            {/* 9. Why ListReady / Commercial Differentiators */}
            <WhyListReady />

            {/* 10. Final Call to Action */}
            <FinalCTA onCheckClick={() => setActiveStep('upload')} />
          </div>
        )}

        {/* WORKFLOW STEPS CONTAINER */}
        {activeStep !== 'landing' && (
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
            
            {/* UPLOAD & ANALYZER VIEW */}
            {activeStep === 'upload' && (
              <div className="max-w-3xl mx-auto space-y-8 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900">Image Compliance Analyzer</h2>
                    <p className="text-xs text-zinc-500 mt-1">Upload your product photo to scan against Amazon requirements.</p>
                  </div>
                  <button
                    onClick={resetWorkflow}
                    className="text-xs text-zinc-600 hover:text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 transition"
                  >
                    Cancel
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 text-sm flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Image Upload Area */}
                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase text-zinc-500 font-bold tracking-wider block">
                    Product Image File
                  </label>

                  {filePreview ? (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 space-y-4">
                      <div className="aspect-square max-w-xs mx-auto bg-white rounded-xl overflow-hidden border border-zinc-200 relative flex items-center justify-center p-3 shadow-inner">
                        <img src={filePreview} alt="Selected Product Preview" className="max-h-full object-contain" />
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setSelectedPreset(null);
                            setFilePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-rose-600 text-white p-1.5 rounded-full transition"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-center text-xs text-zinc-600 space-y-1">
                        {selectedFile ? (
                          <div>
                            <span className="font-bold text-zinc-900">{selectedFile.name}</span>
                            <span className="text-zinc-500 block mt-0.5">
                              Size: {Math.round(selectedFile.size / 1024)} KB • Type: {selectedFile.type || 'image'}
                              {fileDimensions ? ` • Dimensions: ${fileDimensions.width} × ${fileDimensions.height} px` : ''}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-zinc-900">Preset Scenario: {selectedPreset?.name}</span>
                            <span className="text-zinc-500 block mt-0.5">{selectedPreset?.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-zinc-300 hover:border-violet-500 rounded-2xl p-10 text-center bg-zinc-50/50 flex flex-col items-center justify-center space-y-4 transition">
                      <div className="w-14 h-14 rounded-2xl bg-violet-100 border border-violet-200 text-violet-700 flex items-center justify-center">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-zinc-900">Drag & drop your product photo here</h3>
                        <p className="text-xs text-zinc-500 mt-1">Supports PNG, JPG, WEBP formats up to 20MB</p>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                        id="main-file-upload"
                      />
                      <label
                        htmlFor="main-file-upload"
                        className="cursor-pointer bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition"
                      >
                        Select File
                      </label>
                    </div>
                  )}
                </div>

                {/* Marketplace Selector */}
                <MarketplaceSelector
                  selectedMarketplace={selectedMarketplace}
                  onSelect={setSelectedMarketplace}
                />

                {/* Analyze Action Button */}
                <div className="pt-4 border-t border-zinc-200">
                  <button
                    onClick={handleAnalyze}
                    disabled={!filePreview}
                    className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-40 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-violet-700/20 flex items-center justify-center gap-2 transition text-base"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Image</span>
                  </button>
                </div>
              </div>
            )}

            {/* REAL-TIME PROGRESS VIEW */}
            {activeStep === 'progress' && (
              <div className="py-12 bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
                <AnalysisProgress currentStage={progressStage} stageMessage={progressMessage} />
              </div>
            )}

            {/* RESULTS DASHBOARD VIEW */}
            {activeStep === 'results' && complianceResult && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900">Compliance Results</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Target: Amazon Main Image Requirements (2026)</p>
                  </div>
                  <button
                    onClick={() => setActiveStep('upload')}
                    className="text-xs text-zinc-600 hover:text-zinc-900 bg-white px-3.5 py-1.5 rounded-lg border border-zinc-300 transition font-medium"
                  >
                    Change Image
                  </button>
                </div>

                <ComplianceDashboard
                  complianceResult={complianceResult}
                  onApplyFix={handleApplyFix}
                  isFixing={isFixing}
                />
              </div>
            )}

            {/* BEFORE / AFTER VIEW */}
            {activeStep === 'before_after' && transformationResult && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900">Before / After</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Interactive visual comparison of Cloudinary auto-remediation.</p>
                  </div>
                  <button
                    onClick={() => setActiveStep('export')}
                    className="bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-md"
                  >
                    <span>Proceed to Export</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <BeforeAfterSlider transformationResult={transformationResult} />
              </div>
            )}

            {/* EXPORT & DOWNLOAD VIEW */}
            {activeStep === 'export' && transformationResult && (
              <div className="py-4">
                <ExportCard
                  transformationResult={transformationResult}
                  overallStatus={complianceResult?.summary?.overallStatus}
                  onReset={resetWorkflow}
                />
              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

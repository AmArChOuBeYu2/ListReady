'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TransformationResult } from '@/types';
import { CheckCircle2, SlidersHorizontal, Sparkles, Layers, AlertTriangle, RefreshCw } from 'lucide-react';

interface BeforeAfterSliderProps {
  transformationResult: TransformationResult;
}

export default function BeforeAfterSlider({
  transformationResult,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewControl, setViewControl] = useState<'slider' | 'before' | 'after'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const { originalUrl, transformedUrl, appliedFixes, status, error } = transformationResult;

  // Development Assertion (Constraint #3 & Step 3)
  if (
    status === 'success' &&
    transformedUrl &&
    transformedUrl === originalUrl &&
    appliedFixes.length > 0
  ) {
    throw new Error('Transformation output incorrectly equals original asset.');
  }

  // Measure container width for accurate un-distorted pixel alignment in slider mode
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-extrabold text-zinc-900">Before / After Verification</h3>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Visual comparison slider comparing original image against Cloudinary auto-remediated output.
          </p>
        </div>

        {/* View Mode Controls: Before | Slider | After */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-mono font-bold">
          <button
            onClick={() => setViewControl('before')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              viewControl === 'before'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Before
          </button>

          <button
            onClick={() => setViewControl('slider')}
            disabled={status !== 'success' || !transformedUrl}
            className={`px-3.5 py-1.5 rounded-lg transition disabled:opacity-40 ${
              viewControl === 'slider'
                ? 'bg-violet-700 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Slider Mode
          </button>

          <button
            onClick={() => setViewControl('after')}
            disabled={status !== 'success' || !transformedUrl}
            className={`px-3.5 py-1.5 rounded-lg transition disabled:opacity-40 ${
              viewControl === 'after'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            After
          </button>
        </div>
      </div>

      {/* Interactive Visual Comparison Display */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-xl mx-auto rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 select-none shadow-sm flex items-center justify-center"
      >
        
        {/* TRANSFORMATION PENDING STATE */}
        {status === 'pending' && (
          <div className="text-center p-8 space-y-4">
            <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
            <div>
              <h4 className="font-extrabold text-zinc-900 text-base">Preparing fixed image...</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Cloudinary AI background removal is generating derived assets asynchronously.
              </p>
            </div>
          </div>
        )}

        {/* TRANSFORMATION FAILED STATE (Constraint #5: Never fallback to original) */}
        {status === 'failed' && (
          <div className="text-center p-8 space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <div>
              <h4 className="font-extrabold text-rose-700 text-base">Could not generate the fixed image</h4>
              <p className="text-xs text-zinc-500 mt-1">
                {error || 'Transformation pipeline failed or timed out. Please try again.'}
              </p>
            </div>
          </div>
        )}

        {/* TRANSFORMATION SUCCESS STATE */}
        {status === 'success' && transformedUrl && (
          <>
            {viewControl === 'slider' && (
              <>
                {/* RIGHT / AFTER IMAGE (Cloudinary Fixed Output) */}
                <img
                  src={transformedUrl}
                  alt="Cloudinary Fixed Product"
                  className="absolute inset-0 w-full h-full object-contain p-4 bg-white"
                />

                {/* LEFT / BEFORE IMAGE (Original Upload - Pixel Aligned) */}
                <div
                  className="absolute top-0 bottom-0 left-0 overflow-hidden z-10"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div style={{ width: containerWidth > 0 ? `${containerWidth}px` : '100%', height: '100%' }}>
                    <img
                      src={originalUrl}
                      alt="Original Product Upload"
                      className="w-full h-full object-contain p-4 bg-zinc-100"
                    />
                  </div>
                </div>

                {/* Slider Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-violet-600 shadow-xl cursor-ew-resize z-20"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-violet-700 border-2 border-white flex items-center justify-center text-white shadow-2xl">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                </div>

                {/* Slider Drag Track */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
                  aria-label="Image comparison slider"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-white border border-zinc-700/60 shadow z-20">
                  BEFORE (Original)
                </div>
                <div className="absolute top-3 right-3 bg-emerald-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-300 border border-emerald-700/60 shadow z-20">
                  AFTER (Cloudinary Fixed)
                </div>
              </>
            )}

            {viewControl === 'before' && (
              <div className="w-full h-full relative bg-zinc-100 p-4">
                <img src={originalUrl} alt="Original Upload" className="w-full h-full object-contain" />
                <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-white border border-zinc-700">
                  BEFORE (Original)
                </div>
              </div>
            )}

            {viewControl === 'after' && (
              <div className="w-full h-full relative bg-white p-4">
                <img src={transformedUrl} alt="Cloudinary Fixed Output" className="w-full h-full object-contain" />
                <div className="absolute top-3 right-3 bg-emerald-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-mono font-bold text-emerald-300 border border-emerald-700">
                  AFTER (Cloudinary Fixed)
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Section: Changes Made */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Changes made</span>
        </h4>

        {appliedFixes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {appliedFixes.map((fix, idx) => (
              <div
                key={idx}
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{fix}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No transformations required. Image is already compliant.</p>
        )}
      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { OverallComplianceStatus, TransformationResult } from '@/types';
import { Download, Copy, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';

interface ExportCardProps {
  transformationResult: TransformationResult;
  overallStatus?: OverallComplianceStatus;
  onReset: () => void;
}

export default function ExportCard({ transformationResult, overallStatus = 'READY', onReset }: ExportCardProps) {
  const [copied, setCopied] = useState(false);

  const {
    transformedUrl,
    format = 'JPEG',
    dimensions = { width: 2000, height: 2000 },
    fileSizeEst = '~145 KB',
  } = transformationResult;

  if (!transformedUrl) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-sm">
        <h3 className="text-lg font-bold text-rose-700">Transformation Image Not Available</h3>
        <p className="text-xs text-zinc-500">
          The transformed asset could not be generated. Please check the compliance report and try again.
        </p>
        <button
          onClick={onReset}
          className="text-xs text-violet-700 hover:text-violet-900 font-bold bg-zinc-100 px-4 py-2 rounded-lg border border-zinc-300 transition"
        >
          Return to Analyzer
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(transformedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `listready_processed_product_${Date.now()}.${format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(transformedUrl, '_blank');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(transformedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titleText =
    overallStatus === 'MANUAL_REVIEW_REQUIRED'
      ? 'Manual Review Required'
      : overallStatus === 'FIXES_AVAILABLE'
      ? 'Fixes Applied'
      : 'Ready for Catalog';

  const subText =
    overallStatus === 'MANUAL_REVIEW_REQUIRED'
      ? 'ListReady applied supported fixes, but this image contains items requiring seller manual inspection before Amazon catalog submission.'
      : overallStatus === 'FIXES_AVAILABLE'
      ? 'Product photo remediated via Cloudinary background removal and white canvas padding. Review the before/after and download.'
      : 'Your product image passes all evaluated Amazon main image requirements. Download and submit to your catalog.';

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-8 max-w-3xl mx-auto shadow-sm">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">{titleText}</h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">{subText}</p>
      </div>

      {/* Large Final Image Preview */}
      <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 space-y-6">
        <div className="aspect-square max-w-md mx-auto bg-white rounded-xl overflow-hidden border border-zinc-200 p-4 shadow-inner flex items-center justify-center">
          <img
            src={transformedUrl}
            alt="Processed Product Listing"
            className="max-h-full object-contain"
          />
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-violet-700 hover:bg-violet-800 text-white font-extrabold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-700/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>

          <button
            onClick={handleCopyUrl}
            className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold px-6 py-4 rounded-xl border border-zinc-300 flex items-center justify-center gap-2 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Cloudinary Delivery URL'}</span>
          </button>
        </div>
      </div>

      {/* File Information Specs */}
      <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-3">
        <h4 className="text-xs font-mono uppercase text-zinc-500 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Output File Information
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3 rounded-lg border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">Format</span>
            <span className="text-zinc-900 font-bold">{format.toUpperCase()}</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">Width</span>
            <span className="text-zinc-900 font-bold">{dimensions.width} px</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">Height</span>
            <span className="text-zinc-900 font-bold">{dimensions.height} px</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-zinc-200">
            <span className="text-zinc-400 text-[10px] font-mono uppercase block">File Size</span>
            <span className="text-zinc-900 font-bold">{fileSizeEst}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1.5 mx-auto transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Process another image</span>
        </button>
      </div>

    </div>
  );
}

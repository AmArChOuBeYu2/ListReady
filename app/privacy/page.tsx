import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | ListReady',
  description: 'ListReady Privacy Policy detailing image processing, Cloudinary storage, and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: September 2026 • ListReady Hackathon & Production Preview</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
          <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl text-amber-300 text-xs font-mono">
            ⚠️ NOTICE & LEGAL FLAG: This Privacy Policy outlines technical data flows for the ListReady application. Formal legal counsel review is required before commercial deployment.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              ListReady processes product images uploaded directly by users or provided via image URL presets. When an image is uploaded:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Product Image Files & Pixels (processed in-memory and via secure stream to Cloudinary).</li>
              <li>Technical Image Metadata (file dimensions, color histograms, file format, border sampling).</li>
              <li>AI Caption Observations (derived via Cloudinary AI Captioning for compliance checks).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. How Images Are Processed & Stored</h2>
            <p>
              Uploaded images are transmitted over TLS/HTTPS directly to Cloudinary media servers for quality analysis, AI captioning, and image transformation (e.g., background removal and white canvas padding). Images are stored in an isolated Cloudinary folder (`listready_uploads`) to generate transformed delivery assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Third-Party Services</h2>
            <p>
              ListReady integrates with Cloudinary as the primary infrastructure provider for media storage, AI captioning, and image transformations. Cloudinary processes data in accordance with their strict privacy standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Data Retention & Erasure</h2>
            <p>
              Uploaded assets are retained temporarily for evaluation and export generation. Users can request asset deletion or clear local session state at any time.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
            <p className="text-slate-400 text-xs">
              For technical inquiries or data deletion requests regarding ListReady data processing, please submit a inquiry through our development repository.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

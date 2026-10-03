import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms & Conditions | ListReady',
  description: 'ListReady Terms and Conditions of Service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: September 2026 • ListReady Service Terms</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
          <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl text-amber-300 text-xs font-mono">
            ⚠️ NOTICE & DISCLAIMER: ListReady provides automated media analysis and Cloudinary transformations based on published marketplace guidelines. Ultimate compliance acceptance is subject to individual marketplace policies.
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Service Overview</h2>
            <p>
              ListReady offers media analysis, technical compliance evaluations, and Cloudinary automated image transformations for e-commerce sellers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. User Responsibilities & Content Ownership</h2>
            <p>
              Users retain full ownership and copyright of their uploaded images. Users represent and warrant that they possess all necessary commercial rights to process and transform uploaded photos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Disclaimer of Guaranteed Marketplace Acceptance</h2>
            <p>
              While ListReady evaluates images against standard Amazon main image policy checks (pure white background, minimum resolution, formatting, framing), third-party marketplaces reserve the right to enforce additional subjective seller catalog criteria. ListReady does not guarantee marketplace approval for catalog listings.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
            <p className="text-slate-400 text-xs">
              ListReady and its creators are not liable for listing rejections, account suspensions, or commercial losses resulting from marketplace seller decisions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

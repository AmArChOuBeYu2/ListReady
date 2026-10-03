import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cookie Policy | ListReady',
  description: 'ListReady Cookie & Local Storage Usage Policy.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Cookie Policy</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: September 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Use of Cookies & Local Storage</h2>
            <p>
              ListReady operates with minimal cookie dependencies. We use local browser storage strictly for session state management (e.g., active step, selected image preset, and marketplace preference).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Third-Party Cookies</h2>
            <p>
              ListReady does not utilize third-party advertising cookies or invasive tracking beacons. Media delivery and CDN assets served via Cloudinary operate under strict secure transmission.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-14">

        {/* Top row: brand + columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[5px] bg-violet-700 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 10l6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-bold text-sm text-zinc-900 tracking-tight">ListReady</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px]">
              Product image compliance and quality control for marketplace sellers.
            </p>
            <p className="text-[11px] text-zinc-400">
              Powered by Cloudinary AI · Sharp · Amazon Rule Engine
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-zinc-900 tracking-wider uppercase">Product</div>
            <ul className="space-y-2.5">
              <li><FooterLink href="#" label="Check an image" /></li>
              <li><FooterLink href="#truth-guard" label="Product Truth Guard" /></li>
              <li><FooterLink href="#how-it-works" label="How it works" /></li>
              <li><FooterLink href="#compliance-engine" label="Compliance engine" /></li>
              <li><FooterLink href="#pipeline" label="Cloudinary pipeline" /></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-zinc-900 tracking-wider uppercase">Resources</div>
            <ul className="space-y-2.5">
              <li><FooterLink href="/test-pipeline" label="Developer Test Lab" /></li>
              <li><FooterLink href="/cloudinary-test" label="Cloudinary Verify" /></li>
              <li><FooterLink href="https://cloudinary.com/documentation" label="Cloudinary Docs" external /></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-zinc-900 tracking-wider uppercase">Legal</div>
            <ul className="space-y-2.5">
              <li><FooterLink href="/privacy" label="Privacy Policy" /></li>
              <li><FooterLink href="/terms" label="Terms of Service" /></li>
              <li><FooterLink href="/cookies" label="Cookie Policy" /></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-400">
            © {new Date().getFullYear()} ListReady. All rights reserved.
          </p>
          <p className="text-[11px] text-zinc-400">
            ListReady evaluates images against published marketplace policy requirements. Catalog acceptance is subject to marketplace review.
          </p>
        </div>

      </div>
    </footer>
  );
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-zinc-500 hover:text-zinc-900 transition"
      >
        {label}
      </a>
    );
  }
  if (href.startsWith('#')) {
    return (
      <button
        onClick={() => {
          const el = document.getElementById(href.slice(1));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="text-xs text-zinc-500 hover:text-zinc-900 transition text-left"
      >
        {label}
      </button>
    );
  }
  return (
    <Link href={href} className="text-xs text-zinc-500 hover:text-zinc-900 transition">
      {label}
    </Link>
  );
}

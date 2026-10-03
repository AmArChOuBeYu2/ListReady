'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onCheckClick?: () => void;
}

export default function Navbar({ onCheckClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '#how-it-works' },
    { label: 'Truth Guard', href: '#truth-guard' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Compliance', href: '#compliance-engine' },
    { label: 'Developer Lab', href: '/test-pipeline' },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200 ${
          scrolled ? 'shadow-sm border-zinc-200' : 'border-zinc-100'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-6">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-[6px] bg-violet-700 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 10l6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-[15px] text-zinc-900 tracking-tight">ListReady</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium transition"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 font-medium transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/test-pipeline"
              className="text-sm text-zinc-500 hover:text-zinc-900 font-medium px-3 py-1.5 rounded-md hover:bg-zinc-50 transition"
            >
              Sign in
            </Link>
            <button
              onClick={onCheckClick}
              id="nav-check-cta"
              className="flex items-center gap-1.5 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold px-4 py-2 rounded-md transition"
            >
              Check an image
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onCheckClick}
              className="bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
            >
              Check image
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] z-40 bg-white border-b border-zinc-200 shadow-lg">
          <nav className="max-w-[1280px] mx-auto px-5 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-medium transition"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-medium transition"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="mt-2 pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <Link href="/privacy" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600">Privacy</Link>
              <Link href="/terms" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600">Terms</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

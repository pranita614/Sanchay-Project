'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X, User, Bookmark } from 'lucide-react';
import { useTranslation } from '@/lib/translations/LanguageContext';
import { getStudyPackItems, subscribeToStudyPack } from '@/lib/study-pack/store';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studyPackCount, setStudyPackCount] = useState(0);

  useEffect(() => {
    setStudyPackCount(getStudyPackItems().length);
    const unsubscribe = subscribeToStudyPack((items) => {
      setStudyPackCount(items.length);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/collections', label: 'Collections' },
    { href: '/audio', label: 'Audio Speeches' },
    { href: '/video', label: 'Video Archive' },
    { href: '/ask-sanchay', label: 'Ask Sanchay AI' },
    { href: '/study-pack', label: `My Study Pack${studyPackCount > 0 ? ` (${studyPackCount})` : ''}` },
  ];

  return (
    <header className="bg-sanchay-deepNavy/95 text-white sticky top-0 z-50 shadow-md border-b border-sanchay-gold/30 backdrop-blur-md" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 border-2 border-sanchay-gold shadow-goldGlow transition-transform group-hover:scale-105 flex items-center justify-center overflow-hidden">
              <img
                src="/images/sanchay_logo.png"
                alt="Sanchay Digital Heritage Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold text-sanchay-gold tracking-wide block leading-none">
                Sanchay
              </span>
              <span className="text-[10px] text-sanchay-cream/80 tracking-tight block mt-1 font-sans">
                Digital Museum & Archive of Dr. B. R. Ambedkar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Static English */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-md text-xs font-serif font-bold transition-all relative ${
                    isActive
                      ? 'text-sanchay-gold bg-sanchay-darkNavy border-b-2 border-sanchay-gold'
                      : 'text-sanchay-cream/90 hover:text-sanchay-gold hover:bg-sanchay-darkNavy/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: User Avatar & Staff Login Button */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* User Avatar Badge */}
            <div className="w-8 h-8 rounded-full bg-sanchay-cream text-sanchay-deepNavy flex items-center justify-center border border-sanchay-gold/50 shadow-sm">
              <User className="w-4 h-4 text-sanchay-deepNavy" />
            </div>

            {/* Staff Login Button - Static English */}
            <Link
              href="/staff/login"
              className="px-4 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold hover:bg-sanchay-goldLight transition-all shadow-sm flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              Staff Login
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-sanchay-gold hover:bg-sanchay-darkNavy focus:outline-none"
              suppressHydrationWarning
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation - Static English */}
      {mobileOpen && (
        <div className="lg:hidden bg-sanchay-darkNavy border-b border-sanchay-gold/30 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-sanchay-cream hover:text-sanchay-gold hover:bg-sanchay-deepNavy"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-sanchay-gold/20 flex flex-col gap-2">
            <Link
              href="/staff/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center px-4 py-2 rounded bg-sanchay-gold text-sanchay-deepNavy font-bold text-sm"
            >
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

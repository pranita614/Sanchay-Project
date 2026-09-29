'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Mic, Video, Sparkles, Home, Globe } from 'lucide-react';

export default function KioskModePage() {
  return (
    <div className="min-h-screen bg-sanchay-deepNavy text-white p-8 flex flex-col justify-between select-none">
      
      {/* Top Touch Kiosk Bar */}
      <div className="flex items-center justify-between border-b-2 border-sanchay-gold pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sanchay-darkNavy border-2 border-sanchay-gold flex items-center justify-center">
            <span className="text-sanchay-gold font-serif font-bold text-2xl">S</span>
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-sanchay-gold tracking-wide">
              SANCHAY KIOSK
            </h1>
            <p className="text-xs text-sanchay-cream/80">
              Institutional Touch Exhibition & Knowledge Terminal
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-sm flex items-center gap-2 shadow-goldGlow"
        >
          <Home className="w-5 h-5" /> Exit Kiosk Mode
        </Link>
      </div>

      {/* Main Touch Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-auto py-8 max-w-6xl mx-auto w-full">
        
        <Link
          href="/explore"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">Explore Collections</span>
        </Link>

        <Link
          href="/timeline"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <Clock className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">Interactive Timeline</span>
        </Link>

        <Link
          href="/audio"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <Mic className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">Audio Speeches</span>
        </Link>

        <Link
          href="/video"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <Video className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">Video Archive</span>
        </Link>

        <Link
          href="/ask-sanchay"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">Ask Sanchay AI</span>
        </Link>

        <Link
          href="/vows"
          className="p-8 rounded-2xl bg-sanchay-darkNavy border-2 border-sanchay-gold hover:scale-105 active:scale-95 transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-archival"
        >
          <div className="w-20 h-20 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center">
            <Globe className="w-10 h-10 text-sanchay-gold" />
          </div>
          <span className="text-xl font-serif font-bold text-sanchay-gold">22 Vows (Nagpur 1956)</span>
        </Link>

      </div>

      {/* Footer message */}
      <div className="text-center border-t border-sanchay-gold/30 pt-4 text-xs text-sanchay-cream/70 font-mono">
        SANCHAY Touch Screen Kiosk Terminal • Touch any tile to explore
      </div>

    </div>
  );
}

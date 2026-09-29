'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { SEED_VOWS } from '@/lib/db/seed-data';
import { Volume2, Scroll, Copy, Check, ExternalLink } from 'lucide-react';

import { playSpeechAudio } from '@/lib/audio/speech-engine';

export default function VowsPage() {
  const [selectedLang, setSelectedLang] = useState<'english' | 'marathi' | 'hindi'>('english');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const speakVow = (vow: typeof SEED_VOWS[0]) => {
    const text = selectedLang === 'marathi' ? vow.marathiText : selectedLang === 'hindi' ? vow.hindiText : vow.vowText;
    playSpeechAudio({
      text: text,
      language: selectedLang,
      englishTitle: vow.vowText
    });
  };

  const copyToClipboard = (id: string, text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream font-sans" suppressHydrationWarning>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        
        {/* Main Section Header matching BAWS reference */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream p-6 sm:p-8 shadow-archival space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
                22 Vows
              </h1>
              <p className="text-xs sm:text-sm text-sanchay-textDark mt-1 leading-relaxed max-w-3xl">
                In Nagpur, after leaving the Hindu religion and accepting Buddhism on 14th October 1956, Dr. Babasaheb Ambedkar prescribed 22 vows to his followers.
              </p>
              <div className="pt-2">
                <Link
                  href="/documents/doc-buddha-and-his-dhamma"
                  className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Direct book link
                </Link>
              </div>
            </div>

            {/* Language Switcher Toolbar */}
            <div className="flex items-center gap-1.5 bg-sanchay-cream p-1.5 rounded-lg border border-sanchay-borderCream self-start sm:self-center">
              <button
                type="button"
                onClick={() => setSelectedLang('english')}
                className={`px-3 py-1.5 rounded text-xs font-serif font-bold transition-all cursor-pointer ${
                  selectedLang === 'english'
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                    : 'text-sanchay-deepNavy hover:bg-white'
                }`}
                suppressHydrationWarning
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('marathi')}
                className={`px-3 py-1.5 rounded text-xs font-serif font-bold transition-all cursor-pointer ${
                  selectedLang === 'marathi'
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                    : 'text-sanchay-deepNavy hover:bg-white'
                }`}
                suppressHydrationWarning
              >
                मराठी (Marathi)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hindi')}
                className={`px-3 py-1.5 rounded text-xs font-serif font-bold transition-all cursor-pointer ${
                  selectedLang === 'hindi'
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                    : 'text-sanchay-deepNavy hover:bg-white'
                }`}
                suppressHydrationWarning
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted flex items-center justify-between pt-1">
            <span>Historical Record: Deekshabhoomi, Nagpur (14 October 1956)</span>
            <span className="font-bold text-sanchay-deepNavy">Total: 22 Sequential Vows</span>
          </div>
        </div>

        {/* Sequential List of 22 Vows (Full Width Rows as per baws.in layout) */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival divide-y divide-sanchay-borderCream overflow-hidden">
          {SEED_VOWS.map((vow) => {
            const displayText = selectedLang === 'marathi' ? vow.marathiText : selectedLang === 'hindi' ? vow.hindiText : vow.vowText;
            const isCopied = copiedId === vow.id;

            return (
              <div
                key={vow.id}
                className="p-4 sm:p-5 hover:bg-sanchay-creamLight/60 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <span className="text-sm font-mono font-bold text-sanchay-deepNavy shrink-0 pt-0.5 min-w-[28px]">
                    {vow.number})
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-serif text-sanchay-deepNavy font-medium leading-relaxed">
                      {displayText}
                    </p>
                    {vow.context && (
                      <p className="text-[11px] text-sanchay-textMuted font-sans">
                        {vow.context}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(vow.id, `${vow.number}) ${displayText}`)}
                    className="p-1.5 rounded text-sanchay-textMuted hover:text-sanchay-gold hover:bg-sanchay-cream transition-colors cursor-pointer"
                    title="Copy vow text"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => speakVow(vow)}
                    className="p-1.5 rounded text-sanchay-textMuted hover:text-sanchay-gold hover:bg-sanchay-cream transition-colors cursor-pointer"
                    title="Listen TTS playback"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}

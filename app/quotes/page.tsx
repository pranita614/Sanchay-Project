'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudyPackToast from '@/components/study-pack/StudyPackToast';
import { SEED_QUOTES } from '@/lib/db/seed-data';
import { Quote as QuoteIcon, CheckCircle2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

export default function QuotesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />
      <StudyPackToast />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Verified Archival Quotes
          </h1>
          <p className="text-xs text-sanchay-textMuted mt-2">
            Every quote in Sanchay is strictly grounded and cross-referenced with official archival volume and page numbers. Zero unverified or fabricated quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {SEED_QUOTES.map((q) => (
            <div
              key={q.id}
              className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30">
                    {q.topic}
                  </span>
                  <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" /> Grounded & Verified
                  </span>
                </div>

                <QuoteIcon className="w-6 h-6 text-sanchay-gold mb-2 opacity-80" />
                <blockquote className="text-base font-serif italic text-sanchay-deepNavy leading-relaxed font-medium">
                  "{q.quoteText}"
                </blockquote>
              </div>

              <div className="mt-5 pt-3 border-t border-sanchay-borderCream flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                <div>
                  <strong className="text-sanchay-deepNavy block">{q.sourceWork}</strong>
                  <span className="text-sanchay-gold font-mono text-[11px]">{q.volume}, Page {q.pageNumber} ({q.year})</span>
                </div>
                <SaveToStudyPackButton
                  item={{
                    id: q.id,
                    itemType: 'QUOTE',
                    title: `Quote: ${q.sourceWork}`,
                    description: `"${q.quoteText}" (${q.volume}, Page ${q.pageNumber})`,
                    url: '/quotes',
                  }}
                  variant="compact"
                />
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

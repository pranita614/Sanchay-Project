'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEED_DOCUMENTS } from '@/lib/db/seed-data';
import { getBawsBookUrl } from '@/lib/baws-utils';
import { useTranslation } from '@/lib/translations/LanguageContext';
import { ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CollectionsCataloguePage() {
  const { language } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8" suppressHydrationWarning>
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-sanchay-gold uppercase tracking-wider">
            OFFICIAL ARCHIVAL CATALOGUE • ({language.toUpperCase()})
          </span>
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Archival Catalogue & Collections
          </h1>
          <p className="text-xs text-sanchay-textMuted font-sans">
            Complete catalogue of Dr. Babasaheb Ambedkar Writings and Speeches official volumes with direct links to full books.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_DOCUMENTS.map((doc) => {
            const displayTitle = (
              language === 'Marathi' ? doc.marathiTitle :
              language === 'Hindi' ? doc.hindiTitle :
              language === 'Bengali' ? doc.bengaliTitle :
              language === 'Tamil' ? doc.tamilTitle : undefined
            ) || doc.title;

            const bawsUrl = getBawsBookUrl(doc, language);

            return (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-lg border border-sanchay-borderCream shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30">
                      {doc.volume}
                    </span>
                    <span className="text-xs font-mono font-bold text-sanchay-gold">
                      {doc.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-sanchay-deepNavy leading-tight">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-sanchay-textMuted line-clamp-3 font-sans leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-sanchay-borderCream flex items-center justify-between gap-2 text-xs">
                  <a
                    href={bawsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy font-bold flex items-center gap-1 hover:bg-sanchay-goldLight shadow-xs"
                    title={`Read full book in ${language}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sanchay-deepNavy" /> Read Online ({language})
                  </a>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="px-3 py-1.5 rounded bg-sanchay-deepNavy text-sanchay-gold font-bold flex items-center gap-1 hover:bg-sanchay-darkNavy shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Details
                  </Link>
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

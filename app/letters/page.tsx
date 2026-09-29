'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Search, Filter, ExternalLink, Copy, Share2, FileText, Download, Volume2 } from 'lucide-react';
import { SEED_DOCUMENTS, ArchivalDocument } from '@/lib/db/seed-data';
import { playSpeechAudio } from '@/lib/audio/speech-engine';
import { useTranslation, SupportedLanguage } from '@/lib/translations/LanguageContext';

export default function LettersPage() {
  const { language, setLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('All Volumes');

  // Filter all seed documents to get letters & correspondence items
  const rawLetters = useMemo(() => {
    return SEED_DOCUMENTS.filter(doc => doc.type === 'LETTER' || doc.type === 'DOCUMENT');
  }, []);

  const volumesList = useMemo(() => {
    const vols = Array.from(new Set(rawLetters.map(l => l.volume).filter(Boolean)));
    return ['All Volumes', ...vols];
  }, [rawLetters]);

  // Filtered letters matching query, volume & language
  const displayedLetters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rawLetters.filter(letItem => {
      if (selectedVolume !== 'All Volumes' && letItem.volume !== selectedVolume) {
        return false;
      }
      if (!q) return true;
      const titleMatch = letItem.title.toLowerCase().includes(q) || (letItem.marathiTitle && letItem.marathiTitle.toLowerCase().includes(q));
      const descMatch = letItem.description.toLowerCase().includes(q) || (letItem.marathiDescription && letItem.marathiDescription.toLowerCase().includes(q));
      return titleMatch || descMatch;
    });
  }, [rawLetters, searchQuery, selectedVolume]);

  const speakText = (text: string, englishTitle?: string) => {
    playSpeechAudio({
      text: text,
      language: language,
      englishTitle: englishTitle || text
    });
  };

  const getTranslatedTitle = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiTitle) return item.marathiTitle;
    if (language === 'Hindi' && item.hindiTitle) return item.hindiTitle;
    if (language === 'Bengali' && item.bengaliTitle) return item.bengaliTitle;
    if (language === 'Tamil' && item.tamilTitle) return item.tamilTitle;
    return item.title;
  };

  const getTranslatedDescription = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiDescription) return item.marathiDescription;
    if (language === 'Hindi' && item.hindiDescription) return item.hindiDescription;
    if (language === 'Bengali' && item.bengaliDescription) return item.bengaliDescription;
    if (language === 'Tamil' && item.tamilDescription) return item.tamilDescription;
    return item.description;
  };

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8" suppressHydrationWarning>
        
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream p-8 shadow-archival text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanchay-gold/20 text-sanchay-deepNavy text-xs font-mono font-bold">
            <FileText className="w-4 h-4 text-sanchay-gold" /> OFFICIAL ARCHIVE
          </div>
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Dr. Babasaheb Ambedkar Writings And Speeches — Letters & Correspondence
          </h1>
          <p className="text-xs text-sanchay-textMuted max-w-2xl mx-auto leading-relaxed">
            Historical correspondence, memorandum letters, and archival notes of Dr. B. R. Ambedkar preserved in official volumes.
          </p>

          {/* Controls Bar: Search, Language & Volume Filter */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search letters (e.g. Resignation, Attlee, Cabinet Mission)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border-2 border-sanchay-gold bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none"
                suppressHydrationWarning
              />
              <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-serif font-bold text-sanchay-deepNavy shrink-0">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-2 text-xs font-bold rounded-lg border-2 border-sanchay-gold bg-sanchay-cream text-sanchay-deepNavy focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            {/* Volume Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-serif font-bold text-sanchay-deepNavy shrink-0">Volume:</label>
              <select
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
                className="w-full p-2 text-xs font-bold rounded-lg border border-sanchay-borderCream bg-white text-sanchay-deepNavy focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                {volumesList.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Letters Counter */}
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-mono text-sanchay-textMuted px-1">
          <span>Showing {displayedLetters.length} verified archival letters</span>
          <span className="px-2.5 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold font-bold">
            Language: {language}
          </span>
        </div>

        {/* Authentic Letters List Layout */}
        <div className="space-y-4 max-w-4xl mx-auto font-sans">
          {displayedLetters.map((letItem) => {
            const rawTitle = getTranslatedTitle(letItem);
            const formattedTitle = rawTitle.startsWith('"') ? rawTitle : `"${rawTitle}"`;
            const docUrl = `/documents/${letItem.id}`;
            const volLabel = letItem.volume || 'Volume_17_02';
            const desc = getTranslatedDescription(letItem);

            return (
              <div
                key={letItem.id}
                className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival hover:border-blue-500 transition-all space-y-3 group"
              >
                {/* Title Line with Open Direct Link & Volume Subtitle */}
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-slate-900 leading-snug flex items-center gap-2.5 flex-wrap">
                    <span>{formattedTitle}</span>
                    <Link
                      href={docUrl}
                      className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 transition-colors shadow-xs"
                    >
                      Open Direct
                    </Link>
                  </h3>
                  <div className="text-xs font-mono text-slate-500 font-semibold">
                    {volLabel}
                  </div>
                </div>

                {/* Excerpt / Summary */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {desc}
                </p>

                {/* Bottom Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      ARCHIVE RECORD ({letItem.year || '1946'})
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500">
                    <button
                      type="button"
                      onClick={() => speakText(`${rawTitle}. ${desc}`)}
                      className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      title="Listen Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sanchay-gold" /> Listen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(`${rawTitle}\nVolume: ${volLabel}\n${desc}`);
                          alert('Letter citation copied to clipboard!');
                        }
                      }}
                      className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      title="Copy Citation"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(window.location.origin + docUrl);
                          alert('Letter direct link copied!');
                        }
                      }}
                      className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      title="Share Direct Link"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                    <Link
                      href={docUrl}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1 font-serif"
                    >
                      Open Full Document →
                    </Link>
                  </div>
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

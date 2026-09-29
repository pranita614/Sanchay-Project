'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEED_VIDEO, ArchivalVideo } from '@/lib/db/seed-data';
import { Film, Play } from 'lucide-react';
import Link from 'next/link';

export default function VideoArchiveIndexPage() {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Archival Films' | 'Documentaries'>('All');

  const availableCategories = (['All', 'Archival Films', 'Documentaries'] as const).filter(cat => {
    if (cat === 'All') return true;
    return SEED_VIDEO.some(vid => vid.tags.includes(cat) || vid.type?.includes(cat));
  });

  const filteredVideos = SEED_VIDEO.filter(vid => {
    if (activeCategoryFilter === 'All') return true;
    return vid.tags.includes(activeCategoryFilter) || vid.type?.includes(activeCategoryFilter);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E3] font-sans" suppressHydrationWarning>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-block text-xs font-mono font-bold tracking-[0.2em] text-[#C9A227] uppercase">
            INSTITUTIONAL VISUAL REPOSITORIES
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#062A4A] tracking-tight">
            VIDEO ARCHIVE
          </h1>
          <p className="text-sm sm:text-base text-[#172B3D]/80 font-sans leading-relaxed">
            Explore documentary films and archival visual records connected with Dr. B. R. Ambedkar.
          </p>
        </div>

        {/* CATEGORY FILTERS BAR (ONLY CATEGORIES WITH VERIFIED RECORDS) */}
        {availableCategories.length > 1 && (
          <div className="bg-white rounded-xl border border-sanchay-borderCream p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#062A4A] uppercase">
              <Film className="w-4 h-4 text-[#C9A227]" /> Categories:
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#062A4A] text-[#C9A227] shadow-sm'
                      : 'bg-[#FBF8EF] text-[#062A4A] hover:bg-[#C9A227]/20 border border-sanchay-borderCream'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESPONSIVE VIDEO GRID (3 per row desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => {
            return (
              <div
                key={vid.id}
                className="bg-white rounded-xl border border-sanchay-borderCream hover:border-[#C9A227] p-4 shadow-archival hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  
                  {/* 16:9 Source Archival Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#062A4A] border border-sanchay-borderCream shadow-sm">
                    <img
                      src={vid.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
                      alt={vid.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                      }}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Source Badge Overlay */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-[#C9A227] text-[#062A4A] shadow-xs">
                        INTERNET ARCHIVE
                      </span>
                    </div>

                    {/* Circular Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Link
                        href={`/video/${vid.id}`}
                        className="w-12 h-12 rounded-full bg-[#C9A227] text-[#062A4A] flex items-center justify-center group-hover:scale-110 transition-transform shadow-goldGlow"
                      >
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-sanchay-textMuted">
                      <span className="text-[#C9A227] font-bold">{vid.year || '1991'}</span>
                      <span>{vid.type || 'Archival Biographical Film'}</span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-[#062A4A] group-hover:text-[#C9A227] transition-colors leading-snug line-clamp-2">
                      <Link href={`/video/${vid.id}`}>{vid.title}</Link>
                    </h3>

                    <p className="text-xs text-[#172B3D]/80 font-sans leading-relaxed line-clamp-3">
                      {vid.description}
                    </p>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-sanchay-borderCream flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[10px] text-sanchay-textMuted truncate max-w-[140px]">
                    {vid.creator || vid.source}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/video/${vid.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#062A4A] text-[#C9A227] font-bold text-xs flex items-center gap-1.5 hover:bg-[#082F52] transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Video
                    </Link>
                    <Link
                      href={`/video/${vid.id}`}
                      className="text-xs font-serif font-bold text-[#062A4A] hover:text-[#C9A227] transition-colors"
                    >
                      View Details →
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

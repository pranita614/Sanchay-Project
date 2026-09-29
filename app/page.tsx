'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Landmark, GitFork, Mic, PlaySquare, MessageSquareText, Star, ArrowUpRight, Bookmark } from 'lucide-react';
import { useTranslation } from '@/lib/translations/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();

  const featureTabs = [
    {
      title: 'Explore Collections',
      desc: 'Access official BAWS volumes, writings & parliamentary speeches.',
      href: '/explore',
      icon: Landmark,
      bgImage: '/images/cover_annihilation_of_caste.jpg'
    },
    {
      title: 'Interactive Timeline',
      desc: 'Chronological historical movement & life milestones (1891–1956).',
      href: '/timeline',
      icon: GitFork,
      bgImage: '/images/photo_mahad_reception_1927.jpg'
    },
    {
      title: 'Audio Archive',
      desc: 'Multilingual archival audio, speeches & audiobooks in 5 languages.',
      href: '/audio',
      icon: Mic,
      bgImage: '/images/photo_yerwada_poona_pact_1932.jpg'
    },
    {
      title: 'Video Archive',
      desc: 'Constituent Assembly films, documentary footage & archive videos.',
      href: '/video',
      icon: PlaySquare,
      bgImage: '/images/ambedkar_constitution.jpg'
    },
    {
      title: 'Ask Sanchay AI',
      desc: 'AI assistant for authentic citations & contextual knowledge search.',
      href: '/ask-sanchay',
      icon: MessageSquareText,
      bgImage: '/images/cover_castes_in_india.jpg'
    },
    {
      title: 'Saved Content',
      desc: 'Access your saved speeches, liked audiobooks & bookmarked records.',
      href: '/bookmarks',
      icon: Bookmark,
      bgImage: '/images/photo_constitution_presentation_1949.jpg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E3] font-sans" suppressHydrationWarning>
      
      {/* 1. HEADER / NAVIGATION */}
      <Navbar />

      {/* 2. HERO SECTION — Dark Blue Left Shading + Dark Shaded Ambedkar Background Image on Right */}
      <section className="relative bg-gradient-to-r from-[#062A4A] via-[#082F52] to-[#1F5A86] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-2 border-[#C9A227]/50 shadow-xl min-h-[540px] flex items-center" suppressHydrationWarning>
        
        {/* RIGHT SIDE — Single Dark Shaded Background Image of Dr. B. R. Ambedkar */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-1/2 bg-cover bg-top bg-no-repeat opacity-80 mix-blend-luminosity filter contrast-125 brightness-90 pointer-events-none z-0"
          style={{ backgroundImage: `url('/images/ambedkar_portrait.jpg')` }}
        />

        {/* Gradient Mask: Dark Navy Blue Shading on Left Text side -> Translucent Light Archival Blue Blend on Right Image side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062A4A] via-[#062A4A]/95 to-[#1F5A86]/40 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062A4A] via-transparent to-[#062A4A]/60 pointer-events-none z-0" />

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content — Shifted Left with Larger Font Sizes */}
          <div className="lg:col-span-10 space-y-6">
            
            {/* Top Eyebrow */}
            <div className="inline-block text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-[#C9A227] uppercase">
              EXPLORE • LEARN • BE INSPIRED
            </div>

            {/* Sanchay Title — Larger Font Size */}
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-[#C9A227] tracking-tight leading-none drop-shadow-md">
              Sanchay
            </h1>

            {/* Primary Hero Heading — Larger Font Size */}
            <h2 className="text-3xl sm:text-5xl font-serif text-white font-bold leading-tight drop-shadow-sm">
              Explore the Life, Work & Legacy of <br className="hidden sm:inline" />
              <span className="text-[#E0B52A]">Dr. B. R. Ambedkar</span>
            </h2>

            {/* Introductory Paragraph — Larger Font Size */}
            <p className="text-base sm:text-lg text-sanchay-cream/95 font-sans leading-relaxed max-w-2xl">
              Discover documents, speeches, photographs, rare collections and key events from the life and work of Dr. B. R. Ambedkar.
            </p>

            {/* Refined Archival Quote Block */}
            <div className="pt-2">
              <div className="border-l-4 border-[#C9A227] pl-5 py-1.5 space-y-1 max-w-2xl">
                <p className="text-sm sm:text-base font-serif italic text-sanchay-cream leading-snug">
                  "Cultivation of mind should be the ultimate aim of human existence."
                </p>
                <span className="text-xs font-mono text-[#C9A227] font-bold block pt-0.5">— Dr. B. R. Ambedkar</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. ARCHIVAL DISCOVERY PORTALS — Warm Cream Section (#F7F1E3) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 bg-[#F7F1E3]">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-block text-xs font-mono font-bold tracking-[0.2em] text-[#C9A227] uppercase">
            ARCHIVAL DISCOVERY PORTALS
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#062A4A]">
            Explore Dr. Ambedkar's Digital Archive
          </h2>
          <p className="text-sm sm:text-base text-[#526579] font-sans">
            Select a portal below to access official writings, historical audio, documentary films, and interactive AI tools.
          </p>
        </div>

        {/* Exactly SIX Portal Cards Grid (3 cols x 2 rows on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {featureTabs.map((tab, idx) => {
            const IconComp = tab.icon;

            return (
              <Link
                key={idx}
                href={tab.href}
                className="relative bg-[#062A4A] text-white rounded-xl border border-[#D7D0BD] hover:border-[#C9A227] p-6 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden min-h-[175px]"
              >
                {/* Subtle Thematic Background Image Watermark */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-300 mix-blend-overlay"
                  style={{ backgroundImage: `url('${tab.bgImage}')` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#062A4A]/95 via-[#082F52]/90 to-[#0B3B63]/95 z-0" />

                {/* Top Section: Gold Outlined Icon Box + Top-Right Arrow Action */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-[#062A4A] border border-[#C9A227] text-[#C9A227] shadow-sm">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-[#062A4A] transition-all">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Middle & Bottom: Title and Description */}
                <div className="relative z-10 space-y-1.5 mt-4">
                  <h3 className="text-base font-serif font-bold text-[#C9A227] group-hover:text-white transition-colors">
                    {tab.title}
                  </h3>
                  <p className="text-xs text-[#DCEBFA]/90 font-sans leading-relaxed">
                    {tab.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
}

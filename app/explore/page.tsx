'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  RotateCcw,
  ChevronRight,
  Copy,
  Share2,
  FileText,
  ExternalLink,
  Volume2,
  Play,
  Pause,
  Calendar,
  MapPin,
  Heart,
  Bookmark,
  Download,
  LayoutList,
  LayoutGrid,
  X
} from 'lucide-react';
import { performSearch } from '@/lib/search/hybrid-search';
import { useTranslation, SupportedLanguage } from '@/lib/translations/LanguageContext';
import { SEED_VOWS, SEED_AUDIO, ArchivalAudio } from '@/lib/db/seed-data';
import { getBawsBookUrl } from '@/lib/baws-utils';
import { playSpeechAudio } from '@/lib/audio/speech-engine';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialTab = searchParams.get('tab') || 'All';

  const { t, language, setLanguage, formatNumber } = useTranslation();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [yearFrom, setYearFrom] = useState<number | undefined>(undefined);
  const [yearTo, setYearTo] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'relevance' | 'year_asc' | 'year_desc'>('relevance');

  // Audio Playback State for Explore Page Audio Tab
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [audioLikedIds, setAudioLikedIds] = useState<Record<string, boolean>>({});
  const [audioBookmarkedIds, setAudioBookmarkedIds] = useState<Record<string, boolean>>({});
  const [selectedTranscriptAudio, setSelectedTranscriptAudio] = useState<ArchivalAudio | null>(null);
  const [audioViewMode, setAudioViewMode] = useState<'list' | 'grid'>('list');

  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const sidebarCollections = [
    { key: 'colWritings', value: 'Writings & Books' },
    { key: 'colSpeeches', value: 'Speeches' },
    { key: 'colLetters', value: 'Letters & Documents' },
    { key: 'colPhotographs', value: 'Photographs' },
    { key: 'colVows', value: 'Vows' },
    { key: 'colAudio', value: 'Audio' },
    { key: 'colVideo', value: 'Video' }
  ];

  // Effective media type filter
  const effectiveFilter = useMemo(() => {
    if (activeTab !== 'All') return activeTab;
    if (selectedCollection && selectedCollection !== 'All Collections') return selectedCollection;
    return 'All';
  }, [activeTab, selectedCollection]);

  // Perform live search query filtering
  const searchResults = useMemo(() => {
    return performSearch({
      query,
      collectionType: effectiveFilter,
      language: language,
      yearFrom,
      yearTo,
      sortBy
    });
  }, [query, effectiveFilter, language, yearFrom, yearTo, sortBy]);

  const speechIntervalRef = useRef<any>(null);

  const togglePlayAudio = (item: ArchivalAudio) => {
    if (playingAudioId === item.id) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      setPlayingAudioId(null);
      setAudioCurrentTime(0);
    } else {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);

      const displayTitle = (
        language === 'Marathi' && item.marathiTitle ? item.marathiTitle :
        language === 'Hindi' && item.hindiTitle ? item.hindiTitle :
        language === 'Bengali' && item.bengaliTitle ? item.bengaliTitle :
        language === 'Tamil' && item.tamilTitle ? item.tamilTitle : item.title
      );

      const durSecs = item.durationSeconds || 100;
      setAudioDuration(durSecs);
      setAudioCurrentTime(0);
      setPlayingAudioId(item.id);

      const startTime = Date.now();
      speechIntervalRef.current = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000) * audioSpeed;
        if (elapsed >= durSecs) {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingAudioId(null);
          setAudioCurrentTime(0);
        } else {
          setAudioCurrentTime(elapsed);
        }
      }, 250);

      playSpeechAudio({
        text: displayTitle,
        language: language,
        rate: audioSpeed,
        englishTitle: item.title,
        onEnd: () => {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingAudioId(null);
          setAudioCurrentTime(0);
        },
        onError: () => {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingAudioId(null);
          setAudioCurrentTime(0);
        }
      });
    }
  };

  const cycleAudioSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setAudioSpeed(newSpeed);
  };

  const formatAudioTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const resetFilters = () => {
    setQuery('');
    setActiveTab('All');
    setSelectedCollection('');
    setLanguage('English');
    setYearFrom(undefined);
    setYearTo(undefined);
    setSortBy('relevance');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1" suppressHydrationWarning>
      
      {/* Hidden HTML5 Audio Element */}
      <audio ref={globalAudioRef} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR: FILTERS */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-sanchay-borderCream shadow-archival">
            <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3 mb-4">
              <h3 className="font-serif font-bold text-sanchay-deepNavy text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-sanchay-gold" /> Filter Options
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-sanchay-textMuted hover:text-sanchay-gold flex items-center gap-1 font-mono cursor-pointer"
                suppressHydrationWarning
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Sidebar Collections Menu */}
            <div className="space-y-1 mb-6">
              {sidebarCollections.map((col) => {
                const isSelected = selectedCollection === col.value || (activeTab === col.value.split(' ')[0]);
                return (
                  <button
                    type="button"
                    key={col.value}
                    onClick={() => {
                      setSelectedCollection(col.value);
                      setActiveTab(col.value === 'All Collections' ? 'All' : col.value.split(' ')[0]);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-sanchay-deepNavy text-sanchay-gold font-bold shadow-sm'
                        : 'text-sanchay-textDark hover:bg-sanchay-cream'
                    }`}
                    suppressHydrationWarning
                  >
                    <span>{col.value}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                );
              })}
            </div>

            {/* Workable Language Filter Dropdown */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-serif font-bold text-sanchay-deepNavy block">Language (भाषा)</label>
              <select
                value={language}
                onChange={(e) => {
                  const val = e.target.value as SupportedLanguage;
                  setLanguage(val);
                }}
                className="w-full p-2.5 text-xs font-bold rounded border-2 border-sanchay-gold bg-sanchay-cream text-sanchay-deepNavy focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            {/* Year Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-sanchay-deepNavy block">Year Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From Year"
                  value={yearFrom || ''}
                  onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-1/2 p-2 text-xs rounded border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-textDark focus:outline-none focus:border-sanchay-gold font-mono"
                  suppressHydrationWarning
                />
                <input
                  type="number"
                  placeholder="To Year"
                  value={yearTo || ''}
                  onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-1/2 p-2 text-xs rounded border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-textDark focus:outline-none focus:border-sanchay-gold font-mono"
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header & Working Live Search Bar */}
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Explore Archival Index</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Search writings, speeches, documents, photographs, and rare archives of Dr. B. R. Ambedkar.
            </p>

            {/* Main Search Input */}
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search writings, speeches, documents, photographs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-xs rounded-lg border-2 border-sanchay-gold focus:outline-none bg-white shadow-sm text-sanchay-textDark font-medium"
                suppressHydrationWarning
              />
              <Search className="w-4 h-4 text-sanchay-gold absolute right-3 top-3.5" />
            </div>
          </div>

          {/* Filter Tabs & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-sanchay-borderCream pb-3 gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {['All', 'Writings', 'Speeches', 'Documents', 'Photographs', 'Vows', 'Audio', 'Video'].map((tab) => {
                return (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab !== 'All') {
                        const matchedCol = sidebarCollections.find(c => c.value.toLowerCase().includes(tab.toLowerCase()));
                        if (matchedCol) setSelectedCollection(matchedCol.value);
                      } else {
                        setSelectedCollection('All Collections');
                      }
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded text-xs font-serif font-bold transition-all cursor-pointer ${
                      activeTab === tab || (tab === 'Vows' && selectedCollection.includes('Vows')) || (tab === 'Audio' && selectedCollection.includes('Audio'))
                        ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-sm'
                        : 'bg-white text-sanchay-textDark border border-sanchay-borderCream hover:border-sanchay-gold'
                    }`}
                    suppressHydrationWarning
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sanchay-textMuted font-mono">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 rounded border border-sanchay-borderCream bg-white text-sanchay-textDark focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                <option value="relevance">Relevance</option>
                <option value="year_desc">Year (Newest First)</option>
                <option value="year_asc">Year (Oldest First)</option>
              </select>
            </div>
          </div>

          {/* Results Count Bar */}
          <div className="text-xs font-mono text-sanchay-textMuted flex items-center justify-between">
            <span>
              {activeTab === 'Vows' || selectedCollection.includes('Vows')
                ? 'Showing 22 Vows in sequence (Nagpur 1956)'
                : activeTab === 'Audio' || selectedCollection.includes('Audio')
                ? `Showing ${SEED_AUDIO.length} audio recordings`
                : `Showing ${searchResults.length} verified items`}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px] font-bold">
              Language: {language} | Filter: {activeTab}
            </span>
          </div>

          {/* 1. IF VOWS IS SELECTED: RENDER 22 VOWS IN SEQUENCE */}
          {activeTab === 'Vows' || selectedCollection.includes('Vows') ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-sanchay-borderCream p-6 shadow-archival space-y-3 font-sans">
                <h2 className="text-2xl font-serif font-bold text-sanchay-deepNavy">
                  22 Vows
                </h2>
                <p className="text-xs text-sanchay-textDark leading-relaxed">
                  In Nagpur, after leaving the Hindu religion and accepting Buddhism on 14th October 1956, Dr. Babasaheb Ambedkar prescribed 22 vows to his followers.
                </p>
                <div>
                  <Link
                    href="/vows"
                    className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Direct book link
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-sanchay-borderCream shadow-archival divide-y divide-sanchay-borderCream overflow-hidden font-sans">
                {SEED_VOWS.map((vow) => {
                  const displayText = language === 'Marathi' ? vow.marathiText : language === 'Hindi' ? vow.hindiText : vow.vowText;
                  return (
                    <div
                      key={vow.id}
                      className="p-4 hover:bg-sanchay-creamLight/60 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-xs font-mono font-bold text-sanchay-deepNavy shrink-0 pt-0.5 min-w-[28px]">
                          {vow.number})
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-serif text-sanchay-deepNavy font-medium leading-relaxed">
                            {displayText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined') {
                              navigator.clipboard.writeText(`${vow.number}) ${displayText}`);
                              alert(`Vow #${vow.number} copied to clipboard!`);
                            }
                          }}
                          className="p-1 rounded text-sanchay-textMuted hover:text-sanchay-gold transition-colors cursor-pointer"
                          title="Copy vow text"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const u = new SpeechSynthesisUtterance(displayText);
                              if (language === 'Marathi') u.lang = 'mr-IN';
                              else if (language === 'Hindi') u.lang = 'hi-IN';
                              else u.lang = 'en-US';
                              window.speechSynthesis.speak(u);
                            }
                          }}
                          className="p-1 rounded text-sanchay-textMuted hover:text-sanchay-gold transition-colors cursor-pointer"
                          title="Listen TTS"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'Audio' || selectedCollection.includes('Audio') ? (
            
            /* 2. IF AUDIO IS SELECTED: RENDER AUDIO TRACK PLAYER LIST LAYOUT (MATCHING 2ND IMAGE REFERENCE) */
            <div className="space-y-4 font-sans">
              
              {/* Header List/Grid Mode Switcher Bar */}
              <div className="flex items-center justify-end pb-1">
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-sanchay-borderCream shrink-0 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setAudioViewMode('list')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      audioViewMode === 'list'
                        ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                        : 'text-sanchay-deepNavy hover:bg-sanchay-cream'
                    }`}
                    title="List View"
                    suppressHydrationWarning
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioViewMode('grid')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      audioViewMode === 'grid'
                        ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                        : 'text-sanchay-deepNavy hover:bg-sanchay-cream'
                    }`}
                    title="Grid View"
                    suppressHydrationWarning
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Audio Recordings Track Rows (Matching Image 2 Reference - List / Grid mode toggle) */}
              <div className={audioViewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 font-sans' : 'space-y-4 font-sans'}>
                {SEED_AUDIO.map((item) => {
                  const isPlaying = playingAudioId === item.id;
                  const displayTitle = (
                    language === 'Marathi' && item.marathiTitle ? item.marathiTitle :
                    language === 'Hindi' && item.hindiTitle ? item.hindiTitle :
                    language === 'Bengali' && item.bengaliTitle ? item.bengaliTitle :
                    language === 'Tamil' && item.tamilTitle ? item.tamilTitle : item.title
                  );
                  const isLiked = audioLikedIds[item.id];
                  const isBookmarked = audioBookmarkedIds[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl border p-4 shadow-archival transition-all flex flex-col ${
                        audioViewMode === 'grid' ? 'justify-between space-y-3' : 'lg:flex-row lg:items-center justify-between gap-4'
                      } group ${
                        isPlaying ? 'border-sanchay-gold bg-sanchay-gold/5' : 'border-sanchay-borderCream hover:border-sanchay-gold/60'
                      }`}
                    >
                      {/* Left Thumbnail & Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-sanchay-gold/40 bg-sanchay-deepNavy shrink-0 shadow-sm">
                          <img
                            src={item.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
                            alt={displayTitle}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <h3 className="text-sm font-serif font-bold text-sanchay-deepNavy leading-snug truncate group-hover:text-sanchay-gold transition-colors">
                            {displayTitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-sanchay-textMuted">
                            {item.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-sanchay-gold" /> {item.date}
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-sanchay-gold" /> {item.location}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-sanchay-cream text-sanchay-deepNavy text-[10px] font-bold border border-sanchay-borderCream uppercase">
                              {item.tags[0] || 'Speeches'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Integrated Audio Player Controls */}
                      <div className="flex items-center gap-2.5 bg-sanchay-cream/60 p-2.5 rounded-xl border border-sanchay-borderCream flex-1 w-full">
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(item)}
                          className="w-9 h-9 rounded-full bg-sanchay-gold text-sanchay-deepNavy flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-xs shrink-0 cursor-pointer"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-sanchay-deepNavy" /> : <Play className="w-4 h-4 fill-sanchay-deepNavy ml-0.5" />}
                        </button>

                        <div className="flex-1 flex items-center gap-2 text-[11px] font-mono text-sanchay-deepNavy">
                          <span>{isPlaying ? formatAudioTime(audioCurrentTime) : '00:00'}</span>
                          <input
                            type="range"
                            min={0}
                            max={isPlaying && audioDuration ? audioDuration : item.durationSeconds || 100}
                            value={isPlaying ? audioCurrentTime : 0}
                            onChange={(e) => {
                              if (isPlaying) {
                                setAudioCurrentTime(Number(e.target.value));
                              }
                            }}
                            className="w-full h-1.5 rounded-lg bg-sanchay-borderCream accent-sanchay-gold cursor-pointer"
                          />
                          <span>{item.duration || '01:40'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={cycleAudioSpeed}
                          className="px-2 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px] font-mono font-bold hover:bg-sanchay-darkNavy cursor-pointer shrink-0"
                          title="Playback Speed"
                        >
                          {audioSpeed}x
                        </button>
                      </div>

                      {/* Right: Actions Cluster (Like, Bookmark, Source Text Button) */}
                      <div className="flex items-center gap-2 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={() => setAudioLikedIds({ ...audioLikedIds, [item.id]: !isLiked })}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isLiked ? 'bg-red-50 text-red-500 border-red-200' : 'bg-sanchay-cream/40 text-sanchay-deepNavy border-sanchay-borderCream hover:border-sanchay-gold'
                          }`}
                          title="Favorite"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setAudioBookmarkedIds({ ...audioBookmarkedIds, [item.id]: !isBookmarked })}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isBookmarked ? 'bg-sanchay-gold/20 text-sanchay-deepNavy border-sanchay-gold' : 'bg-sanchay-cream/40 text-sanchay-deepNavy border-sanchay-borderCream hover:border-sanchay-gold'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-sanchay-deepNavy' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTranscriptAudio(item)}
                          className="px-3 py-1.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-sanchay-darkNavy transition-colors shadow-xs cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Source Text
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          ) : (

            /* 3. DEFAULT GRID OF SEARCH RESULT CARDS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((item) => {
                const typeBadge = item.type;
                const actionBtnText = item.type === 'AUDIO' ? 'Listen →' : item.type === 'VIDEO' ? 'Watch →' : item.type === 'PHOTOGRAPH' ? 'View Photo →' : 'Read →';

                const cleanTitle = (language === 'Marathi' || language === 'Hindi')
                  ? item.title.replace(/\s*\([^)]*\)/g, '')
                  : item.title;

                if (item.type === 'SPEECH') {
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-sanchay-borderCream p-6 shadow-archival hover:border-blue-500 transition-all space-y-3 font-sans col-span-full group"
                    >
                      <h3 className="text-lg font-serif font-bold text-blue-600 hover:text-blue-800 underline leading-snug">
                        <Link href={item.targetUrl}>{cleanTitle}</Link>
                      </h3>

                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {item.matchSnippet || item.description}
                      </p>

                      <div className="pt-1">
                        <a
                          href={item.pdfUrl || item.sourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                          {item.volume ? item.volume : 'Volume Archive'}
                        </a>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div className="flex flex-wrap items-center gap-1 font-mono">
                          <span className="text-blue-600 hover:underline cursor-pointer">Speeches</span>
                          <span>/</span>
                          <span className="text-blue-600 hover:underline cursor-pointer">{item.volume || 'Archival Volume'}</span>
                          <span>/</span>
                          <span className="text-slate-800 font-semibold truncate max-w-xs">{cleanTitle}</span>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400">
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(`${cleanTitle}\n${item.description}`);
                                alert('Speech citation copied to clipboard!');
                              }
                            }}
                            className="hover:text-blue-600 cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(window.location.origin + item.targetUrl);
                                alert('Speech link copied!');
                              }
                            }}
                            className="hover:text-blue-600 cursor-pointer flex items-center gap-1 text-[11px]"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'LETTER' || item.type === 'DOCUMENT') {
                  const formattedTitle = cleanTitle.startsWith('"') ? cleanTitle : `"${cleanTitle}"`;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg border border-sanchay-borderCream p-5 shadow-archival hover:border-blue-500 transition-all space-y-2.5 font-sans col-span-full group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <h3 className="text-base font-serif font-bold text-slate-900 leading-snug flex items-center gap-2 flex-wrap">
                          <span>{formattedTitle}</span>
                          <Link
                            href={item.targetUrl}
                            className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shadow-xs"
                          >
                            Open Direct
                          </Link>
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                          {item.volume || 'Volume_17_02'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                        {item.matchSnippet || item.description}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-slate-500">Source: Official Archival Record ({item.year})</span>
                        <div className="flex items-center gap-4 text-slate-500">
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(`${cleanTitle}\n${item.description}`);
                                alert('Citation copied to clipboard!');
                              }
                            }}
                            className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined') {
                                navigator.clipboard.writeText(window.location.origin + item.targetUrl);
                                alert('Direct link copied!');
                              }
                            }}
                            className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Share
                          </button>
                          <Link
                            href={item.targetUrl}
                            className="text-blue-600 font-bold hover:underline flex items-center gap-1 font-serif"
                          >
                            Open Document →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.type === 'PHOTOGRAPH') {
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-sanchay-borderCream p-4 shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between group"
                    >
                      <div className="relative rounded-lg border-2 border-sanchay-gold/40 overflow-hidden bg-sanchay-deepNavy shadow-md h-80 sm:h-96 w-full flex items-center justify-center">
                        <img
                          src={item.coverImage || '/images/ambedkar_portrait.jpg'}
                          alt={cleanTitle}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                          }}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-[9px] font-bold shadow-md uppercase">
                          PHOTOGRAPH
                        </span>
                      </div>

                      <div className="pt-4 border-t border-sanchay-borderCream mt-4 flex items-center justify-center">
                        <Link
                          href={item.targetUrl}
                          className="w-full py-2.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center justify-center gap-2 hover:bg-sanchay-darkNavy transition-all shadow-sm text-center"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-sanchay-borderCream p-5 shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {item.coverImage && (
                        <div className="h-80 sm:h-96 w-full rounded-md border border-sanchay-gold/40 mb-3 overflow-hidden bg-sanchay-deepNavy relative shadow-sm">
                          <img
                            src={item.coverImage || '/images/ambedkar_portrait.jpg'}
                            alt={cleanTitle}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                            }}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-[9px] font-bold shadow-md uppercase">
                            {typeBadge}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30 uppercase">
                          {typeBadge}
                        </span>
                        <span className="text-[11px] font-mono text-sanchay-textMuted">{item.year}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-sanchay-deepNavy group-hover:text-sanchay-gold transition-colors leading-snug">
                        {cleanTitle}
                      </h3>

                      <p className="text-xs text-sanchay-textMuted line-clamp-3 mt-2 leading-relaxed font-sans">
                        {item.matchSnippet || item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-sanchay-borderCream flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-sanchay-textMuted font-mono">
                        {item.volume ? item.volume : ''}
                      </span>
                      <div className="flex items-center gap-2">
                        { (item.type === 'BOOK' || item.type === 'WRITING') && (
                          <a
                            href={getBawsBookUrl(item, language)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold hover:bg-sanchay-goldLight transition-colors flex items-center gap-1 shadow-xs"
                            title={`Read whole book on BAWS website in ${language}`}
                          >
                            <ExternalLink className="w-3 h-3 text-sanchay-deepNavy" /> Read ({language})
                          </a>
                        )}
                        <Link
                          href={item.targetUrl}
                          className="px-3 py-1.5 rounded bg-sanchay-deepNavy text-sanchay-gold text-xs font-bold hover:bg-sanchay-darkNavy transition-colors"
                        >
                          {actionBtnText}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* SOURCE TEXT / TRANSCRIPT MODAL */}
      {selectedTranscriptAudio && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 space-y-6 font-sans my-auto">
            
            <button
              type="button"
              onClick={() => setSelectedTranscriptAudio(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sanchay-cream hover:bg-sanchay-gold/20 text-sanchay-deepNavy transition-colors cursor-pointer z-10 border border-sanchay-borderCream"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-sanchay-borderCream pb-4">
              <span className="px-2.5 py-1 rounded bg-sanchay-gold/20 text-sanchay-deepNavy text-xs font-mono font-bold">
                ARCHIVAL SPEECH TRANSCRIPT / SOURCE TEXT
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-sanchay-deepNavy">
                {language === 'Marathi' && selectedTranscriptAudio.marathiTitle ? selectedTranscriptAudio.marathiTitle :
                 language === 'Hindi' && selectedTranscriptAudio.hindiTitle ? selectedTranscriptAudio.hindiTitle :
                 selectedTranscriptAudio.title}
              </h2>
              <div className="text-xs font-mono text-sanchay-textMuted flex flex-wrap gap-3">
                <span>Speaker: {selectedTranscriptAudio.speaker || 'Dr. B. R. Ambedkar'}</span>
                <span>Date: {selectedTranscriptAudio.date}</span>
                <span>Location: {selectedTranscriptAudio.location}</span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedTranscriptAudio.transcriptSegments && selectedTranscriptAudio.transcriptSegments.length > 0 ? (
                selectedTranscriptAudio.transcriptSegments.map((seg, idx) => (
                  <div key={idx} className="bg-sanchay-creamLight p-4 rounded-xl border border-sanchay-borderCream space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-sanchay-gold">
                      <span>{seg.speaker}</span>
                      <span>{seg.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-sanchay-deepNavy leading-relaxed font-serif">
                      "{seg.text}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-sanchay-creamLight p-5 rounded-xl border border-sanchay-borderCream text-xs text-sanchay-textDark leading-relaxed">
                  Speech text preserved under official Archival Collection.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-sanchay-borderCream flex justify-end">
              <Link
                href="/documents/doc-constituent-assembly-debates"
                className="px-4 py-2 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-sanchay-darkNavy transition-colors"
              >
                Open Full Archival Document Page →
              </Link>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-xs">Loading archival index...</div>}>
        <ExploreContent />
      </Suspense>
      <Footer />
    </div>
  );
}

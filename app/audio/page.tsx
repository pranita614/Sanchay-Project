'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { SEED_AUDIO, ArchivalAudio } from '@/lib/db/seed-data';
import { playSpeechAudio, stopSpeechAudio } from '@/lib/audio/speech-engine';
import { useTranslation, SupportedLanguage } from '@/lib/translations/LanguageContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  Heart,
  Bookmark,
  FileText,
  LayoutList,
  LayoutGrid,
  Globe,
  X,
  Search
} from 'lucide-react';

export default function AudioPage() {
  const { language, setLanguage } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback States
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // User Interactive States (Likes & Bookmarks)
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [selectedTranscriptAudio, setSelectedTranscriptAudio] = useState<ArchivalAudio | null>(null);

  // Load saved likes and bookmarks from LocalStorage on mount
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('sanchay_liked_audio');
      if (savedLikes) setLikedIds(JSON.parse(savedLikes));

      const savedBms = localStorage.getItem('sanchay_bookmarks');
      if (savedBms) {
        const bmList: any[] = JSON.parse(savedBms);
        const bmMap: Record<string, boolean> = {};
        bmList.forEach(b => { bmMap[b.id] = true; });
        setBookmarkedIds(bmMap);
      }
    } catch (e) {}
  }, []);

  const toggleLike = (item: ArchivalAudio) => {
    const isLiked = !!likedIds[item.id];
    const newLikes = { ...likedIds, [item.id]: !isLiked };
    setLikedIds(newLikes);
    localStorage.setItem('sanchay_liked_audio', JSON.stringify(newLikes));
  };

  const toggleBookmark = (item: ArchivalAudio) => {
    const isBookmarked = !!bookmarkedIds[item.id];
    const newBms = { ...bookmarkedIds, [item.id]: !isBookmarked };
    setBookmarkedIds(newBms);

    try {
      const currentBmsRaw = localStorage.getItem('sanchay_bookmarks');
      let currentBmsList: any[] = currentBmsRaw ? JSON.parse(currentBmsRaw) : [];
      if (!isBookmarked) {
        if (!currentBmsList.some(b => b.id === item.id)) {
          currentBmsList.push({
            id: item.id,
            title: getTranslatedTitle(item),
            type: 'AUDIO',
            targetUrl: `/audio`
          });
        }
      } else {
        currentBmsList = currentBmsList.filter(b => b.id !== item.id);
      }
      localStorage.setItem('sanchay_bookmarks', JSON.stringify(currentBmsList));
    } catch (e) {}
  };

  // Audio Element Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio items filtered by category, language, and search query
  const filteredAudio = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SEED_AUDIO.filter((item) => {
      if (activeCategory === 'Speeches' && !item.tags.includes('Speech') && !item.tags.includes('Speeches')) return false;
      if (activeCategory === 'Audiobooks' && !item.tags.includes('Audiobook')) return false;
      if (activeCategory === 'Public Addresses' && !item.tags.includes('Public Address')) return false;

      if (!q) return true;
      const titleMatch =
        item.title.toLowerCase().includes(q) ||
        (item.marathiTitle && item.marathiTitle.toLowerCase().includes(q)) ||
        (item.hindiTitle && item.hindiTitle.toLowerCase().includes(q));
      const locMatch = item.location && item.location.toLowerCase().includes(q);
      return titleMatch || locMatch;
    });
  }, [searchQuery, activeCategory]);

  const speechIntervalRef = useRef<any>(null);

  // Helper to extract full speech and audiobook text content
  const getAudioFullText = (item: ArchivalAudio) => {
    const title = getTranslatedTitle(item);

    let mainText = "";
    if (item.transcriptSegments && item.transcriptSegments.length > 0) {
      mainText = item.transcriptSegments.map((s) => s.text).join(" ");
    }

    if (!mainText || mainText.length < 15) {
      if (language === 'Marathi' && item.marathiTitle) {
        mainText = item.marathiTitle;
      } else if (language === 'Hindi' && item.hindiTitle) {
        mainText = item.hindiTitle;
      } else {
        mainText = item.title;
      }
    }

    return `${title}. ${mainText}`;
  };

  // Native Universal Audio Play/Pause Handler (100% audible in all languages)
  const togglePlay = (item: ArchivalAudio) => {
    if (playingId === item.id) {
      stopSpeechAudio();
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      setPlayingId(null);
      setCurrentTime(0);
    } else {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);

      const fullTextToRead = getAudioFullText(item);
      const durSecs = item.durationSeconds || 100;
      setDuration(durSecs);
      setCurrentTime(0);
      setPlayingId(item.id);

      const startTime = Date.now();
      speechIntervalRef.current = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000) * playbackSpeed;
        if (elapsed >= durSecs) {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingId(null);
          setCurrentTime(0);
        } else {
          setCurrentTime(elapsed);
        }
      }, 250);

      playSpeechAudio({
        text: fullTextToRead,
        language: language,
        rate: playbackSpeed,
        englishTitle: item.title,
        onEnd: () => {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingId(null);
          setCurrentTime(0);
        },
        onError: () => {
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          setPlayingId(null);
          setCurrentTime(0);
        }
      });
    }
  };

  // Speed Handler
  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
  };

  // Format Seconds to MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Title Resolver based on Language
  const getTranslatedTitle = (item: ArchivalAudio) => {
    if (language === 'Marathi' && item.marathiTitle) return item.marathiTitle;
    if (language === 'Hindi' && item.hindiTitle) return item.hindiTitle;
    if (language === 'Bengali' && item.bengaliTitle) return item.bengaliTitle;
    if (language === 'Tamil' && item.tamilTitle) return item.tamilTitle;
    return item.title;
  };

  useEffect(() => {
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      stopSpeechAudio();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream font-sans" suppressHydrationWarning>
      <Navbar />

      {/* Shared Native Audio Element - No External Redirect */}
      <audio ref={audioRef} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        {/* Header & Language Bar */}
        <div className="bg-sanchay-deepNavy rounded-xl border-2 border-sanchay-gold/40 p-6 shadow-archival text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanchay-gold/20 text-sanchay-gold text-xs font-mono font-bold mb-2">
              <Volume2 className="w-4 h-4 text-sanchay-gold" /> SANCHAY AUDIO ARCHIVE & SPEECHES
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sanchay-gold">
              Historical Audio Recordings of Dr. B. R. Ambedkar
            </h1>
            <p className="text-xs text-sanchay-cream/80 max-w-2xl mt-1 leading-relaxed">
              Listen to authentic speeches, public addresses, and audiobooks preserved from the Official Archival Digital Collection.
            </p>
          </div>

          {/* Working Language Selector */}
          <div className="flex items-center gap-2 bg-sanchay-darkNavy p-2 rounded-lg border border-sanchay-gold/40 shrink-0">
            <Globe className="w-4 h-4 text-sanchay-gold" />
            <label className="text-xs font-serif font-bold text-sanchay-cream">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-sanchay-cream text-sanchay-deepNavy text-xs font-bold px-3 py-1.5 rounded border border-sanchay-gold focus:outline-none cursor-pointer"
              suppressHydrationWarning
            >
              <option value="English">English</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
            </select>
          </div>
        </div>

        {/* Toolbar: Category Filters, Search & View Switcher */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream p-4 shadow-archival flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Speeches', 'Audiobooks', 'Public Addresses'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-sm'
                    : 'bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-borderCream hover:border-sanchay-gold'
                }`}
                suppressHydrationWarning
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Layout Toggle Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search audio by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold"
                suppressHydrationWarning
              />
              <Search className="w-3.5 h-3.5 text-sanchay-gold absolute left-2.5 top-2.5" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-sanchay-cream p-1 rounded-lg border border-sanchay-borderCream shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                    : 'text-sanchay-deepNavy hover:bg-white'
                }`}
                title="List View"
                suppressHydrationWarning
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-xs'
                    : 'text-sanchay-deepNavy hover:bg-white'
                }`}
                title="Grid View"
                suppressHydrationWarning
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Audio Recordings Count Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-sanchay-textMuted px-1">
          <span>Showing {filteredAudio.length} audio recordings</span>
          <span className="px-2.5 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px] font-bold">
            Active Language: {language}
          </span>
        </div>

        {/* AUDIO TRACK LIST VIEW */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredAudio.map((item) => {
              const isPlaying = playingId === item.id;
              const title = getTranslatedTitle(item);
              const isLiked = likedIds[item.id];
              const isBookmarked = bookmarkedIds[item.id];

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 shadow-archival transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group ${
                    isPlaying ? 'border-sanchay-gold bg-sanchay-gold/5' : 'border-sanchay-borderCream hover:border-sanchay-gold/60'
                  }`}
                >
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-sanchay-gold/40 bg-sanchay-deepNavy shrink-0 shadow-sm">
                      <img
                        src={item.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
                        alt={title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <h3 className="text-sm font-serif font-bold text-sanchay-deepNavy leading-snug truncate group-hover:text-sanchay-gold transition-colors">
                        {title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-sanchay-textMuted">
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
                  <div className="flex items-center gap-3 bg-sanchay-cream/60 p-2.5 rounded-xl border border-sanchay-borderCream flex-1 max-w-xl">
                    
                    {/* Native Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => togglePlay(item)}
                      className="w-10 h-10 rounded-full bg-sanchay-gold text-sanchay-deepNavy flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-xs shrink-0 cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-sanchay-deepNavy" /> : <Play className="w-4 h-4 fill-sanchay-deepNavy ml-0.5" />}
                    </button>

                    {/* Progress Scrub Bar */}
                    <div className="flex-1 flex items-center gap-2 text-[11px] font-mono text-sanchay-deepNavy">
                      <span>{isPlaying ? formatTime(currentTime) : '00:00'}</span>
                      <input
                        type="range"
                        min={0}
                        max={isPlaying && duration ? duration : item.durationSeconds || 100}
                        value={isPlaying ? currentTime : 0}
                        onChange={(e) => {
                          if (isPlaying && audioRef.current) {
                            audioRef.current.currentTime = Number(e.target.value);
                          }
                        }}
                        className="w-full h-1.5 rounded-lg bg-sanchay-borderCream accent-sanchay-gold cursor-pointer"
                      />
                      <span>{item.duration || formatTime(duration)}</span>
                    </div>

                    {/* Mute & Volume Selector */}
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMuted(!isMuted);
                          if (audioRef.current) audioRef.current.muted = !isMuted;
                        }}
                        className="text-sanchay-deepNavy hover:text-sanchay-gold cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setVolume(v);
                          setIsMuted(v === 0);
                          if (audioRef.current) {
                            audioRef.current.volume = v;
                            audioRef.current.muted = v === 0;
                          }
                        }}
                        className="w-14 h-1 rounded bg-sanchay-borderCream accent-sanchay-gold cursor-pointer"
                      />
                    </div>

                    {/* Playback Speed Button */}
                    <button
                      type="button"
                      onClick={cycleSpeed}
                      className="px-2 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px] font-mono font-bold hover:bg-sanchay-darkNavy cursor-pointer shrink-0"
                      title="Playback Speed"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>

                  {/* Right: Actions Cluster (Like, Bookmark, Source Text Button Only - Download & Extra Options Removed) */}
                  <div className="flex items-center gap-2 shrink-0 justify-end">
                    
                    {/* Heart Like */}
                    <button
                      type="button"
                      onClick={() => toggleLike(item)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isLiked ? 'bg-red-50 text-red-500 border-red-200' : 'bg-sanchay-cream/40 text-sanchay-deepNavy border-sanchay-borderCream hover:border-sanchay-gold'
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                    </button>

                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked ? 'bg-sanchay-gold/20 text-sanchay-deepNavy border-sanchay-gold' : 'bg-sanchay-cream/40 text-sanchay-deepNavy border-sanchay-borderCream hover:border-sanchay-gold'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-sanchay-deepNavy' : ''}`} />
                    </button>

                    {/* Source Text Action Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedTranscriptAudio(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center gap-1.5 hover:bg-sanchay-darkNavy transition-colors shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Source Text
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudio.map((item) => {
              const isPlaying = playingId === item.id;
              const title = getTranslatedTitle(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-sanchay-borderCream p-5 shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-sanchay-gold/40 bg-sanchay-deepNavy shadow-sm">
                      <img
                        src={item.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
                        alt={title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-[9px] font-bold uppercase">
                        AUDIO
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-sanchay-deepNavy group-hover:text-sanchay-gold transition-colors leading-snug">
                      {title}
                    </h3>

                    <div className="flex items-center justify-between text-xs font-mono text-sanchay-textMuted pt-1">
                      <span>{item.date || 'Historical Archive'}</span>
                      <span className="font-bold text-sanchay-gold">{item.duration}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sanchay-borderCream flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => togglePlay(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy text-xs font-serif font-bold flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      {isPlaying ? 'Pause' : 'Play Audio'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTranscriptAudio(item)}
                      className="px-3 py-1.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center gap-1 hover:bg-sanchay-darkNavy transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Source Text
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
                  {getTranslatedTitle(selectedTranscriptAudio)}
                </h2>
                <div className="text-xs font-mono text-sanchay-textMuted flex flex-wrap gap-3">
                  <span>Speaker: {selectedTranscriptAudio.speaker || 'Dr. B. R. Ambedkar'}</span>
                  <span>Date: {selectedTranscriptAudio.date}</span>
                  <span>Location: {selectedTranscriptAudio.location}</span>
                </div>
              </div>

              {/* Transcript Text Segments */}
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

      <Footer />
    </div>
  );
}

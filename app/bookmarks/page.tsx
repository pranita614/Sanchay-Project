'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Bookmark, Heart, Trash2, ExternalLink, Play, Mic, FileText } from 'lucide-react';
import { SEED_AUDIO, ArchivalAudio } from '@/lib/db/seed-data';
import { playSpeechAudio, stopSpeechAudio } from '@/lib/audio/speech-engine';
import { useTranslation } from '@/lib/translations/LanguageContext';
import Link from 'next/link';

export default function BookmarksPage() {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks' | 'likes'>('all');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [likedAudio, setLikedAudio] = useState<ArchivalAudio[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load bookmarked items
    const savedBmsRaw = localStorage.getItem('sanchay_bookmarks');
    if (savedBmsRaw) {
      try {
        setBookmarks(JSON.parse(savedBmsRaw));
      } catch (e) {}
    } else {
      setBookmarks([
        { id: "doc-annihilation-caste", title: "Annihilation of Caste (1936)", type: "BOOK", targetUrl: "/documents/doc-annihilation-caste" },
        { id: "audio-mahad-satyagraha", title: "Speech at Mahad Satyagraha", type: "AUDIO", targetUrl: "/audio" }
      ]);
    }

    // 2. Load liked audio items
    const savedLikesRaw = localStorage.getItem('sanchay_liked_audio');
    if (savedLikesRaw) {
      try {
        const likedMap: Record<string, boolean> = JSON.parse(savedLikesRaw);
        const likedItems = SEED_AUDIO.filter(a => likedMap[a.id]);
        setLikedAudio(likedItems);
      } catch (e) {}
    }
  }, []);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('sanchay_bookmarks', JSON.stringify(updated));
  };

  const removeLikedAudio = (id: string) => {
    const updated = likedAudio.filter(a => a.id !== id);
    setLikedAudio(updated);
    try {
      const savedLikesRaw = localStorage.getItem('sanchay_liked_audio');
      if (savedLikesRaw) {
        const likedMap: Record<string, boolean> = JSON.parse(savedLikesRaw);
        delete likedMap[id];
        localStorage.setItem('sanchay_liked_audio', JSON.stringify(likedMap));
      }
    } catch (e) {}
  };

  const togglePlayAudio = (item: ArchivalAudio) => {
    if (playingId === item.id) {
      stopSpeechAudio();
      setPlayingId(null);
    } else {
      setPlayingId(item.id);

      const title = language === 'Marathi' && item.marathiTitle ? item.marathiTitle : (language === 'Hindi' && item.hindiTitle ? item.hindiTitle : item.title);
      let script = "";
      if (language === 'Marathi') script = item.longScriptMarathi || "";
      else if (language === 'Hindi') script = item.longScriptHindi || "";
      else if (language === 'Bengali') script = item.longScriptBengali || "";
      else if (language === 'Tamil') script = item.longScriptTamil || "";
      else script = item.longScriptEnglish || "";

      if (!script && item.transcriptSegments && item.transcriptSegments.length > 0) {
        script = item.transcriptSegments.map(s => s.text).join(" ");
      }

      const fullText = `${title}. ${script || title}`;

      playSpeechAudio({
        text: fullText,
        language: language,
        onEnd: () => setPlayingId(null),
        onError: () => setPlayingId(null)
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E3] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-block text-xs font-mono font-bold tracking-[0.2em] text-[#C9A227] uppercase">
            PERSONAL ARCHIVAL REPOSITORY
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#062A4A]">
            Saved & Liked Content
          </h1>
          <p className="text-sm text-[#172B3D]/80 font-sans leading-relaxed">
            Access all your saved speeches, liked audiobooks, and bookmarked historical documents preserved locally.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream p-3 max-w-xl mx-auto flex items-center justify-center gap-2 shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#062A4A] text-[#C9A227] shadow-sm'
                : 'bg-transparent text-[#062A4A] hover:bg-[#C9A227]/10'
            }`}
          >
            All Saved ({bookmarks.length + likedAudio.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-[#062A4A] text-[#C9A227] shadow-sm'
                : 'bg-transparent text-[#062A4A] hover:bg-[#C9A227]/10'
            }`}
          >
            Bookmarked Records ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'likes'
                ? 'bg-[#062A4A] text-[#C9A227] shadow-sm'
                : 'bg-transparent text-[#062A4A] hover:bg-[#C9A227]/10'
            }`}
          >
            Liked Audio ({likedAudio.length})
          </button>
        </div>

        {/* Saved Content List */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* LIKED AUDIO SECTION */}
          {(activeTab === 'all' || activeTab === 'likes') && likedAudio.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-2 px-1">
                <Heart className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" /> Liked Audio Recordings ({likedAudio.length})
              </h2>

              {likedAudio.map((audio) => {
                const isPlaying = playingId === audio.id;
                return (
                  <div
                    key={audio.id}
                    className="bg-white p-4 rounded-xl border border-sanchay-borderCream hover:border-[#C9A227] shadow-archival flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#062A4A] text-[#C9A227] flex items-center justify-center shrink-0 border border-[#C9A227]">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-[#C9A227] uppercase">
                          {audio.tags[0] || 'AUDIO'} • {audio.date}
                        </span>
                        <h3 className="text-sm font-serif font-bold text-[#062A4A] truncate">
                          {audio.title}
                        </h3>
                        <p className="text-xs text-[#172B3D]/70 font-sans truncate">
                          Location: {audio.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-sanchay-borderCream pt-3 sm:pt-0">
                      <button
                        onClick={() => togglePlayAudio(audio)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#062A4A] text-[#C9A227] text-xs font-bold flex items-center gap-1.5 hover:bg-[#082F52] cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> {isPlaying ? 'Stop' : 'Play Full Audio'}
                      </button>
                      <Link
                        href="/audio"
                        className="px-3 py-1.5 rounded-lg bg-[#FBF8EF] text-[#062A4A] text-xs font-bold border border-sanchay-borderCream hover:border-[#C9A227] flex items-center gap-1"
                      >
                        View in Archive <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                      </Link>
                      <button
                        onClick={() => removeLikedAudio(audio.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BOOKMARKED ITEMS SECTION */}
          {(activeTab === 'all' || activeTab === 'bookmarks') && bookmarks.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-mono font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-2 px-1">
                <Bookmark className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" /> Bookmarked Records ({bookmarks.length})
              </h2>

              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="bg-white p-4 rounded-xl border border-sanchay-borderCream hover:border-[#C9A227] shadow-archival flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#062A4A] text-[#C9A227] flex items-center justify-center shrink-0 border border-[#C9A227]">
                      <Bookmark className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold text-[#C9A227] uppercase">
                        {bm.type}
                      </span>
                      <h3 className="text-sm font-serif font-bold text-[#062A4A] truncate">
                        {bm.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={bm.targetUrl || '/explore'}
                      className="px-3.5 py-1.5 rounded-lg bg-[#062A4A] text-[#C9A227] text-xs font-bold flex items-center gap-1.5 hover:bg-[#082F52]"
                    >
                      Open Record <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
                    </Link>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {bookmarks.length === 0 && likedAudio.length === 0 && (
            <div className="bg-white rounded-xl border border-sanchay-borderCream p-12 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#062A4A] text-[#C9A227] flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#062A4A]">No Saved Content Yet</h3>
              <p className="text-xs text-[#172B3D]/70 max-w-md mx-auto leading-relaxed">
                Click the Heart or Bookmark buttons while exploring the Audio Archive or Collections to save items here.
              </p>
              <Link
                href="/audio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#062A4A] text-[#C9A227] font-bold text-xs shadow-sm hover:bg-[#082F52]"
              >
                Browse Audio Archive →
              </Link>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}

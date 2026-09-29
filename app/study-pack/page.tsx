'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  BookOpen,
  Trash2,
  ExternalLink,
  Share2,
  FileText,
  Mic,
  Video as VideoIcon,
  Clock,
  Quote,
  Image as ImageIcon,
  HelpCircle,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudyPackToast from '@/components/study-pack/StudyPackToast';
import TakeStudyPackModal from '@/components/study-pack/TakeStudyPackModal';
import { getStudyPackItems, removeFromStudyPack, subscribeToStudyPack, StudyPackItem } from '@/lib/study-pack/store';

export default function StudyPackPage() {
  const [items, setItems] = useState<StudyPackItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getStudyPackItems());

    const unsubscribe = subscribeToStudyPack((updatedItems) => {
      setItems(updatedItems);
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = (id: string) => {
    removeFromStudyPack(id);
  };

  const getItemIcon = (type: StudyPackItem['itemType']) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'AUDIO':
        return <Mic className="w-4 h-4 text-amber-600" />;
      case 'VIDEO':
        return <VideoIcon className="w-4 h-4 text-emerald-600" />;
      case 'QUOTE':
        return <Quote className="w-4 h-4 text-purple-600" />;
      case 'TIMELINE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'AI_ANSWER':
        return <HelpCircle className="w-4 h-4 text-teal-600" />;
      case 'PHOTOGRAPH':
        return <ImageIcon className="w-4 h-4 text-rose-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-sanchay-gold" />;
    }
  };

  const getItemBadgeClass = (type: StudyPackItem['itemType']) => {
    switch (type) {
      case 'DOCUMENT':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'AUDIO':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'VIDEO':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'QUOTE':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'TIMELINE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'AI_ANSWER':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'PHOTOGRAPH':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sanchay-cream text-sanchay-deepNavy border-sanchay-gold/30';
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-sanchay-cream text-sanchay-deepNavy flex flex-col">
      <Navbar />
      <StudyPackToast />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header Banner */}
        <div className="bg-sanchay-deepNavy text-white border-2 border-sanchay-gold/40 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sanchay-gold/20 border border-sanchay-gold flex items-center justify-center text-sanchay-gold shadow-goldGlow">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sanchay-gold">My Study Pack</h1>
                  <p className="text-xs sm:text-sm text-sanchay-cream/80 mt-0.5 font-sans">
                    Your personal curated collection of archival documents, speeches, videos, quotes, and AI insights.
                  </p>
                </div>
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs sm:text-sm rounded-xl hover:bg-sanchay-goldLight transition-all shadow-goldGlow flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Take My Study Pack</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-sanchay-borderCream rounded-2xl p-12 text-center max-w-2xl mx-auto my-8 shadow-archival">
            <div className="w-16 h-16 rounded-full bg-sanchay-cream border-2 border-sanchay-gold/40 text-sanchay-gold mx-auto flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-sanchay-gold" />
            </div>
            <h2 className="text-xl font-serif font-bold text-sanchay-deepNavy mb-2">Your Study Pack is Empty</h2>
            <p className="text-xs sm:text-sm text-sanchay-textMuted leading-relaxed mb-6 font-sans">
              You haven&apos;t added any items to your Study Pack yet. Browse documents, speeches, videos, or quotes across the SANChAY archive and click <strong>&quot;Save to My Study Pack&quot;</strong> to collect them here.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sanchay-gold text-sanchay-deepNavy font-bold text-sm hover:bg-sanchay-goldLight transition-all shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Archive</span>
            </Link>
          </div>
        ) : (
          /* Items List / Grid */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-sanchay-deepNavy uppercase tracking-wider font-mono">
                Saved Items ({items.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-sanchay-borderCream rounded-xl p-5 shadow-archival flex flex-col justify-between hover:border-sanchay-gold transition-all group"
                >
                  <div>
                    {/* Badge & Type */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${getItemBadgeClass(
                          item.itemType
                        )}`}
                      >
                        {getItemIcon(item.itemType)}
                        <span>{item.itemType.replace('_', ' ')}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from Study Pack"
                        className="text-sanchay-textMuted hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-serif font-bold text-sanchay-deepNavy line-clamp-2 leading-snug mb-2 group-hover:text-sanchay-gold transition-colors">
                      {item.title}
                    </h3>

                    {/* Description / Snippet */}
                    {item.description && (
                      <p className="text-xs text-sanchay-textDark line-clamp-3 leading-relaxed mb-4 font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-sanchay-borderCream flex items-center justify-between mt-4">
                    <span className="text-[10px] text-sanchay-textMuted font-mono">
                      Saved: {new Date(item.savedAt).toLocaleDateString()}
                    </span>

                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-bold hover:bg-sanchay-darkNavy transition-all"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Take My Study Pack Sharing Modal */}
      <TakeStudyPackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
      />
    </div>
  );
}

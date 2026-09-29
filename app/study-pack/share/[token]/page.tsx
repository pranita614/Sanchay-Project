'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  FileText,
  Mic,
  Video as VideoIcon,
  Quote,
  Clock,
  HelpCircle,
  Image as ImageIcon,
  BookOpen,
  Check,
  Plus,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StudyPackToast from '@/components/study-pack/StudyPackToast';
import { addToStudyPack } from '@/lib/study-pack/store';

export default function SharedStudyPackPage(props: { params: Promise<{ token: string }> }) {
  const params = use(props.params);
  const { token } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studyPack, setStudyPack] = useState<any>(null);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSharedPack();
    }
  }, [token]);

  const fetchSharedPack = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/study-pack/share/${token}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setStudyPack(data.studyPack);
      } else {
        setError(data.error || 'Shared study pack not found or link has expired.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching shared study pack.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = () => {
    if (!studyPack || !Array.isArray(studyPack.items)) return;

    let count = 0;
    studyPack.items.forEach((item: any) => {
      const res = addToStudyPack({
        id: item.itemId || item.id,
        itemId: item.itemId || item.id,
        itemType: item.itemType || 'DOCUMENT',
        title: item.title,
        description: item.description,
        url: item.url,
        metadata: item.metadata,
      });
      if (res.success) count++;
    });

    setImported(true);
    window.dispatchEvent(
      new CustomEvent('sanchay_study_pack_toast', {
        detail: {
          title: 'Import Complete',
          message: `Imported ${count} items into your Study Pack!`,
          type: 'success',
        },
      })
    );
  };

  const getItemIcon = (type: string) => {
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

  const getItemBadgeClass = (type: string) => {
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

  return (
    <div className="min-h-screen bg-sanchay-cream text-sanchay-deepNavy flex flex-col">
      <Navbar />
      <StudyPackToast />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-sanchay-gold animate-spin" />
            <p className="text-xs text-sanchay-deepNavy font-medium">Loading Shared Study Pack...</p>
          </div>
        ) : error ? (
          <div className="bg-white border-2 border-rose-200 rounded-2xl p-10 text-center max-w-lg mx-auto my-12 shadow-archival">
            <h2 className="text-xl font-serif font-bold text-rose-700 mb-2">Study Pack Not Found</h2>
            <p className="text-xs text-sanchay-textMuted mb-6">{error}</p>
            <Link
              href="/study-pack"
              className="px-5 py-2.5 bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs rounded-xl shadow-md"
            >
              Go to My Study Pack
            </Link>
          </div>
        ) : (
          <div>
            {/* Header Banner */}
            <div className="bg-sanchay-deepNavy text-white border-2 border-sanchay-gold/40 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <span className="px-3 py-1 bg-sanchay-gold/20 text-sanchay-gold border border-sanchay-gold/50 text-[11px] font-bold rounded-full inline-block mb-2 font-mono">
                  SHARED STUDY PACK ({token})
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sanchay-gold">
                  {studyPack.title || 'SANChAY Study Pack'}
                </h1>
                <p className="text-xs sm:text-sm text-sanchay-cream/80 mt-1 font-sans">
                  Contains {studyPack.items?.length || 0} curated archival items.
                </p>
              </div>

              <button
                type="button"
                onClick={handleImportAll}
                disabled={imported}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  imported
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500'
                    : 'bg-sanchay-gold text-sanchay-deepNavy hover:bg-sanchay-goldLight shadow-goldGlow'
                }`}
              >
                {imported ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved to My Study Pack</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save All to My Study Pack</span>
                  </>
                )}
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyPack.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-sanchay-borderCream rounded-xl p-5 shadow-archival flex flex-col justify-between hover:border-sanchay-gold transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${getItemBadgeClass(item.itemType)}`}>
                        {getItemIcon(item.itemType)}
                        <span>{item.itemType}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-sanchay-deepNavy line-clamp-2 leading-snug mb-2 group-hover:text-sanchay-gold transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-sanchay-textDark line-clamp-3 leading-relaxed mb-4 font-sans">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-sanchay-borderCream flex items-center justify-end mt-4">
                    <Link
                      href={item.url || '/explore'}
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
    </div>
  );
}

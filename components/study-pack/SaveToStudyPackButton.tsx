'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Check, Plus } from 'lucide-react';
import { addToStudyPack, isInStudyPack, StudyPackItem } from '@/lib/study-pack/store';

interface SaveToStudyPackButtonProps {
  item: {
    id: string;
    itemType: StudyPackItem['itemType'];
    title: string;
    description?: string;
    url: string;
    metadata?: Record<string, any>;
  };
  variant?: 'button' | 'icon' | 'compact' | 'secondary';
  className?: string;
  label?: string;
}

export default function SaveToStudyPackButton({
  item,
  variant = 'button',
  className = '',
  label = 'Save to My Study Pack',
}: SaveToStudyPackButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInStudyPack(item.id));

    const handleUpdate = () => {
      setSaved(isInStudyPack(item.id));
    };

    window.addEventListener('sanchay_study_pack_updated', handleUpdate);
    return () => {
      window.removeEventListener('sanchay_study_pack_updated', handleUpdate);
    };
  }, [item.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      // Dispatch duplicate notification toast
      window.dispatchEvent(
        new CustomEvent('sanchay_study_pack_toast', {
          detail: {
            title: item.title,
            message: 'Already in My Study Pack',
            type: 'info',
          },
        })
      );
      return;
    }

    const res = addToStudyPack(item);
    if (res.success || res.isDuplicate) {
      setSaved(true);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleSave}
        title={saved ? 'Already in My Study Pack' : 'Save to My Study Pack'}
        className={`p-2 rounded-full transition-all ${
          saved
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-white/80 hover:bg-white text-gray-700 hover:text-amber-700 border border-gray-200 shadow-sm'
        } ${className}`}
      >
        {saved ? <Check className="w-4 h-4 text-amber-800" /> : <Bookmark className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleSave}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
          saved
            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold cursor-default'
            : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
        } ${className}`}
      >
        {saved ? (
          <>
            <Check className="w-3.5 h-3.5 text-amber-700" />
            <span>In Study Pack</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5 text-amber-700" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={handleSave}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          saved
            ? 'bg-amber-50 text-amber-900 border-amber-300 cursor-default'
            : 'bg-white text-sanchay-deepNavy border-sanchay-gold/60 hover:bg-sanchay-cream'
        } ${className}`}
      >
        {saved ? <Check className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4 text-sanchay-gold" />}
        <span>{saved ? 'Already in My Study Pack' : label}</span>
      </button>
    );
  }

  // Default button variant
  return (
    <button
      type="button"
      onClick={handleSave}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
        saved
          ? 'bg-amber-100 text-amber-900 border border-amber-400 cursor-default'
          : 'bg-sanchay-gold text-sanchay-deepNavy hover:bg-sanchay-goldLight active:scale-[0.98]'
      } ${className}`}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4 text-amber-800" />
          <span>Already in My Study Pack</span>
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

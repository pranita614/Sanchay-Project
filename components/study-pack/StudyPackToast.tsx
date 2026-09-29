'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle, Info, ExternalLink, X } from 'lucide-react';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export default function StudyPackToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; message: string; type?: 'success' | 'info' | 'warning' }>;
      if (!customEvent.detail) return;

      const newToast: ToastData = {
        id: Math.random().toString(36).substring(2, 9),
        title: customEvent.detail.title || 'Study Pack',
        message: customEvent.detail.message || 'Updated',
        type: customEvent.detail.type || 'success',
      };

      setToasts((prev) => [...prev.slice(-2), newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('sanchay_study_pack_toast', handleToast);
    return () => {
      window.removeEventListener('sanchay_study_pack_toast', handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-sanchay-deepNavy text-white p-3.5 rounded-xl shadow-2xl border border-sanchay-gold/40 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'info' ? (
              <Info className="w-5 h-5 text-amber-400" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-sanchay-gold truncate">{toast.title}</p>
            <p className="text-xs text-sanchay-cream/90 mt-0.5">{toast.message}</p>

            {toast.type === 'success' && (
              <Link
                href="/study-pack"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sanchay-gold hover:underline mt-1.5"
              >
                <span>View My Study Pack</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-sanchay-cream/60 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

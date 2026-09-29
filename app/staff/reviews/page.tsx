'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { CheckSquare, Check, X, FileText, AlertCircle } from 'lucide-react';

export default function StaffReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: 'rev-1', title: 'OCR Correction: Volume 17 Part 2 Page 145', submitter: 'Junior Archivist R. More', date: 'Today at 14:30', category: 'OCR Review', status: 'PENDING' },
    { id: 'rev-2', title: 'New Speech Audio Upload: Columbia University 1952', submitter: 'Curator K. Thorat', date: 'Yesterday at 18:15', category: 'Audio Upload', status: 'PENDING' },
    { id: 'rev-3', title: 'Marathi Translation Update: Annihilation of Caste Chapter 3', submitter: 'Translator S. Kamble', date: '27 Sep 2026', category: 'Translation', status: 'PENDING' }
  ]);

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Pending Reviews & Verification Queue</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Review and approve pending OCR corrections, media uploads, and translation revisions before publishing
            </p>
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 text-amber-800 font-bold">
            Pending Queue: <strong>{reviews.filter(r => r.status === 'PENDING').length}</strong> items
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-xl border border-sanchay-borderCream p-5 shadow-archival flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-sanchay-cream text-sanchay-deepNavy text-[10px] font-bold border border-sanchay-borderCream">
                    {rev.category}
                  </span>
                  <span className="text-[11px] font-mono text-sanchay-textMuted">{rev.date}</span>
                </div>
                <h3 className="font-serif font-bold text-sanchay-deepNavy text-sm">{rev.title}</h3>
                <p className="text-xs text-sanchay-textMuted font-mono">Submitted by: {rev.submitter}</p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                {rev.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(rev.id)}
                      className="px-3 py-1.5 rounded bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(rev.id)}
                      className="px-4 py-1.5 rounded bg-green-600 text-white text-xs font-bold hover:bg-green-700 flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Publish
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded text-xs font-bold ${rev.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rev.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

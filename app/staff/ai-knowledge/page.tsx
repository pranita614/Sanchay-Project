'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { SEED_DOCUMENTS } from '@/lib/db/seed-data';
import { Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StaffAIKnowledgePage() {
  const [indexing, setIndexing] = useState<string | null>(null);

  const handleIndex = (id: string) => {
    setIndexing(id);
    setTimeout(() => {
      setIndexing(null);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">AI Knowledge Base & RAG Indexing</h1>
            <p className="text-xs text-sanchay-textMuted">Manage vector embeddings and verified BAWS source grounding</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-cream uppercase font-serif text-[10px]">
              <tr>
                <th className="p-3">Source Title</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Embedding Chunks</th>
                <th className="p-3">Indexing Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream">
              {SEED_DOCUMENTS.map((doc) => (
                <tr key={doc.id} className="hover:bg-sanchay-cream/30">
                  <td className="p-3 font-serif font-bold text-sanchay-deepNavy">{doc.title}</td>
                  <td className="p-3 font-mono text-sanchay-gold font-bold">{doc.volume}</td>
                  <td className="p-3 font-mono">103 Chunks</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-green-600" /> INDEXED
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleIndex(doc.id)}
                      className="px-3 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px] font-bold flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${indexing === doc.id ? 'animate-spin' : ''}`} /> Re-Index
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

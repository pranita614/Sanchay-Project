'use client';

import React from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { FolderKanban, Mic, Video, CheckSquare, Plus, Upload, Sparkles, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import dbStore from '@/lib/db/prisma';

export default function StaffDashboardPage() {
  const kpis = [
    { label: 'Total Collections', count: '3,245', icon: FolderKanban, color: 'text-sanchay-gold' },
    { label: 'Audio Files', count: '120', icon: Mic, color: 'text-blue-600' },
    { label: 'Video Files', count: '85', icon: Video, color: 'text-purple-600' },
    { label: 'Pending Reviews', count: '12', icon: CheckSquare, color: 'text-amber-600' },
  ];

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        
        {/* Top Bar Banner with Background Image */}
        <div className="relative bg-sanchay-deepNavy text-white p-6 rounded-lg border-2 border-sanchay-gold/40 overflow-hidden shadow-archival">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-luminosity"
            style={{ backgroundImage: `url('/images/hero_parliament_bg.png')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sanchay-deepNavy/95 via-sanchay-deepNavy/80 to-transparent" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-sanchay-gold">Dashboard Overview</h1>
              <p className="text-xs text-sanchay-cream/80 mt-1">
                Institutional Archival Management & AI Knowledge Pipeline Control
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/staff/collections"
                className="px-4 py-2 rounded bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold flex items-center gap-1.5 hover:bg-sanchay-goldLight shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Collection
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid (Screen 10 Target) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival flex items-center justify-between hover:border-sanchay-gold transition-all"
              >
                <div>
                  <span className="text-xs font-serif text-sanchay-textMuted block">{kpi.label}</span>
                  <span className="text-3xl font-serif font-bold text-sanchay-deepNavy mt-1 block">
                    {kpi.count}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-sanchay-cream flex items-center justify-center border border-sanchay-gold/30">
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Stream */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival space-y-4">
            <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
              <h2 className="text-base font-serif font-bold text-sanchay-deepNavy flex items-center gap-2">
                <Activity className="w-4 h-4 text-sanchay-gold" /> Recent Archival Activities
              </h2>
              <span className="text-[10px] font-mono text-sanchay-textMuted">Real-time Audit Log</span>
            </div>

            <div className="space-y-3 text-xs">
              {dbStore.auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded bg-sanchay-cream/40 border border-sanchay-borderCream/60 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sanchay-deepNavy flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold text-[9px] font-mono font-bold">
                        {log.action}
                      </span>
                      <span>{log.details}</span>
                    </div>
                    <span className="text-[10px] text-sanchay-textMuted font-mono block mt-1">Resource: {log.resource}</span>
                  </div>
                  <span className="text-[10px] text-sanchay-textMuted font-mono">{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival space-y-4">
            <h2 className="text-base font-serif font-bold text-sanchay-deepNavy border-b border-sanchay-borderCream pb-3">
              Quick Staff Actions
            </h2>

            <div className="space-y-2">
              <Link
                href="/staff/documents"
                className="w-full text-left p-3 rounded bg-sanchay-cream/50 border border-sanchay-borderCream text-xs text-sanchay-deepNavy font-bold hover:bg-sanchay-deepNavy hover:text-sanchay-gold transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-sanchay-gold" /> Upload Archival Document (PDF/Scan)
              </Link>
              <Link
                href="/staff/audio"
                className="w-full text-left p-3 rounded bg-sanchay-cream/50 border border-sanchay-borderCream text-xs text-sanchay-deepNavy font-bold hover:bg-sanchay-deepNavy hover:text-sanchay-gold transition-colors flex items-center gap-2"
              >
                <Mic className="w-4 h-4 text-sanchay-gold" /> Upload Audio Recording & Transcript
              </Link>
              <Link
                href="/staff/ocr"
                className="w-full text-left p-3 rounded bg-sanchay-cream/50 border border-sanchay-borderCream text-xs text-sanchay-deepNavy font-bold hover:bg-sanchay-deepNavy hover:text-sanchay-gold transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-sanchay-gold" /> Run OCR Text Extraction
              </Link>
              <Link
                href="/staff/ai-knowledge"
                className="w-full text-left p-3 rounded bg-sanchay-cream/50 border border-sanchay-borderCream text-xs text-sanchay-deepNavy font-bold hover:bg-sanchay-deepNavy hover:text-sanchay-gold transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sanchay-gold" /> Index AI Knowledge Base (RAG)
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

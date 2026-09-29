'use client';

import React from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { BarChart3, TrendingUp, Users, BookOpen, Volume2, Globe } from 'lucide-react';

export default function StaffAnalyticsPage() {
  const stats = [
    { label: 'Monthly Active Researchers', value: '48,290', change: '+18%', icon: Users },
    { label: 'Document Views & Reads', value: '124,500', change: '+24%', icon: BookOpen },
    { label: 'Audio Speeches Played', value: '38,120', change: '+32%', icon: Volume2 },
    { label: 'Multilingual Queries Served', value: '94,800', change: '+15%', icon: Globe }
  ];

  const topSearches = [
    { query: 'Annihilation of Caste', views: '28,400', pct: '22%' },
    { query: 'Mahad Satyagraha 1927', views: '19,200', pct: '15%' },
    { query: '22 Vows (Nagpur 1956)', views: '16,800', pct: '13%' },
    { query: 'Constituent Assembly Debates', views: '14,500', pct: '11%' },
    { query: 'States and Minorities', views: '11,300', pct: '9%' }
  ];

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Archive Usage & Research Analytics</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Public engagement metrics, top searched works, audio playback stats, and language distribution
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-xl border border-sanchay-borderCream shadow-archival space-y-2">
                <div className="flex justify-between items-center text-xs text-sanchay-textMuted">
                  <span>{st.label}</span>
                  <Icon className="w-4 h-4 text-sanchay-gold" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-serif font-bold text-sanchay-deepNavy">{st.value}</span>
                  <span className="text-xs font-mono font-bold text-green-700">{st.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Searched Works */}
          <div className="bg-white p-6 rounded-xl border border-sanchay-borderCream shadow-archival space-y-4">
            <h3 className="font-serif font-bold text-sanchay-deepNavy text-base flex items-center gap-2 border-b pb-3">
              <TrendingUp className="w-4 h-4 text-sanchay-gold" /> Top Searched Archival Works
            </h3>

            <div className="space-y-3 font-sans text-xs">
              {topSearches.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-bold text-sanchay-deepNavy">
                    <span>{idx + 1}. {item.query}</span>
                    <span className="font-mono text-sanchay-gold">{item.views} views</span>
                  </div>
                  <div className="w-full bg-sanchay-cream rounded-full h-2 overflow-hidden border border-sanchay-borderCream">
                    <div className="bg-sanchay-deepNavy h-full rounded-full" style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Distribution */}
          <div className="bg-white p-6 rounded-xl border border-sanchay-borderCream shadow-archival space-y-4">
            <h3 className="font-serif font-bold text-sanchay-deepNavy text-base flex items-center gap-2 border-b pb-3">
              <Globe className="w-4 h-4 text-sanchay-gold" /> Language Distribution of Access
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center p-3 bg-sanchay-cream/50 rounded border border-sanchay-borderCream">
                <span className="font-bold text-sanchay-deepNavy">English (English Archive)</span>
                <span className="font-mono text-sanchay-gold font-bold">42% (52,290 sessions)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-sanchay-cream/50 rounded border border-sanchay-borderCream">
                <span className="font-bold text-sanchay-deepNavy">Marathi (मराठी संग्रह)</span>
                <span className="font-mono text-sanchay-gold font-bold">34% (42,330 sessions)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-sanchay-cream/50 rounded border border-sanchay-borderCream">
                <span className="font-bold text-sanchay-deepNavy">Hindi (हिंदी संग्रह)</span>
                <span className="font-mono text-sanchay-gold font-bold">14% (17,430 sessions)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-sanchay-cream/50 rounded border border-sanchay-borderCream">
                <span className="font-bold text-sanchay-deepNavy">Bengali & Tamil (বাংলা / தமிழ்)</span>
                <span className="font-mono text-sanchay-gold font-bold">10% (12,450 sessions)</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

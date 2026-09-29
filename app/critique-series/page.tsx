import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CritiqueSeriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Critique Series
          </h1>
          <p className="text-xs text-sanchay-textMuted mt-2">
            Critical analysis of socio-economic and political treatises authored by Dr. B. R. Ambedkar.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival max-w-4xl mx-auto text-xs leading-relaxed text-sanchay-textDark space-y-3">
          <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Featured Critique Works</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Ranade, Gandhi and Jinnah (1943)</strong> — Analysis of leadership styles and democratic principles.</li>
            <li><strong>What Congress and Gandhi Have Done to the Untouchables (1945)</strong> — Comprehensive critique of political promises vs social reality.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SwarajPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Swaraj Archival Collection
          </h1>
          <p className="text-xs text-sanchay-textMuted mt-2">
            Historical archival records and articles regarding self-governance and social rights.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival max-w-4xl mx-auto text-xs leading-relaxed text-sanchay-textDark space-y-3">
          <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Archival Overview</h2>
          <p>This collection preserves Dr. Ambedkar's historical commentary on Swaraj (self-governance), insisting that political freedom must be accompanied by social and economic democracy.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

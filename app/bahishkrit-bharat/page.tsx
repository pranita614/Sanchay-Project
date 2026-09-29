import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BookOpen, Newspaper } from 'lucide-react';

export default function BahishkritBharatPage() {
  const issues = [
    { issue: 1, date: "3 April 1927", title: "Inaugural Issue of Bahishkrit Bharat", summary: "Founded by Dr. B. R. Ambedkar to advocate for social rights, human dignity, and equality." },
    { issue: 2, date: "20 May 1927", title: "Editorial on Mahad Satyagraha", summary: "Critical commentary on civil rights and access to public water tanks." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Bahishkrit Bharat Archive (बहिष्कृत भारत)
          </h1>
          <p className="text-xs text-sanchay-textMuted mt-2">
            Archival periodical founded by Dr. B. R. Ambedkar in 1927 to voice the cause of the oppressed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {issues.map((item) => (
            <div key={item.issue} className="bg-white p-5 rounded-lg border border-sanchay-borderCream shadow-archival space-y-3">
              <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-2">
                <span className="font-serif font-bold text-sanchay-deepNavy text-sm">Issue #{item.issue}</span>
                <span className="text-xs font-mono text-sanchay-gold font-bold">{item.date}</span>
              </div>
              <h3 className="text-base font-serif font-bold text-sanchay-deepNavy">{item.title}</h3>
              <p className="text-xs text-sanchay-textDark leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

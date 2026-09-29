'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on all pages EXCEPT the public home page ('/')
  if (pathname !== '/') {
    return null;
  }

  return (
    <footer className="bg-sanchay-deepNavy text-sanchay-cream border-t-2 border-sanchay-gold/40 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Institutional info */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 border-2 border-sanchay-gold flex items-center justify-center overflow-hidden">
              <img
                src="/images/sanchay_logo.png"
                alt="Sanchay Digital Heritage Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-serif font-bold text-sanchay-gold">SANCHAY</span>
          </div>
          <p className="text-xs text-sanchay-cream/80 leading-relaxed font-sans">
            AI-Powered Digital Heritage Archive & Audio-Visual Knowledge Platform dedicated exclusively to Dr. B. R. Ambedkar.
          </p>
          <div className="mt-4 text-[11px] text-sanchay-gold/90 font-mono">
            Source Provenance: Official Writings & Speeches Archives & Govt Records.
          </div>
        </div>

        {/* Col 2: Archival Catalogue */}
        <div>
          <h4 className="text-sm font-serif font-bold text-sanchay-gold mb-3 uppercase tracking-wider">
            Archival Catalogue
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/explore?type=Writings" className="hover:text-sanchay-gold transition-colors">Writings & Books</Link></li>
            <li><Link href="/explore?type=Speeches" className="hover:text-sanchay-gold transition-colors">Speeches & Addresses</Link></li>
            <li><Link href="/letters" className="hover:text-sanchay-gold transition-colors">Letters & Correspondence</Link></li>
            <li><Link href="/vows" className="hover:text-sanchay-gold transition-colors">22 Vows (Nagpur 1956)</Link></li>
            <li><Link href="/bahishkrit-bharat" className="hover:text-sanchay-gold transition-colors">Bahishkrit Bharat</Link></li>
          </ul>
        </div>

        {/* Col 3: Special Archival Tools */}
        <div>
          <h4 className="text-sm font-serif font-bold text-sanchay-gold mb-3 uppercase tracking-wider">
            Research Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/timeline" className="hover:text-sanchay-gold transition-colors">Interactive Timeline</Link></li>
            <li><Link href="/ask-sanchay" className="hover:text-sanchay-gold transition-colors">Ask Sanchay (RAG AI)</Link></li>
            <li><Link href="/mind-map" className="hover:text-sanchay-gold transition-colors">Interactive Mind Map</Link></li>
            <li><Link href="/quotes" className="hover:text-sanchay-gold transition-colors">Verified Quotes</Link></li>
            <li><Link href="/kiosk" className="hover:text-sanchay-gold transition-colors">Kiosk / Display Mode</Link></li>
          </ul>
        </div>

        {/* Col 4: Preservation & Access */}
        <div>
          <h4 className="text-sm font-serif font-bold text-sanchay-gold mb-3 uppercase tracking-wider">
            Institutional Access
          </h4>
          <p className="text-xs text-sanchay-cream/80 leading-relaxed mb-3">
            Digital Preservation & Provenance verified under SIH Digital Heritage specifications.
          </p>
          <Link
            href="/staff/login"
            className="inline-block px-3 py-1.5 rounded bg-sanchay-darkNavy border border-sanchay-gold/50 text-xs font-semibold text-sanchay-gold hover:bg-sanchay-gold hover:text-sanchay-deepNavy transition-colors"
          >
            Staff Portal Access
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-sanchay-gold/20 flex flex-col md:flex-row justify-between items-center text-xs text-sanchay-cream/60">
        <div>
          © {new Date().getFullYear()} SANCHAY — Digital Heritage Archive of Dr. B. R. Ambedkar. All rights reserved.
        </div>
        <div className="mt-2 md:mt-0 font-mono text-[11px]">
          Verified Provenance • Zero Hallucination Guarantee
        </div>
      </div>
    </footer>
  );
}

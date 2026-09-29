'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';

export default function StaffOCRPage() {
  const [status, setStatus] = useState<'REVIEWED' | 'APPROVED'>('REVIEWED');

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">OCR Extraction & Correction Workflow</h1>
            <p className="text-xs text-sanchay-textMuted">Compare original scans against extracted text for approval</p>
          </div>
          <span className="px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-bold font-mono">Status: {status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-sanchay-borderCream shadow-archival space-y-2">
            <h3 className="text-sm font-serif font-bold text-sanchay-deepNavy">Original Scan Document Facsimile</h3>
            <div className="h-80 bg-sanchay-cream border border-sanchay-gold/40 rounded flex items-center justify-center p-6 text-center text-sanchay-textMuted font-serif">
              Annihilation of Caste Page 1 Original Scan
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-sanchay-borderCream shadow-archival space-y-3 flex flex-col">
            <h3 className="text-sm font-serif font-bold text-sanchay-deepNavy">OCR Extracted Text (Editable)</h3>
            <textarea
              className="flex-1 p-3 text-xs border border-sanchay-borderCream rounded font-sans focus:outline-none focus:border-sanchay-gold"
              defaultValue="ANNIHILATION OF CASTE WITH A REPLY TO MAHATMA GANDHI BY DR. B. R. AMBEDKAR..."
            />
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStatus('APPROVED')} className="px-4 py-2 rounded bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs">
                Approve & Publish OCR Text
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

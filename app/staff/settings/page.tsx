'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { Settings, Save, Shield, Database, Sparkles, Check } from 'lucide-react';

export default function StaffSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    portalName: 'Sanchay Archival Portal',
    provenanceLabel: 'Dr. Babasaheb Ambedkar Writings and Speeches Archives',
    strictGrounding: true,
    speechSynthesisEnabled: true,
    ocrAutoProcess: true,
    aiModel: 'Gemini 2.0 Pro / Antigravity Heritage Model'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Staff Portal Settings & Archival Configuration</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Configure provenance metadata, AI grounding parameters, and system defaults
            </p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> Settings updated successfully!
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-sanchay-borderCream p-6 shadow-archival space-y-6 font-sans text-xs">
          
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sanchay-deepNavy text-sm border-b pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-sanchay-gold" /> Institutional Provenance Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sanchay-deepNavy mb-1">Portal Display Name</label>
                <input
                  type="text"
                  value={config.portalName}
                  onChange={e => setConfig({ ...config, portalName: e.target.value })}
                  className="w-full p-2.5 rounded border border-sanchay-borderCream font-serif text-sanchay-deepNavy"
                />
              </div>

              <div>
                <label className="block font-bold text-sanchay-deepNavy mb-1">Official Archival Source Label</label>
                <input
                  type="text"
                  value={config.provenanceLabel}
                  onChange={e => setConfig({ ...config, provenanceLabel: e.target.value })}
                  className="w-full p-2.5 rounded border border-sanchay-borderCream text-sanchay-deepNavy"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-sanchay-borderCream">
            <h3 className="font-serif font-bold text-sanchay-deepNavy text-sm border-b pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sanchay-gold" /> AI RAG & Grounding Engine Parameters
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.strictGrounding}
                  onChange={e => setConfig({ ...config, strictGrounding: e.target.checked })}
                  className="w-4 h-4 accent-sanchay-gold cursor-pointer"
                />
                <span className="font-bold text-sanchay-deepNavy">
                  Enforce Zero-Hallucination Policy (Only return citations backed by verified volume and page numbers)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.speechSynthesisEnabled}
                  onChange={e => setConfig({ ...config, speechSynthesisEnabled: e.target.checked })}
                  className="w-4 h-4 accent-sanchay-gold cursor-pointer"
                />
                <span className="font-bold text-sanchay-deepNavy">
                  Enable Multilingual Web Speech TTS Narration Across All Audio & Text Sections
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-sanchay-borderCream flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold hover:bg-sanchay-goldLight transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

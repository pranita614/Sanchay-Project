'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { Languages, Search, Check, Edit, Save, Globe } from 'lucide-react';

export default function StaffTranslationsPage() {
  const [translations, setTranslations] = useState([
    { id: 't1', key: 'Annihilation of Caste', english: 'Annihilation of Caste', marathi: 'जातीचा उच्छेद', hindi: 'जाति का विनाश', bengali: 'জাতি প্রথার উচ্ছেদ', tamil: 'சாதி ஒழிப்பு', status: 'VERIFIED' },
    { id: 't2', key: 'Castes in India', english: 'Castes in India: Their Mechanism, Genesis and Development', marathi: 'भारतातील जाती: त्यांची यंत्रणा, उत्पत्ती आणि विकास', hindi: 'भारत में जातियां: उनकी प्रणाली, उत्पत्ति और विकास', bengali: 'ভারতে জাতপাত', tamil: 'இந்தியாவில் சாதிகள்', status: 'VERIFIED' },
    { id: 't3', key: 'Mahad Satyagraha Speech', english: 'Speech at Mahad Satyagraha (Asserting Equal Public Access)', marathi: 'महाड सत्याग्रह भाषण (सार्वजनिक पाण्याचा अधिकार)', hindi: 'महाड सत्याग्रह भाषण (सार्वजनिक पानी का अधिकार)', bengali: 'মহাড সত্যাগ্রহ বক্তব্য', tamil: 'மகத் சத்தியாகிரக உரை', status: 'VERIFIED' },
    { id: 't4', key: '22 Vows (Nagpur 1956)', english: 'The 22 Vows prescribed by Dr. Ambedkar in Nagpur', marathi: 'नागपूर येथे दिलेल्या २२ प्रतिज्ञा (१९५६)', hindi: 'नागपुर में दी गई 22 प्रतिज्ञाएं (1956)', bengali: '২২টি প্রতিজ্ঞা (নাগপুর ১৯৫৬)', tamil: '22 உறுதிமொழிகள் (நாக்பூர் 1956)', status: 'VERIFIED' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ marathi: string; hindi: string }>({ marathi: '', hindi: '' });

  const filtered = translations.filter(t =>
    t.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.marathi.includes(searchQuery) ||
    t.hindi.includes(searchQuery)
  );

  const startEdit = (item: typeof translations[0]) => {
    setEditingId(item.id);
    setEditData({ marathi: item.marathi, hindi: item.hindi });
  };

  const saveEdit = (id: string) => {
    setTranslations(translations.map(t => {
      if (t.id === id) {
        return { ...t, marathi: editData.marathi, hindi: editData.hindi };
      }
      return t;
    }));
    setEditingId(null);
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Multilingual Translation Verification</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Verify side-by-side human and neural translations across English, Marathi, Hindi, Bengali, and Tamil
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search translations by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Languages Enabled: <strong>5 (English, Marathi, Hindi, Bengali, Tamil)</strong>
          </div>
        </div>

        {/* Translation Cards */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-sanchay-borderCream p-6 shadow-archival space-y-4 font-sans">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-sanchay-deepNavy text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sanchay-gold" /> {item.english}
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold border border-green-200">
                  {item.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-sanchay-creamLight/60 rounded border border-sanchay-borderCream space-y-1">
                  <span className="font-serif font-bold text-sanchay-deepNavy block">Marathi (मराठी):</span>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.marathi}
                      onChange={(e) => setEditData({ ...editData, marathi: e.target.value })}
                      className="w-full p-2 border rounded font-serif text-xs bg-white"
                    />
                  ) : (
                    <p className="font-serif text-sanchay-deepNavy">{item.marathi}</p>
                  )}
                </div>

                <div className="p-3 bg-sanchay-creamLight/60 rounded border border-sanchay-borderCream space-y-1">
                  <span className="font-serif font-bold text-sanchay-deepNavy block">Hindi (हिंदी):</span>
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.hindi}
                      onChange={(e) => setEditData({ ...editData, hindi: e.target.value })}
                      className="w-full p-2 border rounded font-serif text-xs bg-white"
                    />
                  ) : (
                    <p className="font-serif text-sanchay-deepNavy">{item.hindi}</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                {editingId === item.id ? (
                  <button
                    type="button"
                    onClick={() => saveEdit(item.id)}
                    className="px-4 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Translation
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="px-3 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Translations
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

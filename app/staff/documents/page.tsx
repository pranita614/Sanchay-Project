'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { SEED_DOCUMENTS, ArchivalDocument } from '@/lib/db/seed-data';
import { Plus, Search, FileText, Download, Edit, Trash2, Check, X, ExternalLink } from 'lucide-react';

export default function StaffDocumentsPage() {
  const [documents, setDocuments] = useState<ArchivalDocument[]>(
    SEED_DOCUMENTS.filter(d => d.type === 'BOOK' || d.type === 'DOCUMENT' || d.type === 'LETTER')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchivalDocument | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    volume: 'Vol. 1',
    year: 1950,
    type: 'DOCUMENT' as ArchivalDocument['type'],
    description: '',
    pdfUrl: ''
  });

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.volume && d.volume.toLowerCase().includes(searchQuery.toLowerCase())) ||
    d.year.toString().includes(searchQuery)
  );

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newDoc: ArchivalDocument = {
      id: `doc-staff-${Date.now()}`,
      title: formData.title,
      marathiTitle: formData.title,
      hindiTitle: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.description || 'Archival document record.',
      type: formData.type,
      date: `${formData.year}`,
      year: Number(formData.year),
      language: 'English',
      volume: formData.volume,
      pageCount: 100,
      coverImage: '/images/ambedkar_portrait.jpg',
      pdfUrl: formData.pdfUrl || 'https://baws.in/books/baws/EN/Volume_01/pdf/01',
      sourceName: 'Staff Uploaded Archive',
      sourceUrl: 'https://baws.in',
      rights: 'Public Domain',
      status: 'PUBLISHED',
      isFeatured: false,
      topics: ['Documents', 'Archives'],
      tags: ['Archival', 'Document'],
      viewCount: 0,
      content: formData.description || formData.title
    };

    setDocuments([newDoc, ...documents]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      volume: 'Vol. 1',
      year: 1950,
      type: 'DOCUMENT',
      description: '',
      pdfUrl: ''
    });
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Archival Documents & Manuscripts</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Manage books, Constituent Assembly papers, letters, and historical manuscripts
            </p>
          </div>

          <button
            type="button"
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search documents by title, volume or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Verified Documents: <strong>{filteredDocs.length}</strong>
          </div>
        </div>

        {/* Documents Grid / Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Document Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Volume</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">PDF Provenance</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy max-w-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sanchay-gold shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-sanchay-cream text-sanchay-deepNavy text-[10px] font-bold border border-sanchay-borderCream">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-sanchay-gold font-bold">{doc.volume || 'Vol. 1'}</td>
                  <td className="p-3.5 font-mono">{doc.year}</td>
                  <td className="p-3.5">
                    <a
                      href={doc.pdfUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" /> View Scan PDF
                    </a>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingItem(doc); setFormData({ title: doc.title, volume: doc.volume || 'Vol. 1', year: doc.year, type: doc.type, description: doc.description || '', pdfUrl: doc.pdfUrl || '' }); }}
                        className="px-2.5 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-[11px] font-bold hover:bg-sanchay-darkNavy transition-colors"
                      >
                        <Edit className="w-3 h-3 inline mr-1" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Upload Archival Document</h2>
                <button type="button" onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Document Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">Volume *</label>
                    <input type="text" required value={formData.volume} onChange={e => setFormData({ ...formData, volume: e.target.value })} className="w-full p-2 border rounded font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Year *</label>
                    <input type="number" required value={formData.year} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full p-2 border rounded font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">PDF Direct URL</label>
                  <input type="url" placeholder="https://..." value={formData.pdfUrl} onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })} className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-sanchay-gold text-sanchay-deepNavy font-bold rounded">Upload Document</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

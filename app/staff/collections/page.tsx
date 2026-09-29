'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { SEED_DOCUMENTS, ArchivalDocument } from '@/lib/db/seed-data';
import { Plus, Search, Filter, Edit, Trash2, X, Check, FileText, Download, Volume2, Video } from 'lucide-react';

export default function StaffCollectionsPage() {
  const [collections, setCollections] = useState<ArchivalDocument[]>(SEED_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchivalDocument | null>(null);

  // New Collection Form State
  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    hindiTitle: '',
    type: 'BOOK' as ArchivalDocument['type'],
    volume: 'Vol. 1',
    year: 1956,
    date: '1956',
    description: '',
    pdfUrl: '',
    status: 'PUBLISHED'
  });

  const filteredCollections = collections.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.volume && item.volume.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.year.toString().includes(searchQuery);
    
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem: ArchivalDocument = {
      id: `doc-custom-${Date.now()}`,
      title: formData.title,
      marathiTitle: formData.marathiTitle || formData.title,
      hindiTitle: formData.hindiTitle || formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: formData.description || 'Archival document record preserved in official Ambedkar collection.',
      type: formData.type,
      date: formData.date || `${formData.year}`,
      year: Number(formData.year) || 1956,
      language: 'English',
      volume: formData.volume,
      pageCount: 100,
      coverImage: '/images/ambedkar_portrait.jpg',
      pdfUrl: formData.pdfUrl || 'https://baws.in/books/baws/EN/Volume_01/pdf/01',
      sourceName: 'Official Archival Collection',
      sourceUrl: 'https://baws.in',
      rights: 'Public Domain',
      status: 'PUBLISHED',
      isFeatured: false,
      topics: ['Writings', 'Archives'],
      tags: ['Archival', 'Collection'],
      viewCount: 0,
      content: formData.description || formData.title
    };

    setCollections([newItem, ...collections]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setCollections(collections.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: formData.title,
          marathiTitle: formData.marathiTitle,
          hindiTitle: formData.hindiTitle,
          type: formData.type,
          volume: formData.volume,
          year: Number(formData.year),
          description: formData.description,
          pdfUrl: formData.pdfUrl
        };
      }
      return item;
    }));

    setEditingItem(null);
    resetForm();
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection record?')) {
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  const openEditModal = (item: ArchivalDocument) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      marathiTitle: item.marathiTitle || '',
      hindiTitle: item.hindiTitle || '',
      type: item.type,
      volume: item.volume || 'Vol. 1',
      year: item.year || 1956,
      date: item.date || `${item.year}`,
      description: item.description || '',
      pdfUrl: item.pdfUrl || '',
      status: 'PUBLISHED'
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      marathiTitle: '',
      hindiTitle: '',
      type: 'BOOK',
      volume: 'Vol. 1',
      year: 1956,
      date: '1956',
      description: '',
      pdfUrl: '',
      status: 'PUBLISHED'
    });
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Manage Collections</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Add, edit, review and publish archival collections of Dr. B. R. Ambedkar
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            suppressHydrationWarning
          >
            <Plus className="w-4 h-4" /> Add Collection
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search collections by title, volume, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
              suppressHydrationWarning
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs">
              <label className="font-serif font-bold text-sanchay-deepNavy">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 text-xs font-bold rounded-lg border border-sanchay-borderCream bg-white text-sanchay-deepNavy focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                <option value="All">All Types</option>
                <option value="BOOK">Books & Works</option>
                <option value="SPEECH">Speeches</option>
                <option value="LETTER">Letters</option>
                <option value="DOCUMENT">Documents</option>
              </select>
            </div>

            <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
              Total: <strong>{filteredCollections.length}</strong> items
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Volume</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sanchay-borderCream font-sans">
                {filteredCollections.map((doc) => (
                  <tr key={doc.id} className="hover:bg-sanchay-cream/40 transition-colors">
                    <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy max-w-xs truncate">
                      {doc.title}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-sanchay-cream text-sanchay-deepNavy text-[10px] font-bold border border-sanchay-borderCream uppercase">
                        {doc.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-sanchay-gold font-bold">
                      {doc.volume || 'Vol. 1'}
                    </td>
                    <td className="p-3.5 font-mono text-sanchay-deepNavy">
                      {doc.year}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold border border-green-200 inline-flex items-center gap-1">
                        <Check className="w-3 h-3" /> PUBLISHED
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(doc)}
                          className="px-2.5 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-[11px] font-bold hover:bg-sanchay-darkNavy transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit Collection"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCollection(doc.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Collection"
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
        </div>

        {/* ADD COLLECTION MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-auto">
              
              <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
                <h2 className="text-lg font-serif font-bold text-sanchay-deepNavy flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sanchay-gold" /> Add New Archival Collection
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full bg-sanchay-cream hover:bg-sanchay-gold/20 text-sanchay-deepNavy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCollection} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annihilation of Caste"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Marathi Title (मराठी)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. जातीचा उच्छेद"
                      value={formData.marathiTitle}
                      onChange={(e) => setFormData({ ...formData, marathiTitle: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Hindi Title (हिंदी)
                    </label>
                    <input
                      type="text"
                      placeholder="जैसे जाति का विनाश"
                      value={formData.hindiTitle}
                      onChange={(e) => setFormData({ ...formData, hindiTitle: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-bold focus:outline-none focus:border-sanchay-gold cursor-pointer"
                    >
                      <option value="BOOK">Book / Work</option>
                      <option value="SPEECH">Speech</option>
                      <option value="LETTER">Letter</option>
                      <option value="DOCUMENT">Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Volume *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vol. 1 or Volume_17_01"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1936"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                    Description / Historical Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter archival historical context..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold"
                  />
                </div>

                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                    PDF Document URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                  />
                </div>

                <div className="pt-3 border-t border-sanchay-borderCream flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-sanchay-cream text-sanchay-deepNavy font-bold border border-sanchay-borderCream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold hover:bg-sanchay-goldLight transition-colors shadow-sm"
                  >
                    Save & Publish Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT COLLECTION MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-auto">
              
              <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
                <h2 className="text-lg font-serif font-bold text-sanchay-deepNavy flex items-center gap-2">
                  <Edit className="w-5 h-5 text-sanchay-gold" /> Edit Archival Collection
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-full bg-sanchay-cream hover:bg-sanchay-gold/20 text-sanchay-deepNavy transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateCollection} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-bold focus:outline-none focus:border-sanchay-gold cursor-pointer"
                    >
                      <option value="BOOK">Book / Work</option>
                      <option value="SPEECH">Speech</option>
                      <option value="LETTER">Letter</option>
                      <option value="DOCUMENT">Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Volume *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">
                    Description / Historical Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none focus:border-sanchay-gold"
                  />
                </div>

                <div className="pt-3 border-t border-sanchay-borderCream flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-lg bg-sanchay-cream text-sanchay-deepNavy font-bold border border-sanchay-borderCream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold hover:bg-sanchay-goldLight transition-colors shadow-sm"
                  >
                    Update Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

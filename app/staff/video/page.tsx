'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import Link from 'next/link';
import { SEED_VIDEO, ArchivalVideo } from '@/lib/db/seed-data';
import { Plus, Search, Video, Play, Trash2, X, ExternalLink, Link2 } from 'lucide-react';

export default function StaffVideoPage() {
  const [videos, setVideos] = useState<ArchivalVideo[]>(SEED_VIDEO);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    date: '1949',
    year: 1949,
    description: ''
  });

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newVideo: ArchivalVideo = {
      id: `video-staff-${Date.now()}`,
      title: formData.title,
      marathiTitle: formData.title,
      hindiTitle: formData.title,
      description: formData.description || 'Historical archival footage.',
      date: formData.date,
      year: Number(formData.year),
      duration: '58:10',
      durationSeconds: 3490,
      tags: ['Video', 'Film Archive'],
      thumbnailUrl: '/images/ambedkar_constituent_assembly.jpg',
      videoUrl: formData.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      chapters: [
        { timestamp: '00:00', timeInSeconds: 0, title: 'Introduction' }
      ],
      transcriptSegments: [
        { timestamp: '00:00', timeInSeconds: 0, speaker: 'Narrator', text: formData.title }
      ]
    };

    setVideos([newVideo, ...videos]);
    setFormData({
      title: '',
      videoUrl: '',
      date: '1949',
      year: 1949,
      description: ''
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Video Archive & Film Records</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Manage Constituent Assembly documentary films, newsreels, and YouTube archival footage
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Video Film
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search video archives by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Archival Films: <strong>{filteredVideos.length}</strong>
          </div>
        </div>

        {/* Videos Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Film Title</th>
                <th className="p-3.5">Historical Date</th>
                <th className="p-3.5">Video Link / Source</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {filteredVideos.map((vid) => (
                <tr key={vid.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-sanchay-gold shrink-0" />
                      <span>{vid.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-sanchay-gold font-bold">{vid.date}</td>
                  <td className="p-3.5 text-sanchay-textMuted font-mono">
                    <span className="truncate max-w-[200px] inline-block text-sanchay-deepNavy/80" title={vid.videoUrl}>
                      {vid.videoUrl || 'YouTube Archive Stream'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right flex items-center justify-end gap-2">
                    <Link
                      href="/video"
                      className="px-2.5 py-1 rounded bg-sanchay-gold/20 text-sanchay-deepNavy hover:bg-sanchay-gold text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" /> Play on Site
                    </Link>
                    <button
                      type="button"
                      onClick={() => setVideos(videos.filter(v => v.id !== vid.id))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Archival Video Film Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-3">
                <h2 className="text-base font-serif font-bold text-sanchay-deepNavy flex items-center gap-2">
                  <Video className="w-5 h-5 text-sanchay-gold" /> Add Archival Video Film
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-sanchay-textMuted hover:text-sanchay-deepNavy rounded-lg hover:bg-sanchay-cream transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">Film Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter archival film title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 border border-sanchay-borderCream rounded-lg bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
                  />
                </div>

                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sanchay-gold" /> YouTube Video URL / Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full p-2.5 border border-sanchay-borderCream rounded-lg bg-sanchay-creamLight text-sanchay-deepNavy font-mono text-xs focus:outline-none focus:border-sanchay-gold"
                  />
                  <p className="text-[11px] text-sanchay-textMuted mt-1">
                    Provide YouTube video link to embed and play the video directly on the SANCHAY website.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">Date</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-2.5 border border-sanchay-borderCream rounded-lg bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full p-2.5 border border-sanchay-borderCream rounded-lg bg-sanchay-creamLight text-sanchay-deepNavy font-mono focus:outline-none focus:border-sanchay-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-serif font-bold text-sanchay-deepNavy mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter archival record description..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border border-sanchay-borderCream rounded-lg bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-sanchay-borderCream">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-sanchay-cream border border-sanchay-borderCream rounded-lg font-bold text-sanchay-deepNavy hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-sanchay-gold text-sanchay-deepNavy font-bold rounded-lg hover:bg-sanchay-goldLight shadow-sm transition-all"
                  >
                    Save Video
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

'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { SEED_TIMELINE, TimelineMilestone } from '@/lib/db/seed-data';
import { Plus, Search, Clock, Edit, Trash2, X } from 'lucide-react';

export default function StaffTimelinePage() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineMilestone[]>(SEED_TIMELINE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    year: 1927,
    date: '20 March 1927',
    category: 'Social Reform',
    description: '',
    location: 'Mahad, Maharashtra'
  });

  const filteredEvents = timelineEvents.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.year.toString().includes(searchQuery) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newEvent: TimelineMilestone = {
      id: `time-staff-${Date.now()}`,
      year: Number(formData.year),
      date: formData.date,
      title: formData.title,
      marathiTitle: formData.title,
      hindiTitle: formData.title,
      category: formData.category as any,
      description: formData.description || 'Historical milestone recorded in official Ambedkar archives.',
      location: formData.location,
      source: 'Official Archival Records'
    };

    setTimelineEvents([newEvent, ...timelineEvents]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Timeline Events & Milestones</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Curate chronological life events, movements, legislation, and milestones of Dr. B. R. Ambedkar
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Timeline Event
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search timeline events by title, year or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Milestones: <strong>{filteredEvents.length}</strong>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Milestone Event Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5 font-mono text-sanchay-gold font-bold">{ev.year}</td>
                  <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy max-w-md">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sanchay-gold shrink-0" />
                      <span>{ev.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-sanchay-cream text-sanchay-deepNavy text-[10px] font-bold border border-sanchay-borderCream">
                      {ev.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-sanchay-textMuted font-mono">{ev.location}</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setTimelineEvents(timelineEvents.filter(t => t.id !== ev.id))}
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

        {/* Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Add Milestone Event</h2>
                <button type="button" onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Event Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">Year *</label>
                    <input type="number" required value={formData.year} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full p-2 border rounded font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Date</label>
                    <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-2 border rounded" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-sanchay-gold text-sanchay-deepNavy font-bold rounded">Save Event</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

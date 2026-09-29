'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { SEED_AUDIO, ArchivalAudio } from '@/lib/db/seed-data';
import { playSpeechAudio } from '@/lib/audio/speech-engine';
import { Plus, Search, Mic, Play, Volume2, Edit, Trash2, Check, X } from 'lucide-react';

export default function StaffAudioPage() {
  const [audioList, setAudioList] = useState<ArchivalAudio[]>(SEED_AUDIO);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    speaker: 'Dr. B. R. Ambedkar',
    date: '1927',
    year: 1927,
    location: 'Mahad, Maharashtra',
    duration: '02:45',
    audioUrl: '',
    source: 'Official Archival Recording'
  });

  const filteredAudio = audioList.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newAudio: ArchivalAudio = {
      id: `audio-staff-${Date.now()}`,
      title: formData.title,
      marathiTitle: formData.title,
      hindiTitle: formData.title,
      speaker: formData.speaker,
      date: formData.date,
      year: Number(formData.year),
      location: formData.location,
      duration: formData.duration,
      durationSeconds: 165,
      audioUrl: formData.audioUrl || '/audio/mahad_satyagraha_speech.mp3',
      thumbnailUrl: '/images/ambedkar_portrait.jpg',
      language: 'English',
      source: formData.source,
      rights: 'Public Domain',
      tags: ['Speeches', 'Audio Archive'],
      transcriptSegments: [
        { timestamp: '00:00', timeInSeconds: 0, speaker: formData.speaker, text: formData.title }
      ]
    };

    setAudioList([newAudio, ...audioList]);
    setIsAddModalOpen(false);
  };

  const playTTS = (item: ArchivalAudio) => {
    playSpeechAudio({
      text: item.title,
      language: item.language || 'English',
      englishTitle: item.title
    });
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Audio Speeches & Sound Preservation</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Manage historical speeches, radio broadcasts, audiobooks, and sound archives
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Audio Recording
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search audio speeches by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Audio Recordings: <strong>{filteredAudio.length}</strong>
          </div>
        </div>

        {/* Audio Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Speech Title</th>
                <th className="p-3.5">Speaker</th>
                <th className="p-3.5">Date & Location</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Audio Preview</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {filteredAudio.map((audio) => (
                <tr key={audio.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy max-w-xs">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-sanchay-gold shrink-0" />
                      <span className="truncate">{audio.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-sanchay-deepNavy">{audio.speaker}</td>
                  <td className="p-3.5 text-sanchay-textMuted font-mono">{audio.date} • {audio.location}</td>
                  <td className="p-3.5 font-mono text-sanchay-gold font-bold">{audio.duration}</td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => playTTS(audio)}
                      className="px-2.5 py-1 rounded bg-sanchay-gold text-sanchay-deepNavy text-[10px] font-bold flex items-center gap-1 hover:bg-sanchay-goldLight cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Test TTS
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setAudioList(audioList.filter(a => a.id !== audio.id))}
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
                <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Add Audio Speech Recording</h2>
                <button type="button" onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddAudio} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">Speaker</label>
                    <input type="text" value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} className="w-full p-2 border rounded" />
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
                  <button type="submit" className="px-4 py-2 bg-sanchay-gold text-sanchay-deepNavy font-bold rounded">Save Audio</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

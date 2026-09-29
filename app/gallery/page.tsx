'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Camera, Calendar, MapPin, Users, ExternalLink, Info, X, Image as ImageIcon } from 'lucide-react';
import { SEED_DOCUMENTS, ArchivalDocument } from '@/lib/db/seed-data';
import { useTranslation, SupportedLanguage } from '@/lib/translations/LanguageContext';

export default function GalleryPage() {
  const { language, setLanguage } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All Photographs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<ArchivalDocument | null>(null);

  // Extract all PHOTOGRAPH type items from seed data
  const photos = useMemo(() => {
    return SEED_DOCUMENTS.filter(doc => doc.type === 'PHOTOGRAPH');
  }, []);

  const categories = ['All Photographs', 'Social Movements', 'Poona Pact', 'Bhima Koregaon', 'Constitutional Work', 'Buddhism & Speeches'];

  const filteredPhotos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return photos.filter(item => {
      // Category filtering
      if (activeCategory === 'Social Movements' && !item.topics?.includes('Mahad Satyagraha') && !item.topics?.includes('Social Reform')) return false;
      if (activeCategory === 'Poona Pact' && !item.topics?.includes('Poona Pact')) return false;
      if (activeCategory === 'Bhima Koregaon' && !item.topics?.includes('Bhima Koregaon')) return false;
      if (activeCategory === 'Constitutional Work' && !item.topics?.includes('Constitutional Work') && !item.topics?.includes('Constitution of India')) return false;
      if (activeCategory === 'Buddhism & Speeches' && !item.topics?.includes('Buddhism') && !item.topics?.includes('Speeches')) return false;

      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q) || (item.marathiTitle && item.marathiTitle.toLowerCase().includes(q));
      const peopleMatch = item.peopleIdentified && item.peopleIdentified.toLowerCase().includes(q);
      const storyMatch = item.story && item.story.toLowerCase().includes(q);
      return titleMatch || peopleMatch || storyMatch;
    });
  }, [photos, activeCategory, searchQuery]);

  const getTranslatedTitle = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiTitle) return item.marathiTitle;
    if (language === 'Hindi' && item.hindiTitle) return item.hindiTitle;
    if (language === 'Bengali' && item.bengaliTitle) return item.bengaliTitle;
    if (language === 'Tamil' && item.tamilTitle) return item.tamilTitle;
    return item.title;
  };

  const getTranslatedPeople = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiPeopleIdentified) return item.marathiPeopleIdentified;
    if (language === 'Hindi' && item.hindiPeopleIdentified) return item.hindiPeopleIdentified;
    if (language === 'Bengali' && item.bengaliPeopleIdentified) return item.bengaliPeopleIdentified;
    if (language === 'Tamil' && item.tamilPeopleIdentified) return item.tamilPeopleIdentified;
    return item.peopleIdentified;
  };

  const getTranslatedCaption = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiGalleryCaption) return item.marathiGalleryCaption;
    if (language === 'Hindi' && item.hindiGalleryCaption) return item.hindiGalleryCaption;
    if (language === 'Bengali' && item.bengaliGalleryCaption) return item.bengaliGalleryCaption;
    if (language === 'Tamil' && item.tamilGalleryCaption) return item.tamilGalleryCaption;
    return item.galleryCaption;
  };

  const getTranslatedStory = (item: ArchivalDocument) => {
    if (language === 'Marathi' && item.marathiStory) return item.marathiStory;
    if (language === 'Hindi' && item.hindiStory) return item.hindiStory;
    if (language === 'Bengali' && item.bengaliStory) return item.bengaliStory;
    if (language === 'Tamil' && item.tamilStory) return item.tamilStory;
    return item.story;
  };

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream" suppressHydrationWarning>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        
        {/* Gallery Header */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream p-8 shadow-archival text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanchay-gold/20 text-sanchay-deepNavy text-xs font-mono font-bold">
            <Camera className="w-4 h-4 text-sanchay-gold" /> SANCHAY HISTORICAL PHOTOGRAPH GALLERY
          </div>
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Archival Photographs of Dr. B. R. Ambedkar
          </h1>
          <p className="text-xs text-sanchay-textMuted max-w-2xl mx-auto leading-relaxed">
            Verified historical photographs documenting Dr. Ambedkar's leadership in the Mahad Satyagraha, Poona Pact, Bhima-Koregaon, Constitution Drafting, and Buddhist movement.
          </p>

          {/* Search & Language Bar */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, identified people, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border-2 border-sanchay-gold bg-sanchay-creamLight text-sanchay-deepNavy focus:outline-none font-medium"
                suppressHydrationWarning
              />
              <ImageIcon className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-serif font-bold text-sanchay-deepNavy shrink-0">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-2 text-xs font-bold rounded-lg border-2 border-sanchay-gold bg-sanchay-cream text-sanchay-deepNavy focus:outline-none cursor-pointer"
                suppressHydrationWarning
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-sanchay-deepNavy text-sanchay-gold shadow-sm'
                    : 'bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-borderCream hover:border-sanchay-gold'
                }`}
                suppressHydrationWarning
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Photos Count Bar */}
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-mono text-sanchay-textMuted px-1">
          <span>Displaying {filteredPhotos.length} rare archival photographs</span>
          <span className="px-2.5 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold font-bold">
            Language: {language}
          </span>
        </div>

        {/* Gallery Grid Section: Photo Only + View Details Button Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto font-sans">
          {filteredPhotos.map((item) => {
            const displayTitle = getTranslatedTitle(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-sanchay-borderCream p-4 shadow-archival hover:border-sanchay-gold transition-all flex flex-col justify-between group"
              >
                {/* Photo Display Frame - ONLY THE PHOTO */}
                <div className="relative rounded-lg border-2 border-sanchay-gold/40 overflow-hidden bg-sanchay-deepNavy shadow-md h-80 sm:h-96 w-full flex items-center justify-center">
                  <img
                    src={item.coverImage || '/images/ambedkar_portrait.jpg'}
                    alt={displayTitle}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/80 text-sanchay-gold text-[10px] font-mono font-bold border border-sanchay-gold/40 backdrop-blur-xs uppercase">
                    PHOTOGRAPH
                  </span>
                </div>

                {/* ONLY View Details Button Below Photo */}
                <div className="pt-4 border-t border-sanchay-borderCream mt-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(item)}
                    className="w-full py-2.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-serif font-bold flex items-center justify-center gap-2 hover:bg-sanchay-darkNavy transition-all shadow-sm cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* UNIQUE DETAIL MODAL: UPPER PHOTO + LOWER INFORMATION */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 space-y-6 font-sans my-auto">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-sanchay-cream hover:bg-sanchay-gold/20 text-sanchay-deepNavy transition-colors cursor-pointer z-10 border border-sanchay-borderCream"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* UPPER SIDE: PHOTO DISPLAY */}
              <div className="bg-sanchay-deepNavy rounded-xl border-4 border-sanchay-gold/50 p-4 shadow-xl flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.coverImage || '/images/ambedkar_portrait.jpg'}
                  alt={getTranslatedTitle(selectedPhoto)}
                  className="max-h-[500px] w-auto max-w-full object-contain rounded-lg border border-sanchay-gold/30 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                  }}
                />
              </div>

              {/* LOWER SIDE: INFORMATION DISPLAY */}
              <div className="space-y-6">
                
                {/* Title & Badges */}
                <div className="space-y-3 border-b border-sanchay-borderCream pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-sanchay-gold/20 text-sanchay-deepNavy text-xs font-mono font-bold flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-sanchay-gold" /> PHOTOGRAPH
                    </span>
                    {selectedPhoto.date && (
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-1 border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-sanchay-gold" /> {selectedPhoto.date}
                      </span>
                    )}
                    {selectedPhoto.location && (
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-1 border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-sanchay-gold" /> {selectedPhoto.location}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-serif font-bold text-sanchay-deepNavy leading-tight">
                    {getTranslatedTitle(selectedPhoto)}
                  </h2>
                </div>

                {/* Identified People */}
                {getTranslatedPeople(selectedPhoto) && (
                  <div className="bg-sanchay-cream/70 p-4 rounded-xl border border-sanchay-borderCream space-y-1">
                    <span className="text-xs font-mono font-bold text-sanchay-deepNavy uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-sanchay-gold" /> People Identified:
                    </span>
                    <p className="text-xs sm:text-sm text-sanchay-textDark leading-relaxed">
                      {getTranslatedPeople(selectedPhoto)}
                    </p>
                  </div>
                )}

                {/* Suggested Gallery Caption */}
                {getTranslatedCaption(selectedPhoto) && (
                  <div className="bg-sanchay-gold/10 p-4 sm:p-5 rounded-xl border-l-4 border-sanchay-gold space-y-1">
                    <span className="text-[11px] font-mono font-bold text-sanchay-gold uppercase tracking-wider block">
                      SUGGESTED GALLERY CAPTION
                    </span>
                    <p className="text-sm sm:text-base font-serif font-bold text-sanchay-deepNavy leading-relaxed italic">
                      "{getTranslatedCaption(selectedPhoto)}"
                    </p>
                  </div>
                )}

                {/* Historical Story & Background */}
                {getTranslatedStory(selectedPhoto) && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold text-sanchay-deepNavy uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-sanchay-gold" /> Historical Story & Archival Background
                    </h3>
                    <div className="text-xs sm:text-sm leading-relaxed text-sanchay-textDark bg-sanchay-creamLight p-4 sm:p-5 rounded-xl border border-sanchay-borderCream whitespace-pre-line font-sans shadow-inner">
                      {getTranslatedStory(selectedPhoto)}
                    </div>
                  </div>
                )}

                {/* Source & Museum Record */}
                {selectedPhoto.sourceName && (
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-sanchay-textMuted">
                    <span>Archival Source: {selectedPhoto.sourceName}</span>
                    {selectedPhoto.externalRecordUrl && (
                      <a
                        href={selectedPhoto.externalRecordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" /> Open Museum of India Record
                      </a>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { SEED_TIMELINE } from '@/lib/db/seed-data';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/translations/LanguageContext';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

export default function InteractiveTimeline() {
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categoryKeys = [
    { key: 'catAll', value: 'All' },
    { key: 'catEarlyLife', value: 'Early Life' },
    { key: 'catEducation', value: 'Education' },
    { key: 'catSocialReform', value: 'Social Reform' },
    { key: 'catPoliticalCareer', value: 'Political Career' },
    { key: 'catConstitution', value: 'Constitution' },
    { key: 'catWritings', value: 'Writings' },
    { key: 'catLaterYears', value: 'Later Years' }
  ];

  const filteredTimeline = SEED_TIMELINE.filter(item =>
    selectedCategory === 'All' ? true : item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="space-y-8" suppressHydrationWarning>
      
      {/* Title & Filter Pills */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
          {t('timelineTitle')}
        </h1>
        <p className="text-xs text-sanchay-textMuted leading-relaxed font-sans">
          {t('timelineSubtitle')}
        </p>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categoryKeys.map((cat) => (
            <button
              type="button"
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-sanchay-deepNavy text-sanchay-gold border border-sanchay-gold shadow-sm'
                  : 'bg-white text-sanchay-textDark border border-sanchay-borderCream hover:border-sanchay-gold hover:bg-sanchay-cream/40'
              }`}
              suppressHydrationWarning
            >
              {t(cat.key)}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Central Vertical Archival Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-sanchay-gold/40 transform -translate-x-1/2" />

        <div className="space-y-10">
          {filteredTimeline.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const displayTitle = (language === 'Marathi' && item.marathiTitle) ? item.marathiTitle : item.title;
            const displayDescription = (language === 'Marathi' && item.marathiDescription) ? item.marathiDescription : item.description;
            const displayCategory = (language === 'Marathi' && item.marathiCategory) ? item.marathiCategory : item.category;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Year Marker Badge */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-16 h-8 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold text-sanchay-gold font-mono text-xs font-bold flex items-center justify-center shadow-goldGlow">
                    {item.year}
                  </div>
                </div>

                {/* Milestone Content Card */}
                <div className="w-full md:w-1/2 pl-14 md:pl-0 md:px-8">
                  <div className="bg-white p-5 rounded-lg border border-sanchay-borderCream shadow-archival hover:border-sanchay-gold transition-all group">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy uppercase border border-sanchay-gold/30">
                        {displayCategory}
                      </span>
                      <span className="text-[11px] font-mono text-sanchay-textMuted flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sanchay-gold" /> {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-sanchay-deepNavy group-hover:text-sanchay-gold transition-colors leading-snug">
                      {displayTitle}
                    </h3>

                    {item.location && (
                      <div className="text-[11px] text-sanchay-textMuted flex items-center gap-1 mt-1 font-sans">
                        <MapPin className="w-3 h-3 text-sanchay-gold" /> {item.location}
                      </div>
                    )}

                    <p className="text-xs text-sanchay-textDark leading-relaxed mt-2 font-sans">
                      {displayDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-sanchay-borderCream flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <SaveToStudyPackButton
                        item={{
                          id: item.id,
                          itemType: 'TIMELINE',
                          title: `${item.year}: ${displayTitle}`,
                          description: displayDescription,
                          url: `/timeline`,
                        }}
                        variant="compact"
                      />
                      {item.relatedDocId && (
                        <Link
                          href={item.relatedDocId.startsWith('audio') ? `/audio/${item.relatedDocId}` : `/documents/${item.relatedDocId}`}
                          className="text-sanchay-darkNavy font-bold flex items-center gap-1 hover:text-sanchay-gold"
                        >
                          Explore Material <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

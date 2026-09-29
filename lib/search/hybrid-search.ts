import { SEED_DOCUMENTS, SEED_AUDIO, SEED_VIDEO } from '../db/seed-data';

export interface SearchOptions {
  query: string;
  mode?: 'KEYWORD' | 'SEMANTIC' | 'HYBRID';
  collectionType?: string;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
  volume?: string;
  topic?: string;
  sortBy?: 'relevance' | 'year_asc' | 'year_desc';
}

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  year?: number;
  volume?: string;
  language: string;
  sourceName: string;
  coverImage?: string;
  pdfUrl?: string;
  sourceUrl?: string;
  score: number;
  matchSnippet?: string;
  targetUrl: string;
}

const BENGALI_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'doc-annihilation-caste': {
    title: 'জাতি প্রথার উচ্ছেদ',
    desc: 'জাতি প্রথার উচ্ছেদ (অ্যানিহিলেশন অফ কাস্ট) হল ১৯৩৬ সালে ডঃ বি. আর. আম্বেদকর কর্তৃক লিখিত একটি ঐতিহাসিক গ্রন্থ। এতে তিনি জাতপাতের তীব্র সমালোচনা করেছেন।'
  },
  'doc-castes-in-india': {
    title: 'ভারতে জাতিপ্রথা: তাদের প্রক্রিয়া, উৎস ও বিকাশ',
    desc: '১৯১৬ সালে কলম্বিয়া বিশ্ববিদ্যালয়ে নৃতত্ত্ব সেমিনারে উপস্থাপিত ডঃ আম্বেদকরের প্রথম ঐতিহাসিক গবেষণা পত্র।'
  },
  'doc-problem-of-rupee': {
    title: 'টাকার সমস্যা: এর উৎপত্তি ও সমাধান',
    desc: '১৯২৩ সালে লন্ডন স্কুল অফ ইকোনমিক্স (LSE) এ উপস্থাপিত ডঃ আম্বেদকরের বিখ্যাত ডক্টরেট থিসিস।'
  },
  'doc-who-were-shudras': {
    title: 'শূদ্র কারা ছিল?',
    desc: 'মহাত্মা জ্যোতিরাও ফুলে-র স্মৃতির উদ্দেশ্যে উৎসর্গীকৃত ঐতিহাসিক গবেষণা গ্রন্থ।'
  },
  'doc-states-and-minorities': {
    title: 'রাজ্য ও সংখ্যালঘু',
    desc: '১৯৪৭ সালে অল ইন্ডিয়া সিডিউল্ড কাস্টস ফেডারেশন পক্ষ থেকে গণপরিষদে জমা দেওয়া ভারতীয় সংবিধানের খসড়া।'
  },
  'doc-buddha-and-his-dhamma': {
    title: 'ভগবান বুদ্ধ ও তাঁর ধর্ম',
    desc: 'ডঃ বি. আর. আম্বেদকরের বৌদ্ধ দর্শন ও নৈতিকতার ওপর রচিত মহৎ শেষ গ্রন্থ।'
  },
  'doc-constituent-assembly-debates': {
    title: 'গণপরিষদের বক্তৃতা ও বিতর্ক (১৯৪৬-১৯৫০)',
    desc: 'ভারতীয় সংবিধানের খসড়া কমিটির সভাপতি হিসেবে ডঃ আম্বেদকরের ঐতিহাসিক বক্তৃতা।'
  },
  'photo-ambedkar-portrait-1935': {
    title: 'ডঃ বি. আর. আম্বেদকরের আলোকচিত্র (১৯৩৫)',
    desc: '১৯৩৫ সালে বোম্বেতে তোলা ডঃ বি. আর. আম্বেদকরের ঐতিহাসিক আলোকচিত্র।'
  },
  'photo-constitution-drafting-1949': {
    title: 'সংবিধান খসড়া হস্তান্তরের ঐতিহাসিক ছবি (১৯৪৯)',
    desc: 'ডঃ বি. আর. আম্বেদকর ভারতীয় সংবিধানের চূড়ান্ত খসড়া হস্তান্তর করছেন।'
  },
  'photo-mahad-satyagraha-1927': {
    title: 'মাদ সত্যগ্রহের ঐতিহাসিক জনসভা (১৯২৭)',
    desc: 'মাদ শহরে চৌদার পুকুরের জল অধিকারের দাবিতে ডঃ আম্বেদকরের জনসভা।'
  }
};

const TAMIL_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'doc-annihilation-caste': {
    title: 'சாதி ஒழிப்பு',
    desc: 'சாதி ஒழிப்பு என்பது 1936 இல் டாக்டர் பி. ஆர். அம்பேத்கர் அவர்களால் எழுதப்பட்ட வரலாற்றுச் சிறப்புமிக்க நூலாகும். சாதிய அமைப்பை வேரோடு அழிப்பதற்கான வழிகளை இதில் ஆராய்ந்துள்ளார்.'
  },
  'doc-castes-in-india': {
    title: 'இந்தியாவில் சாதிகள்: அவற்றின் பொறிமுறை, தோற்றம் மற்றும் வளர்ச்சி',
    desc: '1916 இல் கொலம்பியா பல்கலைக்கழகத்தில் டாக்டர் அம்பேத்கர் சமர்ப்பித்த வரலாற்று சிறப்புமிக்க முதல் ஆய்வறிக்கை.'
  },
  'doc-problem-of-rupee': {
    title: 'ரூபாயின் சிக்கல்: அதன் தோற்றமும் தீர்வும்',
    desc: '1923 இல் லண்டன் பொருளாதாரப் பள்ளியில் (LSE) டாக்டர் அம்பேத்கர் சமர்ப்பித்த முனைவர் பட்ட ஆய்வேடு.'
  },
  'doc-who-were-shudras': {
    title: 'சூத்திரர்கள் யார்?',
    desc: 'மகாத்மா ஜோதிராவ் பூலே நினைவுக்கு அர்ப்பணிக்கப்பட்ட வரலாற்று ஆய்வு நூல்.'
  },
  'doc-states-and-minorities': {
    title: 'மாநிலங்களும் சிறுபான்மையினரும்',
    desc: '1947 இல் இந்திய அரசியலமைப்பு நிர்ணய சபையில் சமர்ப்பிக்கப்பட்ட வரலாற்று வரைவு ஆவணம்.'
  },
  'doc-buddha-and-his-dhamma': {
    title: 'புத்தரும் அவர்தம் தம்மமும்',
    desc: 'டாக்டர் பி. ஆர். அம்பேத்கரின் பௌத்த தத்துவம் பற்றிய இறுதிப் பெரும் படைப்பு.'
  },
  'doc-constituent-assembly-debates': {
    title: 'அரசியலமைப்பு சபையில் டாக்டர் அம்பேத்கரின் உரைகள் (1949)',
    desc: '1949 நவம்பர் 26 அன்று இந்திய அரசியலமைப்பு சாசனம் ஏற்றுக்கொள்ளப்பட்டபோது ஆற்றிய உரை.'
  },
  'photo-ambedkar-portrait-1935': {
    title: 'டாக்டர் பி. ஆர். அம்பேத்கரின் அரிய புகைப்படம் (1935)',
    desc: '1935 இல் பம்பாயில் எடுக்கப்பட்ட டாக்டர் அம்பேத்கரின் வரலாற்றுப் புகைப்படம்.'
  },
  'photo-constitution-drafting-1949': {
    title: 'அரசியலமைப்பு வரைவு சமர்ப்பிக்கும் புகைப்படம் (1949)',
    desc: 'டாக்டர் அம்பேத்கர் இந்திய அரசியலமைப்பின் இறுதி வரைவை சமர்ப்பித்த காட்சி.'
  },
  'photo-mahad-satyagraha-1927': {
    title: 'மகத் சத்தியாகிரகப் போராட்டம் (1927)',
    desc: 'மகத் சௌதார் குளத்தில் குடிநீர் உரிமை போராட்டம் குறித்த வரலாற்றுப் புகைப்படம்.'
  }
};

export function performSearch(options: SearchOptions): SearchResultItem[] {
  const { query, collectionType, language = 'All', yearFrom, yearTo, sortBy = 'relevance' } = options;
  const q = (query || '').toLowerCase().trim();

  const allItems: SearchResultItem[] = [];

  // 1. Process Documents (Books, Writings, Documents, Photographs)
  SEED_DOCUMENTS.forEach(doc => {
    let score = 0;
    const titleMatch = doc.title.toLowerCase().includes(q) || (doc.marathiTitle && doc.marathiTitle.toLowerCase().includes(q));
    const descMatch = doc.description.toLowerCase().includes(q) || (doc.marathiDescription && doc.marathiDescription.toLowerCase().includes(q));

    if (!q) {
      score = 1.0;
    } else {
      if (titleMatch) score += 0.5;
      if (descMatch) score += 0.3;
    }

    // Determine displayed title and description based on selected language
    let displayTitle = doc.title;
    let displayDesc = doc.description;

    if (language === 'Marathi' && doc.marathiTitle) {
      displayTitle = doc.marathiTitle.replace(/\s*\([^)]*\)/g, '');
      displayDesc = doc.marathiDescription || doc.description;
    } else if (language === 'Hindi' && doc.hindiTitle) {
      displayTitle = doc.hindiTitle.replace(/\s*\([^)]*\)/g, '');
      displayDesc = doc.hindiDescription || doc.description;
    } else if (language === 'Bengali') {
      const bn = BENGALI_TRANSLATIONS[doc.id];
      if (bn) {
        displayTitle = bn.title;
        displayDesc = bn.desc;
      } else if (doc.bengaliTitle) {
        displayTitle = doc.bengaliTitle;
        displayDesc = doc.bengaliDescription || doc.description;
      }
    } else if (language === 'Tamil') {
      const ta = TAMIL_TRANSLATIONS[doc.id];
      if (ta) {
        displayTitle = ta.title;
        displayDesc = ta.desc;
      } else if (doc.tamilTitle) {
        displayTitle = doc.tamilTitle;
        displayDesc = doc.tamilDescription || doc.description;
      }
    }

    if (score > 0 || !q) {
      allItems.push({
        id: doc.id,
        title: displayTitle,
        slug: doc.slug,
        description: displayDesc,
        type: doc.type,
        year: doc.year,
        volume: doc.volume,
        language: doc.language,
        sourceName: doc.sourceName,
        coverImage: doc.coverImage,
        pdfUrl: doc.pdfUrl,
        sourceUrl: doc.sourceUrl,
        score,
        matchSnippet: displayDesc.substring(0, 140) + '...',
        targetUrl: `/documents/${doc.id}`
      });
    }
  });

  // 2. Process Audios
  SEED_AUDIO.forEach(audio => {
    let score = 0;
    const titleMatch = audio.title.toLowerCase().includes(q) || (audio.marathiTitle && audio.marathiTitle.toLowerCase().includes(q));

    if (!q) {
      score = 1.0;
    } else {
      if (titleMatch) score += 0.5;
    }

    let displayTitle = audio.title;
    if (language === 'Marathi' && audio.marathiTitle) {
      displayTitle = audio.marathiTitle;
    } else if (language === 'Hindi' && audio.hindiTitle) {
      displayTitle = audio.hindiTitle;
    } else if (language === 'Bengali' && audio.bengaliTitle) {
      displayTitle = audio.bengaliTitle;
    } else if (language === 'Tamil' && audio.tamilTitle) {
      displayTitle = audio.tamilTitle;
    }

    if (score > 0 || !q) {
      allItems.push({
        id: audio.id,
        title: displayTitle,
        slug: audio.id,
        description: `Authentic Recording: ${displayTitle} delivered at ${audio.location} (${audio.date})`,
        type: 'AUDIO',
        year: audio.year,
        volume: 'Audio Archive',
        language: audio.language,
        sourceName: audio.source,
        coverImage: audio.thumbnailUrl,
        score,
        matchSnippet: `Duration: ${audio.duration} • Speaker: ${audio.speaker}`,
        targetUrl: `/audio/${audio.id}`
      });
    }
  });

  // 3. Process Videos
  SEED_VIDEO.forEach(video => {
    let score = 0;
    const titleMatch = video.title.toLowerCase().includes(q) || (video.marathiTitle && video.marathiTitle.toLowerCase().includes(q));

    if (!q) {
      score = 1.0;
    } else {
      if (titleMatch) score += 0.5;
    }

    let displayTitle = video.title;
    let displayDesc = video.description;
    if (language === 'Marathi' && video.marathiTitle) {
      displayTitle = video.marathiTitle;
      displayDesc = video.marathiDescription || video.description;
    } else if (language === 'Hindi' && video.hindiTitle) {
      displayTitle = video.hindiTitle;
      displayDesc = video.hindiDescription || video.description;
    }

    if (score > 0 || !q) {
      allItems.push({
        id: video.id,
        title: displayTitle,
        slug: video.id,
        description: displayDesc,
        type: 'VIDEO',
        year: video.year,
        volume: 'Video Archive',
        language: 'English',
        sourceName: 'Archival Film Preservation',
        coverImage: video.thumbnailUrl,
        score,
        matchSnippet: `Duration: ${video.duration} • Archival Film`,
        targetUrl: `/video/${video.id}`
      });
    }
  });

  // Filter strictly by selected Collection Type / Horizontal Tab
  let filtered = allItems.filter(item => {
    if (collectionType && collectionType !== 'ALL' && collectionType !== 'All Collections' && collectionType !== 'All') {
      const typeUpper = item.type.toUpperCase();
      const colUpper = collectionType.toUpperCase();

      if (colUpper.includes('PHOTOGRAPH')) {
        return typeUpper === 'PHOTOGRAPH';
      }
      if (colUpper.includes('WRITING') || colUpper.includes('BOOK')) {
        return typeUpper === 'WRITING' || typeUpper === 'BOOK';
      }
      if (colUpper.includes('SPEECH')) {
        return typeUpper === 'SPEECH';
      }
      if (colUpper.includes('DOCUMENT') || colUpper.includes('LETTER')) {
        return typeUpper === 'DOCUMENT' || typeUpper === 'LETTER';
      }
      if (colUpper.includes('AUDIO')) {
        return typeUpper === 'AUDIO' || typeUpper === 'BOOK' || typeUpper === 'WRITING' || typeUpper === 'SPEECH';
      }
      if (colUpper.includes('VIDEO')) {
        return typeUpper === 'VIDEO';
      }
    }

    // Strict language section filter
    if (language && language !== 'All') {
      const itemLang = item.language || '';
      if (language === 'English' && !itemLang.includes('English')) return false;
      if (language === 'Marathi' && !itemLang.includes('Marathi')) return false;
      if (language === 'Hindi' && !itemLang.includes('Hindi')) return false;
      if (language === 'Bengali' && !itemLang.includes('Bengali')) return false;
      if (language === 'Tamil' && !itemLang.includes('Tamil')) return false;
    }

    if (yearFrom && item.year && item.year < yearFrom) return false;
    if (yearTo && item.year && item.year > yearTo) return false;
    return true;
  });

  // Sorting
  if (sortBy === 'relevance') {
    filtered.sort((a, b) => b.score - a.score);
  } else if (sortBy === 'year_asc') {
    filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
  } else if (sortBy === 'year_desc') {
    filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  return filtered;
}

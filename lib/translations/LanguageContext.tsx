'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'English' | 'Marathi' | 'Hindi' | 'Bengali' | 'Tamil';

interface TranslationDictionary {
  [key: string]: {
    [lang in SupportedLanguage]: string;
  };
}

// Numeral maps
const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function formatLanguageNumber(val: string | number | undefined | null, lang: SupportedLanguage): string {
  if (val === undefined || val === null) return '';
  const str = String(val);

  if (lang === 'Marathi' || lang === 'Hindi') {
    return str.replace(/[0-9]/g, (digit) => marathiDigits[parseInt(digit, 10)]);
  }

  return str;
}

export const dictionary: TranslationDictionary = {
  // Navigation Bar
  navHome: { English: 'Home', Marathi: 'मुख्य पृष्ठ', Hindi: 'मुख्य पृष्ठ', Bengali: 'মূল পাতা', Tamil: 'முகப்பு' },
  navExplore: { English: 'Explore', Marathi: 'शोधा', Hindi: 'खोजें', Bengali: 'অনুসন্ধান', Tamil: 'ஆராய்க' },
  navTimeline: { English: 'Timeline', Marathi: 'कालक्रम', Hindi: 'समयरेखा', Bengali: 'সময়রেখা', Tamil: 'காலவரிசை' },
  navCollections: { English: 'Collections', Marathi: 'संग्रह', Hindi: 'संग्रह', Bengali: 'সংগ্রহ', Tamil: 'சேகரிப்புகள்' },
  navAudio: { English: 'Audio', Marathi: 'ऑडिओ भाषणे', Hindi: 'ऑडियो भाषण', Bengali: 'অডিও বক্তৃতা', Tamil: 'ஒலிப்பதிவு' },
  navVideo: { English: 'Video', Marathi: 'व्हिडिओ संग्रह', Hindi: 'वीडियो आर्काइव', Bengali: 'ভিডিও আর্কাইভ', Tamil: 'காணொளி' },
  navAskSanchay: { English: 'Ask Sanchay', Marathi: 'संचयला विचारा', Hindi: 'संचय से पूछें', Bengali: 'সঞ্চয়কে জিজ্ঞাসা করুন', Tamil: 'சஞ்சயிடம் கேட்க' },
  staffLogin: { English: 'Staff Login', Marathi: 'कर्मचारी लॉगिन', Hindi: 'कर्मचारी लॉगिन', Bengali: 'স্টাফ লগইন', Tamil: 'ஊழியர் உள்நுழைவு' },

  // Hero Section
  heroSubtitle: {
    English: 'Explore the Life, Work & Legacy of Dr. B. R. Ambedkar',
    Marathi: 'डॉ. बी. आर. आंबेडकर यांचे जीवन, कार्य आणि वारसा शोधा',
    Hindi: 'डॉ. बी. आर. आंबेडकर के जीवन, कार्य और विरासत की खोज करें',
    Bengali: 'ডঃ বি আর আম্বেদকরের জীবন, কাজ এবং ঐতিহ্য অন্বেষণ করুন',
    Tamil: 'டாக்டர் பி.ஆர்.அம்பேத்கரின் வாழ்க்கை, பணி மற்றும் பாரம்பரியத்தை ஆராயுங்கள்',
  },
  heroDescription: {
    English: 'Digital Museum, Archive and Audio-Visual Knowledge Platform with Authentic Writings, Speeches, Historical Documents and Rare Collections.',
    Marathi: 'प्रामाणिक लेखन, भाषणे, ऐतिहासिक दस्तऐवज आणि दुर्मिळ संग्रहांसह डिजिटल संग्रहालय, दस्तऐवज संग्रह आणि ऑडिओ-व्हिज्युअल ज्ञान मंच.',
    Hindi: 'प्रमाणिक लेखनों, भाषणों, ऐतिहासिक दस्तावेजों और दुर्लभ संग्रहों के साथ डिजिटल संग्रहालय, पुरालेख और दृश्य-श्रव्य ज्ञान मंच।',
    Bengali: 'প্রামাণিক লেখা, বক্তৃতা, ঐতিহাসিক নথি এবং বিরল সংগ্রহ সহ ডিজিটাল সংগ্রহশালা ও অডিও-ভিজ্যুয়াল জ্ঞান প্ল্যাটফর্ম।',
    Tamil: 'நம்பகமான எழுத்துக்கள், உரைகள், வரலாற்று ஆவணங்கள் கொண்ட டிஜிட்டல் அருங்காட்சியகம் மற்றும் அறிவுத் தளம்.',
  },
  searchPlaceholder: {
    English: 'Search writings, speeches, documents, photographs...',
    Marathi: 'लेखन, भाषणे, दस्तऐवज, छायाचित्रे शोधा...',
    Hindi: 'लेखन, भाषण, दस्तावेज, तस्वीरें खोजें...',
    Bengali: 'লেখা, বক্তৃতা, নথি, ছবি অনুসন্ধান করুন...',
    Tamil: 'எழுத்துக்கள், உரைகள், ஆவணங்கள், புகைப்படங்களைத் தேடுங்கள்...',
  },
  heroQuote: {
    English: '"Cultivation of mind should be the ultimate aim of human existence."',
    Marathi: '"बुद्धीची मशागत हेच मानवी अस्तित्वाचे अंतिम ध्येय असले पाहिजे."',
    Hindi: '"मन की खेती ही मानव अस्तित्व का अंतिम लक्ष्य होना चाहिए।"',
    Bengali: '"মনের বিকাশই মানব অস্তিত্বের চূড়ান্ত লক্ষ্য হওয়া উচিত।"',
    Tamil: '"மனதின் மேம்பாடே மனித வாழ்வின் இறுதி இலக்காக இருக்க வேண்டும்."',
  },

  // Feature Tiles
  tileExplore: { English: 'Explore Collections', Marathi: 'संग्रह शोधा', Hindi: 'संग्रह खोजें', Bengali: 'সংগ্রহ অন্বেষণ করুন', Tamil: 'சேகரிப்புகளை ஆராய்க' },
  tileTimeline: { English: 'Interactive Timeline', Marathi: 'परस्परसंवादी कालक्रम', Hindi: 'इंटेरेक्टिव समयरेखा', Bengali: 'ইন্টারেক্টিভ সময়রেখা', Tamil: 'காலவரிசை வரைபடம்' },
  tileAudio: { English: 'Audio Archive', Marathi: 'ऑडिओ संग्रह', Hindi: 'ऑडियो आर्काइव', Bengali: 'অডিও আর্কাইভ', Tamil: 'ஒலிப்பகாப்பகம்' },
  tileVideo: { English: 'Video Archive', Marathi: 'व्हिडिओ संग्रह', Hindi: 'वीडियो आर्काइव', Bengali: 'ভিডিও আর্কাইভ', Tamil: 'காணொளிப்பகாப்பகம்' },
  tileAsk: { English: 'Ask Sanchay AI', Marathi: 'संचय AI ला विचारा', Hindi: 'संचय एआई से पूछें', Bengali: 'সঞ্চয় এআইকে জিজ্ঞাসা করুন', Tamil: 'சஞ்சய் AI இடம் கேட்க' },
  tileRecommend: { English: 'Recommendations', Marathi: 'शिफारसी', Hindi: 'सिफारिशें', Bengali: 'সুপারিশসমূহ', Tamil: 'பரிந்துரைகள்' },

  // Featured Collections Heading
  featuredHeading: { English: 'Featured Archival Collections', Marathi: 'वैशिष्ट्यीकृत दस्तऐवज संग्रह', Hindi: 'प्रमुख पुरालेख संग्रह', Bengali: 'বিশেষ সংগ্রহসমূহ', Tamil: 'சிறப்புச் சேகரிப்புகள்' },
  featuredSubheading: {
    English: 'Grounded in Dr. Babasaheb Ambedkar Writings and Speeches official archives.',
    Marathi: 'डॉ. बाबासाहेब आंबेडकर लेखन आणि भाषणे अधिकृत संग्रहावर आधारित.',
    Hindi: 'डॉ. बाबासाहेब आंबेडकर लेखन और भाषण आधिकारिक अभिलेखागार पर आधारित।',
    Bengali: 'ডঃ বাবাসাহেব আম্বেদকর লেখা ও বক্তৃতা সরকারি আর্কাইভ থেকে নেওয়া।',
    Tamil: 'டாக்டர் பாபாசாகேப் அம்பேத்கர் எழுத்துக்கள் மற்றும் உரைகள் அதிகாரப்பூர்வ ஆவண காப்பகத்தின் அடிப்படையில்.',
  },

  // Timeline Page
  timelineTitle: {
    English: 'Life and Milestones of Dr. B. R. Ambedkar',
    Marathi: 'डॉ. बी. आर. आंबेडकर यांचे जीवन आणि महत्त्वाचे टप्पे',
    Hindi: 'डॉ. बी. आर. आंबेडकर के जीवन और महत्वपूर्ण मील के पत्थर',
    Bengali: 'ডঃ বি আর আম্বেদকরের জীবন এবং গুরুত্বপূর্ণ মাইলফলক',
    Tamil: 'டாக்டர் பி.ஆர்.அம்பேத்கரின் வாழ்க்கை மற்றும் மைல்கற்கள்',
  },
  timelineSubtitle: {
    English: 'Explore important events, works, speeches and movements in a chronological timeline grounded in verified historical records.',
    Marathi: 'अधिकृत ऐतिहासिक नोंदींवर आधारित कालानुक्रमे महत्त्वाच्या घटना, कार्ये, भाषणे आणि चळवळी शोधा.',
    Hindi: 'सत्यापित ऐतिहासिक अभिलेखों पर आधारित कालानुक्रमिक समयरेखा में महत्वपूर्ण घटनाओं, कार्यों, भाषणों और आंदोलनों की खोज करें।',
    Bengali: 'যাচাইকৃত ঐতিহাসিক রেকর্ড নির্ভর সময়রেখা অন্বেষণ করুন।',
    Tamil: 'வரலாற்றுப் பதிவுகளின் அடிப்படையில் முக்கியமான நிகழ்வுகளை ஆராயுங்கள்.',
  },

  // Timeline Categories
  catAll: { English: 'All', Marathi: 'सर्व', Hindi: 'सभी', Bengali: 'সব', Tamil: 'அனைத்தும்' },
  catEarlyLife: { English: 'Early Life', Marathi: 'प्रारंभिक जीवन', Hindi: 'प्रारंभिक जीवन', Bengali: 'প্রাথমিক জীবন', Tamil: 'ஆரம்ப வாழ்க்கை' },
  catEducation: { English: 'Education', Marathi: 'शिक्षण', Hindi: 'शिक्षा', Bengali: 'শিক্ষা', Tamil: 'கல்வி' },
  catSocialReform: { English: 'Social Reform', Marathi: 'सामाजिक सुधारणा', Hindi: 'सामाजिक सुधार', Bengali: 'সমাজ সংস্কার', Tamil: 'சமூக சீர்திருத்தம்' },
  catPoliticalCareer: { English: 'Political Career', Marathi: 'राजकीय कारकीर्द', Hindi: 'राजनीतिक करियर', Bengali: 'রাজনৈতিক জীবন', Tamil: 'அரசியல் வாழ்க்கை' },
  catConstitution: { English: 'Constitution', Marathi: 'संविधान', Hindi: 'संविधान', Bengali: 'সংবিধান', Tamil: 'அரசியலமைப்பு' },
  catWritings: { English: 'Writings', Marathi: 'लेखन', Hindi: 'लेखन', Bengali: 'লেখালেখি', Tamil: 'எழுத்துக்கள்' },
  catLaterYears: { English: 'Later Years', Marathi: 'उत्तरार्ध', Hindi: 'उत्तरार्ध', Bengali: 'পরবর্তী বছরগুলো', Tamil: 'பிற்காலம்' },

  // Explore Page
  exploreTitle: { English: 'Explore Archival Collections', Marathi: 'संग्रह शोधा', Hindi: 'संग्रह खोजें', Bengali: 'সংগ্রহ অন্বেষণ করুন', Tamil: 'சேகரிப்புகளை ஆராய்க' },
  exploreSubtitle: {
    English: "Search and browse Dr. B. R. Ambedkar's writings, speeches, documents, audio, video, and archival photographs.",
    Marathi: "डॉ. बी. आर. आंबेडकर यांचे लेखन, भाषणे, दस्तऐवज, ऑडिओ, व्हिडिओ आणि दुर्मिळ छायाचित्रे शोधा आणि पाहा.",
    Hindi: "डॉ. बी. आर. आंबेडकर के लेखन, भाषण, दस्तावेज, ऑडियो, वीडियो और पुरालेख तस्वीरें खोजें और देखें।",
    Bengali: "ডঃ বি আর আম্বেদকরের লেখা, বক্তৃতা, নথি, অডিও, ভিডিও এবং আর্কাইভ ছবি অনুসন্ধান ও ব্রাউজ করুন।",
    Tamil: "டாக்டர் பி.ஆர்.அம்பேத்கரின் எழுத்துக்கள், உரைகள், ஆவணங்கள், ஒலி, காணொளி மற்றும் புகைப்படங்களை தேடிக் கண்டறியுங்கள்."
  },
  filterBy: { English: 'Filter By', Marathi: 'फिल्टर करा', Hindi: 'फ़िल्टर करें', Bengali: 'ফিল্টার করুন', Tamil: 'வடிகட்டு' },
  resetFilters: { English: 'Reset', Marathi: 'रीसेट', Hindi: 'रीसेट', Bengali: 'রিসেট', Tamil: 'மீட்டமை' },
  sortByLabel: { English: 'Sort by:', Marathi: 'क्रमवारी:', Hindi: 'क्रमानुक्रम:', Bengali: 'ক্রমানুসারে:', Tamil: 'வரிசைப்படுத்து:' },
  showingVerifiedItems: {
    English: 'verified archival items',
    Marathi: 'सत्यापित दस्तऐवज दर्शवित आहे',
    Hindi: 'सत्यापित दस्तावेज़ दिखाए जा रहे हैं',
    Bengali: 'যাচাইকৃত রেকর্ডসমূহ প্রদর্শিত হচ্ছে',
    Tamil: 'சரிபார்க்கப்பட்ட ஆவணங்கள் காட்டப்படுகின்றன'
  },
  showingLabel: { English: 'Showing', Marathi: 'दर्शवित आहे', Hindi: 'दिखाए जा रहे हैं', Bengali: 'প্রদর্শিত হচ্ছে', Tamil: 'காட்டப்படுகிறது' },
  languageLabel: { English: 'Language', Marathi: 'भाषा', Hindi: 'भाषा', Bengali: 'ভাষা', Tamil: 'மொழி' },
  filterLabel: { English: 'Filter', Marathi: 'फिल्टर', Hindi: 'फ़िल्टर', Bengali: 'ফিল্টার', Tamil: 'வடிகட்டி' },
  yearRangeLabel: { English: 'Year Range', Marathi: 'वर्ष श्रेणी', Hindi: 'वर्ष सीमा', Bengali: 'বছর পরিসীমা', Tamil: 'ஆண்டு வரம்பு' },
  fromYear: { English: 'From (e.g. 1916)', Marathi: 'पासून (उदा. १९१६)', Hindi: 'से (जैसे 1916)', Bengali: 'থেকে (যেমন ১৯১৬)', Tamil: 'இருந்து (எ.கா. 1916)' },
  toYear: { English: 'To (e.g. 1956)', Marathi: 'पर्यंत (उदा. १९५६)', Hindi: 'तक (जैसे 1956)', Bengali: 'পর্যন্ত (যেমন ১৯৫৬)', Tamil: 'வரை (எ.கா. 1956)' },

  // Sidebar Collections & Filter Tabs
  colAll: { English: 'All Collections', Marathi: 'सर्व संग्रह', Hindi: 'सभी संग्रह', Bengali: 'সমস্ত সংগ্রহ', Tamil: 'அனைத்து சேகரிப்புகள்' },
  colWritings: { English: 'Writings & Books', Marathi: 'लेखन आणि पुस्तके', Hindi: 'लेखन और पुस्तकें', Bengali: 'লেখা ও বইপত্র', Tamil: 'எழுத்துக்கள் மற்றும் புத்தகங்கள்' },
  colSpeeches: { English: 'Speeches', Marathi: 'भाषणे', Hindi: 'भाषण', Bengali: 'বক্তৃতা', Tamil: 'உரைகள்' },
  colLetters: { English: 'Letters & Documents', Marathi: 'पत्रे आणि दस्तऐवज', Hindi: 'पत्र और दस्तावेज', Bengali: 'চিঠিপত্র ও নথি', Tamil: 'கடிதங்கள் மற்றும் ஆவணங்கள்' },
  colPhotographs: { English: 'Photographs', Marathi: 'छायाचित्रे', Hindi: 'तस्वीरें', Bengali: 'ছবি', Tamil: 'புகைப்படங்கள்' },
  colBelongings: { English: 'Personal Belongings', Marathi: 'वैयक्तिक वस्तू', Hindi: 'व्यक्तिगत वस्तुएं', Bengali: 'ব্যক্তিগত বস্তুসমূহ', Tamil: 'தனிப்பட்ட பொருட்கள்' },
  colAudio: { English: 'Audio', Marathi: 'ऑडिओ भाषणे', Hindi: 'ऑडियो भाषण', Bengali: 'অডিও', Tamil: 'ஒலி' },
  colVideo: { English: 'Video', Marathi: 'व्हिडिओ संग्रह', Hindi: 'वीडियो संग्रह', Bengali: 'ভিডিও', Tamil: 'காணொளி' },
  colOther: { English: 'Other Materials', Marathi: 'इतर साहित्य', Hindi: 'अन्य सामग्री', Bengali: 'অন্যান্য সামগ্রী', Tamil: 'இதரப் பொருட்கள்' },

  tabAll: { English: 'All', Marathi: 'सर्व', Hindi: 'सभी', Bengali: 'সব', Tamil: 'அனைத்தும்' },
  tabWritings: { English: 'Writings', Marathi: 'लेखन', Hindi: 'लेखन', Bengali: 'লেখা', Tamil: 'எழுத்துக்கள்' },
  tabSpeeches: { English: 'Speeches', Marathi: 'भाषणे', Hindi: 'भाषण', Bengali: 'বক্তৃতা', Tamil: 'உரைகள்' },
  tabDocuments: { English: 'Documents', Marathi: 'दस्तऐवज', Hindi: 'दस्तावेज़', Bengali: 'নথি', Tamil: 'ஆவணங்கள்' },
  tabPhotographs: { English: 'Photographs', Marathi: 'छायाचित्रे', Hindi: 'तस्वीरें', Bengali: 'ছবি', Tamil: 'புகைப்படங்கள்' },
  tabAudio: { English: 'Audio', Marathi: 'ऑडिओ', Hindi: 'ऑडियो', Bengali: 'অডিও', Tamil: 'ஒலி' },
  tabVideo: { English: 'Video', Marathi: 'व्हिडिओ', Hindi: 'वीडियो', Bengali: 'ভিডিও', Tamil: 'காணொளி' },

  // Document Viewer Labels
  yearOfPublication: { English: 'Year of Publication', Marathi: 'प्रकाशन वर्ष', Hindi: 'प्रकाशन वर्ष', Bengali: 'প্রকাশনার বছর', Tamil: 'வெளியீட்டு ஆண்டு' },
  bawsVolume: { English: 'Archival Volume', Marathi: 'संग्रह खंड', Hindi: 'अभिलेखागार खंड', Bengali: 'আর্কাইভ ভলিউম', Tamil: 'தொகுதி' },
  pageCountLabel: { English: 'Page Count', Marathi: 'पृष्ठ संख्या', Hindi: 'पृष्ठ संख्या', Bengali: 'পৃষ্ঠা সংখ্যা', Tamil: 'பக்க எண்ணிக்கை' },
  pagesSuffix: { English: 'Pages', Marathi: 'पाने', Hindi: 'पृष्ठ', Bengali: 'পৃষ্ঠা', Tamil: 'பக்கங்கள்' },
  readOnline: { English: 'Read Online', Marathi: 'ऑनलाइन वाचा', Hindi: 'ऑनलाइन पढ़ें', Bengali: 'অনলাইনে পড়ুন', Tamil: 'ஆன்லைனில் படிக்கவும்' },
  listenTTS: { English: 'Listen Audio / TTS', Marathi: 'ऑडिओ ऐका / टीटीएस', Hindi: 'ऑडियो सुनें / टीटीएस', Bengali: 'অডিও শুনুন', Tamil: 'ஆடியோ கேளுங்கள்' },
  downloadPDF: { English: 'Download PDF', Marathi: 'पीडीएफ डाउनलोड करा', Hindi: 'पीडीएफ डाउनलोड करें', Bengali: 'পিডিএফ ডাউনলোড করুন', Tamil: 'பிடிஎஃப் பதிவிறக்கவும்' },
  originalScanPage: { English: 'Original Scan Page', Marathi: 'मूळ स्कॅन पृष्ठ', Hindi: 'मूल स्कैन पृष्ठ', Bengali: 'মূল স্ক্যান পৃষ্ঠা', Tamil: 'அசல் ஸ்கேன் பக்கம்' },
  ocrExtractedText: { English: 'OCR Extracted Text', Marathi: 'ओसीआरद्वारे काढलेला मजकूर', Hindi: 'ओसीआर द्वारा निकाला गया पाठ', Bengali: 'ওসিআর দ্বারা নিষ্কাশিত পাঠ্য', Tamil: 'ஓசிஆர் பெறப்பட்ட உரை' },
  confidenceVerified: { English: '98.4% Verified', Marathi: '९८.४% सत्यापित', Hindi: '९८.४% सत्यापित', Bengali: '৯৮.৪% প্রমাণিত', Tamil: '98.4% சரிபார்க்கப்பட்டது' },
  displayMode: { English: 'Display Mode:', Marathi: 'प्रदर्शित मोड:', Hindi: 'प्रदर्शन मोड:', Bengali: 'ডিসপ্লে মোড:', Tamil: 'காட்சி பயன்முறை:' },
  tabOverview: { English: 'Overview', Marathi: 'आढावा', Hindi: 'अवलोकन', Bengali: 'সংক্ষিপ্ত বিবরণ', Tamil: 'மேலோட்டம்' },
  tabTOC: { English: 'Table of Contents', Marathi: 'अनुक्रमणिका', Hindi: 'विषय सूची', Bengali: 'সূচিপত্র', Tamil: 'பொருளடக்கம்' },
  tabOCR: { English: 'Original Scan & OCR Text', Marathi: 'मूळ स्कॅन व OCR मजकूर', Hindi: 'मूल स्कैन और ओसीआर पाठ', Bengali: 'মূল স্ক্যান ও ওসিআর পাঠ্য', Tamil: 'அசல் ஸ்கேன் & ஓசிஆர் உரை' },
  tabCitations: { English: 'Archival Citations', Marathi: 'संग्रहालय संदर्भ', Hindi: 'पुरालेख उद्धरण', Bengali: 'সংগ্রহশালার উদ্ধৃতি', Tamil: 'ஆவண சான்றுகள்' },
  archivalSummary: { English: 'Archival Summary', Marathi: 'अभिलेख सारांश', Hindi: 'पुरालेख सारांश', Bengali: 'আর্কাইভ সারসংক্ষেপ', Tamil: 'ஆவண சுருக்கம்' },
  howToCite: { English: 'How to cite this archival record:', Marathi: 'या दस्तऐवजाचा संदर्भ कसा द्यावा:', Hindi: 'इस पुरालेख का उद्धरण कैसे दें:', Bengali: 'কীভাবে এই রেকর্ডটি উদ্ধৃত করবেন:', Tamil: 'இந்த ஆவணத்தை எப்படி குறிப்பிடுவது:' },
  facsimileSuffix: { English: 'Facsimile', Marathi: 'प्रतिकृती', Hindi: 'प्रतिलिपि', Bengali: 'অনুকৃতি', Tamil: 'நகல்' },
  pagePrefix: { English: 'Page', Marathi: 'पृष्ठ', Hindi: 'पृष्ठ', Bengali: 'পৃষ্ঠা', Tamil: 'பக்கம்' },

  // Type Badges
  typeBook: { English: 'BOOK', Marathi: 'पुस्तक', Hindi: 'पुस्तक', Bengali: 'বই', Tamil: 'புத்தகம்' },
  typeWriting: { English: 'WRITING', Marathi: 'लेखन', Hindi: 'लेखन', Bengali: 'লেখা', Tamil: 'எழுத்து' },
  typeSpeech: { English: 'SPEECH', Marathi: 'भाषण', Hindi: 'भाषण', Bengali: 'বক্তৃতা', Tamil: 'பேச்சு' },
  typeDocument: { English: 'DOCUMENT', Marathi: 'दस्तऐवज', Hindi: 'दस्तावेज़', Bengali: 'নথি', Tamil: 'ஆவணம்' },
  typePhotograph: { English: 'PHOTOGRAPH', Marathi: 'छायाचित्र', Hindi: 'तस्वीर', Bengali: 'ছবি', Tamil: 'புகைப்படம்' },
  typeAudio: { English: 'AUDIO', Marathi: 'ऑडिओ', Hindi: 'ऑडियो', Bengali: 'অডিও', Tamil: 'ஒலி' },
  typeVideo: { English: 'VIDEO', Marathi: 'व्हिडिओ', Hindi: 'वीडियो', Bengali: 'ভিডিও', Tamil: 'காணொளி' },

  // Buttons
  btnRead: { English: 'Read →', Marathi: 'वाचा →', Hindi: 'पढ़ें →', Bengali: 'পড়ুন →', Tamil: 'படிக்க →' },
  btnListen: { English: 'Listen →', Marathi: 'ऐका →', Hindi: 'सुनें →', Bengali: 'শুনুন →', Tamil: 'கேட்க →' },
  btnWatch: { English: 'Watch →', Marathi: 'पहा →', Hindi: 'देखें →', Bengali: 'দেখুন →', Tamil: 'பார்க்க →' },
  btnViewPhoto: { English: 'View Photo →', Marathi: 'छायाचित्र पहा →', Hindi: 'तस्वीर देखें →', Bengali: 'ছবি দেখুন →', Tamil: 'படம் பார்க்க →' },

  // Sort By Options
  sortRelevance: { English: 'Relevance', Marathi: 'प्रासंगिकता', Hindi: 'प्रासंगिकता', Bengali: 'প্রাসঙ্গিকতা', Tamil: 'பொருத்தம்' },
  sortYearDesc: { English: 'Year (Newest)', Marathi: 'वर्ष (नवीनतम)', Hindi: 'वर्ष (नवीनतम)', Bengali: 'বছর (নতুন)', Tamil: 'ஆண்டு (புதியது)' },
  sortYearAsc: { English: 'Year (Oldest)', Marathi: 'वर्ष (जुने)', Hindi: 'वर्ष (पुराना)', Bengali: 'বছর (পুরনো)', Tamil: 'ஆண்டு (பழையது)' }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  formatNumber: (val: string | number | undefined | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('English');

  useEffect(() => {
    const saved = localStorage.getItem('sanchay_language') as SupportedLanguage;
    if (saved && ['English', 'Marathi', 'Hindi', 'Bengali', 'Tamil'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('sanchay_language', lang);
  };

  const t = (key: string): string => {
    if (dictionary[key] && dictionary[key][language]) {
      return dictionary[key][language];
    }
    return dictionary[key]?.English || key;
  };

  const formatNumber = (val: string | number | undefined | null): string => {
    return formatLanguageNumber(val, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

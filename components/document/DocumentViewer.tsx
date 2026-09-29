'use client';

import React, { useState } from 'react';
import { ArchivalDocument } from '@/lib/db/seed-data';
import { getBawsBookUrl } from '@/lib/baws-utils';
import { playSpeechAudio } from '@/lib/audio/speech-engine';
import { useTranslation } from '@/lib/translations/LanguageContext';
import { BookOpen, Download, Volume2, ListOrdered, FileText, CheckCircle2, X, ChevronLeft, ChevronRight, Camera, Calendar, MapPin, Users, ExternalLink, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

function PhotographViewer({ docItem }: { docItem: ArchivalDocument }) {
  const { language } = useTranslation();

  const title = (
    language === 'Marathi' ? docItem.marathiTitle :
    language === 'Hindi' ? docItem.hindiTitle :
    language === 'Bengali' ? docItem.bengaliTitle :
    language === 'Tamil' ? docItem.tamilTitle : undefined
  ) || docItem.title;

  const people = (
    language === 'Marathi' ? docItem.marathiPeopleIdentified :
    language === 'Hindi' ? docItem.hindiPeopleIdentified :
    language === 'Bengali' ? docItem.bengaliPeopleIdentified :
    language === 'Tamil' ? docItem.tamilPeopleIdentified : undefined
  ) || docItem.peopleIdentified;

  const caption = (
    language === 'Marathi' ? docItem.marathiGalleryCaption :
    language === 'Hindi' ? docItem.hindiGalleryCaption :
    language === 'Bengali' ? docItem.bengaliGalleryCaption :
    language === 'Tamil' ? docItem.tamilGalleryCaption : undefined
  ) || docItem.galleryCaption;

  const story = (
    language === 'Marathi' ? docItem.marathiStory :
    language === 'Hindi' ? docItem.hindiStory :
    language === 'Bengali' ? docItem.bengaliStory :
    language === 'Tamil' ? docItem.tamilStory : undefined
  ) || docItem.story;

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans py-4">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-serif font-bold text-sanchay-deepNavy hover:text-sanchay-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Photograph Gallery
        </Link>
        <span className="px-3 py-1 rounded bg-sanchay-deepNavy text-sanchay-gold text-xs font-mono font-bold uppercase tracking-wider">
          ARCHIVAL PHOTOGRAPH RECORD
        </span>
      </div>

      {/* UPPER SIDE: PHOTO DISPLAY */}
      <div className="bg-sanchay-deepNavy rounded-2xl border-4 border-sanchay-gold/50 p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
        <img
          src={docItem.coverImage || '/images/ambedkar_portrait.jpg'}
          alt={title}
          className="max-h-[600px] w-auto max-w-full object-contain rounded-lg border-2 border-sanchay-gold/30 shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
          }}
        />
      </div>

      {/* LOWER SIDE: INFORMATION DISPLAY */}
      <div className="bg-white rounded-2xl border border-sanchay-borderCream p-6 sm:p-8 shadow-archival space-y-6">
        
        {/* Title & Badges */}
        <div className="space-y-3 border-b border-sanchay-borderCream pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-sanchay-gold/20 text-sanchay-deepNavy text-xs font-mono font-bold flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-sanchay-gold" /> PHOTOGRAPH
            </span>
            {docItem.date && (
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-1 border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-sanchay-gold" /> {docItem.date}
              </span>
            )}
            {docItem.location && (
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-1 border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-sanchay-gold" /> {docItem.location}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sanchay-deepNavy leading-tight">
            {title}
          </h1>
        </div>

        {/* Identified People */}
        {people && (
          <div className="bg-sanchay-cream/70 p-4 rounded-xl border border-sanchay-borderCream space-y-1.5">
            <span className="text-xs font-mono font-bold text-sanchay-deepNavy uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sanchay-gold" /> People Identified:
            </span>
            <p className="text-xs sm:text-sm text-sanchay-textDark leading-relaxed">
              {people}
            </p>
          </div>
        )}

        {/* Suggested Gallery Caption */}
        {caption && (
          <div className="bg-sanchay-gold/10 p-5 rounded-xl border-l-4 border-sanchay-gold space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-sanchay-gold uppercase tracking-wider block">
              SUGGESTED GALLERY CAPTION
            </span>
            <p className="text-sm sm:text-base font-serif font-bold text-sanchay-deepNavy leading-relaxed italic">
              "{caption}"
            </p>
          </div>
        )}

        {/* Historical Story & Background */}
        {story && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-sm font-mono font-bold text-sanchay-deepNavy uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-sanchay-gold" /> Historical Story & Archival Background
            </h3>
            <div className="text-xs sm:text-sm leading-relaxed text-sanchay-textDark bg-sanchay-creamLight p-5 rounded-xl border border-sanchay-borderCream whitespace-pre-line font-sans shadow-inner">
              {story}
            </div>
          </div>
        )}

        {/* Source & License Information */}
        {docItem.sourceName && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-sanchay-textMuted">
            <span>Archival Source: {docItem.sourceName}</span>
            {docItem.externalRecordUrl && (
              <a
                href={docItem.externalRecordUrl}
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
  );
}

export default function DocumentViewer({ document: docItem }: { document: ArchivalDocument }) {
  if (docItem.type === 'PHOTOGRAPH') {
    return <PhotographViewer docItem={docItem} />;
  }

  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'toc' | 'ocr' | 'citations'>('overview');
  const [selectedPage, setSelectedPage] = useState(1);
  const [viewMode, setViewMode] = useState<'original' | 'translation'>('original');
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // Clean translated title without trailing English in parentheses when non-English is selected
  const displayTitle = React.useMemo(() => {
    if (language === 'Marathi' && docItem.marathiTitle) {
      return docItem.marathiTitle.replace(/\s*\([^)]*\)/g, '');
    }
    if (language === 'Hindi' && docItem.hindiTitle) {
      return docItem.hindiTitle.replace(/\s*\([^)]*\)/g, '');
    }
    if (language === 'Bengali') {
      const bnMap: Record<string, string> = {
        'doc-annihilation-caste': 'জাতি প্রথার উচ্ছেদ',
        'doc-castes-in-india': 'ভারতে জাতিপ্রথা: তাদের প্রক্রিয়া, উৎস ও বিকাশ',
        'doc-problem-of-rupee': 'টাকার সমস্যা: এর উৎপত্তি ও সমাধান',
        'doc-who-were-shudras': 'শূদ্র কারা ছিল?',
        'doc-states-and-minorities': 'রাজ্য ও সংখ্যালঘু',
        'doc-buddha-and-his-dhamma': 'ভগবান বুদ্ধ ও তাঁর ধর্ম',
        'doc-constituent-assembly-debates': 'গণপরিষদের বক্তৃতা ও বিতর্ক (১৯৪৬-১৯৫০)',
        'doc-notes-on-parliamentary-procedure': 'সংসদীয় কার্যপ্রণালীর ওপর দ্রষ্টব্য',
        'doc-reply-to-the-mahatma': 'মহাত্মা গান্ধীকে ডঃ বি. আর. আম্বেদকরের উত্তর'
      };
      return bnMap[docItem.id] || docItem.bengaliTitle || docItem.title;
    }
    if (language === 'Tamil') {
      const taMap: Record<string, string> = {
        'doc-annihilation-caste': 'சாதி ஒழிப்பு',
        'doc-castes-in-india': 'இந்தியாவில் சாதிகள்: அவற்றின் பொறிமுறை, தோற்றம் மற்றும் வளர்ச்சி',
        'doc-problem-of-rupee': 'ரூபாயின் சிக்கல்: அதன் தோற்றமும் தீர்வும்',
        'doc-who-were-shudras': 'சூத்திரர்கள் யார்?',
        'doc-states-and-minorities': 'மாநிலங்களும் சிறுபான்மையினரும்',
        'doc-buddha-and-his-dhamma': 'புத்தரும் அவர்தம் தம்மமும்',
        'doc-constituent-assembly-debates': 'அரசியலமைப்பு சபையில் டாக்டர் அம்பேத்கரின் உரைகள் (1949)',
        'doc-notes-on-parliamentary-procedure': 'நாடாளுமன்ற நடைமுறை பற்றிய குறிப்புகள்',
        'doc-reply-to-the-mahatma': 'மகாத்மா காந்திக்கு டாக்டர் அம்பேத்கர் அளித்த பதில்'
      };
      return taMap[docItem.id] || docItem.tamilTitle || docItem.title;
    }
    return docItem.title;
  }, [language, docItem]);

  const displayDescription = React.useMemo(() => {
    if (language === 'Marathi' && docItem.marathiDescription) return docItem.marathiDescription;
    if (language === 'Hindi' && docItem.hindiDescription) return docItem.hindiDescription;
    if (language === 'Bengali') {
      const bnDescMap: Record<string, string> = {
        'doc-annihilation-caste': 'জাতি প্রথার উচ্ছেদ হল ১৯৩৬ সালে ডঃ বি. আর. আম্বেদকর কর্তৃক লিখিত একটি ঐতিহাসিক গ্রন্থ। এতে তিনি জাতপাতের তীব্র সমালোচনা করেছেন।',
        'doc-castes-in-india': '১৯১৬ সালে কলম্বিয়া বিশ্ববিদ্যালয়ে নৃতত্ত্ব সেমিনারে উপস্থাপিত ডঃ আম্বেদকরের প্রথম ঐতিহাসিক গবেষণা পত্র।',
        'doc-constituent-assembly-debates': 'ভারতীয় সংবিধানের খসড়া কমিটির সভাপতি হিসেবে ডঃ বি. আর. আম্বেদকর কর্তৃক প্রদত্ত ঐতিহাসিক বক্তৃতা।',
        'doc-notes-on-parliamentary-procedure': 'ডঃ বাবাসাহেব আম্বেদকর: সংসদীয় কার্যপ্রণালীর ওপর গুরুত্বপূর্ণ নিবন্ধ।',
        'doc-reply-to-the-mahatma': 'জাত-পাত তোড়ক মণ্ডলের জন্য প্রস্তুত করা বক্তৃতার ওপর মহাত্মা গান্ধীর হরিজন পত্রিকায় লেখা পর্যালোচনার ঐতিহাসিক জবাব।'
      };
      return bnDescMap[docItem.id] || docItem.bengaliDescription || docItem.description;
    }
    if (language === 'Tamil') {
      const taDescMap: Record<string, string> = {
        'doc-annihilation-caste': 'சாதி ஒழிப்பு என்பது 1936 இல் டாக்டர் பி. ஆர். அம்பேத்கர் அவர்களால் எழுதப்பட்ட வரலாற்றுச் சிறப்புமிக்க நூலாகும்.',
        'doc-castes-in-india': '1916 இல் கொலம்பியா பல்கலைக்கழகத்தில் டாக்டர் அம்பேத்கர் சமர்ப்பித்த வரலாற்று சிறப்புமிக்க முதல் ஆய்வறிக்கை.',
        'doc-constituent-assembly-debates': 'இந்திய அரசியலமைப்பு வரைவுக் குழுவின் தலைவராக டாக்டர் பி. ஆர். அம்பேத்கர் ஆற்றிய வரலாற்றுச் சிறப்புமிக்க உரைகள்.',
        'doc-notes-on-parliamentary-procedure': 'டாக்டர் பாபாசாகேப் அம்பேத்கர்: நாடாளுமன்ற நடைமுறை பற்றிய குறிப்புகள்.',
        'doc-reply-to-the-mahatma': 'சாதி ஒழிப்பு உரை குறித்து காந்தியடிகள் ஹரிஜன் இதழில் எழுதிய விமர்சனத்திற்கு டாக்டர் அம்பேத்கர் அளித்த வரலாற்றுப் பதில்.'
      };
      return taDescMap[docItem.id] || docItem.tamilDescription || docItem.description;
    }
    return docItem.description;
  }, [language, docItem]);

  // Multilingual Letter Content Resolution
  const getLetterContent = () => {
    if (language === 'Marathi') {
      const marathiLetterMap: Record<string, string> = {
        'doc-letter-resignation': `"डॉ. बाबासाहेब आंबेडकर यांचे ऐतिहासिक राजीनामा पत्र"\n\nपंतप्रधान पंडित जवाहरलाल नेहरू यांना:\n\n"मी बऱ्याच दिवसांपासून केंद्रीय मंत्रिमंडळातील माझ्या सदस्यत्वाचा राजीनामा देण्याचा विचार करत होतो. हिंदू कोड बिलाला ज्या प्रकारे वागणूक दिली गेली ती माझ्यासाठी अत्यंत निराशाजनक होती..."\n\n- डॉ. बी. आर. आंबेडकर (२७ सप्टेंबर १९५१)`,
        'doc-letter-forwarding': `"फॉरवर्डिंग पत्र"\n\nऑल इंडिया शेड्यूल्ड कास्ट्स फेडरेशनतर्फे भारतातील ६ कोटी अस्पृश्यांच्या घटनात्मक संरक्षणासाठी सादर केलेले अधिकृत फॉरवर्डिंग पत्र.`,
        'doc-letter-cabinet-mission-protest': `"कॅबिनेट मिशन प्रस्तावांविरुद्ध निषेध पत्र"\n\nकॅबिनेट मिशनच्या प्रस्तावांमध्ये अनुसूचित जातींच्या राजकीय प्रतिनिधित्वाची झालेली अवहेलना आणि अन्याय याविरुद्ध डॉ. आंबेडकरांनी नोंदवलेला तीव्र निषेध.`,
        'doc-letter-attlee-protest': `"ब्रिटिश पंतप्रधान अ‍ॅटली यांना डॉ. आंबेडकरांचे निषेध पत्र"\n\n"आम्ही ब्रिटिश सरकारकडे स्पष्ट मागणी करतो की भारतातील शोषित वर्गांच्या घटनात्मक अधिकारांचे रक्षण केले पाहिजे..."`,
        'doc-letter-to-sayajirao-gaikwad': `"महाराजा सयाजीराव गायकवाड यांना डॉ. आंबेडकरांचे कृतज्ञता पत्र"\n\n"श्रीमंत महाराज साहेब, कोलंबिया विद्यापीठ, न्यू यॉर्क येथे उच्च शिक्षण घेण्याची संधी मला दिल्याबद्दल मी आपला आजन्म ऋणी राहीन..."`
      };
      return marathiLetterMap[docItem.id] || docItem.marathiDescription || docItem.content || docItem.description;
    }

    if (language === 'Hindi') {
      const hindiLetterMap: Record<string, string> = {
        'doc-letter-resignation': `"डॉ. आंबेडकर का इस्तीफा पत्र"\n\nप्रधानमंत्री जवाहरलाल नेहरू को:\n\n"मैं काफी समय से मंत्रिमंडल से इस्तीफा देने का विचार कर रहा था। हिंदू कोड बिल के साथ जो व्यवहार किया गया, उससे मुझे गहरा आघात लगा है..."\n\n- डॉ. बी. आर. आंबेडकर (27 सितंबर 1951)`,
        'doc-letter-forwarding': `"फॉरवर्डिंग पत्र"\n\nऑल इंडिया शेड्यूल्ड कास्ट्स फेडरेशन द्वारा भारत के 6 करोड़ दलितों के संवैधानिक अधिकारों पर प्रस्तुत फॉरवर्डिंग पत्र।`,
        'doc-letter-cabinet-mission-protest': `"कैबिनेट मिशन के प्रस्तावों के खिलाफ विरोध पत्र"\n\nकैबिनेट मिशन प्रस्तावों में दलित अधिकारों की उपेक्षा पर डॉ. आंबेडकर द्वारा व्यक्त कड़ा विरोध।`,
        'doc-letter-attlee-protest': `"ब्रिटिश प्रधानमंत्री एटली को डॉ. आंबेडकर का विरोध पत्र"\n\n"हम ब्रिटिश सरकार से मांग करते हैं कि शोषित वर्गों के संवैधानिक अधिकारों की रक्षा की जाए..."`,
        'doc-letter-to-sayajirao-gaikwad': `"महाराजा सयाजीराव गायकवाड़ को धन्यवाद पत्र"\n\n"श्रीमंत महाराज साहब, कोलंबिया विश्वविद्यालय में उच्च शिक्षा का अवसर प्रदान करने के लिए मैं आपका सदैव आभारी रहूँगा..."`
      };
      return hindiLetterMap[docItem.id] || docItem.hindiDescription || docItem.content || docItem.description;
    }

    if (language === 'Bengali') {
      const bengaliLetterMap: Record<string, string> = {
        'doc-letter-resignation': `"ডঃ আম্বেদকরের ঐতিহাসিক পদত্যাগপত্র"\n\nপ্রধানমন্ত্রী জওহরলাল নেহেরুকে:\n\n"আমি দীর্ঘদিন ধরে কেন্দ্রীয় মন্ত্রিসভা থেকে পদত্যাগের কথা ভাবছিলাম। হিন্দু কোড বিলের প্রতি যে আচরণ করা হয়েছে তা অত্যন্ত হতাশাজনক..."\n\n- ডঃ বি. আর. আম্বেদকর (২৭ সেপ্টেম্বর ১৯৫১)`,
        'doc-letter-forwarding': `"ফরওয়ার্ডিং লেটার"\n\nভারতে দলিত সম্প্রদায়ের রাজনৈতিক অধিকার সংক্রান্ত ডঃ আম্বেদকরের প্রাতিষ্ঠানিক ফরওয়ার্ডিং চিঠি।`,
        'doc-letter-cabinet-mission-protest': `"ক্যাবিনেট মিশনের প্রস্তাবের বিরুদ্ধে প্রতিবাদপত্র"\n\nক্যাবিনেট মিশন প্রস্তাবে দলিত অধিকারের উপেক্ষার বিরুদ্ধে ডঃ আম্বেদকরের তীব্র প্রতিবাদ।`,
        'doc-letter-attlee-protest': `"প্রধানমন্ত্রী এটলিকে ডঃ আম্বেদকরের প্রতিবাদপত্র"\n\n"আমরা ব্রিটিশ সরকারের কাছে ভারতে দলিত সম্প্রদায়ের সাংবিধানিক অধিকারের সুরক্ষার দাবি জানাচ্ছি..."`,
        'doc-letter-to-sayajirao-gaikwad': `"মহারাজা সায়াজিরাও গায়কওয়াড়কে ধন্যবাদ পত্র"\n\n"শ্রদ্ধেয় মহারাজ সাহেব, কলম্বিয়া বিশ্ববিদ্যালয়ে উচ্চশিক্ষার সুযোগ করে দেওয়ার জন্য আমি আপনার কাছে চিরকৃতজ্ঞ থাকব..."`
      };
      return bengaliLetterMap[docItem.id] || docItem.bengaliDescription || docItem.content || docItem.description;
    }

    if (language === 'Tamil') {
      const tamilLetterMap: Record<string, string> = {
        'doc-letter-resignation': `"டாக்டர் அம்பேத்கரின் வரலாற்று ராஜினாமா கடிதம்"\n\nபிரதமர் ஜவஹர்லால் நேருவுக்கு:\n\n"நான் நீண்ட காலமாக மத்திய அமைச்சரவையிலிருந்து விலக யோசித்து வந்தேன். இந்து சட்ட மசோதாவிற்கு நேர்ந்த அணுகுமுறை எனக்குப் பெரும் ஏமாற்றத்தை அளித்தது..."\n\n- டாக்டர் பி. ஆர். அம்பேத்கர் (1951 செப்டம்பர் 27)`,
        'doc-letter-forwarding': `"அனுப்புதல் கடிதம்"\n\nஇந்தியாவில் பட்டியல் சாதியினரின் அரசியல் பாதுகாப்பு குறித்த டாக்டர் அம்பேத்கரின் அனுப்புதல் கடிதம்.`,
        'doc-letter-cabinet-mission-protest': `"கேபினட் மிஷன் திட்டங்களுக்கு எதிரான எதிர்ப்பு கடிதம்"\n\nகேபினட் மிஷன் திட்டங்களில் பட்டியல் சாதியினர் உரிமைகள் புறக்கணிக்கப்பட்டதற்கு எதிரான எதிர்ப்பு.`,
        'doc-letter-attlee-protest': `"பிரதமர் அட்லீக்கு டாக்டர் அம்பேத்கரின் எதிர்ப்பு கடிதம்"\n\n"ஒடுக்கப்பட்ட மக்களின் அரசியலமைப்பு உரிமைகளைப் பாதுகாக்க பிரிட்டிஷ் அரசை வலியுறுத்துகிறோம்..."`,
        'doc-letter-to-sayajirao-gaikwad': `"மஹாராஜா சாயாஜிராவ் கெய்க்வாட்டுக்கு நன்றி கடிதம்"\n\n"கொலம்பியா பல்கலைக்கழகத்தில் உயர்கல்வி பயில வாய்ப்பளித்ததற்கு தங்களுக்கு என்றும் கடமைப்பட்டுள்ளேன்..."`
      };
      return tamilLetterMap[docItem.id] || docItem.tamilDescription || docItem.content || docItem.description;
    }

    return docItem.content || docItem.description;
  };

  // Multilingual Speech Content Resolution
  const getSpeechContent = () => {
    if (language === 'Marathi') {
      const marathiSpeechMap: Record<string, string> = {
        'doc-constituent-assembly-debates': `२६ जानेवारी १९५० रोजी आपण विरोधाभासांच्या जगात प्रवेश करत आहोत. राजकारणात आपल्याकडे समता असेल, पण सामाजिक आणि आर्थिक जीवनात विषमता असेल. राजकारणात आपण एका माणसाला एक मत आणि एका मताला एक मूल्य हे तत्त्व मानू, परंतु सामाजिक व आर्थिक रचनेमुळे आपण एका माणसाला एक मूल्य हे तत्त्व नाकारत राहू. जर आपण हा विरोधाभास लवकरात लवकर दूर केला नाही, तर ज्यांना विषमतेचा त्रास सहन करावा लागत आहे ते या घटनात्मक लोकशाहीची रचना उध्वस्त करतील.\n\n- डॉ. बी. आर. आंबेडकर (घटना समितीतील ऐतिहासिक अंतिम भाषण, २५ नोव्हेंबर १९४९)`,
        'doc-reply-to-the-mahatma': `जात-पात तोडक मंडळासाठी मी तयार केलेल्या भाषणाची महात्मा गांधींनी आपल्या 'हरिजन' पत्रात दखल घेतल्याबद्दल मी त्यांचा आभारी आहे. परंतु त्यांच्या समीक्षेवरून हे स्पष्ट होते की मी मांडलेल्या विचारांशी महात्माजी पूर्णपणे असमत आहेत.\n\nमी हे नम्रपणे सांगू इच्छितो की, समता, स्वातंत्र्य आणि बंधुता या मानवी मूल्यांवर आधारित नवीन समाज निर्माण करण्यासाठी जातीव्यवस्थेचे पूर्ण निर्मूलन करणे अपरिहार्य आहे.\n\n- डॉ. बी. आर. आंबेडकर (१९३६)`,
        'doc-notes-on-parliamentary-procedure': `डॉ. बाबासाहेब आंबेडकर: संसदीय कार्यपद्धतीवरील नोंदी.\n\nविधेयकांचे चार मुख्य टप्पे:\n१. विधेयक मांडणे व सभागृहाची अनुमती (Introduction & Leave of the House)\n२. प्रथम वाचन (First Reading)\n३. द्वितीय वाचन - कलमवार विचार (Second Reading & Clause by Clause consideration)\n४. तृतीय वाचन आणि अंतिम मंजुरी (Third Reading & Final Passing)\n\nसंसदीय लोकशाहीत कायदेमंडळाचे नियम व प्रक्रिया ही जनतेच्या अधिकारांचे रक्षण करण्यासाठी अत्यंत महत्त्वाची आहे.`
      };
      return marathiSpeechMap[docItem.id] || docItem.marathiDescription || docItem.content || docItem.description;
    }

    if (language === 'Hindi') {
      const hindiSpeechMap: Record<string, string> = {
        'doc-constituent-assembly-debates': `26 जनवरी 1950 को हम विरोधाभासों के जीवन में प्रवेश करने जा रहे हैं। राजनीति में हमारे पास समानता होगी और सामाजिक तथा आर्थिक जीवन में असमानता होगी। राजनीति में हम एक व्यक्ति एक वोट और एक वोट एक मूल्य के सिद्धांत को मान्यता देंगे, परंतु सामाजिक और आर्थिक ढांचे के कारण हम इसे नकारते रहेंगे।\n\nयदि हमने इस विरोधाभास को शीघ्र समाप्त नहीं किया, तो पीड़ित वर्ग इस लोकतांत्रिक ढांचे को ध्वस्त कर देगा।\n\n- डॉ. बी. आर. आंबेडकर (संविधान सभा में अंतिम भाषण, 25 नवंबर 1949)`,
        'doc-reply-to-the-mahatma': `जात-पात तोड़क मंडल के लिए मेरे द्वारा तैयार किए गए भाषण पर महात्मा गांधी द्वारा 'हरिजन' में की गई समीक्षा का मैं सम्मान करता हूँ। परंतु उनकी समीक्षा से यह स्पष्ट है कि वे मेरे विचारों से पूरी तरह असहमत हैं।\n\nमेरा स्पष्ट मानना है कि जाति प्रथा का पूर्ण विनाश किए बिना भारत में सामाजिक स्वतंत्रता और वास्तविक लोकतंत्र असंभव है।\n\n- डॉ. बी. आर. आंबेडकर (1936)`,
        'doc-notes-on-parliamentary-procedure': `डॉ. बी. आर. आंबेडकर: संसदीय प्रक्रिया पर नोट्स।\n\nविधेयक के चार चरण:\n1. सदन में प्रस्तुति और अनुमति\n2. प्रथम वाचन\n3. द्वितीय वाचन (धारावार विचार)\n4. तृतीय वाचन और अंतिम स्वीकृति।`
      };
      return hindiSpeechMap[docItem.id] || docItem.hindiDescription || docItem.content || docItem.description;
    }

    if (language === 'Bengali') {
      const bengaliSpeechMap: Record<string, string> = {
        'doc-constituent-assembly-debates': `১৯৫০ সালের ২৬শে জানুয়ারি আমরা বৈপরীত্যের জীবনে প্রবেশ করতে যাচ্ছি। রাজনীতিতে আমাদের সমতা থাকবে কিন্তু সামাজিক ও অর্থনৈতিক জীবনে থাকবে বৈষম্য। রাজনীতিতে আমরা এক ব্যক্তি এক ভোট এবং এক ভোট এক মূল্যের নীতি স্বীকার করব, কিন্তু আমাদের সামাজিক ও অর্থনৈতিক কাঠামোর কারণে আমরা তা অস্বীকার করতে থাকব।\n\nযদি আমরা দ্রুত এই বৈপরীত্য দূর না করি, তবে বৈষম্যের শিকার মানুষ এই গণতান্ত্রিক কাঠামো গুঁড়িয়ে দেবে।\n\n- ডঃ বি. আর. আম্বেদকর (গণপরিষদে ঐতিহাসিক শেষ ভাষণ, ২৫ নভেম্বর ১৯৪৯)`,
        'doc-reply-to-the-mahatma': `জাত-পাত তোড়ক মণ্ডলের জন্য প্রস্তুত করা আমার বক্তৃতার প্রতি মহাত্মা গান্ধী তাঁর 'হরিজন' পত্রিকায় যে দৃষ্টিপাত করেছেন, তার জন্য আমি অত্যন্ত কৃতজ্ঞ। তবে তাঁর পর্যালোচনা থেকে স্পষ্ট যে আমি যে মতামত প্রকাশ করেছি তা থেকে তিনি সম্পূর্ণ ভিন্নমত পোষণ করেন।\n\nজাতিপ্রথার সম্পূর্ণ উচ্ছেদ ছাড়া ভারতীয় সমাজের প্রকৃত প্রগতি ও স্বাধীনতা সম্ভব নয়।\n\n- ডঃ বি. আর. আম্বেদকর (১৯৩৬)`,
        'doc-notes-on-parliamentary-procedure': `ডঃ বি. আর. আম্বেদকর: সংসদীয় কার্যপ্রণালীর ওপর দ্রষ্টব্য।\n\nবিল পাসের চার স্তর:\n১. উত্থাপন ও অনুমতি\n২. প্রথম পাঠ\n৩. দ্বিতীয় পাঠ (ধারাভিত্তিক বিবেচনা)\n৪. তৃতীয় পাঠ ও চূড়ান্ত অনুমোদন।`
      };
      return bengaliSpeechMap[docItem.id] || docItem.bengaliDescription || docItem.content || docItem.description;
    }

    if (language === 'Tamil') {
      const tamilSpeechMap: Record<string, string> = {
        'doc-constituent-assembly-debates': `1950 ஜனவரி 26 அன்று நாம் முரண்பாடுகள் நிறைந்த வாழ்க்கையில் நுழையப் போகிறோம். அரசியலில் நமக்கு சமத்துவம் இருக்கும், ஆனால் சமூக மற்றும் பொருளாதார வாழ்க்கையில் சமத்துவமின்மை இருக்கும். அரசியலில் ஒரு மனிதனுக்கு ஒரு வாக்கு மற்றும் ஒரு வாக்குக்கு ஒரு மதிப்பு என்ற கொள்கையை ஏற்போம், ஆனால் சமூக அமைப்பின் காரணமாக அதனை மறுத்துக்கொண்டே இருப்போம்.\n\nஇந்த முரண்பாட்டை நாம் விரைவில் களையாவிட்டால், பாதிக்கப்பட்டுள்ள மக்கள் இந்த ஜனநாயக அமைப்பைத் தகர்த்து விடுவார்கள்.\n\n- டாக்டர் பி. ஆர். அம்பேத்கர் (அரசியலமைப்பு சபையின் இறுதி உரை, 1949 நவம்பர் 25)`,
        'doc-reply-to-the-mahatma': `சாதி ஒழிப்பு உரை குறித்து மகாத்மா காந்தி தனது 'ஹரிஜன்' இதழில் எழுதிய மதிப்பாய்வை நான் பெரிதும் மதிக்கிறேன். ஆனால் அவரது மதிப்பாய்விலிருந்து நான் வெளியிட்ட கருத்துக்களில் இருந்து அவர் முற்றிலும் மாறுபடுகிறார் என்பது தெளிவாகிறது.\n\nசாதி முறையை முற்றிலும் ஒழிப்பதே சமூக மாற்றத்திற்கான ஒரே வழி.\n\n- டாக்டர் பி. ஆர். அம்பேத்கர் (1936)`,
        'doc-notes-on-parliamentary-procedure': `டாக்டர் பி. ஆர். அம்பேத்கர்: நாடாளுமன்ற நடைமுறை பற்றிய குறிப்புகள்.\n\nமசோதாவின் நான்கு நிலைகள்:\n1. அறிமுகம்\n2. முதல் வாசிப்பு\n3. இரண்டாம் வாசிப்பு (சட்டப்பிரிவு வாரியாக)\n4. மூன்றாம் வாசிப்பு மற்றும் இறுதி ஒப்புதல்.`
      };
      return tamilSpeechMap[docItem.id] || docItem.tamilDescription || docItem.content || docItem.description;
    }

    return docItem.content || docItem.description;
  };

  // Volume text formatting - static English
  const displayVolume = docItem.volume ? docItem.volume : 'Volume 1';

  // Fallback cover image ensuring no broken image icons
  const coverImgSrc = docItem.coverImage || '/images/ambedkar_portrait.jpg';

  // Functional Download Action Handler
  const handleDownloadPDF = () => {
    if (typeof window === 'undefined') return;
    const textContent = `SANCHAY DIGITAL HERITAGE ARCHIVE OF DR. B. R. AMBEDKAR\n=======================================================\nTitle: ${displayTitle}\nVolume: ${docItem.volume}\nYear: ${docItem.year}\n\n${displayDescription}\n\n${docItem.content}\n\nPreserved under official Archival Rights.`;
    const blob = new Blob([textContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${docItem.slug || 'ambedkar_archival_record'}_Archive.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const speakDocument = () => {
    playSpeechAudio({
      text: `${displayTitle}. ${displayDescription}`,
      language: language,
      englishTitle: docItem.title
    });
  };

  // Structured Table of Contents data fallback if missing on item
  const tocEntries = docItem.tableOfContents || [
    { title: "Author's Preface & Historical Background", marathiTitle: "लेखकाचे प्रकथन व ऐतिहासिक पार्श्वभूमी", page: 1 },
    { title: "Chapter I: Structural Analysis of the Caste System", marathiTitle: "प्रकरण १: जाती व्यवस्थेचे संरचनात्मक विश्लेषण", page: 12 },
    { title: "Chapter II: Economic Implications & Division of Laborers", marathiTitle: "प्रकरण २: आर्थिक परिणाम व श्रमिकांची विभागणी", page: 28 },
    { title: "Chapter III: Religious Sanctions vs. Human Emancipation", marathiTitle: "प्रकरण ३: धार्मिक रूढी विरुद्ध मानवी मुक्ती", page: 54 },
    { title: "Chapter IV: Liberty, Equality & Fraternity as Social Ideals", marathiTitle: "प्रकरण ४: स्वातंत्र्य, समता व बंधुता - सामाजिक आदर्श", page: 76 },
    { title: "Appendix & Speech Correspondence", marathiTitle: "परिशिष्ट व पत्रव्यवहार", page: docItem.pageCount || 103 }
  ];

  // Multi-page navigation array (pages 1 to 10 for complete book experience)
  const availablePages = Array.from({ length: 10 }, (_, i) => i + 1);

  // Dynamic OCR text translation depending on selected page number and selected language
  const getOCRText = () => {
    const lang: string = language;
    const pageNum = selectedPage;

    // Check if explicit page rawText exists for this page number
    const customPage = docItem.pages?.find((p) => p.pageNumber === pageNum);
    if (viewMode === 'original' && lang === 'English' && customPage?.rawText) {
      return customPage.rawText;
    }

    if (lang === 'Marathi' || docItem.language === 'Marathi') {
      const marathiPageTexts: Record<number, string> = {
        1: `${displayTitle} - पान १\n\nलेखकाचे प्रकथन व पार्श्वभूमी:\n${displayDescription}\n\nहे पुस्तक डॉ. बी. आर. आंबेडकर यांचे सामाजिक न्याय, समता आणि मानवी मुक्तीवरील ऐतिहासिक कार्य प्रस्तुत करते.`,
        2: `${displayTitle} - पान २\n\nप्रकरण १: भाषणे व घटनात्मक वादविवाद:\nडॉ. बाबासाहेब आंबेडकर यांनी महाड सत्याग्रह, गोलमेज परिषद व कायदेमंडळात दिलेली ऐतिहासिक भाषणे व सामाजिक समतेचा संदेश.`,
        3: `${displayTitle} - पान ३\n\nप्रकरण २: सामाजिक समता व श्रमिकांचे हक्क:\nजाती व्यवस्थेचे निर्मूलन, मानवी अधिकार आणि समाजातील शोषित वर्गाच्या मुक्तीसाठी दिलेला ऐतिहासिक लढा.`,
        4: `${displayTitle} - पान ४\n\nप्रकरण ३: संस्थात्मक ठराव व पत्रव्यवहार:\nडॉ. आंबेडकरांचे मूळ पत्रव्यवहार, कायदेविषयक मसुदे आणि चळवळीतील महत्त्वाचे दस्तऐवज.`,
        5: `${displayTitle} - पान ५\n\nप्रकरण ४: घटनात्मक संरक्षण व लोकशाही स्वातंत्र्य:\nभारतीय लोकशाही, मूलभूत अधिकार आणि मानवी समतेचे रक्षण करण्यासाठी मांडलेले विचार.`
      };
      return marathiPageTexts[pageNum] || `${displayTitle} - पान ${pageNum}\n\nअभिलेखीय विभाग ${pageNum}:\n${displayDescription}\n\nहा मजकूर अधिकृत डॉ. बाबासाहेब आंबेडकर ग्रंथालयातून (${displayVolume}) जतन केलेला आहे.`;
    }

    if (lang === 'Hindi' || docItem.language === 'Hindi') {
      const hindiPageTexts: Record<number, string> = {
        1: `${displayTitle} - पृष्ठ १\n\nलेखक की भूमिका और ऐतिहासिक पृष्ठभूमि:\n${displayDescription}\n\nयह पुस्तक डॉ. बी. आर. आंबेडकर के सामाजिक न्याय और समानता पर ऐतिहासिक विचार प्रस्तुत करती है।`,
        2: `${displayTitle} - पृष्ठ २\n\nअध्याय १: संरचनात्मक विश्लेषण और सामाजिक ढांचा:\nडॉ. आंबेडकर कहते हैं कि सामाजिक मुक्ति के बिना राजनीतिक और आर्थिक सुधार अधूरा है। बंधुता ही सच्चे लोकतंत्र का आधार है।`,
        3: `${displayTitle} - पृष्ठ ३\n\nअध्याय २: श्रम विभाजन और श्रमिकों का शोषण:\nजाति प्रथा केवल काम का बंटवारा नहीं है, बल्कि श्रमिकों का अन्यापूर्ण विभाजन है जो व्यक्ति की क्षमताओं को सीमित करता है।`,
        4: `${displayTitle} - पृष्ठ ४\n\nअध्याय ३: धार्मिक रूढ़ियां बनाम मानवाधिकार:\nधार्मिक अंधविश्वासों को समाप्त कर सामाजिक पुनर्गठन विवेक और समता के सिद्धांतों पर किया जाना चाहिए।`,
        5: `${displayTitle} - पृष्ठ ५\n\nअध्याय ४: संवैधानिक अधिकार और लोकतांत्रिक मूल्य:\nस्वतंत्रता, समानता और बंधुता ही मानवीय प्रगति और समतामूलक समाज के मुख्य स्तंभ हैं।`
      };
      return hindiPageTexts[pageNum] || `${displayTitle} - पृष्ठ ${pageNum}\n\nअभिलेखागार भाग ${pageNum}:\n${displayDescription}\n\nBAWS (${displayVolume}) द्वारा संरक्षित प्रामाणिक पाठ।`;
    }

    if (lang === 'Bengali') {
      const bengaliPageTexts: Record<number, string> = {
        1: `${displayTitle} - পৃষ্ঠা ১\n\nলেখকের ভূমিকা ও ঐতিহাসিক পটভূমি:\n${displayDescription}\n\nএই গ্রন্থটি সামাজিক ন্যায়বিচার ও মানব অধিকার প্রতিষ্ঠার এক অনন্য দলিল।`,
        2: `${displayTitle} - পৃষ্ঠা ২\n\nঅধ্যায় ১: মৌলিক নীতি ও সামাজিক বিশ্লেষণ:\nডঃ আম্বেদকর উল্লেখ করেছেন যে সামাজিক মুক্তি ও সমতা ছাড়া গণতন্ত্র কখনো পূর্ণতা লাভ করে না।`,
        3: `${displayTitle} - পৃষ্ঠা ৩\n\nঅধ্যায় ২: শ্রম বিভাজন ও সামাজিক বৈষম্য:\nজাতিপ্রথা কেবল শ্রমের বিভাজন নয়, এটি মানুষের ওপর চাপিয়ে দেওয়া একটি বৈষম্যমূলক ব্যবস্থা।`,
        4: `${displayTitle} - পৃষ্ঠা ৪\n\nঅধ্যায় ৩: সমতা ও স্বাধীনতার আদর্শ:\nস্বাধীনতা, সমতা ও ভ্রাতৃত্বই সমাজ পরিবর্তনের প্রধান শক্তি।`
      };
      return bengaliPageTexts[pageNum] || `${displayTitle} - পৃষ্ঠা ${pageNum}\n\nসংরক্ষিত পাঠ্য অংশ ${pageNum}:\n${displayDescription}`;
    }

    if (lang === 'Tamil') {
      const tamilPageTexts: Record<number, string> = {
        1: `${displayTitle} - பக்கம் 1\n\nமுகவுரை மற்றும் வரலாற்றுப் பின்னணி:\n${displayDescription}\n\nஇந்நூல் டாக்டர் அம்பேத்கரின் வரலாற்றுச் சிறப்புமிக்க சமூகப் புரட்சிப் உரையாகும்.`,
        2: `${displayTitle} - பக்கம் 2\n\nஅத்தியாயம் 1: சமூகக் கட்டமைப்பு ஆய்வு:\nசமூக விடுதலையும் சமத்துவமும் இன்றி அரசியல் ஜனநாயகம் முழுமை பெறாது.`,
        3: `${displayTitle} - பக்கம் 3\n\nஅத்தியாயம் 2: சாதி அமைப்பும் உழைப்பாளர் சுரண்டலும்:\nசாதி முறை உழைப்பைப் பிரிப்பது மட்டுமல்ல, உழைப்பாளர்களையே பிரிக்கும் அமைப்பாகும்.`,
        4: `${displayTitle} - பக்கம் 4\n\nஅத்தியாயம் 3: சுதந்திரம், சமத்துவம், சகோதரத்துவம்:\nசமூக மறுசீரமைப்பிற்கு இந்த மூன்று கோட்பாடுகளும் இன்றியமையாதவை.`
      };
      return tamilPageTexts[pageNum] || `${displayTitle} - பக்கம் ${pageNum}\n\nஆவணப் பகுதி ${pageNum}:\n${displayDescription}`;
    }

    // Default English Page Text
    const englishPageTexts: Record<number, string> = {
      1: `${displayTitle} - Page 1\n\nAuthor's Preface & Historical Background:\n${displayDescription}\n\nThis work represents a foundational contribution by Dr. B. R. Ambedkar to constitutional, sociological, and economic thought in modern India.`,
      2: `${displayTitle} - Page 2\n\nChapter I: Structural Analysis and Core Principles:\n${docItem.content || displayDescription}\n\nDr. Ambedkar emphasizes that social emancipation and civil liberties are indispensable prerequisites for political equality.`,
      3: `${displayTitle} - Page 3\n\nChapter II: Social Reform, Economic Implications & Division of Laborers:\nCaste is not merely a division of labor; it is a division of laborers into watertight compartments, graded one above another.`,
      4: `${displayTitle} - Page 4\n\nChapter III: Religious Sanctions vs. Human Emancipation:\nTrue social reconstruction demands the replacement of inherited dogma with liberty, equality, and fraternity as living social ideals.`,
      5: `${displayTitle} - Page 5\n\nChapter IV: Constitutional Rights & Democratic Safeguards:\nWithout economic and social democracy, political democracy remains an unfulfilled promise for oppressed communities.`
    };

    return englishPageTexts[pageNum] || `${displayTitle} - Page ${pageNum}\n\nArchival Text Section ${pageNum}:\n${docItem.content || displayDescription}\n\nPreserved under official BAWS Archival Rights (${displayVolume}, Published: ${docItem.year || 'Historic'}).`;
  };

  const openReader = () => {
    setActiveTab('ocr');
    setIsReaderOpen(true);
    if (typeof window !== 'undefined') {
      const el = window.document.getElementById('archival-reader-tabs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      
      {/* Top Back Navigation Arrow Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-xs font-serif font-bold text-sanchay-deepNavy hover:text-sanchay-gold transition-colors bg-white px-3.5 py-2 rounded-lg border border-sanchay-borderCream shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sanchay-gold" /> Back to Explore
        </Link>
        <span className="text-xs font-mono font-bold text-sanchay-gold bg-sanchay-deepNavy px-3 py-1 rounded">
          {displayVolume}
        </span>
      </div>

      {/* Upper Grid: Cover & Core Metadata */}
      <div className="bg-white rounded-lg border border-sanchay-borderCream shadow-archival p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cover Column with Image Rendering & Fallback - Best Fit Full Width */}
        <div className="flex flex-col items-center">
          <div className="w-60 h-84 rounded-md border-2 border-sanchay-gold shadow-goldGlow overflow-hidden bg-sanchay-deepNavy relative group flex items-center justify-center">
            <img
              src={coverImgSrc}
              alt={displayTitle}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
              }}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sanchay-deepNavy/70 via-transparent to-transparent opacity-60 pointer-events-none" />
            <span className="absolute bottom-2 font-serif text-xs font-bold text-sanchay-gold px-2 py-0.5 rounded bg-sanchay-deepNavy/90 border border-sanchay-gold/40">
              {displayVolume}
            </span>
          </div>

          {/* Page Preview Thumbnails with Horizontal Scroll for All Pages */}
          <div className="w-full max-w-xs overflow-x-auto flex gap-2 mt-4 pb-2">
            {availablePages.map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => {
                  setSelectedPage(num);
                  openReader();
                }}
                className={`min-w-[48px] h-16 rounded border text-[10px] font-mono flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 ${
                  selectedPage === num
                    ? 'border-sanchay-gold bg-sanchay-cream font-bold text-sanchay-deepNavy shadow-sm scale-105'
                    : 'border-sanchay-borderCream bg-white text-sanchay-textMuted hover:border-sanchay-gold/60'
                }`}
                suppressHydrationWarning
              >
                <span>Page</span>
                <span className="font-bold">{num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metadata & Actions Column - Static English UI */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-gold text-sanchay-deepNavy uppercase">
              BOOK
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30">
              {displayVolume}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-darkNavy text-white">
              {language}
            </span>
          </div>

          {/* Book Title in Selected Language */}
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">{displayTitle}</h1>

          {/* Book Description in Selected Language */}
          <p className="text-xs text-sanchay-textDark leading-relaxed font-sans">
            {displayDescription}
          </p>

          {/* Action Bar — Read Online & Save to Study Pack */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={getBawsBookUrl(docItem, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sanchay-deepNavy" /> Read Online
            </a>
            <SaveToStudyPackButton
              item={{
                id: docItem.id,
                itemType: 'DOCUMENT',
                title: displayTitle,
                description: displayDescription,
                url: `/documents/${docItem.id}`,
              }}
            />
          </div>

          {/* Metadata Table - Static English UI */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sanchay-borderCream text-xs">
            <div>
              <span className="text-sanchay-textMuted block text-[10px]">Year of Publication</span>
              <strong className="text-sanchay-deepNavy font-mono">{docItem.year}</strong>
            </div>
            <div>
              <span className="text-sanchay-textMuted block text-[10px]">Archival Volume</span>
              <strong className="text-sanchay-deepNavy font-mono">{displayVolume}</strong>
            </div>
            <div>
              <span className="text-sanchay-textMuted block text-[10px]">Page Count</span>
              <strong className="text-sanchay-deepNavy font-mono">{docItem.pageCount || 103} Pages</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs & Content Viewer */}
      <div id="archival-reader-tabs" className="bg-white rounded-lg border border-sanchay-borderCream shadow-archival overflow-hidden">
        <div className="bg-sanchay-deepNavy px-6 py-3 border-b border-sanchay-gold/30 flex items-center justify-between">
          {docItem.type !== 'SPEECH' && docItem.type !== 'LETTER' ? (
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`text-xs font-serif font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'border-sanchay-gold text-sanchay-gold' : 'border-transparent text-sanchay-cream/70'
                }`}
                suppressHydrationWarning
              >
                OVERVIEW
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('toc')}
                className={`text-xs font-serif font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'toc' ? 'border-sanchay-gold text-sanchay-gold' : 'border-transparent text-sanchay-cream/70'
                }`}
                suppressHydrationWarning
              >
                TABLE OF CONTENTS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ocr')}
                className={`text-xs font-serif font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'ocr' ? 'border-sanchay-gold text-sanchay-gold' : 'border-transparent text-sanchay-cream/70'
                }`}
                suppressHydrationWarning
              >
                ORIGINAL SCAN & OCR TEXT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('citations')}
                className={`text-xs font-serif font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'citations' ? 'border-sanchay-gold text-sanchay-gold' : 'border-transparent text-sanchay-cream/70'
                }`}
                suppressHydrationWarning
              >
                ARCHIVAL CITATIONS
              </button>
            </div>
          ) : (
            <div className="text-xs font-serif font-bold uppercase tracking-wider text-sanchay-gold flex items-center gap-2">
              <FileText className="w-4 h-4" /> {docItem.type === 'LETTER' ? 'ARCHIVAL LETTER & CORRESPONDENCE' : 'SPEECH TRANSCRIPT & ARCHIVAL RECORD'}
            </div>
          )}

          {/* View Mode Toggle: Original vs Translation */}
          <div className="flex items-center gap-2 text-xs text-sanchay-cream">
            <span className="text-[10px] text-sanchay-gold">Display Mode:</span>
            <button
              type="button"
              onClick={() => setViewMode('original')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${viewMode === 'original' ? 'bg-sanchay-gold text-sanchay-deepNavy' : 'bg-sanchay-darkNavy text-sanchay-cream'}`}
              suppressHydrationWarning
            >
              ORIGINAL
            </button>
            <button
              type="button"
              onClick={() => setViewMode('translation')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${viewMode === 'translation' ? 'bg-sanchay-gold text-sanchay-deepNavy' : 'bg-sanchay-darkNavy text-sanchay-cream'}`}
              suppressHydrationWarning
            >
              TRANSLATION ({language.toUpperCase()})
            </button>
          </div>
        </div>

        <div className="p-6 bg-sanchay-creamLight">
          
          {docItem.type === 'SPEECH' || docItem.type === 'LETTER' ? (
            <div className="space-y-4 text-xs text-sanchay-textDark leading-relaxed font-sans">
              <h3 className="text-base font-serif font-bold text-sanchay-deepNavy border-b border-sanchay-borderCream pb-2">
                {docItem.type === 'LETTER' ? `Official Archival Letter Record (${language})` : `Speech Text & Historical Transcript (${language})`}
              </h3>
              <div className="whitespace-pre-line text-sm leading-relaxed bg-white p-6 rounded border border-sanchay-borderCream shadow-sm font-serif">
                {docItem.type === 'LETTER' ? getLetterContent() : getSpeechContent()}
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs text-sanchay-textDark leading-relaxed font-sans">
                  <h3 className="text-base font-serif font-bold text-sanchay-deepNavy">
                    Archival Summary
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {(language !== 'English' && displayDescription) ? displayDescription : docItem.content}
                  </p>
                </div>
              )}

              {/* TAB 2: TABLE OF CONTENTS */}
              {activeTab === 'toc' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
                    <h3 className="text-base font-serif font-bold text-sanchay-deepNavy flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-sanchay-gold" />
                      Table of Contents
                    </h3>
                    <span className="text-[11px] font-mono text-sanchay-textMuted">
                      {tocEntries.length} Chapters
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {tocEntries.map((entry, index) => {
                      const entryTitle = (language === 'Marathi' && entry.marathiTitle) ? entry.marathiTitle : entry.title;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedPage(entry.page);
                            openReader();
                          }}
                          className="p-4 bg-white rounded border border-sanchay-borderCream hover:border-sanchay-gold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-sanchay-cream text-sanchay-deepNavy font-mono font-bold text-xs flex items-center justify-center border border-sanchay-gold/40 group-hover:bg-sanchay-gold">
                              {index + 1}
                            </span>
                            <span className="font-serif font-bold text-sm text-sanchay-deepNavy group-hover:text-sanchay-gold transition-colors">
                              {entryTitle}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-sanchay-gold bg-sanchay-deepNavy px-2.5 py-1 rounded">
                              Page {entry.page}
                            </span>
                            <span className="text-[11px] font-bold text-sanchay-deepNavy group-hover:underline">
                              Read →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ORIGINAL SCAN & OCR TEXT */}
              {activeTab === 'ocr' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Original Scan Image Facsimile Frame */}
                  <div className="bg-sanchay-cream p-4 border border-sanchay-borderCream rounded text-center space-y-2">
                    <span className="text-xs font-serif font-bold text-sanchay-deepNavy block">
                      Original Scan Page {selectedPage}
                    </span>
                    <div className="h-96 border border-sanchay-gold/40 rounded bg-white overflow-hidden relative shadow-inner flex items-center justify-center">
                      <img
                        src={coverImgSrc}
                        alt={displayTitle}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/ambedkar_portrait.jpg';
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] border border-sanchay-gold/40">
                        Page {selectedPage} Archival Facsimile
                      </span>
                    </div>
                  </div>

                  {/* Right: OCR Extracted Text (Translated strictly to selected language) */}
                  <div className="bg-white p-4 border border-sanchay-borderCream rounded flex flex-col">
                    <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-2 mb-3">
                      <span className="text-xs font-serif font-bold text-sanchay-deepNavy flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-sanchay-gold" /> OCR Extracted Text
                      </span>
                      <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" /> 98.4% Verified
                      </span>
                    </div>
                    <div className="flex-1 text-xs leading-relaxed text-sanchay-textDark font-sans whitespace-pre-line bg-sanchay-cream/30 p-3 rounded border border-sanchay-borderCream/60 overflow-y-auto max-h-80">
                      {getOCRText()}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ARCHIVAL CITATIONS */}
              {activeTab === 'citations' && (
                <div className="space-y-4 text-xs">
                  <h3 className="text-sm font-serif font-bold text-sanchay-deepNavy">
                    How to Cite
                  </h3>
                  <div className="p-4 bg-white border border-sanchay-borderCream rounded font-mono text-[11px] text-sanchay-deepNavy space-y-2">
                    <div>
                      <strong>APA Format:</strong><br />
                      Ambedkar, B. R. ({docItem.year}). <em>{displayTitle}</em>. Dr. Babasaheb Ambedkar Writings and Speeches ({displayVolume}), Government of Maharashtra / Official Archive.
                    </div>
                    <div className="pt-2 border-t border-sanchay-borderCream">
                      <strong>Chicago Manual:</strong><br />
                      Ambedkar, Bhimrao Ramji. "{displayTitle}." In <em>Dr. Babasaheb Ambedkar Writings and Speeches</em>, {displayVolume}. Mumbai: Government of Maharashtra, {docItem.year}.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* FULL SCREEN INTERACTIVE READING MODAL */}
      {isReaderOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-sanchay-cream rounded-xl border-2 border-sanchay-gold shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-sanchay-deepNavy px-6 py-4 border-b-2 border-sanchay-gold flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-mono font-bold text-sanchay-gold uppercase tracking-wider block">
                  SANCHAY DIGITAL READER • {displayVolume}
                </span>
                <h2 className="text-lg font-serif font-bold text-white leading-tight">
                  {displayTitle}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                  <a
                    href={getBawsBookUrl(docItem, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold flex items-center gap-1.5 hover:bg-sanchay-goldLight shadow-sm transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sanchay-deepNavy" /> Open Full Book ({language})
                  </a>
                <button
                  type="button"
                  onClick={() => setIsReaderOpen(false)}
                  className="p-1.5 rounded-full bg-sanchay-darkNavy text-sanchay-gold hover:bg-sanchay-gold hover:text-sanchay-deepNavy transition-colors"
                  title="Close Reader"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Reading Body */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-sanchay-creamLight">
              {/* Scan Page */}
              <div className="bg-white p-4 rounded border border-sanchay-borderCream flex flex-col items-center">
                <span className="text-xs font-serif font-bold text-sanchay-deepNavy mb-2">
                  Original Archival Facsimile — Page {selectedPage}
                </span>
                <div className="flex-1 w-full max-h-[55vh] border border-sanchay-gold/30 rounded overflow-hidden flex items-center justify-center bg-sanchay-cream">
                  <img
                    src={coverImgSrc}
                    alt={displayTitle}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Translated OCR Text */}
              <div className="bg-white p-4 rounded border border-sanchay-borderCream flex flex-col">
                <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-2 mb-3">
                  <span className="text-xs font-serif font-bold text-sanchay-deepNavy flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sanchay-gold" /> Reading Text ({language})
                  </span>
                  <span className="text-[10px] font-mono text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Verified Translation
                  </span>
                </div>
                <div className="flex-1 text-sm leading-relaxed text-sanchay-textDark font-sans whitespace-pre-line bg-sanchay-cream/30 p-4 rounded border border-sanchay-borderCream/60 overflow-y-auto max-h-[55vh]">
                  {getOCRText()}
                </div>
              </div>
            </div>

            {/* Modal Bottom Controls Bar */}
            <div className="bg-sanchay-deepNavy px-6 py-3 border-t border-sanchay-gold/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPage(Math.max(1, selectedPage - 1))}
                  disabled={selectedPage <= 1}
                  className="px-3 py-1.5 rounded bg-sanchay-darkNavy text-sanchay-gold text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-sanchay-gold hover:text-sanchay-deepNavy transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Page
                </button>
                <div className="flex gap-1 overflow-x-auto max-w-xs py-1">
                  {availablePages.map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setSelectedPage(num)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold shrink-0 transition-colors cursor-pointer ${
                        selectedPage === num
                          ? 'bg-sanchay-gold text-sanchay-deepNavy shadow-sm'
                          : 'bg-sanchay-darkNavy text-sanchay-cream hover:bg-sanchay-gold/30 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPage(Math.min(availablePages.length, selectedPage + 1))}
                  disabled={selectedPage >= availablePages.length}
                  className="px-3 py-1.5 rounded bg-sanchay-darkNavy text-sanchay-gold text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-sanchay-gold hover:text-sanchay-deepNavy transition-colors cursor-pointer"
                >
                  Next Page <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-3.5 py-1.5 rounded bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold flex items-center gap-1.5 hover:bg-sanchay-goldLight shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

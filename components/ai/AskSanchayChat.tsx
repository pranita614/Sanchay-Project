'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, BookOpen, Volume2, Globe, Sparkles, AlertCircle } from 'lucide-react';
import { askSanchayAI, RAGResponse } from '@/lib/rag/engine';
import { useTranslation, SupportedLanguage } from '@/lib/translations/LanguageContext';
import Link from 'next/link';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

export default function AskSanchayChat() {
  const { language: globalLang, setLanguage: setGlobalLang } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(globalLang || 'English');
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize local language state with global LanguageContext
  useEffect(() => {
    if (globalLang && ['English', 'Marathi', 'Hindi'].includes(globalLang)) {
      setSelectedLang(globalLang as SupportedLanguage);
    }
  }, [globalLang]);

  const handleLangChange = (newLang: SupportedLanguage) => {
    setSelectedLang(newLang);
    setGlobalLang(newLang);
  };

  const getGreeting = (lang: string) => {
    if (lang === 'Marathi') {
      return 'जयभीम! मी "संचय AI" आहे. डॉ. बी. आर. आंबेडकर यांचे दस्तऐवज, पुस्तके, भाषणे आणि ऐतिहासिक नोंदींच्या आधारे मी तुमच्या प्रश्नांची उत्तरे देण्यास उत्सुक आहे. आज तुम्हाला काय विचारायचे आहे?';
    }
    if (lang === 'Hindi') {
      return 'जय भीम! मैं "संचय AI" हूँ। डॉ. बी. आर. आंबेडकर के लेखनों, भाषणों, पुस्तकों एवं ऐतिहासिक अभिलेखों पर आधारित आपकी सहायता के लिए तैयार हूँ। आज आप क्या जानना चाहते हैं?';
    }
    return 'Greetings! I am Ask Sanchay AI, your research assistant grounded strictly in the verified writings, speeches, and archival records of Dr. B. R. Ambedkar. How may I assist your research today?';
  };

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; data?: RAGResponse }>>([
    {
      role: 'assistant',
      text: getGreeting(selectedLang),
    }
  ]);

  // Update initial greeting when language changes if no user messages sent yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', text: getGreeting(selectedLang) }]);
    }
  }, [selectedLang]);

  // Auto-scroll to the bottom of the chat whenever messages or loading state change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sampleQuestionsByLang: Record<string, string[]> = {
    English: [
      "When and where was Dr. Ambedkar born?",
      "What did Ambedkar write about education?",
      "What was the Mahad Satyagraha?",
      "What did Ambedkar write about democracy?"
    ],
    Marathi: [
      "डॉ. आंबेडकरांचा जन्म कधी व कोठे झाला?",
      "महाडचा चवदार तळ्याचा सत्याग्रह काय होता?",
      "डॉ. आंबेडकरांचे शिक्षण व पदव्या कोणत्या होत्या?",
      "जातीचा उच्छेद (Annihilation of Caste) या पुस्तकाबद्दल सांगा."
    ],
    Hindi: [
      "डॉ. आंबेडकर का जन्म कब और कहाँ हुआ था?",
      "महड का चवदार तालाब सत्याग्रह क्या था?",
      "डॉ. आंबेडकर की शिक्षा और डिग्रियां क्या थीं?",
      "भारतीय संविधान में डॉ. आंबेडकर का क्या योगदान था?"
    ]
  };

  const currentSampleQuestions = sampleQuestionsByLang[selectedLang] || sampleQuestionsByLang.English;

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const updatedMsgs = [...messages, { role: 'user' as const, text: q }];
    setMessages(updatedMsgs);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await askSanchayAI({ question: q, language: selectedLang });
      setMessages([...updatedMsgs, { role: 'assistant', text: res.answer, data: res }]);
    } catch (err) {
      setMessages([...updatedMsgs, {
        role: 'assistant',
        text: selectedLang === 'Marathi'
          ? 'अभिलेख निर्देशांकाची चौकशी करताना एक त्रुटी आली.'
          : selectedLang === 'Hindi'
          ? 'पुरालेख अनुक्रमणिका की खोज करते समय एक त्रुटि हुई।'
          : 'An error occurred while querying the archival index.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedLang === 'Marathi') utterance.lang = 'mr-IN';
        else if (selectedLang === 'Hindi') utterance.lang = 'hi-IN';
        else utterance.lang = 'en-US';

        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("TTS is active.");
    }
  };

  const getPlaceholder = () => {
    if (selectedLang === 'Marathi') return 'डॉ. आंबेडकरांचे लेखन, भाषणे किंवा संविधानाबाबत प्रश्न विचारा...';
    if (selectedLang === 'Hindi') return 'डॉ. आंबेडकर के लेखन, भाषण या संविधान के बारे में प्रश्न पूछें...';
    return 'Ask a question about Dr. B. R. Ambedkar\'s writings, speeches, or constitutional work...';
  };

  return (
    <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[640px]">
      
      {/* Left Sidebar: Suggested Questions */}
      <div className="bg-sanchay-deepNavy p-6 text-sanchay-cream border-r border-sanchay-gold/30 flex flex-col justify-between">
        <div>
          <button
            onClick={() => setMessages([{ role: 'assistant', text: getGreeting(selectedLang) }])}
            className="w-full py-3 px-4 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-sm flex items-center justify-center gap-2 mb-6 hover:bg-sanchay-goldLight shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {selectedLang === 'Marathi' ? 'नवीन संवाद सुरू करा' : selectedLang === 'Hindi' ? 'नई चैट शुरू करें' : 'Start New Chat'}
          </button>

          <h3 className="text-xs sm:text-sm font-serif font-bold text-sanchay-gold uppercase tracking-wider mb-4 border-b border-sanchay-gold/30 pb-2">
            {selectedLang === 'Marathi' ? 'नमुन्याचे प्रश्न (Sample Questions)' : selectedLang === 'Hindi' ? 'नमूना प्रश्न (Sample Questions)' : 'Sample Questions'}
          </h3>

          <div className="space-y-3">
            {currentSampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left p-3 rounded-lg bg-sanchay-darkNavy/80 border border-sanchay-gold/20 text-xs sm:text-sm text-sanchay-cream/95 hover:border-sanchay-gold hover:text-sanchay-gold transition-colors block leading-relaxed shadow-xs cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-sanchay-gold/20 text-xs text-sanchay-gold/90 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-sanchay-gold" />
          <span>
            {selectedLang === 'Marathi' ? 'अधिकृत दस्तऐवजांवर आधारित. शून्य भ्रम धोरण.' : selectedLang === 'Hindi' ? 'आधिकारिक अभिलेखों पर आधारित। शून्य भ्रम नीति।' : 'Grounded in official archival records. Zero hallucination policy.'}
          </span>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="lg:col-span-3 flex flex-col bg-sanchay-creamLight">
        
        {/* Header with Prominent Multilingual Language Selector */}
        <div className="bg-sanchay-darkNavy px-6 py-5 border-b border-sanchay-gold/30 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-sanchay-gold flex items-center gap-2.5">
              <Bot className="w-6 h-6 text-sanchay-gold" /> Ask Sanchay AI
            </h1>
            <p className="text-xs sm:text-sm text-sanchay-cream/80 font-sans mt-0.5">
              {selectedLang === 'Marathi' ? 'डॉ. बी. आर. आंबेडकर यांच्या अधिकृत ग्रंथांमधून विश्वासार्ह उत्तरे मिळवा.' : selectedLang === 'Hindi' ? 'डॉ. बी. आर. आंबेडकर के आधिकारिक अभिलेखों से विश्वसनीय उत्तर प्राप्त करें।' : 'Get reliable answers from verified writings, speeches and archival sources of Dr. B. R. Ambedkar.'}
            </p>
          </div>

          {/* Multilingual Selector Dropdown */}
          <div className="flex items-center gap-2 bg-sanchay-deepNavy px-3.5 py-1.5 rounded-lg border-2 border-sanchay-gold/60 shadow-md">
            <Globe className="w-4 h-4 text-sanchay-gold" />
            <select
              value={selectedLang}
              onChange={(e) => handleLangChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-sanchay-cream font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
            >
              <option value="English" className="text-black bg-white">English</option>
              <option value="Marathi" className="text-black bg-white">मराठी (Marathi)</option>
              <option value="Hindi" className="text-black bg-white">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Message Trajectory with Larger Text Font Sizes */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[520px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-sanchay-deepNavy border-2 border-sanchay-gold flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5 text-sanchay-gold" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-xl p-5 text-sm sm:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sanchay-darkNavy text-white font-medium shadow-md'
                    : 'bg-white border border-sanchay-borderCream text-sanchay-textDark shadow-archival'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.text}</div>

                {/* Grounded Citation & Sources Box */}
                {msg.data && msg.data.citations && msg.data.citations.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-sanchay-borderCream bg-[#FBF8EF] p-4 rounded-lg space-y-3">
                    <div className="font-serif font-bold text-sanchay-deepNavy flex items-center gap-2 text-xs sm:text-sm">
                      <BookOpen className="w-4 h-4 text-sanchay-gold" /> Verified Archival Sources:
                    </div>
                    {msg.data.citations.map((c, cIdx) => (
                      <div key={cIdx} className="text-xs sm:text-sm bg-white p-3 rounded-lg border border-sanchay-borderCream shadow-xs">
                        <span className="font-bold text-sanchay-deepNavy">{cIdx + 1}. {c.workTitle}</span> — <span className="text-sanchay-gold font-mono font-bold">{c.volume}{c.pageNumber ? `, Page ${c.pageNumber}` : ''}</span>
                        <div className="italic text-sanchay-textMuted mt-1">"{c.quoteSnippet}"</div>
                        <Link href={c.url} className="inline-block text-xs text-sanchay-darkNavy underline font-bold mt-2 hover:text-sanchay-gold">
                          View Original Archival Source →
                        </Link>
                      </div>
                    ))}

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="px-3 py-1.5 rounded-lg bg-sanchay-deepNavy text-sanchay-gold text-xs font-bold flex items-center gap-1.5 hover:bg-sanchay-darkNavy shadow-xs cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" /> {isSpeaking ? 'Stop Audio' : 'Listen / Audio TTS'}
                      </button>
                      <SaveToStudyPackButton
                        item={{
                          id: `ai-ans-${idx}`,
                          itemType: 'AI_ANSWER',
                          title: `Ask Sanchay AI: ${messages[idx - 1]?.text || 'Archive Response'}`,
                          description: msg.text.substring(0, 200) + '...',
                          url: '/ask-sanchay',
                        }}
                        variant="compact"
                      />
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full bg-sanchay-gold text-sanchay-deepNavy flex items-center justify-center flex-shrink-0 mt-1 font-bold text-sm shadow-sm">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-sm text-sanchay-textMuted italic p-2">
              <Bot className="w-5 h-5 text-sanchay-gold animate-spin" />
              {selectedLang === 'Marathi' ? 'अधिकृत दस्तऐवज शोधत आहे...' : selectedLang === 'Hindi' ? 'आधिकारिक अभिलेख खोजे जा रहे हैं...' : 'Retrieving verified BAWS archival index...'}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Larger Text Font Sizes */}
        <div className="p-4 sm:p-5 bg-white border-t border-sanchay-borderCream">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-sm sm:text-base rounded-lg border-2 border-sanchay-borderCream focus:outline-none focus:border-sanchay-gold bg-[#FBF8EF] text-sanchay-textDark font-sans shadow-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-sm sm:text-base flex items-center gap-2 hover:bg-sanchay-goldLight shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" /> Ask
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

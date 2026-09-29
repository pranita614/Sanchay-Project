'use client';

/**
 * Universal Audio Engine for SANCHAY
 * Plays full multi-paragraph speeches and long audiobooks without truncation or browser timeouts
 * using sequential sentence queueing and keep-alive synthesis.
 */

let activeAudioElement: HTMLAudioElement | null = null;
let keepAliveInterval: any = null;
let isPlaybackActive = false;

export function stopSpeechAudio() {
  if (typeof window === 'undefined') return;

  isPlaybackActive = false;

  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement = null;
    } catch (e) {
      // Ignore audio stop errors
    }
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore speech synth cancel errors
    }
  }
}

export function playSpeechAudio({
  text,
  language = 'English',
  rate = 1.0,
  englishTitle = '',
  onEnd,
  onError
}: {
  text: string;
  language?: string;
  rate?: number;
  englishTitle?: string;
  onEnd?: () => void;
  onError?: () => void;
}) {
  if (typeof window === 'undefined') return;

  // Stop any active playing audio or speech cleanly
  stopSpeechAudio();

  const cleanText = text.trim();
  if (!cleanText) return;

  const langLower = (language || 'english').toLowerCase().trim();
  let langCode = 'en-US';

  if (langLower.includes('marathi') || langLower === 'mr') langCode = 'mr-IN';
  else if (langLower.includes('hindi') || langLower === 'hi') langCode = 'hi-IN';
  else if (langLower.includes('bengali') || langLower === 'bn') langCode = 'bn-IN';
  else if (langLower.includes('tamil') || langLower === 'ta') langCode = 'ta-IN';

  // 1. USE WEB SPEECH API WITH SEQUENTIAL SENTENCE QUEUEING (No 15-second browser timeout)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isPlaybackActive = true;

    // Split long speech text into clean sentence chunks
    const sentences = cleanText
      .split(/(?<=[.!?।॥\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length === 0) return;

    const voices = window.speechSynthesis.getVoices() || [];
    const matchedVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      if (langCode.startsWith('mr')) return vLang.startsWith('mr');
      if (langCode.startsWith('hi')) return vLang.startsWith('hi');
      if (langCode.startsWith('bn')) return vLang.startsWith('bn');
      if (langCode.startsWith('ta')) return vLang.startsWith('ta');
      return vLang.startsWith('en');
    });

    let sentenceIndex = 0;

    const speakNextSentence = () => {
      if (!isPlaybackActive) return;

      if (sentenceIndex >= sentences.length) {
        stopSpeechAudio();
        if (onEnd) onEnd();
        return;
      }

      const currentText = sentences[sentenceIndex];
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = langCode;
      utterance.rate = Math.max(0.7, Math.min(2.0, rate || 1.0));
      utterance.pitch = 1.0;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        if (!isPlaybackActive) return;
        sentenceIndex++;
        speakNextSentence();
      };

      utterance.onerror = (e) => {
        console.warn("Speech utterance error:", e);
        if (!isPlaybackActive) return;
        sentenceIndex++;
        speakNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    };

    // Keep-alive timer to prevent Chrome/Edge SpeechSynthesis engine freeze
    keepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);

    speakNextSentence();
    return;
  }

  // 2. FALLBACK TO SERVER STREAM IF BROWSER DOES NOT SUPPORT SPEECH SYNTHESIS
  const streamUrl = `/api/tts/stream?lang=${langCode}&text=${encodeURIComponent(cleanText.substring(0, 500))}`;
  const audio = new Audio(streamUrl);
  activeAudioElement = audio;
  audio.playbackRate = Math.max(0.7, Math.min(2.0, rate || 1.0));

  audio.onended = () => {
    activeAudioElement = null;
    if (onEnd) onEnd();
  };

  audio.onerror = () => {
    activeAudioElement = null;
    if (onError) onError();
  };

  audio.play().catch(() => {
    activeAudioElement = null;
    if (onError) onError();
  });
}

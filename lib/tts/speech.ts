// Multilingual Text-to-Speech Engine for SANCHAY

export interface TTSOptions {
  text: string;
  language: string;
  voice?: string;
  speed?: number;
}

export interface TTSResult {
  audioUrl?: string;
  audioBuffer?: ArrayBuffer;
  language: string;
  isSynthetic: boolean;
  attributionLabel: string;
  supported: boolean;
  message?: string;
}

export const SUPPORTED_TTS_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'mr', name: 'Marathi' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'or', name: 'Odia' },
  { code: 'as', name: 'Assamese' }
];

export function generateTTS(options: TTSOptions): TTSResult {
  const { text, language = 'English' } = options;

  const matchedLang = SUPPORTED_TTS_LANGUAGES.find(
    l => l.name.toLowerCase() === language.toLowerCase() || l.code.toLowerCase() === language.toLowerCase()
  );

  if (!matchedLang) {
    return {
      language,
      isSynthetic: true,
      attributionLabel: "AI-generated Text-to-Speech",
      supported: false,
      message: `TTS is currently unavailable for this language.`
    };
  }

  // Provide synthetic Web Speech / audio stream metadata
  return {
    audioUrl: `/api/tts/stream?lang=${matchedLang.code}&text=${encodeURIComponent(text.substring(0, 200))}`,
    language: matchedLang.name,
    isSynthetic: true,
    attributionLabel: "AI-generated Text-to-Speech",
    supported: true
  };
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || '';
  const lang = searchParams.get('lang') || 'en';

  if (!text.trim()) {
    return new NextResponse('Text parameter is required', { status: 400 });
  }

  // Clean text and take up to first 250 characters for immediate streaming
  const cleanedText = text.trim().substring(0, 250);

  // Normalize language codes
  let langCode = lang.toLowerCase().trim();
  if (langCode.includes('marathi') || langCode === 'mr') langCode = 'mr';
  else if (langCode.includes('hindi') || langCode === 'hi') langCode = 'hi';
  else if (langCode.includes('bengali') || langCode === 'bn') langCode = 'bn';
  else if (langCode.includes('tamil') || langCode === 'ta') langCode = 'ta';
  else langCode = 'en';

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanedText)}&tl=${langCode}&client=tw-ob`;

  try {
    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      return new NextResponse('Audio stream fetch failed', { status: 500 });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, immutable'
      }
    });
  } catch (err) {
    return new NextResponse('TTS Stream Failed', { status: 500 });
  }
}

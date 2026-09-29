import { NextRequest, NextResponse } from 'next/server';
import { generateTTS } from '@/lib/tts/speech';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language, speed } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const ttsResult = generateTTS({ text, language, speed });
    return NextResponse.json(ttsResult);
  } catch (error) {
    return NextResponse.json({ error: 'TTS synthesis error' }, { status: 500 });
  }
}

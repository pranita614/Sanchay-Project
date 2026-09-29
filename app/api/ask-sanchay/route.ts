import { NextRequest, NextResponse } from 'next/server';
import { askSanchayAI } from '@/lib/rag/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, language } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const response = await askSanchayAI({ question, language });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process RAG query' }, { status: 500 });
  }
}

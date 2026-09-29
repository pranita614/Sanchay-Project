import { NextRequest, NextResponse } from 'next/server';
import { performSearch } from '@/lib/search/hybrid-search';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const mode = (searchParams.get('mode') as any) || 'HYBRID';
  const collectionType = searchParams.get('collectionType') || undefined;
  const language = searchParams.get('language') || undefined;

  const results = performSearch({
    query,
    mode,
    collectionType,
    language
  });

  return NextResponse.json({
    success: true,
    count: results.length,
    results
  });
}

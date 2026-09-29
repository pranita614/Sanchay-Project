import { NextRequest, NextResponse } from 'next/server';
import dbStore from '@/lib/db/prisma';
import { getSharedStudyPackFromDisk } from '@/lib/study-pack/disk-store';

export async function GET(req: NextRequest, props: { params: Promise<{ token: string }> }) {
  try {
    const params = await props.params;
    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 1. Check memory dbStore
    let foundPack = dbStore.studyPacks.find((p: any) => p.shareToken === token);

    // 2. Check disk store
    if (!foundPack) {
      foundPack = getSharedStudyPackFromDisk(token);
    }

    // 3. Fallback: Check if base64 encoded token format SP-DATA-...
    if (!foundPack && token.startsWith('SP-DATA-')) {
      try {
        const base64Str = token.replace('SP-DATA-', '');
        const jsonStr = Buffer.from(base64Str, 'base64').toString('utf-8');
        foundPack = JSON.parse(jsonStr);
      } catch (e) {
        console.warn('Failed to parse base64 study pack token:', e);
      }
    }

    if (foundPack) {
      return NextResponse.json({
        success: true,
        studyPack: foundPack,
      });
    }

    return NextResponse.json({ error: 'Study pack not found or link expired' }, { status: 404 });
  } catch (err: any) {
    console.error('Error fetching shared study pack:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

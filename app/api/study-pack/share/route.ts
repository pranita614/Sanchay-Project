import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import dbStore from '@/lib/db/prisma';
import { saveSharedStudyPackToDisk } from '@/lib/study-pack/disk-store';

function getLocalIpAddress(): string {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch (e) {
    console.error('Failed to resolve local IP address:', e);
  }
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, title = 'My Study Pack' } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Study pack cannot be empty' }, { status: 400 });
    }

    // Generate unique token e.g. SP-8A3F9K
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const shareToken = `SP-${randomHex}`;

    const rawHost = req.headers.get('host') || 'localhost:3000';
    const port = rawHost.includes(':') ? rawHost.split(':')[1] : '3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const origin = req.nextUrl.origin || `${protocol}://${rawHost}`;

    const localIp = getLocalIpAddress();
    
    // Web URL for desktop browser
    const shareUrl = `${origin}/study-pack/share/${shareToken}`;
    
    // Mobile URL replacing localhost with LAN IP address so phone camera scan works!
    const mobileShareUrl = rawHost.includes('localhost') || rawHost.includes('127.0.0.1')
      ? `${protocol}://${localIp}:${port}/study-pack/share/${shareToken}`
      : shareUrl;

    const studyPackPayload = {
      shareToken,
      title,
      items: items.map((item: any, idx: number) => ({
        itemType: item.itemType || 'DOCUMENT',
        itemId: item.itemId || item.id || `item-${idx}`,
        title: item.title || 'Untitled Archive Item',
        description: item.description || '',
        url: item.url || '/explore',
        metadata: item.metadata || {},
        position: idx,
      })),
      createdAt: new Date().toISOString(),
    };

    // Store in dbStore memory
    dbStore.studyPacks.push(studyPackPayload);

    // Store persistently on disk
    saveSharedStudyPackToDisk(shareToken, studyPackPayload);

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl,
      mobileShareUrl,
      itemCount: items.length,
      studyPack: studyPackPayload,
    });
  } catch (err: any) {
    console.error('Error creating shared study pack:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

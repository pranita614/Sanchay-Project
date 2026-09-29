import { NextRequest, NextResponse } from 'next/server';
import { sendStudyPackEmail } from '@/lib/study-pack/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientEmail, shareUrl, shareToken, items = [] } = body;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid recipient email address is required' }, { status: 400 });
    }

    if (!shareUrl) {
      return NextResponse.json({ error: 'Share URL is required' }, { status: 400 });
    }

    const result = await sendStudyPackEmail({
      recipientEmail,
      shareUrl,
      shareToken: shareToken || 'SP-SHARED',
      itemCount: items.length,
      items,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      mailtoUrl: result.mailtoUrl,
    });
  } catch (err: any) {
    console.error('Error in study pack email endpoint:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

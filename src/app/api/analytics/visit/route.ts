import { NextRequest, NextResponse } from 'next/server';
import { newVisitorId, recordVisit } from '@/lib/analytics';
import { allowPublicRequest } from '@/platform/public-api';

export async function POST(request: NextRequest) {
  if (!await allowPublicRequest(request, 'site-visit', 120, 60 * 60)) {
    return NextResponse.json({ ok: true });
  }
  const visitorId = request.cookies.get('sp_visitor')?.value || newVisitorId();
  try {
    await recordVisit(visitorId);
    const response = NextResponse.json({ ok: true });
    if (!request.cookies.get('sp_visitor')) {
      response.cookies.set('sp_visitor', visitorId, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 365, path: '/' });
    }
    return response;
  } catch (error) {
    console.error('Traffic tracking failed', error);
    return NextResponse.json({ ok: true });
  }
}

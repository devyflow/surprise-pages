import { NextResponse } from 'next/server';
import { getTrafficSummary } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { displayedCount } = await getTrafficSummary();
    return NextResponse.json({ count: displayedCount }, { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } });
  } catch {
    return NextResponse.json({ count: null });
  }
}

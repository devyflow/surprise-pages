import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/platform/auth';
import { audit } from '@/platform/audit';
import { setVisitorCountSetting } from '@/lib/analytics';

const schema = z.object({ mode: z.enum(['actual', 'custom', 'hidden']), customCount: z.number().int().min(0).max(1_000_000_000) });

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid visitor-count setting' }, { status: 422 });
    await setVisitorCountSetting(parsed.data, admin.id);
    await audit({ adminId: admin.id, action: 'update_visitor_count', targetType: 'site_setting', targetId: 'visitor_count', details: parsed.data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update visitor count', error);
    return NextResponse.json({ error: 'Could not save the setting' }, { status: 500 });
  }
}

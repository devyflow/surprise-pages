import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/platform/auth';
import { getSupabaseServerClient } from '@/lib/supabase';
import { audit } from '@/platform/audit';

const schema = z.object({ status: z.enum(['new', 'in_progress', 'delivered']), internalNotes: z.string().trim().max(2000).optional() });

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid update' }, { status: 422 });
    const { error } = await getSupabaseServerClient().from('manual_requests').update({ status: parsed.data.status, internal_notes: parsed.data.internalNotes ?? null }).eq('id', params.id);
    if (error) throw error;
    await audit({ adminId: admin.id, action: 'update_manual_request', targetType: 'manual_request', targetId: params.id, details: { status: parsed.data.status } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update manual request', error);
    return NextResponse.json({ error: 'Could not update request' }, { status: 500 });
  }
}

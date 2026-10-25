import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/platform/auth';
import { audit } from '@/platform/audit';
import { updateOrderOperations } from '@/lib/customer-ops';

const schema = z.object({
  fulfillmentStatus: z.enum(['awaiting_payment', 'paid', 'in_production', 'needs_customer', 'ready', 'delivered', 'cancelled', 'refunded']),
  internalNotes: z.string().trim().max(2000).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = await requireAdmin();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid update' }, { status: 422 });
    const order = await updateOrderOperations(params.slug, parsed.data);
    await audit({ adminId: admin.id, action: 'update_fulfillment', targetType: 'order', targetId: order.id, details: { slug: params.slug, status: parsed.data.fulfillmentStatus } });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    console.error('Failed to update order', error);
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/platform/auth';
import { audit } from '@/platform/audit';
import { OrderNotFoundError, takeDownOrder } from '@/lib/orders';

export async function POST(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = await requireAdmin();
    const order = await takeDownOrder(params.slug);
    await audit({ adminId: admin.id, action: 'takedown_page', targetType: 'order', targetId: order.id, details: { slug: order.slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OrderNotFoundError) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    console.error('Failed to take down order', error);
    return NextResponse.json({ error: 'Could not take down the page' }, { status: 500 });
  }
}

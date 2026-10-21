import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';
import { createOrderInputSchema } from '@/lib/validation';
import { getSupabaseSessionClient } from '@/platform/supabase/server';
import { allowPublicRequest } from '@/platform/public-api';

export async function POST(request: NextRequest) {
  if (!await allowPublicRequest(request, 'draft-order', 8, 60 * 60)) {
    return NextResponse.json({ error: 'Too many draft attempts. Please try again later.' }, { status: 429 });
  }
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createOrderInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    // Accounts are optional for checkout, but when a user is signed in we
    // attach the order server-side so it appears in their private dashboard.
    const { data: { user } } = await getSupabaseSessionClient().auth.getUser();
    const order = await createOrder(parsed.data, user?.id ?? null);
    return NextResponse.json(
      { slug: order.slug, status: order.status },
      { status: 201 }
    );
  } catch (err) {
    console.error('Failed to create order', err);
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  }
}

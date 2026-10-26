import { NextRequest, NextResponse } from 'next/server';
import { getOrder, markPaymentStarted, OrderNotFoundError } from '@/lib/orders';
import { createRazorpayOrder } from '@/lib/razorpay';
import { allowPublicRequest } from '@/platform/public-api';

/**
 * POST /api/orders/:slug/pay
 * Creates a Razorpay order for the given draft and returns what the
 * client-side Razorpay Checkout widget needs to open the payment sheet.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!await allowPublicRequest(request, 'start-payment', 12, 60 * 60)) {
      return NextResponse.json({ error: 'Too many payment attempts. Please try again later.' }, { status: 429 });
    }
    const order = await getOrder(params.slug);

    if (order.status === 'published') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
    }

    const paymentOrder = await createRazorpayOrder(order.priceInPaise, order.slug);

    await markPaymentStarted(order.slug, paymentOrder.gatewayOrderId);

    return NextResponse.json({
      razorpayOrderId: paymentOrder.gatewayOrderId,
      amountInPaise: paymentOrder.amountInPaise,
      currency: paymentOrder.currency,
      keyId: paymentOrder.keyId,
    });
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (typeof err === 'object' && err !== null && 'statusCode' in err && err.statusCode === 401) {
      return NextResponse.json({ error: 'Razorpay authentication failed' }, { status: 401 });
    }
    console.error('Failed to initiate payment', err);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}

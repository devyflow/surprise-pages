import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getOrderWithPublicTokenAndPin, InvalidPinError, OrderNotFoundError } from '@/lib/orders';
import { getTemplateDefinition } from '@/lib/templates';
import PinGate from '@/components/PinGate';
import Tier3Locked from '@/components/templates/Tier3Locked';
import { rateLimit } from '@/platform/rate-limit';

interface PageProps {
  params: { slug: string };
  searchParams: { pin?: string };
}

export const metadata = { robots: { index: false, follow: false } };

/**
 * This route never imports Tier1Template directly — it asks the registry
 * for whichever component matches order.config.tier. Tier2/3/4 pages will
 * reuse this exact route with zero changes (Open/Closed).
 */
export default async function LivePage({ params, searchParams }: PageProps) {
  const pin = searchParams.pin ?? '';

  if (pin.length !== 4) {
    return <PinGate slug={params.slug} />;
  }

  try {
    const order = await getOrderWithPublicTokenAndPin(params.slug, pin);

    if (order.status !== 'published') {
      return (
        <main className="min-h-screen flex items-center justify-center text-white/70 px-6 text-center">
          This link isn&apos;t active yet — the recipient may still be waiting on payment.
        </main>
      );
    }

    // Do not pass config (photos, media, message, URLs) into React's server
    // payload until the server itself confirms the capsule has unlocked.
    if (order.config.tier === 'tier3' && new Date(order.config.data.revealAt).getTime() > Date.now()) {
      return <Tier3Locked recipientName={order.config.data.recipientName} unlockAt={order.config.data.revealAt} accentColor={order.config.data.accentColor} />;
    }

    const { Component } = getTemplateDefinition(order.config.tier);
    return <Component config={order.config.data} isPreview={false} />;
  } catch (err) {
    if (err instanceof InvalidPinError) {
      const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
      const allowed = await rateLimit(`page-pin:${params.slug}:${ip}`, 5, 5 * 60);
      if (!allowed) return <PinGate slug={params.slug} error="Too many PIN attempts. Please wait a few minutes." />;
      return <PinGate slug={params.slug} error="Incorrect PIN — try again." />;
    }
    if (err instanceof OrderNotFoundError) {
      notFound();
    }
    throw err;
  }
}

import { getSupabaseServerClient } from '@/lib/supabase';
import { notifyManualRequest } from '@/lib/email';
import type { ManualRequest, ManualRequestInput } from '@/types';

interface ManualRequestRow {
  id: string;
  tier: ManualRequest['tier'];
  recipient_name: string;
  contact_email: string;
  contact_phone: string | null;
  preferred_contact: ManualRequest['preferredContact'];
  contact_consent: boolean;
  sender_name: string | null;
  occasion: string | null;
  relationship: string | null;
  tone: string | null;
  preferred_language: string | null;
  requested_delivery_at: string | null;
  message: string | null;
  notes: string | null;
  status: ManualRequest['status'];
  created_at: string;
}

function toManualRequest(row: ManualRequestRow): ManualRequest {
  return {
    id: row.id, tier: row.tier, recipientName: row.recipient_name, contactEmail: row.contact_email,
    contactPhone: row.contact_phone ?? undefined, preferredContact: row.preferred_contact,
    contactConsent: row.contact_consent, senderName: row.sender_name ?? undefined,
    occasion: row.occasion ?? undefined, relationship: row.relationship ?? undefined,
    tone: row.tone ?? undefined, preferredLanguage: row.preferred_language ?? undefined,
    requestedDeliveryAt: row.requested_delivery_at ?? undefined,
    message: row.message ?? undefined, notes: row.notes ?? undefined,
    status: row.status, createdAt: row.created_at,
  };
}

export async function submitManualRequest(input: ManualRequestInput): Promise<ManualRequest> {
  const { data, error } = await getSupabaseServerClient()
    .from('manual_requests')
    .insert({
      tier: input.tier, recipient_name: input.recipientName, contact_email: input.contactEmail,
      contact_phone: input.contactPhone ?? null, preferred_contact: input.preferredContact,
      contact_consent: input.contactConsent, sender_name: input.senderName ?? null,
      occasion: input.occasion ?? null, relationship: input.relationship ?? null,
      tone: input.tone ?? null, preferred_language: input.preferredLanguage ?? null,
      requested_delivery_at: input.requestedDeliveryAt ?? null,
      message: input.message ?? null, notes: input.notes ?? null, status: 'new',
    })
    .select()
    .single<ManualRequestRow>();

  if (error || !data) throw new Error(`Failed to create manual request: ${error?.message ?? 'unknown error'}`);

  const request = toManualRequest(data);
  try {
    await notifyManualRequest(request);
  } catch (err) {
    console.error('Failed to notify about new manual request', request.id, err);
  }
  return request;
}

import { getSupabaseServerClient } from '@/lib/supabase';
import type { CustomerContact, CustomerNeeds, FulfillmentStatus } from '@/types';

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  preferred_contact: CustomerContact['preferredContact'];
  contact_consent: boolean;
}

export async function upsertCustomer(contact: CustomerContact): Promise<CustomerRow> {
  const supabase = getSupabaseServerClient();
  const normalizedEmail = contact.email.trim().toLowerCase();
  const { data: existing, error: findError } = await supabase
    .from('customers')
    .select('id, full_name, email, phone, preferred_contact, contact_consent')
    .ilike('email', normalizedEmail)
    .maybeSingle<CustomerRow>();

  if (findError) throw new Error(`Failed to find customer: ${findError.message}`);

  const values = {
    full_name: contact.fullName.trim(),
    email: normalizedEmail,
    phone: contact.phone?.trim() || null,
    preferred_contact: contact.preferredContact,
    contact_consent: contact.contactConsent,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase.from('customers').update(values).eq('id', existing.id).select().single<CustomerRow>();
    if (error || !data) throw new Error(`Failed to update customer: ${error?.message ?? 'unknown error'}`);
    return data;
  }

  const { data, error } = await supabase.from('customers').insert(values).select().single<CustomerRow>();
  if (error || !data) throw new Error(`Failed to create customer: ${error?.message ?? 'unknown error'}`);
  return data;
}

export async function updateOrderOperations(
  slug: string,
  fields: { fulfillmentStatus: FulfillmentStatus; internalNotes?: string },
) {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .update({ fulfillment_status: fields.fulfillmentStatus, internal_notes: fields.internalNotes ?? null })
    .eq('slug', slug)
    .select('id, slug, fulfillment_status, internal_notes')
    .single();
  if (error || !data) throw new Error(`Failed to update order operations: ${error?.message ?? 'unknown error'}`);
  return data;
}

export function needsToRow(needs: CustomerNeeds) {
  return {
    occasion: needs.occasion,
    relationship: needs.relationship,
    tone: needs.tone,
    preferred_language: needs.preferredLanguage,
    requested_delivery_at: needs.requestedDeliveryAt || null,
    special_requests: needs.specialRequests || null,
  };
}

import { getSupabaseServerClient } from '@/lib/supabase';
import { createPublicToken, createSlug } from '@/lib/slug';
import { getTemplateDefinition } from '@/lib/templates';
import type { CreateOrderInput, Order, OrderStatus } from '@/types';
import { needsToRow, upsertCustomer } from '@/lib/customer-ops';

interface OrderRow {
  id: string;
  slug: string;
  public_token: string;
  status: OrderStatus;
  config: Order['config'];
  price_in_paise: number;
  pin_code: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  owner_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export class OrderNotFoundError extends Error {
  constructor(slug: string) {
    super(`Order not found for slug "${slug}"`);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidPinError extends Error {
  constructor() {
    super('Incorrect PIN');
    this.name = 'InvalidPinError';
  }
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    slug: row.slug,
    publicToken: row.public_token,
    status: row.status,
    config: row.config,
    priceInPaise: row.price_in_paise,
    pinCode: row.pin_code,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}

export async function createOrder(input: CreateOrderInput, ownerId: string | null): Promise<Order> {
  const slug = createSlug(input.config.data.recipientName);
  const publicToken = createPublicToken();
  const priceInPaise = getTemplateDefinition(input.config.tier).priceInPaise;
  const customer = await upsertCustomer(input.customer);
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .insert({
      slug,
      public_token: publicToken,
      status: 'draft',
      fulfillment_status: 'awaiting_payment',
      config: input.config,
      price_in_paise: priceInPaise,
      pin_code: input.pinCode,
      owner_id: ownerId,
      customer_id: customer.id,
      ...needsToRow(input.needs),
    })
    .select()
    .single<OrderRow>();

  if (error || !data) throw new Error(`Failed to create order: ${error?.message ?? 'unknown error'}`);
  return toOrder(data);
}

/** Returns only the orders explicitly linked to this signed-in customer. */
export async function getOrdersForOwner(ownerId: string): Promise<Order[]> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select()
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch account orders: ${error.message}`);
  return (data ?? []).map((row) => toOrder(row as OrderRow));
}

export async function getOrder(slug: string): Promise<Order> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select()
    .eq('slug', slug)
    .maybeSingle<OrderRow>();

  if (error) throw new Error(`Failed to fetch order ${slug}: ${error.message}`);
  if (!data) throw new OrderNotFoundError(slug);
  return toOrder(data);
}

export async function getOrderByPublicToken(publicToken: string): Promise<Order> {
  const { data, error } = await getSupabaseServerClient().from('orders').select().eq('public_token', publicToken).maybeSingle<OrderRow>();
  if (error) throw new Error(`Failed to fetch public page: ${error.message}`);
  if (!data) throw new OrderNotFoundError(publicToken);
  return toOrder(data);
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select()
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle<OrderRow>();

  if (error) throw new Error(`Failed to fetch Razorpay order: ${error.message}`);
  if (!data) throw new OrderNotFoundError(razorpayOrderId);
  return toOrder(data);
}

export async function getOrderWithPin(slug: string, pinCode: string): Promise<Order> {
  const order = await getOrder(slug);
  if (order.pinCode !== pinCode) throw new InvalidPinError();
  return order;
}

export async function getOrderWithPublicTokenAndPin(publicToken: string, pinCode: string): Promise<Order> {
  const order = await getOrderByPublicToken(publicToken);
  if (order.pinCode !== pinCode) throw new InvalidPinError();
  return order;
}

export async function markPaymentStarted(slug: string, razorpayOrderId: string): Promise<Order> {
  return updateOrder(slug, 'previewing', { razorpay_order_id: razorpayOrderId });
}

export async function publishOrder(slug: string, razorpayPaymentId: string): Promise<Order> {
  const existing = await getOrder(slug);
  // Razorpay can retry webhooks. Keep a completed order immutable.
  if (existing.status === 'published') return existing;
  return updateOrder(slug, 'published', {
    razorpay_payment_id: razorpayPaymentId,
    paid_at: new Date().toISOString(),
    fulfillment_status: 'paid',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  });
}

/** Admin-only caller: makes a published recipient page immediately unavailable. */
export async function takeDownOrder(slug: string): Promise<Order> {
  return updateOrder(slug, 'expired', {});
}

async function updateOrder(
  slug: string,
  status: OrderStatus,
  fields: Record<string, string>
): Promise<Order> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .update({ status, ...fields })
    .eq('slug', slug)
    .select()
    .single<OrderRow>();

  if (error || !data) throw new Error(`Failed to update order ${slug}: ${error?.message ?? 'unknown error'}`);
  return toOrder(data);
}

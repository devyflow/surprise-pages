'use client';

import { useState } from 'react';
import type { FulfillmentStatus } from '@/types';

const OPTIONS: { value: FulfillmentStatus; label: string }[] = [
  { value: 'awaiting_payment', label: 'Awaiting payment' }, { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' }, { value: 'needs_customer', label: 'Needs customer' },
  { value: 'ready', label: 'Ready' }, { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }, { value: 'refunded', label: 'Refunded' },
];

export default function OrderOperationsControl({ slug, initialStatus, initialNotes }: { slug: string; initialStatus: FulfillmentStatus; initialNotes?: string | null }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  async function save() {
    setState('saving');
    const res = await fetch(`/api/admin/orders/${slug}/operations`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fulfillmentStatus: status, internalNotes: notes }) });
    setState(res.ok ? 'saved' : 'error');
  }
  return <div className="sp-admin-ops"><select value={status} onChange={(e) => setStatus(e.target.value as FulfillmentStatus)}>{OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Private production notes" maxLength={2000} /><button className="sp-admin-button" type="button" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save'}</button>{state === 'saved' && <small>Saved</small>}{state === 'error' && <small className="error">Could not save</small>}</div>;
}

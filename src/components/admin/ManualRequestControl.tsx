'use client';

import { useState } from 'react';

export default function ManualRequestControl({ id, initialStatus, initialNotes }: { id: string; initialStatus: 'new' | 'in_progress' | 'delivered'; initialNotes?: string | null }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [message, setMessage] = useState('');
  async function save() {
    setMessage('Saving…');
    const res = await fetch(`/api/admin/manual-requests/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, internalNotes: notes }) });
    setMessage(res.ok ? 'Saved' : 'Could not save');
  }
  return <div className="sp-admin-ops"><select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="new">New</option><option value="in_progress">In progress</option><option value="delivered">Delivered</option></select><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Private notes" /><button type="button" className="sp-admin-button" onClick={save}>Save</button><small>{message}</small></div>;
}

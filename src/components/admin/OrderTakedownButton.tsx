'use client';

import { useState } from 'react';

export default function OrderTakedownButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (done) return <span className="sp-admin-status">Taken down</span>;

  async function takeDown() {
    if (!window.confirm('Take this page down immediately? Its recipient link will stop working.')) return;
    setLoading(true); setError(null);
    const response = await fetch(`/api/admin/orders/${slug}/takedown`, { method: 'POST' });
    if (response.ok) setDone(true); else setError('Could not take down page.');
    setLoading(false);
  }

  return <div><button type="button" onClick={takeDown} disabled={loading} className="sp-admin-button danger">{loading ? 'Taking down…' : 'Take down'}</button>{error && <p className="sp-admin-notice error">{error}</p>}</div>;
}

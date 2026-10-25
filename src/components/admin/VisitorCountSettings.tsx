'use client';

import { useState } from 'react';
import type { VisitorCountSetting } from '@/lib/analytics';

export default function VisitorCountSettings({ actualCount, initial }: { actualCount: number; initial: VisitorCountSetting }) {
  const [mode, setMode] = useState(initial.mode);
  const [customCount, setCustomCount] = useState(initial.customCount);
  const [message, setMessage] = useState('');
  async function save() {
    setMessage('Saving…');
    const res = await fetch('/api/admin/settings/visitor-count', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, customCount }) });
    setMessage(res.ok ? 'Saved. The public footer is updated.' : 'Could not save.');
  }
  return <div className="sp-admin-card sp-admin-settings"><h2>Public visitor count</h2><p>The original count is always preserved internally: <strong>{actualCount.toLocaleString('en-IN')}</strong> unique daily visitors recorded.</p><label><input type="radio" checked={mode === 'actual'} onChange={() => setMode('actual')} /> Show the actual count</label><label><input type="radio" checked={mode === 'custom'} onChange={() => setMode('custom')} /> Show a custom display count</label>{mode === 'custom' && <input className="sp-admin-code" type="number" min={0} value={customCount} onChange={(e) => setCustomCount(Math.max(0, Number(e.target.value)))} />}<label><input type="radio" checked={mode === 'hidden'} onChange={() => setMode('hidden')} /> Hide the count publicly</label><div><button className="sp-admin-button" type="button" onClick={save}>Save setting</button> <span className="sp-admin-inline-status">{message}</span></div><p className="sp-admin-hint">Changing the displayed number never overwrites the real analytics.</p></div>;
}

'use client';

import { useEffect, useState } from 'react';

function remaining(unlockAt: string) {
  return Math.max(0, new Date(unlockAt).getTime() - Date.now());
}

/** Receives no private page content; safe to render before a capsule unlocks. */
export default function Tier3Locked({ recipientName, unlockAt, accentColor }: { recipientName: string; unlockAt: string; accentColor: string }) {
  const [ms, setMs] = useState(() => remaining(unlockAt));
  useEffect(() => {
    const timer = window.setInterval(() => setMs(remaining(unlockAt)), 1000);
    return () => window.clearInterval(timer);
  }, [unlockAt]);
  const seconds = Math.floor(ms / 1000);
  const units = [
    [Math.floor(seconds / 86400), 'days'], [Math.floor((seconds % 86400) / 3600), 'hrs'],
    [Math.floor((seconds % 3600) / 60), 'min'], [seconds % 60, 'sec'],
  ];
  return <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center dark-surface" style={{ background: `radial-gradient(circle at top, ${accentColor}18, #0a0a0c 60%)` }}>
    <p className="text-white/50 text-sm mb-3 uppercase tracking-widest">Something&apos;s waiting for {recipientName || 'you'}</p>
    <div className="flex gap-4 mb-6">{units.map(([value, label]) => <div key={String(label)} className="flex flex-col items-center"><span className="text-3xl font-semibold text-white tabular-nums">{String(value).padStart(2, '0')}</span><span className="text-xs text-white/50">{label}</span></div>)}</div>
    <p className="text-white/40 text-xs">It&apos;ll open on its own — no need to refresh.</p>
  </main>;
}

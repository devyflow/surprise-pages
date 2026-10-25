'use client';

import { useEffect } from 'react';

export default function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('sp_visit_recorded')) return;
    sessionStorage.setItem('sp_visit_recorded', '1');
    void fetch('/api/analytics/visit', { method: 'POST', keepalive: true });
  }, []);
  return null;
}

'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    void fetch('/api/analytics/visitor-count').then((res) => res.json()).then((body) => {
      if (typeof body.count === 'number') setCount(body.count);
    }).catch(() => undefined);
  }, []);
  if (count === null) return null;
  return <span>{count.toLocaleString('en-IN')} people have visited</span>;
}

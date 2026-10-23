import type { Metadata } from 'next';
import { DiscoveryLanding } from '@/components/discovery/DiscoveryLanding';

export const metadata: Metadata = {
  title: 'Discover thoughtful gifts — Surprise Pages',
  description: 'A curated way to find uncommon gifts from small Indian businesses, with evidence-led seller Trust Passports.',
};

export default function DiscoverPage() {
  return <DiscoveryLanding />;
}

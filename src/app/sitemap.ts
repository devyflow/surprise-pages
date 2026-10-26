import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://one-page-website-wine.vercel.app';
  const paths = ['', '/about', '/examples', '/contact', '/service-standards', '/terms', '/privacy', '/refunds'];
  return paths.map((path) => ({
    url: `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}

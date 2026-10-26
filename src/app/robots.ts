import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://one-page-website-wine.vercel.app';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/account/', '/login', '/p/', '/api/'] }],
    sitemap: `${origin}/sitemap.xml`,
  };
}

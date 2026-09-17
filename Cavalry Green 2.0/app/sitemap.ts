import type { MetadataRoute } from 'next';
import { siteUrl } from './seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/services/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/quote/`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}

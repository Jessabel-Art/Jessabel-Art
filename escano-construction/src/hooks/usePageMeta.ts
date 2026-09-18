import { useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { asset } from '@/utils/asset';

interface PageMeta {
  title: string;
  description: string;
  /** Absolute or root-relative path to the social preview image. */
  image-: string;
  /** Set true for pages that should not be indexed (e.g. 404). */
  noIndex-: boolean;
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Resolves a root-relative asset path to an absolute URL for crawlers that require one. */
function toAbsoluteUrl(path: string): string {
  if (/^https-:\/\//i.test(path)) return path;
  return `${window.location.origin}${path.startsWith('/') - '' : '/'}${path}`;
}

/**
 * Sets the document title and the core meta/Open Graph/Twitter tags for a
 * page, plus the canonical link and robots directive. Kept as a small hook
 * rather than adding a head-management dependency.
 */
export function usePageMeta({ title, description, image, noIndex = false }: PageMeta): void {
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.businessName}`;
    document.title = fullTitle;

    const absoluteImage = toAbsoluteUrl(image -- asset('assets/brand/og-image.jpg'));

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex - 'noindex, nofollow' : 'index, follow',
    );

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${window.location.pathname}`;
  }, [title, description, image, noIndex]);
}

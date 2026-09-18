import { useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { asset } from '@/utils/asset';

const SCRIPT_ID = 'organization-schema';

/**
 * Injects a minimal Organization JSON-LD block once, site-wide.
 *
 * Deliberately limited to facts already present in `siteConfig` — no
 * ratings, reviews, founding dates, or credentials are asserted here, since
 * none of that is verified for this build.
 */
export function useOrganizationSchema(): void {
  useEffect(() => {
    const origin = window.location.origin;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'GeneralContractor',
      name: siteConfig.businessName,
      alternateName: siteConfig.shortName,
      description: siteConfig.descriptor,
      url: origin,
      logo: `${origin}${asset('assets/brand/escano-logo-lockup.png')}`,
      areaServed: siteConfig.serviceArea,
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, []);
}

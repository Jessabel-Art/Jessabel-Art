import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useOrganizationSchema } from '@/hooks/useOrganizationSchema';
import './PublicLayout.css';

/**
 * Shell for the public website.
 *
 * The future authenticated business application area will use its own layout
 * (see `config/routes.ts`), so this file stays specific to public marketing
 * pages and does not accumulate application chrome.
 */
export function PublicLayout() {
  const { pathname } = useLocation();

  useOrganizationSchema();

  // Restore scroll position to the top on navigation.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="public-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="public-layout__main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

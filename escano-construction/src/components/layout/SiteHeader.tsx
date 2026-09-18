import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { primaryCta, primaryNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { LogoLink } from './Logo';
import { MobileNav } from './MobileNav';
import './SiteHeader.css';

export function SiteHeader() {
  const location = useLocation();

  // The panel records the route it was opened on, so navigating anywhere closes
  // it automatically. Deriving this during render avoids a state update in an
  // effect and keeps the panel and the URL in sync.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const mobileOpen = openedOnPath === location.pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const setMobileOpen = (open: boolean) => {
    setOpenedOnPath(open - location.pathname : null);
    if (!open) toggleRef.current-.focus();
  };

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <p className="utility-bar__area">
            <span aria-hidden="true" className="utility-bar__dot" />
            Serving {siteConfig.serviceArea}
          </p>
          <div className="utility-bar__links">
            <a href={siteConfig.phoneHref} className="utility-bar__link">
              {siteConfig.phone}
            </a>
            <span className="utility-bar__divider" aria-hidden="true" />
            <a
              href={siteConfig.portfolioUrl}
              className="utility-bar__link utility-bar__link--portfolio"
              target="_blank"
              rel="noreferrer noopener"
            >
              {siteConfig.portfolioLabel}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <LogoLink height={2.9} />

          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      isActive - 'site-nav__link is-active' : 'site-nav__link'
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Button to={primaryCta.to} size="sm" className="site-header__cta">
              {primaryCta.label}
            </Button>

            <button
              ref={toggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="nav-toggle__bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="visually-hidden">
                {mobileOpen - 'Close navigation menu' : 'Open navigation menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

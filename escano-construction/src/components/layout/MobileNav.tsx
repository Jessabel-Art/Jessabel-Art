import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { primaryCta, primaryNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { useScrollLock } from '@/hooks/useScrollLock';
import './MobileNav.css';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-height mobile navigation panel.
 * Traps focus, closes on Escape, and restores focus to the toggle on close.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={open ? 'mobile-nav is-open' : 'mobile-nav'}
      id="mobile-navigation"
      hidden={!open}
    >
      <button
        type="button"
        className="mobile-nav__scrim"
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <div className="mobile-nav__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className="mobile-nav__head">
          <span className="mobile-nav__eyebrow">Menu</span>
          <button type="button" className="mobile-nav__close" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
            <span className="visually-hidden">Close navigation menu</span>
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          <ul className="mobile-nav__list">
            {primaryNav.map((item, index) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={onClose}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav__link is-active' : 'mobile-nav__link'
                  }
                >
                  <span>{item.label}</span>
                  <span className="mobile-nav__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-nav__foot">
          {/* The panel closes on route change, handled in SiteHeader. */}
          <Button to={primaryCta.to} fullWidth withArrow>
            {primaryCta.label}
          </Button>
          <a href={siteConfig.phoneHref} className="mobile-nav__contact">
            {siteConfig.phone}
          </a>
          <a
            href={siteConfig.portfolioUrl}
            className="mobile-nav__portfolio"
            target="_blank"
            rel="noreferrer noopener"
          >
            {siteConfig.portfolioLabel}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}

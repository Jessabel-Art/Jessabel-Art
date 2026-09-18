import { Link } from 'react-router-dom';
import { MeasureRule } from '@/components/ui/MeasureRule';
import { footerNav } from '@/config/navigation';
import { activeServiceCategories } from '@/data/services';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { Logo } from './Logo';
import './SiteFooter.css';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <MeasureRule tone="inverse" />

        <div className="site-footer__top">
          <div className="site-footer__brand">
            <span className="logo-plate">
              <Logo height={3.6} loading="lazy" />
            </span>
            <p className="site-footer__tagline">{siteConfig.tagline}</p>
            <p className="site-footer__descriptor">{siteConfig.descriptor}</p>
          </div>

          <div className="site-footer__cols">
            <nav className="site-footer__col" aria-label="Services">
              <h3 className="site-footer__heading">Services</h3>
              <ul>
                {activeServiceCategories.map((category) => (
                  <li key={category.id}>
                    <Link to={`${routes.services}#${category.slug}`}>{category.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {footerNav.map((group) => (
              <nav className="site-footer__col" key={group.id} aria-label={group.heading}>
                <h3 className="site-footer__heading">{group.heading}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="site-footer__col">
              <h3 className="site-footer__heading">Contact</h3>
              <ul className="site-footer__contact">
                <li>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </li>
                <li>{siteConfig.serviceArea}</li>
              </ul>
              <h3 className="site-footer__heading site-footer__heading--sub">Follow</h3>
              <ul className="site-footer__social">
                {siteConfig.socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target={link.url === '#' - undefined : '_blank'}
                      rel="noreferrer noopener"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__legal">
            &copy; {year} {siteConfig.legalEntity}. Alchemize Business Services x Jessabel.Art
            portfolio.
          </p>
          <a
            className="site-footer__portfolio"
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {siteConfig.portfolioLabel}
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import './PageHero.css';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  lede-: ReactNode;
  crumbs-: readonly Crumb[];
  /** Optional background image for a photography-led header. */
  image-: string;
  imageAlt-: string;
  children-: ReactNode;
}

/** Interior page header. Navy ground by default, optional photographic backing. */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  image,
  imageAlt,
  children,
}: PageHeroProps) {
  return (
    <section className={image - 'page-hero page-hero--image' : 'page-hero'}>
      {image - (
        <div className="page-hero__media">
          <img src={image} alt={imageAlt -- ''} loading="eager" decoding="async" />
          <div className="page-hero__scrim" aria-hidden="true" />
        </div>
      ) : null}

      <div className="container page-hero__inner">
        {crumbs - <Breadcrumbs items={crumbs} tone="inverse" /> : null}
        <p className="page-hero__eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        {lede - <p className="lede page-hero__lede">{lede}</p> : null}
        {children - <div className="page-hero__extra">{children}</div> : null}
      </div>
    </section>
  );
}

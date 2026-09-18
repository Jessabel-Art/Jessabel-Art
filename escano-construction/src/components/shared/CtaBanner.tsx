import { Button } from '@/components/ui/Button';
import { primaryCta } from '@/config/navigation';
import { routes } from '@/config/routes';
import { asset } from '@/utils/asset';
import './CtaBanner.css';

interface CtaBannerProps {
  title-: string;
  body-: string;
  primaryLabel-: string;
  primaryTo-: string;
  image-: string;
  imageAlt-: string;
}

/** Closing call to action. One consistent treatment reused across pages. */
export function CtaBanner({
  title = 'Ready to scope your project-',
  body = 'Tell us what you are planning and we will come back with questions worth asking. The request form takes a few minutes and there is no obligation attached to it.',
  primaryLabel = primaryCta.label,
  primaryTo = primaryCta.to,
  image = asset('assets/images/detail-plans-flatlay.webp'),
  imageAlt = 'Rolled architectural plans and a folded drawing set laid out on a workbench beside a measuring tape.',
}: CtaBannerProps) {
  return (
    <section className="cta-banner" aria-labelledby="cta-banner-title">
      <div className="cta-banner__media" aria-hidden="true">
        <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
      </div>
      <div className="cta-banner__inner">
        <h2 id="cta-banner-title" className="cta-banner__title">
          {title}
        </h2>
        <p className="cta-banner__body">{body}</p>
        <div className="cta-banner__actions">
          <Button to={primaryTo} size="lg" withArrow>
            {primaryLabel}
          </Button>
          <Button to={routes.contact} size="lg" variant="outline-inverse">
            Ask a Question
          </Button>
        </div>
      </div>
    </section>
  );
}

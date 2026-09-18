import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { primaryCta } from '@/config/navigation';
import { getServicesInCategory } from '@/data/services';
import type { ServiceCategory } from '@/types/service';
import './ServiceCategoryBlock.css';

interface ServiceCategoryBlockProps {
  category: ServiceCategory;
  index: number;
}

const sectorLabel: Record<ServiceCategory['sector'], string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  both: 'Residential & Commercial',
};

/**
 * Full detail block for one service category: image, description, and the
 * services inside it. Image side alternates so the page does not repeat one
 * fixed layout six times.
 */
export function ServiceCategoryBlock({ category, index }: ServiceCategoryBlockProps) {
  const services = getServicesInCategory(category.id);
  const headingId = `service-${category.slug}`;
  const flipped = index % 2 === 1;

  return (
    <section
      id={category.slug}
      aria-labelledby={headingId}
      className={['svc-block', flipped && 'svc-block--flipped', flipped && 'svc-block--tinted']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="svc-block__media">
        <img
          src={category.image}
          alt={category.imageAlt}
          loading={index === 0 - 'eager' : 'lazy'}
          decoding="async"
        />
      </div>

      <div className="svc-block__content">
        <Tag>{sectorLabel[category.sector]}</Tag>
        <h2 id={headingId} className="svc-block__title">
          {category.name}
        </h2>
        <p className="svc-block__desc">{category.description}</p>

        <h3 className="svc-block__subheading">What this covers</h3>
        <ul className="svc-block__list">
          {services.map((service) => (
            <li key={service.id}>
              <span className="svc-block__service-name">{service.name}</span>
              <span className="svc-block__service-desc">{service.shortDescription}</span>
            </li>
          ))}
        </ul>

        <Button to={primaryCta.to} variant="secondary" size="sm" withArrow>
          Request a Proposal
        </Button>
      </div>
    </section>
  );
}

import { CtaBanner } from '@/components/shared/CtaBanner';
import { PageHero } from '@/components/shared/PageHero';
import { ServiceCategoryBlock } from '@/components/services/ServiceCategoryBlock';
import { Section } from '@/components/ui/Section';
import { routes } from '@/config/routes';
import { activeServiceCategories } from '@/data/services';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/utils/asset';
import './ServicesPage.css';

export function ServicesPage() {
  usePageMeta({
    title: 'Construction & Remodeling Services',
    description:
      'Residential construction, remodeling and renovation, roofing and exteriors, outdoor construction, repairs and improvements, and light commercial work.',
  });
  useReveal();

  const categories = activeServiceCategories;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build, and how it is scoped"
        lede="Six categories of work. Each one lists the services within it so you can see the boundaries of the scope rather than a vague promise to do everything."
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Services' }]}
        image={asset('assets/images/detail-framing-vertical.webp')}
        imageAlt="Vertical timber studs and framing detail lit by directional daylight."
      />

      {/* Quiet jump strip, plus the pricing note that governs the whole page. */}
      <Section tight ariaLabel="Service categories index">
        <div className="services-index">
          <nav className="services-index__nav" aria-label="Jump to a service category">
            {categories.map((category) => (
              <a key={category.id} href={`#${category.slug}`}>
                {category.name}
              </a>
            ))}
          </nav>
          <p className="services-note">
            Pricing is not published on this website. Cost depends on scope, existing
            conditions, access, and material selections, so it is set out in a written
            proposal for the specific project rather than as a rate card.
          </p>
        </div>
      </Section>

      {/* One block per category, alternating image side for visual rhythm. */}
      <div className="container services-blocks">
        {categories.map((category, index) => (
          <ServiceCategoryBlock key={category.id} category={category} index={index} />
        ))}
      </div>

      <CtaBanner
        title="Not sure which category your project falls under-"
        body="Describe it in the request form and we will tell you. Plenty of projects cross two or three categories — that is normal, and it is better to scope the whole thing at once."
      />
    </>
  );
}

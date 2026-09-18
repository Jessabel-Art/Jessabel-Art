import { CtaBanner } from '@/components/shared/CtaBanner';
import { PageHero } from '@/components/shared/PageHero';
import { ProcessSequence } from '@/components/shared/ProcessSequence';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { approachPillars } from '@/data/content';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/utils/asset';
import './AboutPage.css';

export function AboutPage() {
  usePageMeta({
    title: 'About',
    description:
      'How Escano Construction approaches project planning, communication, quality of work, and attention to detail across residential construction and commercial improvements.',
  });
  useReveal();

  return (
    <>
      <PageHero
        eyebrow="About"
        title="How we work, not how long we have been around"
        lede="This page describes an approach to construction work rather than a company history. Nothing here claims a track record, a trading history, or credentials."
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'About' }]}
        image={asset('assets/images/detail-plans-flatlay.webp')}
        imageAlt="Architectural drawing set and measuring tools laid out on a workbench."
      />

      {/* --- The approach pillars, set as a running editorial column ------ */}
      <Section ariaLabelledBy="about-approach-title">
        <SectionHeading
          id="about-approach-title"
          title="Our approach"
          lede="What determines how a project is planned, communicated, and built."
        />

        <div className="about-pillars">
          {approachPillars.map((pillar) => (
            <article className="about-pillar reveal" key={pillar.id}>
              <h3 className="about-pillar__title">{pillar.heading}</h3>
              <div className="about-pillar__body">
                {pillar.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* --- Process restated here, since it is central to the approach -- */}
      <Section tone="inverse" ariaLabelledBy="about-process-title">
        <h2 id="about-process-title" className="about-process__title">
          Project planning in practice
        </h2>
        <p className="about-process__lede">
          Planning is the part of construction with the highest return on effort. This is the
          sequence, and the reason each stage exists.
        </p>
        <ProcessSequence />
      </Section>

      {/* --- Service area and scope -------------------------------------- */}
      <Section tone="subtle" ariaLabelledBy="about-area-title">
        <div className="about-area">
          <div className="about-area__content">
            <h2 id="about-area-title">Where we work</h2>
            <p>
              {siteConfig.businessName} is set up to work across {siteConfig.serviceArea}. The
              scope covers residential construction and remodeling alongside light commercial
              improvements — two types of work that share the same fundamentals but demand
              different scheduling.
            </p>
            <Button to={routes.services} variant="secondary" withArrow>
              See all services
            </Button>
          </div>

          <div className="about-area__media reveal">
            <img
              src={asset('assets/images/detail-siding-trim.webp')}
              alt="New siding and trim detail with clean butt joints and consistent reveal lines."
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Section>

      <CtaBanner
        title="Want to talk through a project?"
        body="The request form is the most efficient way to start — it gathers the details that actually matter before a conversation, so the first call is useful rather than exploratory."
      />
    </>
  );
}

import { CtaBanner } from '@/components/shared/CtaBanner';
import { OperatingPrinciples } from '@/components/home/OperatingPrinciples';
import { ServiceScopeIndex } from '@/components/home/ServiceScopeIndex';
import { ProcessSequence } from '@/components/shared/ProcessSequence';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { primaryCta, secondaryCta } from '@/config/navigation';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { featuredProjects } from '@/data/projects';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/utils/asset';
import './HomePage.css';

export function HomePage() {
  usePageMeta({
    title: 'Residential & Commercial Construction in Jacksonville, FL',
    description:
      'Escano Construction LLC — residential construction, remodeling, roofing, exteriors, outdoor construction, and light commercial improvements. Request a proposal for your project.',
  });
  useReveal();

  return (
    <>
      {/* ---------------------------------------------------------------
          Hero — the photograph is the canvas. A navy plate anchored to
          the lower-left carries identity and the two calls to action;
          nothing splits the frame in half and nothing covers the image.
          --------------------------------------------------------------- */}
      <section className="home-hero">
        <div className="home-hero__media">
          <img
            src={asset('assets/images/hero-framing-golden.webp')}
            alt="New timber-framed residential structure at golden hour, framing members, trusses, and stacked lumber visible on an organised site."
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="home-hero__plate">
          <p className="home-hero__eyebrow">{siteConfig.serviceArea}</p>
          <h1 className="home-hero__title">
            Scoped right.
            <br />
            Built right.
          </h1>
          <p className="home-hero__lede">
            Residential construction, remodeling, roofing, exterior work, and light commercial
            improvements.
          </p>
          <div className="home-hero__actions">
            <Button to={primaryCta.to} size="lg" withArrow>
              {primaryCta.label}
            </Button>
            <Button to={secondaryCta.to} size="lg" variant="outline-inverse">
              {secondaryCta.label}
            </Button>
          </div>
        </div>
      </section>

      {/* --- Service discovery: a compact index, not six generated rows --- */}
      <Section tight ariaLabel="What we build">
        <ServiceScopeIndex />
      </Section>

      {/* --- Featured work: one dominant project, three supporting --- */}
      <Section tone="subtle" ariaLabelledBy="home-projects-title">
        <SectionHeading
          id="home-projects-title"
          title="Featured work"
          lede="A closer look at how a few projects were scoped and built."
          action={
            <Button to={routes.projects} variant="quiet">
              All projects
            </Button>
          }
        />

        {featuredProjects.length > 0 ? (
          <div className="home-projects">
            <div className="home-projects__lead reveal">
              <ProjectCard project={featuredProjects[0]} size="feature" />
            </div>
            <div className="home-projects__rest">
              {featuredProjects.slice(1, 4).map((project) => (
                <div className="reveal" key={project.id}>
                  <ProjectCard project={project} size="compact" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Section>

      {/* --- Process: one connected sequence, not a 3x2 grid --- */}
      <Section tone="inverse" ariaLabelledBy="home-process-title">
        <h2 id="home-process-title" className="home-process__title">
          How a project runs
        </h2>
        <ProcessSequence />
      </Section>

      {/* --- A material moment that also carries the residential/commercial
          distinction, without a mirrored comparison section. --- */}
      <section className="home-moment" aria-labelledby="home-moment-title">
        <img
          src={asset('assets/images/project-covered-patio.webp')}
          alt="A covered patio structure at dusk with cedar posts, exposed rafters, and warm recessed lighting."
          loading="lazy"
          decoding="async"
        />
        <div className="home-moment__statement">
          <h2 id="home-moment-title">
            Residential or light commercial.
            <br />
            The sequence doesn&rsquo;t change.
          </h2>
          <p>
            Different property, same planning discipline &mdash; scoped, phased, and finished
            without surprises.
          </p>
        </div>
      </section>

      {/* --- Operating principles: stacked statements, not a 2x2 grid --- */}
      <Section ariaLabelledBy="home-principles-title">
        <h2 id="home-principles-title" className="home-principles__title">
          Operating principles
        </h2>
        <OperatingPrinciples />
      </Section>

      <CtaBanner
        title="Have a project in mind? Start with the scope."
        body="Tell us the project type, the property, and what you're picturing. The request form walks through scope, timeline, and budget range, and takes photos or documents if you have them — a few minutes now saves a lot of back-and-forth later."
      />
    </>
  );
}

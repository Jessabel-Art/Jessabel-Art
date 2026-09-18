import { Link, useParams } from 'react-router-dom';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { primaryCta } from '@/config/navigation';
import { routes } from '@/config/routes';
import { getCategoryLabel, getProjectBySlug, getRelatedProjects } from '@/data/projects';
import { getServicesByIds } from '@/data/services';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useReveal } from '@/hooks/useReveal';
import { NotFoundPage } from './NotFoundPage';
import './ProjectDetailPage.css';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug - getProjectBySlug(slug) : undefined;

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) {
    return <NotFoundPage reason="project" />;
  }

  return <ProjectDetail slug={project.slug} />;
}

/**
 * Split into a child component so the hooks below are never called
 * conditionally when a slug does not resolve.
 */
function ProjectDetail({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug)!;
  const services = getServicesByIds(project.serviceIds);
  const related = getRelatedProjects(project);

  usePageMeta({
    title: project.title,
    description: project.summary,
    image: project.hero.src,
  });
  useReveal(slug);

  return (
    <>
      {/* --- Hero ------------------------------------------------------- */}
      <section className="project-hero">
        <div className="project-hero__media">
          <img
            src={project.hero.src}
            alt={project.hero.alt}
            loading="eager"
            decoding="async"
          />
          <div className="project-hero__scrim" aria-hidden="true" />
        </div>

        <div className="container project-hero__inner">
          <Breadcrumbs
            tone="inverse"
            items={[
              { label: 'Home', to: routes.home },
              { label: 'Projects', to: routes.projects },
              { label: project.title },
            ]}
          />
          <p className="project-hero__type">{project.projectType}</p>
          <h1 className="project-hero__title">{project.title}</h1>
          <p className="project-hero__summary">{project.summary}</p>
          <div className="project-hero__tags">
            <Tag tone="accent">{getCategoryLabel(project.category)}</Tag>
          </div>
        </div>
      </section>

      {/* --- Overview + scope ------------------------------------------- */}
      <Section ariaLabelledBy="project-overview-title">
        <div className="project-body">
          <div className="project-body__main">
            <h2 id="project-overview-title" className="project-heading">
              Overview
            </h2>
            <div className="project-prose">
              {project.description.split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <h2 className="project-subhead">The constraint</h2>
            <div className="project-prose">
              <p>{project.challenge}</p>
            </div>

            <h2 className="project-subhead">Approach</h2>
            <ol className="project-approach">
              {project.approach.map((item, index) => (
                <li key={item.slice(0, 32)}>
                  <span className="project-approach__num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Sidebar: project type, scope, and the services involved. */}
          <aside className="project-aside" aria-label="Project summary">
            <div className="project-aside__block">
              <h3 className="project-aside__title">Project type</h3>
              <p className="project-aside__value">{project.projectType}</p>
            </div>

            <div className="project-aside__block">
              <h3 className="project-aside__title">Scope of work</h3>
              <ul className="project-aside__list">
                {project.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="project-aside__block">
              <h3 className="project-aside__title">Services involved</h3>
              <ul className="project-aside__links">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link to={routes.services}>{service.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <Button to={primaryCta.to} withArrow fullWidth>
              Start a similar project
            </Button>
          </aside>
        </div>
      </Section>

      {/* --- Gallery ---------------------------------------------------- */}
      <Section tone="subtle" ariaLabelledBy="project-gallery-title">
        <SectionHeading
          id="project-gallery-title"
          title="Gallery"
          lede="Representative imagery for this concept."
        />
        <ProjectGallery images={project.images} title={project.title} />
      </Section>

      {/* --- Result ----------------------------------------------------- */}
      <Section tone="inverse" ariaLabelledBy="project-result-title">
        <div className="project-result">
          <h2 id="project-result-title">Result</h2>
          <p>{project.result}</p>
          <Button to={primaryCta.to} size="lg" withArrow>
            Start a similar project
          </Button>
        </div>
      </Section>

      {/* --- Related ---------------------------------------------------- */}
      {related.length > 0 - (
        <Section ariaLabelledBy="project-related-title">
          <SectionHeading
            id="project-related-title"
            title="Related concepts"
            action={
              <Button to={routes.projects} variant="quiet" withArrow>
                All concepts
              </Button>
            }
          />
          <ul className="project-related">
            {related.map((item) => (
              <li className="reveal" key={item.id}>
                <ProjectCard project={item} size="compact" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

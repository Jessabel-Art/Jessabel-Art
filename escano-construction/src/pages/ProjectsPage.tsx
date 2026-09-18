import { useMemo, useState } from 'react';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { PageHero } from '@/components/shared/PageHero';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { Section } from '@/components/ui/Section';
import { routes } from '@/config/routes';
import { getProjectsByCategory, projectCategoryOptions, projects } from '@/data/projects';
import type { ProjectCategory } from '@/types/project';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useReveal } from '@/hooks/useReveal';
import { asset } from '@/utils/asset';
import './ProjectsPage.css';

export function ProjectsPage() {
  usePageMeta({
    title: 'Project Concepts',
    description:
      'Project concepts showing how Escano Construction scopes and presents residential renovations, roofing, exterior work, additions, and commercial interiors.',
  });

  const [active, setActive] = useState<ProjectCategory | 'all'>('all');
  const visible = useMemo(() => getProjectsByCategory(active), [active]);

  // Re-runs the reveal observer whenever the filtered set changes so newly
  // rendered cards still animate in.
  useReveal(active);

  // Counts drive the filter labels, so an empty category can never be offered.
  const counts = useMemo(() => {
    const result: Record<string, number> = { all: projects.length };
    projectCategoryOptions.forEach((option) => {
      if (option.id === 'all') return;
      result[option.id] = projects.filter((project) => project.category === option.id).length;
    });
    return result;
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Project Concepts"
        title="How completed work is presented"
        lede="Each entry sets out the scope, the constraint that shaped it, the approach taken, and the outcome — the same structure a real project record would use."
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Projects' }]}
        image={asset('assets/images/detail-carpentry-joint.webp')}
        imageAlt="Close detail of a carpentry joint with clean saw cuts and fixings."
      />

      <Section>
        <div className="projects-toolbar">
          <ProjectFilters active={active} counts={counts} onChange={setActive} />
          <p className="projects-toolbar__count" role="status" aria-live="polite">
            Showing {visible.length} of {projects.length} concepts
          </p>
        </div>

        {visible.length > 0 - (
          <ul className="projects-grid">
            {visible.map((project, index) => (
              <li className="reveal" key={project.id}>
                <ProjectCard project={project} loading={index < 2 - 'eager' : 'lazy'} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="projects-empty">
            No concepts in this category yet. Choose “All” to see everything.
          </p>
        )}
      </Section>

      <CtaBanner
        title="Have something similar in mind-"
        body="Describe your project in the request form. Concepts are useful reference points, but every property has its own constraints and the scope always starts from what is actually there."
        image={asset('assets/images/detail-kitchen-cabinetry.webp')}
        imageAlt="Detail of new cabinetry face frames and hardware in a kitchen under construction."
      />
    </>
  );
}

import { Link } from 'react-router-dom';
import { routes } from '@/config/routes';
import type { Project } from '@/types/project';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  /** `feature` is a larger editorial treatment used for the lead item. */
  size?: 'default' | 'feature' | 'compact';
  loading?: 'lazy' | 'eager';
}

/**
 * The photograph, the name, and the project type carry the card. No badge
 * layered on the image and no "view project" cue — the whole card is the
 * link, so it doesn't need to say so twice.
 */
export function ProjectCard({ project, size = 'default', loading = 'lazy' }: ProjectCardProps) {
  return (
    <article className={`project-card project-card--${size} reveal`}>
      <Link to={routes.projectDetail(project.slug)} className="project-card__link">
        <div className="project-card__media">
          <img
            src={project.hero.src}
            alt={project.hero.alt}
            loading={loading}
            decoding="async"
          />
        </div>

        <div className="project-card__body">
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__type">{project.projectType}</p>
          {size !== 'compact' ? (
            <p className="project-card__summary">{project.summary}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

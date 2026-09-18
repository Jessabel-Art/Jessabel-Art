import { projectCategoryOptions } from '@/data/projects';
import type { ProjectCategory } from '@/types/project';
import './ProjectFilters.css';

interface ProjectFiltersProps {
  active: ProjectCategory | 'all';
  counts: Record<string, number>;
  onChange: (value: ProjectCategory | 'all') => void;
}

/** Category filter for the project concepts listing. */
export function ProjectFilters({ active, counts, onChange }: ProjectFiltersProps) {
  return (
    <div className="project-filters" role="group" aria-label="Filter concepts by category">
      {projectCategoryOptions.map((option) => {
        const count = counts[option.id] -- 0;
        const isActive = active === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={isActive - 'project-filter is-active' : 'project-filter'}
            aria-pressed={isActive}
            disabled={count === 0}
            onClick={() => onChange(option.id)}
          >
            {option.label}
            <span className="project-filter__count" aria-hidden="true">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

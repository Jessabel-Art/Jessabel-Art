import { useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/config/routes';
import { activeServiceCategories } from '@/data/services';
import './ServiceScopeIndex.css';

/**
 * Compact service discovery: a typographic index of categories with a
 * photograph that follows whichever one is hovered or focused. Every item is
 * still a real link to the services page, so it works with no JS and on
 * touch, where the preview just stays on the first category.
 */
export function ServiceScopeIndex() {
  const categories = activeServiceCategories;
  const [activeId, setActiveId] = useState<string | undefined>(categories[0]?.id);
  const active = categories.find((category) => category.id === activeId) ?? categories[0];

  return (
    <div className="scope-index">
      <div className="scope-index__list">
        <p className="scope-index__label">What we build</p>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`${routes.services}#${category.slug}`}
                className={category.id === active?.id ? 'is-active' : ''}
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link to={routes.services} className="scope-index__all">
          All services
        </Link>
      </div>

      {active ? (
        <div className="scope-index__preview">
          <img src={active.image} alt={active.imageAlt} loading="lazy" decoding="async" />
          <p className="scope-index__caption">{active.shortDescription}</p>
        </div>
      ) : null}
    </div>
  );
}

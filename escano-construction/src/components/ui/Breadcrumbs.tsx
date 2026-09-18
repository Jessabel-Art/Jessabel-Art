import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: readonly Crumb[];
  tone?: 'default' | 'inverse';
}

export function Breadcrumbs({ items, tone = 'default' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs breadcrumbs--${tone}`}>
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast ? (
                <span className="breadcrumbs__sep" aria-hidden="true">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

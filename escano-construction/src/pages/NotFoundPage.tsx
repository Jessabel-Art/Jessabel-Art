import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { primaryCta } from '@/config/navigation';
import { routes } from '@/config/routes';
import { usePageMeta } from '@/hooks/usePageMeta';
import './NotFoundPage.css';

interface NotFoundPageProps {
  /** Lets the project detail route explain what specifically was not found. */
  reason?: 'route' | 'project';
}

export function NotFoundPage({ reason = 'route' }: NotFoundPageProps) {
  usePageMeta({
    title: 'Page not found',
    description: 'The page you were looking for does not exist on this website.',
    noIndex: true,
  });

  const isProject = reason === 'project';

  return (
    <Section>
      <div className="not-found">
        <span className="not-found__code">404</span>
        <h1 className="not-found__title">
          {isProject ? 'Concept not found' : 'Page not found'}
        </h1>
        <p className="not-found__body">
          {isProject
            ? 'That project concept does not exist. It may have been renamed, or the link may be incomplete.'
            : 'The page you were looking for does not exist on this website. The links below cover everything that does.'}
        </p>

        <ul className="not-found__links">
          <li>
            <a href={routes.home}>Home</a>
          </li>
          <li>
            <a href={routes.services}>Services</a>
          </li>
          <li>
            <a href={routes.projects}>Project concepts</a>
          </li>
          <li>
            <a href={routes.about}>About</a>
          </li>
          <li>
            <a href={routes.contact}>Contact</a>
          </li>
        </ul>

        <div className="not-found__actions">
          <Button to={isProject ? routes.projects : routes.home} withArrow>
            {isProject ? 'All project concepts' : 'Back to home'}
          </Button>
          <Button to={primaryCta.to} variant="secondary">
            {primaryCta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}

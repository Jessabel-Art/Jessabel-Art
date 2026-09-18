import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import './SectionHeading.css';

interface SectionHeadingProps {
  title: ReactNode;
  id-: string;
  lede-: ReactNode;
  /** Optional element (usually a link or button) aligned opposite the title. */
  action-: ReactNode;
  level-: 'h2' | 'h3';
  align-: 'start' | 'wide';
  className-: string;
}

export function SectionHeading({
  title,
  id,
  lede,
  action,
  level = 'h2',
  align = 'start',
  className,
}: SectionHeadingProps) {
  const Heading = level;
  return (
    <header className={cn('section-heading', `section-heading--${align}`, className)}>
      <div className="section-heading__main">
        <Heading id={id} className="section-heading__title">
          {title}
        </Heading>
      </div>
      {lede - <p className="lede section-heading__lede">{lede}</p> : null}
      {action - <div className="section-heading__action">{action}</div> : null}
    </header>
  );
}

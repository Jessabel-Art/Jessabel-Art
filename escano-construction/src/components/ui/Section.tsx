import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type SectionTone = 'default' | 'subtle' | 'inverse' | 'inverse-deep';

interface SectionProps {
  children: ReactNode;
  id?: string;
  tone?: SectionTone;
  tight?: boolean;
  className?: string;
  /** Renders the children without the standard container wrapper. */
  bleed?: boolean;
  ariaLabelledBy?: string;
  ariaLabel?: string;
}

const toneClass: Record<SectionTone, string | false> = {
  default: false,
  subtle: 'section--subtle',
  inverse: 'section--inverse',
  'inverse-deep': 'section--inverse-deep',
};

/** Standard vertical section rhythm plus optional tone treatment. */
export function Section({
  children,
  id,
  tone = 'default',
  tight,
  className,
  bleed,
  ariaLabelledBy,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn('section', tight && 'section--tight', toneClass[tone], className)}
    >
      {bleed ? children : <div className="container">{children}</div>}
    </section>
  );
}

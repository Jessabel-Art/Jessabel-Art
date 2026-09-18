import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import './Tag.css';

interface TagProps {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'inverse';
  className?: string;
}

/** Small square label for a category or project type. Used sparingly. */
export function Tag({ children, tone = 'default', className }: TagProps) {
  return <span className={cn('tag', `tag--${tone}`, className)}>{children}</span>;
}

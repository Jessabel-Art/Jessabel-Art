import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline-inverse' | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Renders a trailing arrow glyph. */
  withArrow?: boolean;
  fullWidth?: boolean;
}

interface LinkButtonProps extends CommonProps {
  to: string;
  href?: never;
}

interface AnchorButtonProps extends CommonProps {
  href: string;
  to?: never;
  external?: boolean;
}

interface NativeButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  to?: never;
  href?: never;
}

type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

function classesFor({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: CommonProps): string {
  return cn(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    className,
  );
}

/** The single button component used across the site. */
export function Button(props: ButtonProps) {
  const { children, withArrow } = props;
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {withArrow ? (
        <span className="btn__arrow" aria-hidden="true">
          &rarr;
        </span>
      ) : null}
    </>
  );

  if ('to' in props && props.to) {
    const { to, ...rest } = props;
    return (
      <Link to={to} className={classesFor(rest)}>
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, external, ...rest } = props as AnchorButtonProps;
    return (
      <a
        href={href}
        className={classesFor(rest)}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {content}
      </a>
    );
  }

  const {
    children: _children,
    variant,
    size,
    className,
    withArrow: _withArrow,
    fullWidth,
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button
      type="button"
      className={classesFor({ children: _children, variant, size, className, fullWidth })}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

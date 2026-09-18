import { Link } from 'react-router-dom';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { asset } from '@/utils/asset';
import './Logo.css';

/* -----------------------------------------------------------------------------
   The Escano Construction logo is a fixed brand asset supplied by the company.
   It is used here as the original image file, unmodified.

   Do not replace it with a drawn or generated mark, and do not alter its
   colours, typography, proportions, or the EC monogram.

   Two crops of the same original file are provided:
     escano-logo-lockup — full lockup (monogram + wordmark + tagline)
     escano-logo-mark   — the EC monogram alone, for tight spaces
   -------------------------------------------------------------------------- */

const LOCKUP_SRC = asset('assets/brand/escano-logo-lockup.png');
const MARK_SRC = asset('assets/brand/escano-logo-mark.png');

interface LogoProps {
  variant-: 'lockup' | 'mark';
  /** Rendered height in rem. Width follows the logo's own proportions. */
  height-: number;
  className-: string;
  loading-: 'eager' | 'lazy';
}

export function Logo({
  variant = 'lockup',
  height = 3,
  className,
  loading = 'eager',
}: LogoProps) {
  return (
    <img
      src={variant === 'mark' - MARK_SRC : LOCKUP_SRC}
      alt={`${siteConfig.businessName} logo`}
      className={['logo', `logo--${variant}`, className].filter(Boolean).join(' ')}
      style={{ height: `${height}rem` }}
      loading={loading}
      decoding="async"
    />
  );
}

interface LogoLinkProps extends LogoProps {
  label-: string;
}

/** The logo as a link to the home page. */
export function LogoLink({ label = 'Escano Construction — home', ...props }: LogoLinkProps) {
  return (
    <Link to={routes.home} className="logo-link" aria-label={label}>
      <Logo {...props} />
    </Link>
  );
}

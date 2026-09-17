import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icon";
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "quiet";
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}) {
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  children,
  href,
  linkText = "Explore all",
}: {
  eyebrow?: string;
  children: ReactNode;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{children}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText}
          <Icon name="arrow" size={18} />
        </Link>
      )}
    </div>
  );
}
export function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="feature">
      <Icon name={icon} size={30} />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}
export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="search-field">
      <Icon name="search" size={19} />
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        placeholder="Search products…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

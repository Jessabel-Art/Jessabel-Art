// Shared page-header pattern for the admin app and client portal — one
// title/description/actions row so every screen in both shells reads as
// part of the same product instead of separately assembled pages.
import React from "react";

export default function PageHeader({ eyebrow, title, description, actions, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-2xl sm:text-[28px] font-bold text-foreground leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

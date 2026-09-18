/**
 * Canonical route paths.
 *
 * The application is organised into two conceptual areas:
 *
 *   PUBLIC WEBSITE   — implemented in this phase (`publicRoutes`).
 *   BUSINESS APP     — not implemented yet. When an authenticated proposal
 *                      drafting and management area is added, it will live
 *                      under its own path prefix (see `APP_ROUTE_PREFIX`) with
 *                      its own layout, so the public site does not need to be
 *                      rebuilt. See `src/routes/index.tsx`.
 */

export const routes = {
  home: '/',
  services: '/services',
  projects: '/projects',
  projectDetail: (slug: string) => `/projects/${slug}`,
  about: '/about',
  contact: '/contact',
  requestProposal: '/request-proposal',
} as const;

/**
 * Reserved prefix for the future authenticated business application
 * (proposal drafting, customers, project requests, admin). Nothing is
 * mounted here yet — it is declared so links and route guards have a
 * single place to reference once that work begins.
 */
export const APP_ROUTE_PREFIX = '/app';

export const PUBLIC_PATHS: readonly string[] = [
  routes.home,
  routes.services,
  routes.projects,
  routes.about,
  routes.contact,
  routes.requestProposal,
];

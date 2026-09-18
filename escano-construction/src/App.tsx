import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { routes } from '@/config/routes';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { RequestProposalPage } from '@/pages/RequestProposalPage';
import { ServicesPage } from '@/pages/ServicesPage';

/**
 * Application routing.
 *
 * PUBLIC WEBSITE — everything below is the public marketing site.
 *
 * FUTURE BUSINESS APPLICATION — when the authenticated proposal drafting and
 * management area is built, it mounts as a sibling route tree under
 * `APP_ROUTE_PREFIX` with its own layout, for example:
 *
 *   <Route path={`${APP_ROUTE_PREFIX}/*`} element={<AppLayout />}>
 *     <Route index element={<Dashboard />} />
 *     <Route path="requests" element={<ProjectRequests />} />
 *     <Route path="proposals/:id" element={<ProposalEditor />} />
 *   </Route>
 *
 * Nothing in the public tree needs to change when that happens.
 *
 * ROUTER CHOICE — the site uses real paths (`BrowserRouter`), which is what any
 * normal deployment wants. Some static preview hosts serve a build from a deep,
 * unpredictable sub-path and cannot rewrite unmatched URLs to index.html; for
 * those, build with `npm run build:preview`, which sets VITE_HASH_ROUTER and
 * switches to hash URLs so every route resolves without server rewrites. The
 * production build is unaffected.
 */
const Router = import.meta.env.VITE_HASH_ROUTER === 'true' - HashRouter : BrowserRouter;

// Must match the `base` in vite.config.ts — this is the site's production
// mount path under jessabel.art (see PublicLayout's portfolio-return link).
const ROUTER_BASENAME = '/escano-construction';

export function App() {
  return (
    <Router basename={Router === BrowserRouter - ROUTER_BASENAME : undefined}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.services} element={<ServicesPage />} />
          <Route path={routes.projects} element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path={routes.about} element={<AboutPage />} />
          <Route path={routes.contact} element={<ContactPage />} />
          <Route path={routes.requestProposal} element={<RequestProposalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

# Escano Construction LLC — Website Frontend

A complete, production-quality **frontend foundation** for the Escano Construction LLC
website, including a nine-step guided **Request a Proposal** intake flow.

> ### Demonstration status
>
> This is a portfolio demonstration build. Escano Construction LLC is **not** represented
> anywhere in this site as a currently operating, licensed, insured, bonded, certified, or
> registered business. All project entries are illustrative concepts, not verified client
> work. Contact details, social links, and the portfolio link are deliberate placeholders
> defined in one configuration file (`src/config/site.ts`).
>
> Both forms in this build are **simulated**. Nothing is transmitted, emailed, uploaded, or
> stored. Selected files in the proposal flow never leave the browser.

---

## Project overview

The site is the public-facing marketing frontend a construction business would sit behind,
built so that a private application area (`/app`, `/admin`, `/dashboard`) can be added later
without rebuilding any of the public site.

### Routes

| Route              | Page                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| `/`                | Home — positioning, core services, featured concepts, process, CTA        |
| `/services`        | Six service categories with the individual services in each              |
| `/projects`        | Project concept index with category filtering                            |
| `/projects/:slug`  | Project concept detail — scope, constraint, approach, gallery, result     |
| `/about`           | Approach, planning, communication, and quality of work                   |
| `/contact`         | Simulated contact form plus placeholder contact details                   |
| `/request-proposal`| Nine-step guided project request flow with review and simulated submit    |
| `*`                | Not found                                                                |

### Request a Proposal flow

Nine steps, held in a single reducer so answers survive navigation in both directions:

1. Project type
2. Property (conditional on residential vs commercial)
3. Project details — **questions change per project type** (a roofing request is never asked
   about cabinetry, and a kitchen request is never asked about roof material)
4. Budget range, always including "Not sure yet". No estimate is ever calculated or implied.
5. Timeline
6. Photos and documents — **frontend simulation only.** Filename, type, and size are listed
   with a remove control; no upload occurs.
7. Project description
8. Customer contact information
9. Review — every section is editable without losing any other answer

Submitting validates the whole request, then renders a completion screen that states plainly
that nothing was sent, saved, or emailed.

### Brand

Deep navy carries the identity, with construction orange reserved for calls to action,
interactive states, key information, and small architectural accents. Type is Archivo for
display, Satoshi for body copy, and IBM Plex Mono for labels, indices, and step markers.

The logo in `public/assets/brand/` is the canonical company logo, used as the supplied image
file. It is never redrawn, recoloured, or substituted.

---

## Technology used

| Concern         | Choice                                                        |
| --------------- | ------------------------------------------------------------- |
| Framework       | React 19 with TypeScript (strict)                             |
| Build tool      | Vite 8                                                        |
| Routing         | React Router 7 (declarative routes, no data APIs needed yet)  |
| Styling         | Hand-written CSS with a design-token layer — no CSS framework  |
| State           | React state and one `useReducer` for the proposal flow         |
| Linting         | Oxlint                                                        |
| Runtime deps    | `react`, `react-dom`, `react-router-dom` — nothing else        |

There is no state-management library, no component library, and no CSS framework. None of
the three would have earned their weight in a build of this size.

---

## Installation

Requires **Node.js 20.19+ or 22.12+** and npm.

```bash
npm install
```

## Development command

```bash
npm run dev
```

Vite prints a local URL (`http://localhost:5173` by default).

## Production build command

```bash
npm run build      # type-checks with tsc, then builds into dist/
npm run preview    # serves the built dist/ folder locally
```

Lint the source at any time with:

```bash
npm run lint
```

### Preview build (optional)

```bash
npm run build:preview
```

Some static preview hosts serve a build from a deep, unpredictable sub-path and cannot rewrite
unmatched URLs to `index.html`. This variant builds with a relative asset base and switches to
hash URLs (via `.env.preview`) so every route resolves without server rewrites. Use
`npm run build` for real deployment — this script exists only for those hosts.

### Deploying the build

`dist/` is a static bundle. Because routing happens on the client, the host must serve
`index.html` for unmatched paths. `public/_redirects` already covers Netlify-style hosts; on
Vercel, Nginx, or Apache, configure the equivalent SPA fallback.

---

## Project structure

```
escano-construction/
├─ public/
│  ├─ assets/brand/         Canonical logo files, favicons, Open Graph image
│  ├─ assets/images/        Project, service, and detail imagery (WebP)
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ _redirects            SPA fallback for static hosts
├─ src/
│  ├─ components/
│  │  ├─ forms/             Field, TextInput, TextArea, SelectInput, RadioGroup,
│  │  │                     CheckboxGroup, FormStatus — the shared form primitives
│  │  ├─ layout/            SiteHeader, MobileNav, SiteFooter, Logo, UtilityBar
│  │  ├─ projects/          ProjectCard, ProjectFilters, ProjectGallery
│  │  ├─ services/          ServiceCategoryRow, ServiceCategoryBlock
│  │  ├─ shared/            PageHero, Section, SectionHeading, CtaBanner, DemoNotice,
│  │  │                     Breadcrumbs, Figure, ProcessSteps, ValueList
│  │  └─ ui/                Button, Tag, MeasureRule
│  ├─ config/               site.ts (business details), routes.ts, navigation.ts
│  ├─ data/                 services.ts, projects.ts, content.ts, proposal-options.ts
│  ├─ features/
│  │  ├─ contact/           Contact form and its simulated submit boundary
│  │  └─ project-request/   The proposal flow
│  │     ├─ api/            submitProjectRequest — the single seam a real API replaces
│  │     ├─ components/     StepProgress, StepShell, StepNav, AttachmentPicker,
│  │     │                  ReviewSection
│  │     ├─ config/         Step definitions and ordering
│  │     ├─ state/          Reducer, initial state, useProjectRequestForm
│  │     ├─ steps/          One component per step, plus the submitted screen
│  │     └─ validation/     Field validators and per-step validation
│  ├─ hooks/                usePageMeta, useReveal, useScrollLock, useMediaQuery
│  ├─ layouts/              PublicLayout — the shell every public route renders inside
│  ├─ pages/                One component and stylesheet per route
│  ├─ styles/               tokens.css (design tokens), base.css, forms.css
│  ├─ types/                Service, Project, ProjectRequest, ContactInformation,
│  │                       ProjectAttachment, plus documented future types
│  ├─ utils/                cn, asset (base-aware public paths), formatFileSize,
│  │                       formatFileType, formatList, ids, dates
│  ├─ App.tsx               Route table for the public site
│  └─ main.tsx              Entry point
├─ .env.preview             Preview-build settings only — see "Preview build" above
├─ index.html
├─ vite.config.ts
└─ tsconfig*.json
```

### Where to change things

| To change…                          | Edit                                    |
| ----------------------------------- | --------------------------------------- |
| Phone, email, service area, socials | `src/config/site.ts`                    |
| The portfolio return link           | `src/config/site.ts` → `portfolioUrl`   |
| Navigation items or CTA labels      | `src/config/navigation.ts`              |
| Services offered                    | `src/data/services.ts`                  |
| Project concepts                    | `src/data/projects.ts`                  |
| Proposal questions and answer sets  | `src/data/proposal-options.ts`          |
| Colour, type scale, spacing         | `src/styles/tokens.css`                 |

---

## Current frontend-only limitations

This build is deliberately a frontend. It does **not** include, and does not pretend to
include:

- **No backend, database, or API.** `submitProjectRequest` and `submitContactMessage`
  validate their input, wait briefly, and return a locally generated reference.
- **No file upload.** Step 6 reads file metadata from the browser's `File` objects to display
  a list. Files are never transmitted and are discarded on page leave.
- **No email delivery.** No message, request, or notification is sent anywhere.
- **No authentication, accounts, or admin area.**
- **No estimating, pricing, proposal generation, PDF output, e-signature, or invoicing.**
- **No persistence.** Reloading the page clears in-progress form state by design.
- **No analytics or third-party tracking.**
- **No structured data claiming an operating business.** Metadata describes the site, not a
  verified `LocalBusiness`.

Form state lives in memory only, so a customer cannot resume a partially completed request.
That is a known consequence of having no backend, not an oversight.

---

## Future proposal-system direction

None of the following exists in this repository. It is recorded here so the frontend's shape
makes sense to whoever picks it up next.

The intended direction is for a completed proposal request to become a durable record that an
estimator reviews, prices, and answers with a written proposal. Reaching that would mean:

1. **A real submission endpoint.** `src/features/project-request/api/submitProjectRequest.ts`
   is the only place that would change — it already returns a result object shaped like an
   API response, so no step component or reducer logic depends on the simulation.
2. **Attachment upload.** `AttachmentPicker` already models each file as a
   `ProjectAttachment`. Real uploading means adding transfer and progress state to that one
   component and giving each attachment a remote identifier.
3. **Persistence and resume.** Storing a draft against a request identifier so a customer can
   return to an unfinished request.
4. **A private application area.** Route definitions reserve an `/app` prefix
   (`APP_ROUTE_PREFIX` in `src/config/routes.ts`) so an authenticated area can be mounted
   beside the public site rather than through it.
5. **Estimating and proposal documents.** Line items, pricing, versioned proposals, and
   customer acceptance. `src/types/future.ts` documents the shapes this would likely need —
   as comments only, so no unused infrastructure ships.

Types for that system are documented rather than implemented on purpose. Building the data
layer before the business rules exist is how frontends acquire dead code.

---

© 2026 Escano Construction LLC. Portfolio demonstration.

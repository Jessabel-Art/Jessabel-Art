# Alder & Field — Landscape & Lawn

A standalone, fictional landscaping portfolio demo. Created in an empty directory; no existing project or client assets were used.

## Run locally

Requires Node.js 20 or later. No dependency installation is needed.

```sh
npm run build
npm run dev
```

Open http://127.0.0.1:4173. Rebuild after edits. `npm test` runs validation and catalog relationship tests.

## Architecture

This is a lightweight, multi-page, statically rendered website using native ES modules, semantic HTML, and CSS. The build generates five complete HTML pages, unique metadata, canonical URLs, WebSite structured data, a sitemap, robots.txt, and a 404 page. JavaScript progressively supplies interactive catalog and form behavior. There are no runtime framework dependencies.

- `src/config.js`: all fictional contact details, demo service regions, site origin, and **`portfolioUrl: 'PORTFOLIO_URL'`**. Replace this with a valid HTTPS portfolio URL; until configured, the return control explains the demo without navigating to a broken URL. External navigation uses `noopener,noreferrer`.
- `src/data.js`: 6 service categories, 56 services, 31 materials, product categories, service/material relationships, and illustrative projects.
- `src/layout.js`, `src/ui.js`: shared navigation, footer, dialogs, and small presentation helpers.
- `src/home.js`, `services.js`, `catalog.js`, `about.js`, `contact.js`: page components and behavior.
- `src/state.js`: validated, device-local material selections; no personal form data is persisted.
- `src/validation.js`: reusable request and upload validation.
- `src/quote-api.js`: async demo submission adapter; intentionally makes no network request. Replace with a server endpoint for a real deployment. Server validation, spam protection, secure file handling, privacy requirements, delivery, and operational monitoring are needed before accepting real leads.
- `src/styles.css`, `src/pages.css`: responsive design system and page layouts.
- `src/assets`: optimized local WebP photography with smaller responsive variants and SVG brand favicon.
- `scripts/build.mjs`, `scripts/serve.mjs`: dependency-free build and local preview server.
- `tests`: Node tests. `scripts/qa.mjs` and `scripts/qa-flows.mjs` use the environment's bundled Playwright and Edge for browser checks; use a local Playwright installation if running these outside Codex.

## Demo behavior and privacy

No real business credentials, customer reviews, completed-project claims, operating address, or service territory are implied. Garden imagery is illustrative and category material photographs do not represent exact stock. Prices are quoted rather than fabricated. Submitted contact details and photos are neither stored nor sent. Upload previews support 5 JPG/PNG/WebP images, up to 10 MB each; rejected files are not attached. Accepted images are decoded before previewing. The browser adapter returns a clearly labeled simulated success state.

Only material IDs are stored in localStorage. They survive navigation and refresh and can be cleared in the footer's demo/privacy dialog. Storage failures fall back to in-memory behavior. Photo object URLs are revoked on removal, completion, and page exit.

Native dialogs provide modal semantics, focus trapping, Escape-to-close, and focus restoration. Forms use inline errors and focus the first invalid control. Reduced motion, keyboard focus, mobile navigation, touch controls, and descriptive image alternatives are included.

An optional feature-detected WebMCP tool, `stage_quote_materials`, adds valid material IDs to the same shortlist. It never submits requests and rejects unknown IDs atomically.

## Imagery

See `ASSETS.md` for the centralized provenance list. Replace matching asset files and update `src/data.js` as needed. Project and product imagery is explicitly described as inspiration. The hero is an original generated illustration in a photographic style.

## Hosting

Publish the `dist/` directory on a static host with directory index support and a 404 page. `.openai/hosting.json` records the independent Sites project. Set `business.siteUrl` to the deployed origin before building to update every canonical and sitemap URL. The preview server is a development utility, not a production service.

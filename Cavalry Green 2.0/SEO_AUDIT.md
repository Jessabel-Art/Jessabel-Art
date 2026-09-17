# Cavalry Green LLC — final repository SEO audit
Date: September 10, 2026

The corrected repository and static export pass the code-level checks described below. Changes are built locally; they have not been deployed to the production host. Live-site verification is partial because some HTTP requests failed with TLS/connection resets. These failures do not establish that Google is blocked.

## A. Audit scorecard

Ratings describe the final repository/export. PASS WITH IMPROVEMENT identifies a category corrected during this audit or a remaining verification limitation.

| Category | Result | Evidence |
|---|---|---|
| Technical SEO | PASS WITH IMPROVEMENT | Static build and local links/assets pass; live quote/404 verification remains incomplete. |
| Indexability | PASS WITH IMPROVEMENT | All three exported pages are index, follow; no blocked Next assets. Actual Google indexing requires external verification. |
| On-page SEO | PASS | One meaningful H1 per page; logical H2/H3 structure, visible services and crawlable navigation. |
| Local SEO | PASS | Business, veteran ownership, telephone, services and all five NC areas are visible. Existing copy retained. |
| Structured data | PASS WITH IMPROVEMENT | Corrected unsupported type; valid JSON and recognized vocabulary. No fabricated address. |
| Sitemap | PASS WITH IMPROVEMENT | Three canonical production URLs, aligned with trailing-slash export. |
| Robots | PASS | Allow-all rules and production sitemap retained. |
| Metadata | PASS WITH IMPROVEMENT | Duplicate brand suffixes corrected; production host fixed; existing icons connected. |
| Image SEO | PASS WITH IMPROVEMENT | Accurate alt text and compressed delivery; responsive layout retained. |
| Social metadata | PASS WITH IMPROVEMENT | Existing suitable lawn image wired into OG and X metadata. |

## B. Issues found and disposition

| Severity | File(s) | Finding | Correction/status |
|---|---|---|---|
| High | .env.example; app/layout.tsx; app/robots.ts; app/sitemap.ts | Example environment used the retired preview host; environment overrides could contaminate metadataBase, robots and sitemap. | Example corrected; production SEO now reads a fixed production origin in app/seo.ts. Existing baseline dist already had zero retired-host matches. |
| Medium | app/services/page.tsx; app/quote/page.tsx | Actual exported titles repeated the business name because the layout template appended it. | Explicit absolute page titles; homepage title uses the same explicit strategy. |
| Medium | app/sitemap.ts; app/services/page.tsx; app/quote/page.tsx | Sitemap listed non-slash URLs while exported canonicals and production services redirect used trailing slashes. | Sitemap, canonical and OG definitions now consistently use slash URLs. Routing/configuration unchanged. |
| Medium | app/layout.tsx | LandscapingBusiness is absent from the current official Schema.org vocabulary. | Replaced with recognized LocalBusiness; services explain the landscaping business accurately. Added stable production @id. |
| Low | app/layout.tsx | City names lacked state qualification; visible Junk Removal was missing from the catalog. | Added NC to five City names and the existing Junk Removal service to the catalog. |
| Medium | app/page.tsx; app/services/page.tsx; app/components.tsx; public images | Five photos totaled 17,459,779 bytes; header/footer loaded a 1,547,733-byte logo. | Full-size photo WebP derivatives total 2,315,120 bytes (86.7% smaller). Logo derivative is 240×240, sufficient for the existing 100/120px displays at 2×. Original files retained. |
| Low | app/page.tsx; app/services/page.tsx | Hero alt described a nonexistent mowing professional; service descriptions did not accurately describe edging, piled debris and a household-item trailer. | Alt descriptions corrected after asset inspection. Decorative backgrounds retain empty alt. |
| Low | app/layout.tsx | Icons used the large general logo even though dedicated favicon/Apple assets existed. | Connected favicon.ico, 96×96 PNG, 180×180 Apple icon and existing manifest. Did not use the oversized SVG. |
| Low | app/seo.ts; app/layout.tsx; three page metadata objects | No explicit OG/X image despite an appropriate existing landscape asset. | Reused original hero-lawn.png, 1536×1024, with descriptive image alt; X summary_large_image on all public pages. No artwork generated. |
| Medium, verification limitation | Production hosting (no repository file) | Requests for live quote, some repeat services checks and nonexistent URLs encountered TLS/connection resets. | Tried curl and a second HTTP client; no speculative server changes. Recheck after deployment and use Search Console live URL testing. |
| Low, informational | Build environment; next.config.ts unchanged | Next reports multiple parent lockfiles and infers a broader workspace root. | Build succeeds. Left unchanged because this is not an observed SEO failure. |

No critical code-level indexing blocker was found.

## C. Files changed

Existing source files changed and the new shared SEO module:
- [.env.example](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/.env.example>)
- [app/seo.ts](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/seo.ts>)
- [app/layout.tsx](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/layout.tsx>)
- [app/page.tsx](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/page.tsx>)
- [app/services/page.tsx](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/services/page.tsx>)
- [app/quote/page.tsx](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/quote/page.tsx>)
- [app/robots.ts](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/robots.ts>)
- [app/sitemap.ts](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/sitemap.ts>)
- [app/components.tsx](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/app/components.tsx>)

New optimized derivatives:
- [public/cavalry-green-logo.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/cavalry-green-logo.webp>)
- [public/hero-lawn.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/hero-lawn.webp>)
- [public/service-landscape.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/service-landscape.webp>)
- [public/service-cleanup.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/service-cleanup.webp>)
- [public/service-hauling.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/service-hauling.webp>)
- [public/final-property.webp](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/public/final-property.webp>)

Audit artifacts:
- [SEO_AUDIT.md](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/SEO_AUDIT.md>)
- [audit/verify.mjs](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/verify.mjs>)
- [audit/baseline-verification.json](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/baseline-verification.json>)
- [audit/final-verification.json](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/final-verification.json>)
- [audit/live-verification.json](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/live-verification.json>)
- [audit/protected-hashes.json](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/protected-hashes.json>)

The build regenerated [dist](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/dist>), including index.html, services/index.html, quote/index.html, robots.txt, sitemap.xml and hashed Next assets. A complete generated-file manifest is in [audit/dist-files.json](<C:/Users/Jessa/OneDrive/Desktop/Website Builds/Cavalry Green 2.0/audit/dist-files.json>).

Pre-existing user changes to public/api/config.php, public/api/quote-submit.php and scripts/build-static.mjs, the untracked Composer/vendor files, and the existing deletion of public/final-property.avif were preserved. None of those are audit edits.

## D. Final page metadata

All three pages emit exactly one title, description and canonical. Robots: index, follow. OG type: website; OG site_name: Cavalry Green LLC. The viewport is width=device-width, initial-scale=1, with theme-color #f2ebdd. All pages include the configured favicon/Apple icon and manifest.

### Home
- Title: Lawn Care & Landscaping in Hope Mills, NC | Cavalry Green LLC
- Description: Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC. Request a quote from Cavalry Green LLC.
- Canonical and OG URL: https://cavalrygreenllc.com/
- Robots: index, follow
- H1: Year‑round property care.

### Services
- Title: Lawn Care & Landscaping Services | Cavalry Green LLC
- Description: Explore lawn care, landscaping, mulch and pine straw, trimming, property cleanups, debris removal and recurring maintenance from Cavalry Green LLC serving the Fayetteville and Hope Mills area.
- Canonical and OG URL: https://cavalrygreenllc.com/services/
- Robots: index, follow
- H1: Property care, from routine to seasonal.

### Quote
- Title: Request a Lawn Care or Landscaping Quote | Cavalry Green LLC
- Description: Request a quote from Cavalry Green LLC for lawn care, landscaping, property cleanup and maintenance services in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.
- Canonical and OG URL: https://cavalrygreenllc.com/quote/
- Robots: index, follow
- H1: Let’s take care of your property.

The slash form deliberately follows the existing export and observed production services redirect. The non-slash routes remain public entry points; no server routing change was made. Full emitted OG/X descriptions, image properties, icons and headings are preserved in final-verification.json.

## E. Structured data

Every public page includes one syntactically valid JSON-LD business object.

Root properties:
- @context: https://schema.org
- @type: LocalBusiness
- @id: https://cavalrygreenllc.com/#business
- name: Cavalry Green LLC
- url: https://cavalrygreenllc.com/
- telephone: +1-472-300-2290
- description: Cavalry Green LLC provides lawn care, landscaping, property cleanup and recurring property maintenance for homeowners and properties throughout the Fayetteville and Hope Mills area.
- areaServed: five City objects, each with @type and name: Hope Mills, NC; Fayetteville, NC; Raeford, NC; Spring Lake, NC; Cameron, NC.
- hasOfferCatalog: OfferCatalog with @type, name (Cavalry Green LLC Services), itemListElement.
- Each catalog entry: Offer with @type and itemOffered.
- Each itemOffered: Service with @type and name.

The 14 services are Lawn Care; Landscaping; Mulch & Pine Straw; Planting; Hedge & Shrub Trimming; Yard Clear-Outs; Junk Removal; Brush & Debris Removal; Leaf Removal; Property Cleanups; Storm Cleanup; Light Hauling; Recurring Property Maintenance; Seasonal & Holiday Services.

Exact types present: LocalBusiness, City, OfferCatalog, Offer, Service.

JSON parsing passed, and every emitted type/property was checked against the [official Schema.org vocabulary](https://schema.org/version/latest/schemaorg-current-https.jsonld). LandscapingBusiness is not defined there.

No address, coordinates, hours, reviews, ratings, prices, social accounts, founding date or employee count was invented. Google’s LocalBusiness rich-result documentation requires an address; therefore this address-free service-area markup is not claimed to satisfy that rich-result eligibility requirement. This is separate from ordinary page indexability. See [Google’s LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## F. Generated build and live verification

- Final npm run build: PASS. Next compiled, TypeScript passed, all static routes exported, build script finalized dist.
- First sandboxed attempt failed opening .next/trace; rerunning with approved filesystem/network access succeeded. The final rebuild after all source changes also passed.
- Final verification: 172 generated files; zero assertions failed.
- All dist files scanned as bytes: ZERO retired-preview-domain matches; production origin found in 24 files.
- Source/environment scan excluding dependency, Git and tool-cache directories: zero retired-host matches.
- Every public page: one canonical, title, description and H1; production OG URL matches canonical; index, follow.
- Every emitted local href/src exists in dist; same-page anchor targets exist. Navigation exports real anchors and correct slash URLs.
- All initial rendered images have alt attributes. Header logo intentionally has empty alt within an explicitly labelled home link; footer logo has business-name alt. Decorative final background has empty alt.
- Fill images use positioned containers and defined layout heights. Logos have width/height. Below-fold imagery remains lazy-loaded and the hero remains prioritized.
- Static export uses images.unoptimized, so it has no runtime image optimizer or responsive srcset. CSS remains responsive; full-resolution compressed images are served to all viewport sizes. Further mobile-specific variants are optional, not an indexing blocker.
- Fonts remain self-hosted in Next output with display: swap. The initial HTML contains business/service/location text, not only client-generated or image-only copy.
- The generated 404 has noindex. Live 404 HTTP status could not be verified.
- robots.txt allows User-Agent: * with Allow: / and Sitemap: https://cavalrygreenllc.com/sitemap.xml. No Next assets are disallowed.
- Sitemap contains only /, /services/, /quote/ under the production HTTPS domain. Priorities: 1, 0.9, 0.5. No fabricated lastmod values.
- SHA-256 comparison: all 94 protected source files unchanged. Exported API/upload files match their sources byte-for-byte.
- No quote request was submitted. Form validation, success state, PHP, MariaDB, photo uploads, request IDs, SMTP and notifications were not modified or exercised.

Live observations before deploying these changes:
- Homepage GET: HTTP 200, correct canonical and index, follow.
- Services HEAD chain: HTTP 301 from /services to /services/, then HTTP 200; no X-Robots-Tag blocking header in that response.
- robots.txt and sitemap.xml GET: HTTP 200 on the first pass. Sitemap still contained old non-slash entries, as expected before deployment.
- /index.html: HTTP 200 with homepage canonical. Duplicate access is consolidated by the canonical; no redirect change was needed.
- Later live requests were inconsistent: connection resets prevented full services/quote body inspection, alias checks and nonexistent-page status verification. This is an unresolved observation, not proof of a site outage.
- Googlebot-specific access, Google-selected canonicals, indexing status and real-user Core Web Vitals were not independently established.

## G. External actions

Hosting action before Google submission: deploy the audited frontend HTML, Next assets, icons, image derivatives, robots and sitemap to the existing production host while preserving the working production API configuration and customer uploads. This audit did not deploy to Hostinger or to the retired preview host.

Then:
1. Create or confirm the Search Console Domain property for cavalrygreenllc.com.
2. Verify domain ownership using Google’s DNS record.
3. Submit https://cavalrygreenllc.com/sitemap.xml.
4. Use live URL Inspection for the homepage, services and quote pages; confirm accessibility and Google-selected canonicals, then request indexing where appropriate.
5. Recheck production quote access, HTTPS/host redirects, real 404 status and asset availability. Investigate hosting/CDN/TLS only if failures reproduce outside this audit environment.
6. Associate https://cavalrygreenllc.com/ with the verified Google Business Profile.
7. Review accurate GBP categories, services, phone, service areas, real business photos and actual business hours. Keep a service-area business’s private address hidden where applicable; do not invent a storefront.
8. Monitor Search Console indexing, performance and Core Web Vitals after Google crawls the deployed version.

Technical readiness does not guarantee indexing, rich results, rankings or leads.

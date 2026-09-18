/**
 * Resolve a path inside `public/` against the build's base URL.
 *
 * A normal build has a base of `/`, so `asset('assets/images/x.webp')` returns
 * `/assets/images/x.webp` — a root-relative path, which is what any site served
 * from its own domain root wants.
 *
 * The preview build (`npm run build:preview`) sets the base to `./` so the
 * bundle works from an arbitrary sub-path. Going through this helper is what
 * makes images follow that base instead of hard-coding a root-relative path
 * that would 404 there.
 *
 * Pass paths without a leading slash; a leading slash is tolerated and stripped.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalisedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalisedBase}${path.replace(/^\/+/, '')}`;
}

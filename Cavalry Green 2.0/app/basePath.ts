// Single source of truth for this site's deployed sub-path when it is
// hosted underneath jessabel.art (https://jessabel.art/cavalry-green/)
// instead of at its own domain root. Used by next.config.ts (so Next
// automatically rewrites <Link>/<Image>/_next asset URLs) and by any
// client code that builds a request URL by hand (e.g. fetch calls),
// which Next does NOT rewrite automatically.
export const basePath = '/cavalry-green';

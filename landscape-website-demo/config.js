// Deployed sub-path when hosted underneath jessabel.art
// (https://jessabel.art/landscape-website-demo/) instead of at a domain root.
export const basePath = '/landscape-website-demo';

// Every internal href/src/srcset in the site is authored as a root-absolute
// path (e.g. '/services/') so route-matching in app.js can compare it
// directly against location.pathname. withBase() is the single place that
// turns one of those into a real, deployable URL — used identically whether
// the markup is produced at build time (scripts/build.mjs) or re-rendered
// client-side (app.js), since both call the same header/footer/page
// functions. Never hand-prefix a path elsewhere; route through this.
export const withBase = (rootRelativePath) => basePath + rootRelativePath;

export const business = {
  name: 'Alder & Field', tagline: 'Thoughtfully planted. Beautifully kept.',
  phone: '(202) 555-0148', phoneHref: '+12025550148', email: 'hello@alderandfield.example',
  hours: 'Mon–Fri, 8am–5pm · Sat by appointment',
  portfolioUrl: 'https://jessabel.art/',
  siteUrl: 'https://jessabel.art' + basePath,
  demo: true,
  regions: ['The town center', 'Surrounding neighborhoods', 'Nearby communities'],
};
export const navigation = [['Home','/'],['Services','/services/'],['Products','/products/'],['About','/about/']];

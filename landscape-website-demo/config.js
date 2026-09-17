// Deployed sub-path when hosted underneath jessabel.art
// (https://jessabel.art/landscape-website-demo/) instead of at a domain root.
export const basePath = '/landscape-website-demo';

export const business = {
  name: 'Alder & Field', tagline: 'Thoughtfully planted. Beautifully kept.',
  phone: '(202) 555-0148', email: 'hello@alderandfield.example',
  hours: 'Mon–Fri, 8am–5pm · Sat by appointment',
  portfolioUrl: 'https://jessabel.art/',
  siteUrl: 'https://jessabel.art' + basePath,
  demo: true,
  regions: ['The town center', 'Surrounding neighborhoods', 'Nearby communities'],
};
export const navigation = [['Home','/'],['Services','/services/'],['Products','/products/'],['About','/about/']];

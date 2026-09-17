import { socialImage } from '../seo';
import { Footer, Header } from '../components';
import QuoteForm from './QuoteForm';

export const metadata = {
  title: { absolute: 'Request a Lawn Care or Landscaping Quote | Cavalry Green LLC' },
  description: 'Request a quote from Cavalry Green LLC for lawn care, landscaping, property cleanup and maintenance services in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.',
  alternates: { canonical: 'https://cavalrygreenllc.com/quote/' },
  openGraph: {
    title: 'Request a Lawn Care or Landscaping Quote | Cavalry Green LLC',
    description: 'Tell Cavalry Green what your property needs and request a quote for lawn care, landscaping, cleanup and maintenance in the Fayetteville and Hope Mills area.',
    url: 'https://cavalrygreenllc.com/quote/',
    type: 'website',
    siteName: 'Cavalry Green LLC',
    images: [socialImage],
  },
  twitter: { card: 'summary_large_image' as const, images: [socialImage], title: 'Request a Lawn Care or Landscaping Quote | Cavalry Green LLC', description: 'Request lawn care, landscaping, cleanup, and maintenance services in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.' },
};

export default function Quote(){return <><Header /><main id="main-content"><section className="quote-shell"><aside className="quote-intro"><p className="eyebrow">Request service</p><h1>Let’s take care<br /><em>of your property.</em></h1><p>Describe the property, location, services needed, and how you prefer to be contacted. We serve Hope Mills, Fayetteville, Raeford, Spring Lake, Cameron, and nearby communities.</p><div className="business-card"><p className="footer-label">Cavalry Green LLC</p><a href="tel:+14723002290">472-300-2290</a><span>Veteran owned</span><span>Hope Mills · Fayetteville · Raeford<br />Spring Lake · Cameron · Nearby communities</span></div></aside><div className="form-panel"><QuoteForm /></div></section></main><Footer /></>}

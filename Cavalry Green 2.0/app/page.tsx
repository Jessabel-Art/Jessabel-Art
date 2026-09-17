import { socialImage } from './seo';
import Link from 'next/link';
import Image from 'next/image';
import { FinalCta, Footer, Header, serviceFamilies } from './components';
import { basePath } from './basePath';

export const metadata = {
  title: { absolute: 'Lawn Care & Landscaping in Hope Mills, NC | Cavalry Green LLC' },
  description: 'Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC. Request a quote from Cavalry Green LLC.',
  alternates: { canonical: 'https://cavalrygreenllc.com/' },
  openGraph: {
    title: 'Lawn Care & Landscaping in Hope Mills, NC | Cavalry Green LLC',
    description: 'Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.',
    url: 'https://cavalrygreenllc.com/',
    type: 'website',
    siteName: 'Cavalry Green LLC',
    images: [socialImage],
  },
  twitter: { card: 'summary_large_image' as const, images: [socialImage], title: 'Lawn Care & Landscaping in Hope Mills, NC | Cavalry Green LLC', description: 'Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.' },
};

export default function Home() {
  return <><Header /><main id="main-content">
    <section className="hero">
      <div className="hero-photo"><Image src={`${basePath}/hero-lawn.webp`} alt="Maintained residential lawn and landscaped planting beds" fill priority sizes="(max-width: 960px) 100vw, 57vw" /></div>
      <div className="hero-copy"><p className="eyebrow">Hope Mills · Fayetteville · Surrounding communities</p><h1><span className="keep">Year‑round</span><br /><em>property care.</em></h1><p className="hero-deck">Cavalry Green provides lawn care, landscaping, property cleanup, and recurring maintenance for homes and properties throughout Hope Mills, Fayetteville, Raeford, Spring Lake, and Cameron, NC.</p><div className="hero-actions"><Link className="button button-dark" href="/quote">Request a quote</Link><Link className="text-link" href="/services">Explore all services</Link></div></div>
      <div className="hero-rail"><span>Veteran owned</span><span>Community focused</span></div>
    </section>
    <section className="intro split-statement" aria-labelledby="intro-heading"><span className="watermark" aria-hidden="true">CAVALRY</span><div><p className="eyebrow">Built for the work</p><h2 id="intro-heading">Built on discipline.<br /><em>Focused on your property.</em></h2></div><p className="statement-copy">From lawn care and landscaping to cleanup and recurring property maintenance, Cavalry Green helps homeowners and properties stay cared for across Hope Mills, Fayetteville, Raeford, Spring Lake, and Cameron.</p></section>
    <section className="service-preview"><div className="section-heading"><p className="eyebrow">Capabilities in the field</p><h2>Care for the<br /><em>whole property.</em></h2><Link className="text-link" href="/services">View the full service list</Link></div><div className="service-index">{serviceFamilies.map((family)=><article key={family.title} className="service-row"><h3>{family.title}</h3><p>{family.items.slice(0,3).join(' · ')}</p></article>)}</div></section>
    <section className="veteran-story"><div className="story-photo"><Image src={`${basePath}/service-landscape.webp`} alt="Freshly maintained planting bed and lawn at a residential property" fill sizes="(max-width: 850px) 100vw, 58vw" /></div><div className="story-copy"><p className="eyebrow">A service mindset</p><h2>Veteran owned.<br /><em>Community focused.</em></h2><p>Discipline, reliability, attention to detail, and respect for your property guide every job. Cavalry Green brings that steady service mindset to homes and properties throughout the communities we serve.</p></div></section>
    <section className="service-area"><span className="watermark" aria-hidden="true">GREEN</span><div><p className="eyebrow">Local coverage</p><h2>Close to home.<br /><em>Ready for the work.</em></h2><p>Serving Hope Mills, Fayetteville, Raeford, Spring Lake, Cameron, and nearby communities where scheduling and project scope allow.</p></div><div className="area-grid" aria-label="Service areas"><span>Hope Mills</span><span>Fayetteville</span><span>Raeford</span><span>Spring Lake</span><span>Cameron</span><span>Surrounding communities</span></div></section>
    <FinalCta /><Footer />
  </main></>;
}

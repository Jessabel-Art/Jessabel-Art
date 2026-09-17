import { socialImage } from '../seo';
import Link from 'next/link';
import Image from 'next/image';
import { Footer, Header, serviceFamilies } from '../components';
import { basePath } from '../basePath';

export const metadata = {
  title: { absolute: 'Lawn Care & Landscaping Services | Cavalry Green LLC' },
  description: 'Explore lawn care, landscaping, mulch and pine straw, trimming, property cleanups, debris removal and recurring maintenance from Cavalry Green LLC serving the Fayetteville and Hope Mills area.',
  alternates: { canonical: 'https://cavalrygreenllc.com/services/' },
  openGraph: {
    title: 'Lawn Care & Landscaping Services | Cavalry Green LLC',
    description: 'Lawn care, landscaping, cleanup, debris removal and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.',
    url: 'https://cavalrygreenllc.com/services/',
    type: 'website',
    siteName: 'Cavalry Green LLC',
    images: [socialImage],
  },
  twitter: { card: 'summary_large_image' as const, images: [socialImage], title: 'Lawn Care & Landscaping Services | Cavalry Green LLC', description: 'Explore lawn care, landscaping, cleanup and recurring maintenance from Cavalry Green LLC.' },
};

export default function Services() {
  const imageData = [
    {src:`${basePath}/service-landscape.webp`,alt:'Lawn edging beside a mulched planting bed and walkway'},
    {src:`${basePath}/service-cleanup.webp`,alt:'Branches, leaves and bagged yard debris gathered beside a driveway'},
    {src:`${basePath}/service-hauling.webp`,alt:'Utility trailer loaded with furniture and household items for hauling'},
  ];
  return <><Header /><main id="main-content"><section className="page-hero services-hero"><div><p className="eyebrow">Residential property services</p><h1><span className="keep">Property care,</span><br /><em>from routine to seasonal.</em></h1></div><p>Cavalry Green offers lawn care, landscaping, cleanup, debris removal, and recurring maintenance for properties throughout Hope Mills, Fayetteville, Raeford, Spring Lake, and Cameron, NC.</p></section>
    <section className="catalog" aria-label="Property service catalog">{serviceFamilies.map((family,index)=><article className={`catalog-family family-${index+1}`} key={family.title}><div className="category-copy"><p className="eyebrow">Service family</p><h2>{family.title}</h2><p>{family.note}</p></div><div className="catalog-items">{family.items.map(item=><div className="catalog-item" key={item}><h3>{item}</h3></div>)}</div><div className="category-photo"><Image src={imageData[index].src} alt={imageData[index].alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1200px) 100vw, 25vw" /></div></article>)}</section>
    <section className="fit-cta"><p className="eyebrow">Not sure which service fits?</p><h2>Start with the property,<br /><em>not the service name.</em></h2><p>Describe what needs attention, the condition of the property, and what you would like handled. We’ll determine the appropriate category from there.</p><Link className="button button-dark" href="/quote">Request a property service quote</Link></section>
    </main><Footer /></>;
}

import Link from 'next/link';
import Image from 'next/image';
import { basePath } from './basePath';

export const serviceFamilies = [
  { title: 'Lawn & Landscape', note: 'Routine care and considered improvements that keep the property orderly, healthy, and ready for the season.', items: ['Lawn Care','Landscaping','Mulch & Pine Straw','Planting','Hedge & Shrub Trimming'] },
  { title: 'Cleanup & Removal', note: 'Practical help clearing what has accumulated—from seasonal debris to storm-damaged material.', items: ['Yard Clear-Outs','Junk Removal','Brush & Debris Removal','Leaf Removal','Property Cleanups','Storm Cleanup'] },
  { title: 'Property Services', note: 'Flexible support for ongoing needs, special occasions, and the work that falls outside routine lawn care.', items: ['Light Hauling','Recurring Property Maintenance','Seasonal & Holiday Services'] },
];

export function Header() {
  return <><a className="skip-link" href="#main-content">Skip to main content</a><header className="site-header">
    <Link className="brand" href="/" aria-label="Cavalry Green LLC home"><Image src={`${basePath}/cavalry-green-logo.webp`} alt="" width={100} height={100} priority /></Link>
    <nav className="desktop-nav" aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/quote">Request a Quote</Link></nav>
    <a className="phone-link" href="tel:+14723002290">472-300-2290</a>
    <details className="mobile-menu"><summary><span className="sr-only">Menu</span><i></i><i></i></summary><nav aria-label="Mobile navigation"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/quote">Request a Quote</Link><a href="tel:+14723002290">Call 472-300-2290</a></nav></details>
  </header></>;
}

export function Footer() {
  return <footer className="footer">
    <div className="footer-lead"><Image src={`${basePath}/cavalry-green-logo.webp`} alt="Cavalry Green LLC" width={120} height={120} /><p>Veteran owned.<br />Community focused.</p></div>
    <div><p className="footer-label">Navigate</p><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/quote">Request a Quote</Link></div>
    <div><p className="footer-label">Service area</p><p>Hope Mills · Fayetteville · Raeford · Spring Lake · Cameron · Surrounding communities</p></div>
    <div><p className="footer-label">Talk with us</p><a className="footer-phone" href="tel:+14723002290">472-300-2290</a></div>
    <p className="footer-base">© {new Date().getFullYear()} Cavalry Green LLC · <a className="portfolio-link" href="https://jessabel.art/">Return to Portfolio</a></p>
  </footer>;
}

export function FinalCta() {
  return <section className="final-cta"><Image className="final-bg" src={`${basePath}/final-property.webp`} alt="" fill sizes="100vw" /><span className="watermark" aria-hidden="true">PROPERTY CARE</span><p className="eyebrow">Ready when your property needs attention</p><h2>Your property.<br /><em>Handled.</em></h2><p>Tell us what needs attention. We’ll help determine the appropriate next step.</p><div className="hero-actions"><Link className="button button-light" href="/quote">Request a quote</Link><a className="text-link" href="tel:+14723002290">Call 472-300-2290</a></div></section>;
}

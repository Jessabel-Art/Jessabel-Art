import type { Metadata, Viewport } from 'next';
import { Oswald, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { siteUrl, socialImage } from './seo';
import { basePath } from './basePath';

const display = Oswald({ variable: '--font-display', subsets: ['latin'], display: 'swap' });
const body = Source_Sans_3({ variable: '--font-body', subsets: ['latin'], display: 'swap' });

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f2ebdd' };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Cavalry Green LLC | Lawn Care & Landscaping in Hope Mills, NC', template: '%s | Cavalry Green LLC' },
  description: 'Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC. Request a quote from Cavalry Green LLC.',
  applicationName: 'Cavalry Green LLC',
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon-96x96.png`, sizes: '96x96', type: 'image/png' },
    ],
    apple: { url: `${basePath}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
  },
  manifest: `${basePath}/site.webmanifest`,
  openGraph: {
    title: 'Cavalry Green LLC',
    description: 'Reliable lawn care, landscaping, property cleanups and recurring property maintenance in Hope Mills, Fayetteville, Raeford, Spring Lake and Cameron, NC.',
    siteName: 'Cavalry Green LLC',
    type: 'website',
    url: 'https://cavalrygreenllc.com/',
    images: [socialImage],
  },
  twitter: { card: 'summary', title: 'Cavalry Green LLC', description: 'Lawn care, landscaping, property cleanup and recurring maintenance in the Fayetteville and Hope Mills area.' },
  robots: { index: true, follow: true },
};

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#business`,
  name: 'Cavalry Green LLC',
  url: 'https://cavalrygreenllc.com/',
  telephone: '+1-472-300-2290',
  description: 'Cavalry Green LLC provides lawn care, landscaping, property cleanup and recurring property maintenance for homeowners and properties throughout the Fayetteville and Hope Mills area.',
  areaServed: ['Hope Mills', 'Fayetteville', 'Raeford', 'Spring Lake', 'Cameron'].map((name) => ({ '@type': 'City', name: `${name}, NC` })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cavalry Green LLC Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lawn Care' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landscaping' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mulch & Pine Straw' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Planting' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hedge & Shrub Trimming' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Yard Clear-Outs' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Junk Removal' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brush & Debris Removal' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Leaf Removal' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Property Cleanups' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Storm Cleanup' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Light Hauling' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Recurring Property Maintenance' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Seasonal & Holiday Services' } },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }} /></body></html>;
}

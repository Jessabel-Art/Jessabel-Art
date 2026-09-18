/**
 * Central business configuration.
 *
 * IMPORTANT — this project is currently a portfolio demonstration.
 * Values marked DEMO PLACEHOLDER are intentionally obvious stand-ins.
 * Replace them with verified information only once the business is
 * formally established and the details can be confirmed.
 *
 * No component should hard-code contact details, the tagline, or the
 * portfolio URL. Always read them from here.
 */

export interface SocialLink {
  readonly id: string;
  readonly label: string;
  /** DEMO PLACEHOLDER until real profiles exist. */
  readonly url: string;
}

export interface SiteConfig {
  readonly businessName: string;
  readonly shortName: string;
  readonly legalEntity: string;
  readonly tagline: string;
  readonly descriptor: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly address: string | null;
  readonly serviceArea: string;
  readonly socialLinks: readonly SocialLink[];
  /** Where the "Return to portfolio" control sends the visitor. */
  readonly portfolioUrl: string;
  readonly portfolioLabel: string;
}

export const siteConfig: SiteConfig = {
  businessName: 'Escano Construction LLC',
  shortName: 'Escano Construction',
  legalEntity: 'Escano Construction LLC',
  tagline: 'Building a Stronger Tomorrow',
  descriptor:
    'Residential construction, remodeling, renovation, roofing, and light-commercial improvements.',

  // DEMO PLACEHOLDER — not a working number.
  phone: '(000) 000-0000',
  phoneHref: 'tel:+10000000000',

  // DEMO PLACEHOLDER — not a monitored mailbox.
  email: 'hello@example-escano.com',

  // No physical business address is published for this demonstration.
  address: null,

  serviceArea: 'Jacksonville, Florida and surrounding areas',

  socialLinks: [
    // DEMO PLACEHOLDER links — replace with real profiles when they exist.
    { id: 'instagram', label: 'Instagram', url: '#' },
    { id: 'facebook', label: 'Facebook', url: '#' },
    { id: 'linkedin', label: 'LinkedIn', url: '#' },
  ],

  portfolioUrl: 'https://jessabel.art',
  portfolioLabel: 'Return to Portfolio',
};

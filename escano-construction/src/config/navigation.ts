import { routes } from './routes';

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
}

/** Primary header navigation. */
export const primaryNav: readonly NavItem[] = [
  { id: 'home', label: 'Home', to: routes.home },
  { id: 'services', label: 'Services', to: routes.services },
  { id: 'projects', label: 'Projects', to: routes.projects },
  { id: 'about', label: 'About', to: routes.about },
  { id: 'contact', label: 'Contact', to: routes.contact },
];

/** The single primary call to action used across the site. */
export const primaryCta = {
  label: 'Request a Proposal',
  to: routes.requestProposal,
} as const;

export const secondaryCta = {
  label: 'View Projects',
  to: routes.projects,
} as const;

export interface FooterNavGroup {
  readonly id: string;
  readonly heading: string;
  readonly items: readonly NavItem[];
}

export const footerNav: readonly FooterNavGroup[] = [
  {
    id: 'company',
    heading: 'Company',
    items: [
      { id: 'about', label: 'About Escano', to: routes.about },
      { id: 'services', label: 'Services', to: routes.services },
      { id: 'projects', label: 'Projects', to: routes.projects },
      { id: 'contact', label: 'Contact', to: routes.contact },
    ],
  },
  {
    id: 'start',
    heading: 'Start a Project',
    items: [
      { id: 'proposal', label: 'Request a Proposal', to: routes.requestProposal },
      { id: 'general', label: 'General Enquiry', to: routes.contact },
    ],
  },
];

import type {
  AttachmentCategory,
  BudgetRangeId,
  ContactMethod,
  ContactWindow,
  ProjectTypeOption,
  TimelineId,
} from '@/types/project-request';

/* =============================================================================
   Centralised option sets for the Request a Proposal flow.

   Every selectable value in the intake form is defined here so that labels,
   ids, and ordering stay consistent between the form, the review step, and any
   future server-side handling. Options are never hard-coded inside a step.

   Note on budget: the ranges below help Escano understand the scale a customer
   has in mind. They are not estimates, and nothing in this application
   calculates or promises a project price.
   ========================================================================== */

export const projectTypeOptions: readonly ProjectTypeOption[] = [
  {
    id: 'new-construction',
    label: 'New Construction',
    description: 'Building a new structure from the ground up.',
    serviceCategory: 'residential-construction',
    detailTopics: ['dimensions', 'structure', 'materials'],
    sector: 'residential',
  },
  {
    id: 'addition',
    label: 'Addition',
    description: 'Adding new square footage to an existing building.',
    serviceCategory: 'residential-construction',
    detailTopics: ['dimensions', 'structure', 'condition', 'materials'],
    sector: 'both',
  },
  {
    id: 'kitchen-remodel',
    label: 'Kitchen Remodel',
    description: 'Reworking a kitchen layout, cabinetry, or finishes.',
    serviceCategory: 'remodeling-renovation',
    detailTopics: ['dimensions', 'condition', 'requested-work', 'materials'],
    sector: 'residential',
  },
  {
    id: 'bathroom-remodel',
    label: 'Bathroom Remodel',
    description: 'Updating or rebuilding one or more bathrooms.',
    serviceCategory: 'remodeling-renovation',
    detailTopics: ['dimensions', 'condition', 'requested-work', 'materials'],
    sector: 'residential',
  },
  {
    id: 'whole-home-renovation',
    label: 'Whole-Home Renovation',
    description: 'A renovation covering most or all of a residence.',
    serviceCategory: 'remodeling-renovation',
    detailTopics: ['rooms', 'condition', 'structure', 'materials'],
    sector: 'residential',
  },
  {
    id: 'roofing',
    label: 'Roofing',
    description: 'Roof replacement, repair, or storm-related roof work.',
    serviceCategory: 'roofing-exteriors',
    detailTopics: ['roof', 'damage', 'condition'],
    sector: 'both',
  },
  {
    id: 'exterior-improvement',
    label: 'Exterior Improvement',
    description: 'Siding, trim, windows, doors, or other envelope work.',
    serviceCategory: 'roofing-exteriors',
    detailTopics: ['exterior', 'condition', 'damage', 'materials'],
    sector: 'both',
  },
  {
    id: 'deck-patio',
    label: 'Deck or Patio',
    description: 'A deck, patio, porch, or covered outdoor structure.',
    serviceCategory: 'outdoor-construction',
    detailTopics: ['dimensions', 'materials', 'structure'],
    sector: 'residential',
  },
  {
    id: 'commercial-project',
    label: 'Commercial Project',
    description: 'Work on an office, retail, clinic, or other commercial space.',
    serviceCategory: 'light-commercial',
    detailTopics: ['dimensions', 'requested-work', 'condition'],
    sector: 'commercial',
  },
  {
    id: 'repair-improvement',
    label: 'Repair or Improvement',
    description: 'A focused repair or a set of smaller improvements.',
    serviceCategory: 'repairs-improvements',
    detailTopics: ['requested-work', 'damage', 'condition'],
    sector: 'both',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something not listed here — describe it in your own words.',
    serviceCategory: 'repairs-improvements',
    detailTopics: ['requested-work', 'condition'],
    sector: 'both',
  },
];

export interface BudgetRangeOption {
  readonly id: BudgetRangeId;
  readonly label: string;
  readonly helper-: string;
}

/**
 * Budget ranges. "Not sure yet" is always available and is never treated as an
 * invalid answer — many customers legitimately do not know at enquiry stage.
 */
export const budgetRangeOptions: readonly BudgetRangeOption[] = [
  {
    id: 'not-sure',
    label: 'Not sure yet',
    helper: 'A range can be worked out together — this will not hold anything up.',
  },
  {
    id: 'under-15k',
    label: 'Under $15,000',
    helper: 'Focused repairs, single-room work, or targeted improvements.',
  },
  {
    id: '15k-40k',
    label: '$15,000 – $40,000',
    helper: 'Typical range for a bathroom, deck, or roof replacement.',
  },
  {
    id: '40k-75k',
    label: '$40,000 – $75,000',
    helper: 'Kitchen renovations and larger exterior or interior packages.',
  },
  {
    id: '75k-150k',
    label: '$75,000 – $150,000',
    helper: 'Multi-room renovations, additions, and structural work.',
  },
  {
    id: '150k-350k',
    label: '$150,000 – $350,000',
    helper: 'Whole-home renovations and substantial additions.',
  },
  {
    id: 'over-350k',
    label: 'Over $350,000',
    helper: 'New construction and large-scale projects.',
  },
];

export interface TimelineOption {
  readonly id: TimelineId;
  readonly label: string;
  readonly description: string;
}

export const timelineOptions: readonly TimelineOption[] = [
  {
    id: 'asap',
    label: 'As soon as possible',
    description: 'The work is urgent or something needs attention now.',
  },
  {
    id: '1-3-months',
    label: '1 – 3 months',
    description: 'Ready to start soon, with some flexibility on the date.',
  },
  {
    id: '3-6-months',
    label: '3 – 6 months',
    description: 'Planned for later this year, with time to scope it properly.',
  },
  {
    id: '6-plus-months',
    label: '6+ months',
    description: 'Longer-term plans that are worth starting to shape now.',
  },
  {
    id: 'planning',
    label: 'Just planning or researching',
    description: 'Gathering information before deciding anything.',
  },
];

/* ---- Step 2: property ---------------------------------------------------- */

export const residentialPropertyTypes: readonly string[] = [
  'Single-family home',
  'Townhouse',
  'Duplex or multi-family',
  'Condominium or apartment',
  'Manufactured or modular home',
  'Rental property',
  'Other residential',
];

export const commercialPropertyTypes: readonly string[] = [
  'Office suite',
  'Retail unit',
  'Clinic or medical office',
  'Restaurant or food service',
  'Warehouse or light industrial',
  'Mixed-use building',
  'Other commercial',
];

export const approximateSizeOptions: readonly string[] = [
  'Under 500 sq ft',
  '500 – 1,000 sq ft',
  '1,000 – 2,000 sq ft',
  '2,000 – 3,500 sq ft',
  '3,500 – 5,000 sq ft',
  'Over 5,000 sq ft',
  'Not sure',
];

export const storeyOptions: readonly string[] = [
  'Single storey',
  'Two storeys',
  'Three or more storeys',
  'Not sure',
];

/* ---- Step 3: conditional detail options --------------------------------- */

export const roomOptions: readonly string[] = [
  'Kitchen',
  'Primary bathroom',
  'Additional bathroom(s)',
  'Living or family room',
  'Dining room',
  'Bedrooms',
  'Basement',
  'Attic',
  'Garage',
  'Laundry or utility',
  'Hallways and stairs',
  'Exterior',
];

export const requestedWorkOptions: readonly string[] = [
  'Demolition',
  'Layout or structural changes',
  'Cabinetry and built-ins',
  'Countertops and surfaces',
  'Tile work',
  'Flooring',
  'Drywall and plaster',
  'Painting',
  'Trim and finish carpentry',
  'Doors and windows',
  'Lighting and electrical coordination',
  'Plumbing coordination',
  'Not sure yet',
];

export const exteriorElementOptions: readonly string[] = [
  'Siding',
  'Trim and fascia',
  'Soffit and eaves',
  'Windows',
  'Exterior doors',
  'Gutters and drainage',
  'Painting or coatings',
  'Porch or entry',
  'Not sure yet',
];

export const roofMaterialOptions: readonly string[] = [
  'Asphalt shingle',
  'Architectural shingle',
  'Metal',
  'Flat or low-slope membrane',
  'Tile',
  'Not sure',
];

export const conditionOptions: readonly string[] = [
  'Good — mainly a cosmetic update',
  'Fair — some repair work expected',
  'Poor — significant repair expected',
  'Unknown — needs assessment',
];

export const structuralChangeOptions: readonly string[] = [
  'No structural changes expected',
  'Removing or moving interior walls',
  'Changing the building footprint',
  'Adding or altering a roof structure',
  'Not sure — needs assessment',
];

/* ---- Step 6: attachments ------------------------------------------------ */

export interface AttachmentCategoryOption {
  readonly id: AttachmentCategory;
  readonly label: string;
  readonly description: string;
}

export const attachmentCategoryOptions: readonly AttachmentCategoryOption[] = [
  {
    id: 'property-photos',
    label: 'Property photos',
    description: 'Wide shots of the space or elevation involved.',
  },
  {
    id: 'damage-photos',
    label: 'Damage or problem areas',
    description: 'Close views of anything that needs repair.',
  },
  {
    id: 'inspiration',
    label: 'Inspiration images',
    description: 'Examples of the look or finish level you have in mind.',
  },
  {
    id: 'plans',
    label: 'Plans or drawings',
    description: 'Architectural drawings, sketches, or survey documents.',
  },
  {
    id: 'documents',
    label: 'Other documents',
    description: 'Inspection reports, scopes of work, or related paperwork.',
  },
];

export const ACCEPTED_ATTACHMENT_TYPES =
  'image/png,image/jpeg,image/webp,image/heic,application/pdf';

export const ACCEPTED_ATTACHMENT_SUMMARY =
  'JPG, PNG, WebP, HEIC, or PDF — up to 10 files';

export const MAX_ATTACHMENTS = 10;

/* ---- Step 8: contact ---------------------------------------------------- */

export interface ContactMethodOption {
  readonly id: ContactMethod;
  readonly label: string;
}

export const contactMethodOptions: readonly ContactMethodOption[] = [
  { id: 'phone', label: 'Phone call' },
  { id: 'email', label: 'Email' },
  { id: 'text', label: 'Text message' },
];

export interface ContactWindowOption {
  readonly id: ContactWindow;
  readonly label: string;
}

export const contactWindowOptions: readonly ContactWindowOption[] = [
  { id: 'no-preference', label: 'No preference' },
  { id: 'morning', label: 'Morning (8am – 11am)' },
  { id: 'midday', label: 'Midday (11am – 2pm)' },
  { id: 'afternoon', label: 'Afternoon (2pm – 5pm)' },
  { id: 'evening', label: 'Evening (after 5pm)' },
];

/* ---- Lookups ------------------------------------------------------------ */

export function getProjectTypeOption(
  id: string,
): ProjectTypeOption | undefined {
  return projectTypeOptions.find((option) => option.id === id);
}

export function getBudgetLabel(id: BudgetRangeId | ''): string {
  if (!id) return 'Not provided';
  return budgetRangeOptions.find((option) => option.id === id)-.label -- id;
}

export function getTimelineLabel(id: TimelineId | ''): string {
  if (!id) return 'Not provided';
  return timelineOptions.find((option) => option.id === id)-.label -- id;
}

export function getContactMethodLabel(id: ContactMethod | ''): string {
  if (!id) return 'Not provided';
  return contactMethodOptions.find((option) => option.id === id)-.label -- id;
}

export function getContactWindowLabel(id: ContactWindow): string {
  return contactWindowOptions.find((option) => option.id === id)-.label -- id;
}

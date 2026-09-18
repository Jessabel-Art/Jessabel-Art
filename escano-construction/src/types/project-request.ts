import type { ServiceCategoryId } from './service';

/** Stable identifiers for the intake project types (step 1). */
export type ProjectTypeId =
  | 'new-construction'
  | 'addition'
  | 'kitchen-remodel'
  | 'bathroom-remodel'
  | 'whole-home-renovation'
  | 'roofing'
  | 'exterior-improvement'
  | 'deck-patio'
  | 'commercial-project'
  | 'repair-improvement'
  | 'other';

/**
 * Question groups that a project type may require in step 3.
 * Keeping this as a small set of flags avoids an unmaintainable decision tree.
 */
export type DetailTopic =
  | 'rooms'
  | 'dimensions'
  | 'condition'
  | 'requested-work'
  | 'damage'
  | 'materials'
  | 'roof'
  | 'exterior'
  | 'structure';

export interface ProjectTypeOption {
  readonly id: ProjectTypeId;
  readonly label: string;
  readonly description: string;
  /** Links intake selections back to the centralised service categories. */
  readonly serviceCategory: ServiceCategoryId;
  /** Which conditional detail groups step 3 should show. */
  readonly detailTopics: readonly DetailTopic[];
  readonly sector: 'residential' | 'commercial' | 'both';
}

export type PropertyUse = 'residential' | 'commercial';

export type BudgetRangeId =
  | 'not-sure'
  | 'under-15k'
  | '15k-40k'
  | '40k-75k'
  | '75k-150k'
  | '150k-350k'
  | 'over-350k';

export type TimelineId =
  | 'asap'
  | '1-3-months'
  | '3-6-months'
  | '6-plus-months'
  | 'planning';

export type ContactMethod = 'phone' | 'email' | 'text';

export type ContactWindow =
  | 'no-preference'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'evening';

/**
 * A file the customer selected in the browser.
 *
 * Nothing is uploaded in this phase — the browser `File` object is held in
 * memory only. When a real upload service is introduced, this record gains
 * server-side fields (for example a storage key and an upload status) and the
 * `file` reference is used by the uploader.
 */
export interface ProjectAttachment {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly category: AttachmentCategory;
  readonly file: File;
}

export type AttachmentCategory =
  | 'property-photos'
  | 'damage-photos'
  | 'inspiration'
  | 'plans'
  | 'documents';

export interface ContactInformation {
  fullName: string;
  email: string;
  phone: string;
  projectAddress: string;
  preferredContactMethod: ContactMethod | '';
  bestTimeToContact: ContactWindow;
}

export interface PropertyDetails {
  use: PropertyUse | '';
  propertyType: string;
  approximateSize: string;
  constructionStatus: 'existing-structure' | 'new-construction' | '';
  occupancy: 'occupied' | 'vacant' | 'not-applicable' | '';
  storeys: string;
}

export interface ProjectDetails {
  rooms: string[];
  dimensions: string;
  existingCondition: string;
  requestedWork: string[];
  knownDamage: string;
  materialPreferences: string;
  specialConsiderations: string;
  roofMaterial: string;
  roofStoreys: string;
  exteriorElements: string[];
  structuralChanges: string;
}

/**
 * The complete customer-facing intake payload.
 *
 * In the future business application, submitting this form will create a
 * ProjectRequest record that an administrator reviews before drafting a
 * proposal. That server-side record will add its own fields (identifier,
 * status, timestamps, assigned reviewer, linked customer). Those belong to the
 * backend and are intentionally absent here.
 */
export interface ProjectRequestDraft {
  projectType: ProjectTypeId | '';
  otherProjectType: string;
  property: PropertyDetails;
  details: ProjectDetails;
  budgetRange: BudgetRangeId | '';
  budgetNotes: string;
  timeline: TimelineId | '';
  timelineNotes: string;
  attachments: ProjectAttachment[];
  projectDescription: string;
  contact: ContactInformation;
}

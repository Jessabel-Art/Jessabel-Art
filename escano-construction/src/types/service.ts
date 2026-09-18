/** Stable identifiers for the six service categories. */
export type ServiceCategoryId =
  | 'residential-construction'
  | 'remodeling-renovation'
  | 'roofing-exteriors'
  | 'outdoor-construction'
  | 'repairs-improvements'
  | 'light-commercial';

export interface ServiceCategory {
  readonly id: ServiceCategoryId;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  /** Broad classification, useful for future filtering and reporting. */
  readonly sector: 'residential' | 'commercial' | 'both';
  readonly active: boolean;
}

/**
 * A single offered service.
 *
 * `id` is the stable key. Future records (project requests, projects,
 * proposals, proposal line items, invoices) are expected to reference
 * services by `id` rather than by name, so ids must not be reused or
 * repurposed once published.
 */
export interface Service {
  readonly id: string;
  readonly slug: string;
  readonly category: ServiceCategoryId;
  readonly name: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly active: boolean;
  /** Optional representative image; falls back to the category image. */
  readonly image?: string;
  /** Ids of other services commonly delivered alongside this one. */
  readonly relatedServices: readonly string[];
}

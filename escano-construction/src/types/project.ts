export type ProjectCategory =
  | 'residential'
  | 'renovation'
  | 'kitchen'
  | 'bathroom'
  | 'roofing'
  | 'exterior'
  | 'outdoor'
  | 'commercial';

export interface ProjectImage {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

/**
 * A demonstration project concept.
 *
 * These records illustrate the type of work Escano Construction is set up to
 * deliver and the way a completed project would be presented. They are not
 * verified client projects, so they deliberately carry no customer names,
 * addresses, prices, or completion dates.
 */
export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly category: ProjectCategory;
  /** Short label describing the type of work, shown in listings and hero. */
  readonly projectType: string;
  readonly summary: string;
  readonly description: string;
  /** References `Service.id` values from the centralised service data. */
  readonly serviceIds: readonly string[];
  readonly hero: ProjectImage;
  readonly images: readonly ProjectImage[];
  /** Line items describing the scope of work at a conceptual level. */
  readonly scope: readonly string[];
  readonly challenge: string;
  readonly approach: readonly string[];
  readonly result: string;
  readonly featured: boolean;
}

export interface ProjectCategoryOption {
  readonly id: ProjectCategory | 'all';
  readonly label: string;
}

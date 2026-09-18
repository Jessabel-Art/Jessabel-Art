import type { ContactMethod } from './project-request';

/** General enquiry from the Contact page — deliberately simpler than intake. */
export interface ContactMessageDraft {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContactMethod: ContactMethod | '';
}

/**
 * Shared shape returned by the simulated submit handlers.
 * A real API client can return this same shape, so calling code does not
 * change when the network layer is introduced.
 */
export interface SubmissionResult {
  readonly status: 'simulated' | 'succeeded' | 'failed';
  /** Local reference only. Not a server-issued identifier. */
  readonly reference: string;
  readonly submittedAt: string;
  readonly message: string;
}

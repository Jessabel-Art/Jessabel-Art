import type { ProjectRequestDraft } from '@/types/project-request';
import type { SubmissionResult } from '@/types/contact';
import { createLocalId } from '@/utils/id';

/* =============================================================================
   Submission adapter for the proposal request form.

   NOTHING IS SENT ANYWHERE. There is no backend, no database, no email
   delivery, and no file upload in this phase. This function exists so that the
   UI already calls a single, well-defined boundary — when a real API is
   introduced, only the body of `submitProjectRequest` changes.

   A future implementation would look roughly like this:

     const response = await fetch('/api/project-requests', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(serialiseDraft(draft)),
     });
     if (!response.ok) throw new SubmissionError(await response.text());
     return response.json();

   File attachments would be uploaded separately (direct-to-storage or
   multipart), and the returned storage references attached to the request.
   ========================================================================== */

/** Delay used only to make the simulated submit feel like a real request. */
const SIMULATED_LATENCY_MS = 900;

/**
 * Serialises the draft into the shape a future API would receive.
 * Browser `File` objects are replaced by their metadata, since files are not
 * transmitted in this phase.
 */
export function serialiseDraft(draft: ProjectRequestDraft) {
  return {
    projectType: draft.projectType,
    otherProjectType: draft.otherProjectType || null,
    property: draft.property,
    details: draft.details,
    budgetRange: draft.budgetRange,
    budgetNotes: draft.budgetNotes || null,
    timeline: draft.timeline,
    timelineNotes: draft.timelineNotes || null,
    projectDescription: draft.projectDescription,
    contact: draft.contact,
    attachments: draft.attachments.map((attachment) => ({
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      category: attachment.category,
    })),
  };
}

/**
 * Simulates submitting a project request.
 *
 * The returned result is explicitly marked `simulated` so the UI can describe
 * what actually happened without overstating it.
 */
export async function submitProjectRequest(
  draft: ProjectRequestDraft,
): Promise<SubmissionResult> {
  // Logged for development visibility only — this is the payload a real API
  // would receive.
  if (import.meta.env.DEV) {
    console.info('[demo] Project request payload (not sent):', serialiseDraft(draft));
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  return {
    status: 'simulated',
    reference: createLocalId('req').toUpperCase(),
    submittedAt: new Date().toISOString(),
    message: 'Your project request has been received.',
  };
}

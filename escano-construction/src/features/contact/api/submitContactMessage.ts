import type { ContactMessageDraft, SubmissionResult } from '@/types/contact';
import { createLocalId } from '@/utils/id';

/* -----------------------------------------------------------------------------
   Simulated contact submission.

   Same pattern as the proposal request adapter: one boundary function, so
   connecting a real endpoint later is a single-file change. Nothing is sent.
   -------------------------------------------------------------------------- */

const SIMULATED_LATENCY_MS = 700;

export async function submitContactMessage(
  draft: ContactMessageDraft,
): Promise<SubmissionResult> {
  if (import.meta.env.DEV) {
    console.info('[demo] Contact message payload (not sent):', draft);
  }

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  return {
    status: 'simulated',
    reference: createLocalId('msg').toUpperCase(),
    submittedAt: new Date().toISOString(),
    message: 'Your message has been received.',
  };
}

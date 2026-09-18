import type { ProjectRequestDraft } from '@/types/project-request';
import { getProjectTypeOption } from '@/data/proposal-options';

export type StepId =
  | 'project-type'
  | 'property'
  | 'details'
  | 'budget'
  | 'timeline'
  | 'attachments'
  | 'description'
  | 'contact'
  | 'review';

export interface StepDefinition {
  readonly id: StepId;
  /** Short label used in the progress indicator. */
  readonly shortLabel: string;
  readonly title: string;
  readonly description: string;
  /** True when a step can be completed without entering anything. */
  readonly skippable?: boolean;
}

export const steps: readonly StepDefinition[] = [
  {
    id: 'project-type',
    shortLabel: 'Project type',
    title: 'What kind of project is this?',
    description:
      'Choose the closest match. It determines which questions come next, and it can be changed later without losing anything you have entered.',
  },
  {
    id: 'property',
    shortLabel: 'Property',
    title: 'Tell us about the property',
    description:
      'Basic property information helps establish scale, access, and the constraints the work has to fit around.',
  },
  {
    id: 'details',
    shortLabel: 'Details',
    title: 'Project details',
    description:
      'These questions are specific to the type of project you selected. Anything you are unsure about can be left blank.',
  },
  {
    id: 'budget',
    shortLabel: 'Budget',
    title: 'Budget range',
    description:
      'A rough range helps shape a realistic scope. Nothing here produces an estimate, and "not sure yet" is a valid answer.',
  },
  {
    id: 'timeline',
    shortLabel: 'Timeline',
    title: 'When would you like to start?',
    description:
      'Timing affects sequencing, material lead times, and scheduling, so it is worth knowing early.',
  },
  {
    id: 'attachments',
    shortLabel: 'Photos',
    title: 'Photos and documents',
    description:
      'Images of the space are the single most useful thing you can add. Selecting files here is optional.',
    skippable: true,
  },
  {
    id: 'description',
    shortLabel: 'Description',
    title: 'Tell us about your project',
    description:
      'In your own words — what you want, what is prompting it, and anything that has already been decided or ruled out.',
  },
  {
    id: 'contact',
    shortLabel: 'Contact',
    title: 'How should we reach you?',
    description:
      'We use these details only to follow up on this request.',
  },
  {
    id: 'review',
    shortLabel: 'Review',
    title: 'Review your request',
    description:
      'Check everything below. Any section can be edited without losing the rest of your answers.',
  },
];

export const TOTAL_STEPS = steps.length;

export function getStepIndex(id: StepId): number {
  return steps.findIndex((step) => step.id === id);
}

/**
 * Which conditional question groups step 3 should render, based on the project
 * type selected in step 1.
 */
export function activeDetailTopics(draft: ProjectRequestDraft): readonly string[] {
  if (!draft.projectType) return [];
  return getProjectTypeOption(draft.projectType)?.detailTopics ?? [];
}

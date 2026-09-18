import { useCallback, useMemo, useReducer } from 'react';
import type {
  ContactInformation,
  ProjectAttachment,
  ProjectDetails,
  ProjectRequestDraft,
  PropertyDetails,
} from '@/types/project-request';
import { steps, type StepId } from '../config/steps';
import { validateStep, type StepErrors } from '../validation/stepValidation';
import { createInitialDraft } from './initialState';

/* =============================================================================
   Single source of truth for the proposal request flow.

   A reducer is used rather than a global state library: the form is one
   self-contained feature, its state never needs to be read elsewhere, and the
   transitions benefit from being explicit and testable.

   State is never cleared when validation fails or when the customer steps
   backwards — answers persist for the whole session until the form is
   deliberately reset.
   ========================================================================== */

export type SubmissionState = 'idle' | 'submitting' | 'submitted';

interface FormState {
  draft: ProjectRequestDraft;
  stepIndex: number;
  /** Errors for the step currently displayed, populated only after a check. */
  errors: StepErrors;
  /** Steps the customer has attempted to advance past. */
  visited: StepId[];
  /** Furthest step reached, so earlier steps stay directly selectable. */
  maxReached: number;
  submission: SubmissionState;
}

type Action =
  | { type: 'set-project-type'; value: ProjectRequestDraft['projectType'] }
  | { type: 'set-field'; key: 'otherProjectType' | 'budgetNotes' | 'timelineNotes' | 'projectDescription'; value: string }
  | { type: 'set-budget'; value: ProjectRequestDraft['budgetRange'] }
  | { type: 'set-timeline'; value: ProjectRequestDraft['timeline'] }
  | { type: 'patch-property'; patch: Partial<PropertyDetails> }
  | { type: 'patch-details'; patch: Partial<ProjectDetails> }
  | { type: 'patch-contact'; patch: Partial<ContactInformation> }
  | { type: 'add-attachments'; attachments: ProjectAttachment[] }
  | { type: 'remove-attachment'; id: string }
  | { type: 'go-to-step'; index: number }
  | { type: 'attempt-next' }
  | { type: 'go-back' }
  | { type: 'clear-error'; key: string }
  | { type: 'set-submission'; value: SubmissionState }
  | { type: 'reset' };

function initialState(): FormState {
  return {
    draft: createInitialDraft(),
    stepIndex: 0,
    errors: {},
    visited: [],
    maxReached: 0,
    submission: 'idle',
  };
}

function withoutErrors(state: FormState, ...keys: string[]): StepErrors {
  if (keys.length === 0) return state.errors;
  const next = { ...state.errors };
  keys.forEach((key) => delete next[key]);
  return next;
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'set-project-type': {
      // Changing the project type keeps every other answer intact. Detail
      // questions are conditional on this value, so irrelevant answers simply
      // stop being displayed rather than being destroyed.
      return {
        ...state,
        draft: { ...state.draft, projectType: action.value },
        errors: withoutErrors(state, 'projectType'),
      };
    }

    case 'set-field': {
      return {
        ...state,
        draft: { ...state.draft, [action.key]: action.value },
        errors: withoutErrors(state, action.key),
      };
    }

    case 'set-budget': {
      return {
        ...state,
        draft: { ...state.draft, budgetRange: action.value },
        errors: withoutErrors(state, 'budgetRange'),
      };
    }

    case 'set-timeline': {
      return {
        ...state,
        draft: { ...state.draft, timeline: action.value },
        errors: withoutErrors(state, 'timeline'),
      };
    }

    case 'patch-property': {
      const property = { ...state.draft.property, ...action.patch };
      // Switching between residential and commercial invalidates the property
      // type list, so that one dependent value is cleared.
      if (action.patch.use && action.patch.use !== state.draft.property.use) {
        property.propertyType = '';
      }
      return {
        ...state,
        draft: { ...state.draft, property },
        errors: withoutErrors(
          state,
          ...Object.keys(action.patch).map((key) => `property.${key}`),
        ),
      };
    }

    case 'patch-details': {
      return {
        ...state,
        draft: { ...state.draft, details: { ...state.draft.details, ...action.patch } },
        errors: withoutErrors(
          state,
          ...Object.keys(action.patch).map((key) => `details.${key}`),
        ),
      };
    }

    case 'patch-contact': {
      return {
        ...state,
        draft: { ...state.draft, contact: { ...state.draft.contact, ...action.patch } },
        errors: withoutErrors(
          state,
          ...Object.keys(action.patch).map((key) => `contact.${key}`),
        ),
      };
    }

    case 'add-attachments': {
      return {
        ...state,
        draft: {
          ...state.draft,
          attachments: [...state.draft.attachments, ...action.attachments],
        },
      };
    }

    case 'remove-attachment': {
      return {
        ...state,
        draft: {
          ...state.draft,
          attachments: state.draft.attachments.filter((item) => item.id !== action.id),
        },
      };
    }

    case 'go-to-step': {
      const index = Math.max(0, Math.min(steps.length - 1, action.index));
      return {
        ...state,
        stepIndex: index,
        maxReached: Math.max(state.maxReached, index),
        errors: {},
      };
    }

    case 'attempt-next': {
      const current = steps[state.stepIndex];
      const errors = validateStep(current.id, state.draft);
      const visited = state.visited.includes(current.id)
        - state.visited
        : [...state.visited, current.id];

      if (Object.keys(errors).length > 0) {
        // Answers are preserved; only the error map changes.
        return { ...state, errors, visited };
      }

      const nextIndex = Math.min(steps.length - 1, state.stepIndex + 1);
      return {
        ...state,
        errors: {},
        visited,
        stepIndex: nextIndex,
        maxReached: Math.max(state.maxReached, nextIndex),
      };
    }

    case 'go-back': {
      // Going back never validates and never discards anything.
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1), errors: {} };
    }

    case 'clear-error': {
      return { ...state, errors: withoutErrors(state, action.key) };
    }

    case 'set-submission': {
      return { ...state, submission: action.value };
    }

    case 'reset': {
      return initialState();
    }

    default:
      return state;
  }
}

export function useProjectRequestForm() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const currentStep = steps[state.stepIndex];

  const actions = useMemo(
    () => ({
      setProjectType: (value: ProjectRequestDraft['projectType']) =>
        dispatch({ type: 'set-project-type', value }),
      setField: (
        key: 'otherProjectType' | 'budgetNotes' | 'timelineNotes' | 'projectDescription',
        value: string,
      ) => dispatch({ type: 'set-field', key, value }),
      setBudget: (value: ProjectRequestDraft['budgetRange']) =>
        dispatch({ type: 'set-budget', value }),
      setTimeline: (value: ProjectRequestDraft['timeline']) =>
        dispatch({ type: 'set-timeline', value }),
      patchProperty: (patch: Partial<PropertyDetails>) =>
        dispatch({ type: 'patch-property', patch }),
      patchDetails: (patch: Partial<ProjectDetails>) =>
        dispatch({ type: 'patch-details', patch }),
      patchContact: (patch: Partial<ContactInformation>) =>
        dispatch({ type: 'patch-contact', patch }),
      addAttachments: (attachments: ProjectAttachment[]) =>
        dispatch({ type: 'add-attachments', attachments }),
      removeAttachment: (id: string) => dispatch({ type: 'remove-attachment', id }),
      goToStep: (index: number) => dispatch({ type: 'go-to-step', index }),
      attemptNext: () => dispatch({ type: 'attempt-next' }),
      goBack: () => dispatch({ type: 'go-back' }),
      setSubmission: (value: SubmissionState) =>
        dispatch({ type: 'set-submission', value }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  const validateCurrent = useCallback(
    () => validateStep(currentStep.id, state.draft),
    [currentStep.id, state.draft],
  );

  return {
    draft: state.draft,
    stepIndex: state.stepIndex,
    currentStep,
    errors: state.errors,
    visited: state.visited,
    maxReached: state.maxReached,
    submission: state.submission,
    isFirstStep: state.stepIndex === 0,
    isLastStep: state.stepIndex === steps.length - 1,
    validateCurrent,
    ...actions,
  };
}

export type ProjectRequestFormApi = ReturnType<typeof useProjectRequestForm>;

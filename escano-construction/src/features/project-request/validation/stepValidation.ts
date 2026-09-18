import type { ProjectRequestDraft } from '@/types/project-request';
import type { StepId } from '../config/steps';
import { isBlank, isValidEmail, isValidPhone, minLength } from './validators';

export type StepErrors = Record<string, string>;

const MIN_DESCRIPTION_LENGTH = 30;

/**
 * Validates a single step and returns a map of field key to message.
 *
 * Validation is kept separate from the step components so the same rules can be
 * reused by a server-side handler when the intake form is connected to an API.
 *
 * Field keys match the `name`/`id` used by the corresponding control, so the
 * form can move focus to the first field with an error.
 */
export function validateStep(step: StepId, draft: ProjectRequestDraft): StepErrors {
  const errors: StepErrors = {};

  switch (step) {
    case 'project-type': {
      if (!draft.projectType) {
        errors.projectType = 'Select the option closest to your project.';
      }
      if (draft.projectType === 'other' && isBlank(draft.otherProjectType)) {
        errors.otherProjectType = 'Briefly describe the type of project.';
      }
      break;
    }

    case 'property': {
      if (!draft.property.use) {
        errors['property.use'] = 'Select whether this is a residential or commercial property.';
      }
      if (isBlank(draft.property.propertyType)) {
        errors['property.propertyType'] = 'Select the property type.';
      }
      if (!draft.property.constructionStatus) {
        errors['property.constructionStatus'] =
          'Let us know whether this involves an existing structure or new construction.';
      }
      break;
    }

    case 'details': {
      // Step 3 is intentionally forgiving — a customer often does not know these
      // answers yet, and guessing is worse than leaving a field blank.
      break;
    }

    case 'budget': {
      if (!draft.budgetRange) {
        errors.budgetRange = 'Choose a range, or select "Not sure yet".';
      }
      break;
    }

    case 'timeline': {
      if (!draft.timeline) {
        errors.timeline = 'Select the timing that fits best.';
      }
      break;
    }

    case 'attachments': {
      // Attachments are always optional.
      break;
    }

    case 'description': {
      if (isBlank(draft.projectDescription)) {
        errors.projectDescription = 'A short description of the project is needed.';
      } else if (!minLength(draft.projectDescription, MIN_DESCRIPTION_LENGTH)) {
        errors.projectDescription = `Please add a little more detail — at least ${MIN_DESCRIPTION_LENGTH} characters.`;
      }
      break;
    }

    case 'contact': {
      if (isBlank(draft.contact.fullName)) {
        errors['contact.fullName'] = 'Enter your full name.';
      }
      if (isBlank(draft.contact.email)) {
        errors['contact.email'] = 'Enter your email address.';
      } else if (!isValidEmail(draft.contact.email)) {
        errors['contact.email'] = 'Enter a valid email address, for example name@example.com.';
      }
      if (isBlank(draft.contact.phone)) {
        errors['contact.phone'] = 'Enter a phone number.';
      } else if (!isValidPhone(draft.contact.phone)) {
        errors['contact.phone'] = 'Enter a phone number with at least 10 digits.';
      }
      if (!draft.contact.preferredContactMethod) {
        errors['contact.preferredContactMethod'] = 'Choose how you would prefer to be contacted.';
      }
      break;
    }

  }

  return errors;
}

/** True when every required step currently passes validation. */
export function isDraftComplete(
  draft: ProjectRequestDraft,
  stepIds: readonly StepId[],
): boolean {
  return stepIds.every((step) => Object.keys(validateStep(step, draft)).length === 0);
}

import { useState } from 'react';
import { FormStatus } from '@/components/forms/FormStatus';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { TextArea } from '@/components/forms/TextArea';
import { TextInput } from '@/components/forms/TextInput';
import { Button } from '@/components/ui/Button';
import { contactMethodOptions } from '@/data/proposal-options';
import type { ContactMessageDraft, SubmissionResult } from '@/types/contact';
import type { ContactMethod } from '@/types/project-request';
import { formatTimestamp } from '@/utils/format';
import { isBlank, isValidEmail, isValidPhone } from '../project-request/validation/validators';
import { submitContactMessage } from './api/submitContactMessage';
import './ContactForm.css';

type Errors = Partial<Record<keyof ContactMessageDraft, string>>;

const emptyDraft: ContactMessageDraft = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  preferredContactMethod: '',
};

function validate(draft: ContactMessageDraft): Errors {
  const errors: Errors = {};
  if (isBlank(draft.name)) errors.name = 'Enter your name.';
  if (isBlank(draft.email)) {
    errors.email = 'Enter your email address.';
  } else if (!isValidEmail(draft.email)) {
    errors.email = 'Enter a valid email address, for example name@example.com.';
  }
  // Phone is optional here, but must be plausible if given.
  if (!isBlank(draft.phone) && !isValidPhone(draft.phone)) {
    errors.phone = 'Enter a phone number with at least 10 digits, or leave it blank.';
  }
  if (isBlank(draft.subject)) errors.subject = 'Add a short subject.';
  if (isBlank(draft.message)) {
    errors.message = 'Enter your message.';
  } else if (draft.message.trim().length < 20) {
    errors.message = 'Please add a little more detail — at least 20 characters.';
  }
  if (!draft.preferredContactMethod) {
    errors.preferredContactMethod = 'Choose how you would prefer to be contacted.';
  }
  return errors;
}

/** General enquiry form. Simulated submission only — nothing is delivered. */
export function ContactForm() {
  const [draft, setDraft] = useState<ContactMessageDraft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const patch = (next: Partial<ContactMessageDraft>) => {
    setDraft((current) => ({ ...current, ...next }));
    setErrors((current) => {
      const remaining = { ...current };
      Object.keys(next).forEach((key) => delete remaining[key as keyof ContactMessageDraft]);
      return remaining;
    });
  };

  const handleSubmit = async () => {
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const submission = await submitContactMessage(draft);
    setBusy(false);
    setResult(submission);
    setDraft(emptyDraft);
  };

  if (result) {
    return (
      <div className="contact-form contact-form--done">
        <FormStatus tone="success" title="Message sent">
          <p>{result.message}</p>
          <p>
            Reference {result.reference} · {formatTimestamp(result.submittedAt)}
          </p>
        </FormStatus>
        <Button variant="secondary" onClick={() => setResult(null)}>
          Write another message
        </Button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      {errorCount > 0 - (
        <FormStatus
          tone="error"
          title={`${errorCount} ${errorCount === 1 - 'field needs' : 'fields need'} attention`}
        >
          <ul>
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </FormStatus>
      ) : null}

      <div className="form-grid form-grid--2">
        <TextInput
          id="contact-name"
          label="Name"
          required
          autoComplete="name"
          value={draft.name}
          error={errors.name}
          onChange={(event) => patch({ name: event.target.value })}
        />
        <TextInput
          id="contact-email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={draft.email}
          error={errors.email}
          onChange={(event) => patch({ email: event.target.value })}
        />
        <TextInput
          id="contact-phone"
          label="Phone number"
          type="tel"
          optional
          autoComplete="tel"
          inputMode="tel"
          value={draft.phone}
          error={errors.phone}
          onChange={(event) => patch({ phone: event.target.value })}
        />
        <TextInput
          id="contact-subject"
          label="Subject"
          required
          hint="A few words about why you are getting in touch."
          value={draft.subject}
          error={errors.subject}
          onChange={(event) => patch({ subject: event.target.value })}
        />
      </div>

      <TextArea
        id="contact-message"
        label="Message"
        required
        rows={7}
        maxCount={1200}
        maxLength={1200}
        value={draft.message}
        error={errors.message}
        onChange={(event) => patch({ message: event.target.value })}
      />

      <RadioGroup
        name="contact-preferred"
        legend="Preferred contact method"
        required
        columns={3}
        options={contactMethodOptions.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        value={draft.preferredContactMethod}
        error={errors.preferredContactMethod}
        onChange={(value) => patch({ preferredContactMethod: value as ContactMethod })}
      />

      <div className="contact-form__actions">
        <Button type="submit" withArrow disabled={busy}>
          {busy - 'Working…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

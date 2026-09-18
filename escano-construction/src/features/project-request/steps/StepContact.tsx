import { RadioGroup } from '@/components/forms/RadioGroup';
import { SelectInput } from '@/components/forms/SelectInput';
import { TextInput } from '@/components/forms/TextInput';
import { contactMethodOptions, contactWindowOptions } from '@/data/proposal-options';
import type { ContactMethod, ContactWindow } from '@/types/project-request';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepContact({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, patchContact } = form;
  const { contact } = draft;

  return (
    <>
      <div className="form-grid form-grid--2">
        <TextInput
          id="contact.fullName"
          label="Full name"
          required
          autoComplete="name"
          value={contact.fullName}
          error={errors['contact.fullName']}
          onChange={(event) => patchContact({ fullName: event.target.value })}
        />

        <TextInput
          id="contact.email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={contact.email}
          error={errors['contact.email']}
          onChange={(event) => patchContact({ email: event.target.value })}
        />

        <TextInput
          id="contact.phone"
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          value={contact.phone}
          error={errors['contact.phone']}
          onChange={(event) => patchContact({ phone: event.target.value })}
        />

        <TextInput
          id="contact.projectAddress"
          label="Project location"
          optional
          hint="Street address, or just the city and neighbourhood if you would rather not share it yet."
          autoComplete="street-address"
          value={contact.projectAddress}
          error={errors['contact.projectAddress']}
          onChange={(event) => patchContact({ projectAddress: event.target.value })}
        />
      </div>

      <RadioGroup
        name="contact.preferredContactMethod"
        legend="Preferred contact method"
        required
        columns={3}
        options={contactMethodOptions.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        value={contact.preferredContactMethod}
        error={errors['contact.preferredContactMethod']}
        onChange={(value) => patchContact({ preferredContactMethod: value as ContactMethod })}
      />

      <SelectInput
        id="contact.bestTimeToContact"
        label="Best time to reach you"
        optional
        options={contactWindowOptions.map((option) => option.label)}
        placeholder="No preference"
        value={
          contactWindowOptions.find((option) => option.id === contact.bestTimeToContact)
            ?.label ?? ''
        }
        onChange={(event) => {
          const match = contactWindowOptions.find(
            (option) => option.label === event.target.value,
          );
          patchContact({ bestTimeToContact: (match?.id ?? 'no-preference') as ContactWindow });
        }}
      />
    </>
  );
}

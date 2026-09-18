import { RadioGroup } from '@/components/forms/RadioGroup';
import { TextInput } from '@/components/forms/TextInput';
import { projectTypeOptions } from '@/data/proposal-options';
import type { ProjectTypeId } from '@/types/project-request';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepProjectType({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, setProjectType, setField } = form;

  return (
    <>
      <RadioGroup
        name="projectType"
        legend="Project type"
        required
        hint="Pick the closest match — the scope can be refined once we talk."
        columns={2}
        options={projectTypeOptions.map((option) => ({
          value: option.id,
          label: option.label,
          description: option.description,
        }))}
        value={draft.projectType}
        error={errors.projectType}
        onChange={(value) => setProjectType(value as ProjectTypeId)}
      />

      {draft.projectType === 'other' - (
        <TextInput
          id="otherProjectType"
          label="Describe the type of project"
          required
          hint="A few words is enough, for example “detached workshop build”."
          value={draft.otherProjectType}
          error={errors.otherProjectType}
          onChange={(event) => setField('otherProjectType', event.target.value)}
        />
      ) : null}
    </>
  );
}

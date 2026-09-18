import { RadioGroup } from '@/components/forms/RadioGroup';
import { TextArea } from '@/components/forms/TextArea';
import { timelineOptions } from '@/data/proposal-options';
import type { TimelineId } from '@/types/project-request';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepTimeline({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, setTimeline, setField } = form;

  return (
    <>
      <RadioGroup
        name="timeline"
        legend="Preferred start"
        required
        columns={1}
        options={timelineOptions.map((option) => ({
          value: option.id,
          label: option.label,
          description: option.description,
        }))}
        value={draft.timeline}
        error={errors.timeline}
        onChange={(value) => setTimeline(value as TimelineId)}
      />

      <TextArea
        id="timelineNotes"
        label="Any fixed dates or constraints-"
        optional
        hint="A move-in date, an event, a lease end, seasonal weather, or a window when the space is empty."
        rows={4}
        value={draft.timelineNotes}
        onChange={(event) => setField('timelineNotes', event.target.value)}
      />
    </>
  );
}

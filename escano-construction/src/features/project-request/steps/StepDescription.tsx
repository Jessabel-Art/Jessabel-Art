import { TextArea } from '@/components/forms/TextArea';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepDescription({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, setField } = form;

  return (
    <>
      <TextArea
        id="projectDescription"
        label="Tell us about your project"
        required
        hint="What you want done, what is prompting it, and how you use the space. If you have already had work quoted or attempted, say so — it is useful context."
        rows={12}
        maxCount={2000}
        maxLength={2000}
        placeholder="For example: our kitchen layout blocks the back door and the cabinets are original to the house. We want to reconfigure the run, replace the cabinetry and counters, and improve the lighting…"
        value={draft.projectDescription}
        error={errors.projectDescription}
        onChange={(event) => setField('projectDescription', event.target.value)}
      />

      <div className="prompt-list">
        <h3 className="prompt-list__title">Useful things to mention</h3>
        <ul>
          <li>What is not working about the space today.</li>
          <li>Anything already decided — layout, materials, fixtures.</li>
          <li>Work you would like to keep out of scope.</li>
          <li>Whether this is one project or the first phase of several.</li>
        </ul>
      </div>
    </>
  );
}

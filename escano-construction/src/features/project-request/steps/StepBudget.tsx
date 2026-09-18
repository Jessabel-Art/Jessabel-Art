import { FormStatus } from '@/components/forms/FormStatus';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { TextArea } from '@/components/forms/TextArea';
import { budgetRangeOptions } from '@/data/proposal-options';
import type { BudgetRangeId } from '@/types/project-request';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepBudget({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, setBudget, setField } = form;

  return (
    <>
      <FormStatus tone="info" title="No estimate is produced here">
        <p>
          This form does not calculate a price, and selecting a range does not commit you to
          anything. Cost is discussed once the scope of work is understood.
        </p>
      </FormStatus>

      <RadioGroup
        name="budgetRange"
        legend="Budget range"
        required
        hint="If you genuinely do not know yet, choose “Not sure yet” — it is a normal answer."
        columns={2}
        options={budgetRangeOptions.map((option) => ({
          value: option.id,
          label: option.label,
          description: option.helper,
        }))}
        value={draft.budgetRange}
        error={errors.budgetRange}
        onChange={(value) => setBudget(value as BudgetRangeId)}
      />

      <TextArea
        id="budgetNotes"
        label="Anything we should know about the budget?"
        optional
        hint="Phasing, a hard ceiling, financing in progress, or priorities if choices have to be made."
        rows={4}
        value={draft.budgetNotes}
        onChange={(event) => setField('budgetNotes', event.target.value)}
      />
    </>
  );
}

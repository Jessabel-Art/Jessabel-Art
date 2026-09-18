import { CheckboxGroup } from '@/components/forms/CheckboxGroup';
import { SelectInput } from '@/components/forms/SelectInput';
import { TextArea } from '@/components/forms/TextArea';
import { TextInput } from '@/components/forms/TextInput';
import {
  conditionOptions,
  exteriorElementOptions,
  requestedWorkOptions,
  roofMaterialOptions,
  roomOptions,
  storeyOptions,
  structuralChangeOptions,
} from '@/data/proposal-options';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';
import { activeDetailTopics } from '../config/steps';

/* -----------------------------------------------------------------------------
   Step 3 is entirely conditional.

   Each project type declares the detail topics that are relevant to it (see
   `data/proposal-options.ts`), and only those question groups render. A roofing
   request is never asked about cabinetry, and a kitchen remodel is never asked
   about shingle material.
   -------------------------------------------------------------------------- */

export function StepDetails({ form }: { form: ProjectRequestFormApi }) {
  const { draft, patchDetails } = form;
  const { details } = draft;
  const topics = activeDetailTopics(draft);
  const shows = (topic: string) => topics.includes(topic);

  if (topics.length === 0) {
    return (
      <p className="lede">
        Choose a project type on step one and the questions relevant to it will appear here.
      </p>
    );
  }

  return (
    <>
      {shows('rooms') ? (
        <CheckboxGroup
          name="details.rooms"
          legend="Which areas are involved?"
          optional
          hint="Select everything that is in scope, even if some parts are still undecided."
          columns={3}
          options={roomOptions}
          selected={details.rooms}
          onChange={(rooms) => patchDetails({ rooms })}
        />
      ) : null}

      {shows('requested-work') ? (
        <CheckboxGroup
          name="details.requestedWork"
          legend="What work do you have in mind?"
          optional
          hint="A rough selection is enough — the final scope is set together."
          columns={3}
          options={requestedWorkOptions}
          selected={details.requestedWork}
          onChange={(requestedWork) => patchDetails({ requestedWork })}
        />
      ) : null}

      {shows('exterior') ? (
        <CheckboxGroup
          name="details.exteriorElements"
          legend="Which exterior elements are involved?"
          optional
          columns={3}
          options={exteriorElementOptions}
          selected={details.exteriorElements}
          onChange={(exteriorElements) => patchDetails({ exteriorElements })}
        />
      ) : null}

      {shows('roof') ? (
        <div className="form-grid form-grid--2">
          <SelectInput
            id="details.roofMaterial"
            label="Current or preferred roof material"
            optional
            options={roofMaterialOptions}
            placeholder="Select a roof material"
            value={details.roofMaterial}
            onChange={(event) => patchDetails({ roofMaterial: event.target.value })}
          />
          <SelectInput
            id="details.roofStoreys"
            label="Roof height"
            optional
            hint="How many storeys the roof sits above."
            options={storeyOptions}
            placeholder="Select a height"
            value={details.roofStoreys}
            onChange={(event) => patchDetails({ roofStoreys: event.target.value })}
          />
        </div>
      ) : null}

      {shows('dimensions') ? (
        <TextInput
          id="details.dimensions"
          label="Approximate dimensions or area"
          optional
          hint="For example “12 × 16 ft patio” or “roughly 220 sq ft kitchen”. Estimates are fine."
          value={details.dimensions}
          onChange={(event) => patchDetails({ dimensions: event.target.value })}
        />
      ) : null}

      {shows('condition') ? (
        <SelectInput
          id="details.existingCondition"
          label="Condition of the existing space"
          optional
          hint="Your honest read on it — this is not an inspection."
          options={conditionOptions}
          placeholder="Select the closest description"
          value={details.existingCondition}
          onChange={(event) => patchDetails({ existingCondition: event.target.value })}
        />
      ) : null}

      {shows('structure') ? (
        <SelectInput
          id="details.structuralChanges"
          label="Are structural changes expected?"
          optional
          hint="Moving walls, changing openings, or altering the roofline all affect planning."
          options={structuralChangeOptions}
          placeholder="Select an answer"
          value={details.structuralChanges}
          onChange={(event) => patchDetails({ structuralChanges: event.target.value })}
        />
      ) : null}

      {shows('damage') ? (
        <TextArea
          id="details.knownDamage"
          label="Known damage or problems"
          optional
          hint="Leaks, rot, movement, water staining, failed materials — anything you have already noticed."
          rows={4}
          value={details.knownDamage}
          onChange={(event) => patchDetails({ knownDamage: event.target.value })}
        />
      ) : null}

      {shows('materials') ? (
        <TextArea
          id="details.materialPreferences"
          label="Material or finish preferences"
          optional
          hint="Anything already chosen, ruled out, or that you would like matched to what is there."
          rows={4}
          value={details.materialPreferences}
          onChange={(event) => patchDetails({ materialPreferences: event.target.value })}
        />
      ) : null}

      <TextArea
        id="details.specialConsiderations"
        label="Access, scheduling, or site considerations"
        optional
        hint="Narrow access, pets, stairs only, HOA rules, working hours, permits already in progress."
        rows={4}
        value={details.specialConsiderations}
        onChange={(event) => patchDetails({ specialConsiderations: event.target.value })}
      />
    </>
  );
}

import { RadioGroup } from '@/components/forms/RadioGroup';
import { SelectInput } from '@/components/forms/SelectInput';
import {
  approximateSizeOptions,
  commercialPropertyTypes,
  residentialPropertyTypes,
  storeyOptions,
} from '@/data/proposal-options';
import type { PropertyUse } from '@/types/project-request';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';

export function StepProperty({ form }: { form: ProjectRequestFormApi }) {
  const { draft, errors, patchProperty } = form;
  const { property } = draft;

  const propertyTypes =
    property.use === 'commercial' ? commercialPropertyTypes : residentialPropertyTypes;

  return (
    <>
      <RadioGroup
        name="property.use"
        legend="Is this a residential or commercial property?"
        required
        layout="inline"
        columns={2}
        options={[
          {
            value: 'residential',
            label: 'Residential',
            description: 'A home, rental, or other dwelling.',
          },
          {
            value: 'commercial',
            label: 'Commercial',
            description: 'An office, retail unit, clinic, or similar.',
          },
        ]}
        value={property.use}
        error={errors['property.use']}
        onChange={(value) => patchProperty({ use: value as PropertyUse })}
      />

      {/* The property type list depends on the answer above. */}
      {property.use ? (
        <SelectInput
          id="property.propertyType"
          label="Property type"
          required
          options={propertyTypes}
          placeholder="Select the property type"
          value={property.propertyType}
          error={errors['property.propertyType']}
          onChange={(event) => patchProperty({ propertyType: event.target.value })}
        />
      ) : null}

      <div className="form-grid form-grid--2">
        <SelectInput
          id="property.approximateSize"
          label="Approximate size"
          optional
          hint="An estimate is fine — square footage of the building or the area involved."
          options={approximateSizeOptions}
          placeholder="Select an approximate size"
          value={property.approximateSize}
          onChange={(event) => patchProperty({ approximateSize: event.target.value })}
        />

        <SelectInput
          id="property.storeys"
          label="Number of storeys"
          optional
          options={storeyOptions}
          placeholder="Select the number of storeys"
          value={property.storeys}
          onChange={(event) => patchProperty({ storeys: event.target.value })}
        />
      </div>

      <RadioGroup
        name="property.constructionStatus"
        legend="Does this involve an existing structure or new construction?"
        required
        layout="inline"
        columns={2}
        options={[
          {
            value: 'existing-structure',
            label: 'Existing structure',
            description: 'Work on a building that is already there.',
          },
          {
            value: 'new-construction',
            label: 'New construction',
            description: 'Building something that does not exist yet.',
          },
        ]}
        value={property.constructionStatus}
        error={errors['property.constructionStatus']}
        onChange={(value) =>
          patchProperty({
            constructionStatus: value as 'existing-structure' | 'new-construction',
          })
        }
      />

      {/* Occupancy only matters when there is an existing structure. */}
      {property.constructionStatus === 'existing-structure' ? (
        <RadioGroup
          name="property.occupancy"
          legend="Will the property be occupied during the work?"
          optional
          layout="inline"
          columns={3}
          options={[
            {
              value: 'occupied',
              label: 'Occupied',
              description: 'People will be living or working there throughout.',
            },
            {
              value: 'vacant',
              label: 'Vacant',
              description: 'The space will be empty while work happens.',
            },
            {
              value: 'not-applicable',
              label: 'Not sure yet',
              description: 'This has not been decided.',
            },
          ]}
          value={property.occupancy}
          onChange={(value) =>
            patchProperty({ occupancy: value as 'occupied' | 'vacant' | 'not-applicable' })
          }
        />
      ) : null}
    </>
  );
}

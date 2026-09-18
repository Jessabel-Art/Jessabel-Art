import {
  attachmentCategoryOptions,
  getBudgetLabel,
  getContactMethodLabel,
  getContactWindowLabel,
  getProjectTypeOption,
  getTimelineLabel,
} from '@/data/proposal-options';
import { formatFileSize, formatList, orFallback } from '@/utils/format';
import { ReviewSection, type ReviewItem } from '../components/ReviewSection';
import { activeDetailTopics, getStepIndex } from '../config/steps';
import type { ProjectRequestFormApi } from '../state/useProjectRequestForm';
import './StepReview.css';

const NOT_PROVIDED = 'Not provided';

export function StepReview({ form }: { form: ProjectRequestFormApi }) {
  const { draft, goToStep } = form;
  const topics = activeDetailTopics(draft);
  const projectTypeOption = draft.projectType
    - getProjectTypeOption(draft.projectType)
    : undefined;

  const projectTypeItems: ReviewItem[] = [
    {
      label: 'Project type',
      value: projectTypeOption-.label -- NOT_PROVIDED,
    },
  ];
  if (draft.projectType === 'other') {
    projectTypeItems.push({
      label: 'Described as',
      value: orFallback(draft.otherProjectType, NOT_PROVIDED),
    });
  }

  const propertyItems: ReviewItem[] = [
    {
      label: 'Property use',
      value: draft.property.use === 'commercial' - 'Commercial' : 'Residential',
    },
    { label: 'Property type', value: orFallback(draft.property.propertyType, NOT_PROVIDED) },
    {
      label: 'Approximate size',
      value: orFallback(draft.property.approximateSize, NOT_PROVIDED),
    },
    { label: 'Storeys', value: orFallback(draft.property.storeys, NOT_PROVIDED) },
    {
      label: 'Structure',
      value:
        draft.property.constructionStatus === 'new-construction'
          - 'New construction'
          : 'Existing structure',
    },
  ];
  if (draft.property.constructionStatus === 'existing-structure') {
    propertyItems.push({
      label: 'Occupancy',
      value:
        draft.property.occupancy === 'occupied'
          - 'Occupied during work'
          : draft.property.occupancy === 'vacant'
            - 'Vacant during work'
            : NOT_PROVIDED,
    });
  }

  // Only the detail answers relevant to the selected project type are shown.
  const detailItems: ReviewItem[] = [];
  if (topics.includes('rooms')) {
    detailItems.push({
      label: 'Areas involved',
      value: orFallback(formatList(draft.details.rooms), NOT_PROVIDED),
    });
  }
  if (topics.includes('requested-work')) {
    detailItems.push({
      label: 'Requested work',
      value: orFallback(formatList(draft.details.requestedWork), NOT_PROVIDED),
    });
  }
  if (topics.includes('exterior')) {
    detailItems.push({
      label: 'Exterior elements',
      value: orFallback(formatList(draft.details.exteriorElements), NOT_PROVIDED),
    });
  }
  if (topics.includes('roof')) {
    detailItems.push(
      { label: 'Roof material', value: orFallback(draft.details.roofMaterial, NOT_PROVIDED) },
      { label: 'Roof height', value: orFallback(draft.details.roofStoreys, NOT_PROVIDED) },
    );
  }
  if (topics.includes('dimensions')) {
    detailItems.push({
      label: 'Dimensions',
      value: orFallback(draft.details.dimensions, NOT_PROVIDED),
    });
  }
  if (topics.includes('condition')) {
    detailItems.push({
      label: 'Existing condition',
      value: orFallback(draft.details.existingCondition, NOT_PROVIDED),
    });
  }
  if (topics.includes('structure')) {
    detailItems.push({
      label: 'Structural changes',
      value: orFallback(draft.details.structuralChanges, NOT_PROVIDED),
    });
  }
  if (topics.includes('damage')) {
    detailItems.push({
      label: 'Known damage',
      value: orFallback(draft.details.knownDamage, NOT_PROVIDED),
    });
  }
  if (topics.includes('materials')) {
    detailItems.push({
      label: 'Materials and finishes',
      value: orFallback(draft.details.materialPreferences, NOT_PROVIDED),
    });
  }
  detailItems.push({
    label: 'Site considerations',
    value: orFallback(draft.details.specialConsiderations, NOT_PROVIDED),
  });

  const attachmentItems: ReviewItem[] = [
    {
      label: 'Files selected',
      value:
        draft.attachments.length === 0 - (
          'None selected'
        ) : (
          <ul className="review-files">
            {draft.attachments.map((attachment) => {
              const category =
                attachmentCategoryOptions.find((option) => option.id === attachment.category)
                  -.label -- 'File';
              return (
                <li key={attachment.id}>
                  {attachment.name}{' '}
                  <span className="review-files__meta">
                    ({category}, {formatFileSize(attachment.size)})
                  </span>
                </li>
              );
            })}
          </ul>
        ),
    },
  ];

  return (
    <>
      <div className="review">
        <ReviewSection
          id="project-type"
          title="Project type"
          items={projectTypeItems}
          editLabel="Edit project type"
          onEdit={() => goToStep(getStepIndex('project-type'))}
        />
        <ReviewSection
          id="property"
          title="Property"
          items={propertyItems}
          editLabel="Edit property information"
          onEdit={() => goToStep(getStepIndex('property'))}
        />
        <ReviewSection
          id="project-details"
          title="Project details"
          items={detailItems}
          editLabel="Edit project details"
          onEdit={() => goToStep(getStepIndex('details'))}
        />
        <ReviewSection
          id="budget"
          title="Budget"
          items={[
            { label: 'Range', value: getBudgetLabel(draft.budgetRange) },
            { label: 'Notes', value: orFallback(draft.budgetNotes, NOT_PROVIDED) },
          ]}
          editLabel="Edit budget range"
          onEdit={() => goToStep(getStepIndex('budget'))}
        />
        <ReviewSection
          id="timeline"
          title="Timeline"
          items={[
            { label: 'Preferred start', value: getTimelineLabel(draft.timeline) },
            { label: 'Constraints', value: orFallback(draft.timelineNotes, NOT_PROVIDED) },
          ]}
          editLabel="Edit timeline"
          onEdit={() => goToStep(getStepIndex('timeline'))}
        />
        <ReviewSection
          id="attachments"
          title="Photos and documents"
          items={attachmentItems}
          editLabel="Edit selected files"
          onEdit={() => goToStep(getStepIndex('attachments'))}
        />
        <ReviewSection
          id="description"
          title="Project description"
          items={[
            {
              label: 'In your words',
              value: orFallback(draft.projectDescription, NOT_PROVIDED),
            },
          ]}
          editLabel="Edit project description"
          onEdit={() => goToStep(getStepIndex('description'))}
        />
        <ReviewSection
          id="contact"
          title="Contact information"
          items={[
            { label: 'Name', value: orFallback(draft.contact.fullName, NOT_PROVIDED) },
            { label: 'Email', value: orFallback(draft.contact.email, NOT_PROVIDED) },
            { label: 'Phone', value: orFallback(draft.contact.phone, NOT_PROVIDED) },
            {
              label: 'Project location',
              value: orFallback(draft.contact.projectAddress, NOT_PROVIDED),
            },
            {
              label: 'Preferred contact',
              value: getContactMethodLabel(draft.contact.preferredContactMethod),
            },
            {
              label: 'Best time',
              value: getContactWindowLabel(draft.contact.bestTimeToContact),
            },
          ]}
          editLabel="Edit contact information"
          onEdit={() => goToStep(getStepIndex('contact'))}
        />
      </div>
    </>
  );
}

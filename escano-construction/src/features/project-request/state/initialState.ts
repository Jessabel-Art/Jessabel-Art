import type { ProjectRequestDraft } from '@/types/project-request';

/** A fresh, empty intake draft. */
export function createInitialDraft(): ProjectRequestDraft {
  return {
    projectType: '',
    otherProjectType: '',
    property: {
      use: '',
      propertyType: '',
      approximateSize: '',
      constructionStatus: '',
      occupancy: '',
      storeys: '',
    },
    details: {
      rooms: [],
      dimensions: '',
      existingCondition: '',
      requestedWork: [],
      knownDamage: '',
      materialPreferences: '',
      specialConsiderations: '',
      roofMaterial: '',
      roofStoreys: '',
      exteriorElements: [],
      structuralChanges: '',
    },
    budgetRange: '',
    budgetNotes: '',
    timeline: '',
    timelineNotes: '',
    attachments: [],
    projectDescription: '',
    contact: {
      fullName: '',
      email: '',
      phone: '',
      projectAddress: '',
      preferredContactMethod: '',
      bestTimeToContact: 'no-preference',
    },
  };
}

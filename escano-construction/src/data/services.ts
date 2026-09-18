import type { Service, ServiceCategory, ServiceCategoryId } from '@/types/service';
import { asset } from '@/utils/asset';

/* =============================================================================
   Centralised service data.

   This is the only place service information is defined. Pages, cards, the
   intake form, and any future proposal tooling read from here.

   `id` values are stable keys. Do not rename or reuse them — future records
   (project requests, projects, proposals, proposal line items, invoices) are
   expected to reference services by id.

   No pricing is stored here. Pricing belongs to the future proposal system.
   ========================================================================== */

const IMG = asset('assets/images');

export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: 'residential-construction',
    slug: 'residential-construction',
    name: 'Residential Construction',
    shortDescription:
      'New homes, additions, and structural work built from the ground up.',
    description:
      'Ground-up residential building and structural work, from foundation and framing through to a weather-tight, finished structure. Suited to new homes, additions that change a building footprint, and interior build-outs of unfinished space.',
    image: `${IMG}/service-residential-construction.webp`,
    imageAlt:
      'A newly framed single-family house with roof sheathing installed and house wrap partly applied on an organised job site.',
    sector: 'residential',
    active: true,
  },
  {
    id: 'remodeling-renovation',
    slug: 'remodeling-renovation',
    name: 'Remodeling & Renovation',
    shortDescription:
      'Kitchens, bathrooms, and whole-home renovations inside an existing structure.',
    description:
      'Reworking existing space — from a single room to an entire home. Covers demolition, layout changes, surfaces and finishes, and the coordination of trades needed to bring an older interior up to current expectations.',
    image: `${IMG}/service-remodeling-renovation.webp`,
    imageAlt:
      'A room mid-renovation, stripped to the studs on one wall and finished with fresh drywall and primer on the other.',
    sector: 'residential',
    active: true,
  },
  {
    id: 'roofing-exteriors',
    slug: 'roofing-exteriors',
    name: 'Roofing & Exteriors',
    shortDescription:
      'Roof replacement and repair, siding, trim, and weather-related work.',
    description:
      'The building envelope: the systems that keep water out and hold up over time. Includes full roof replacement, targeted repair, siding and trim, and repairs following storm or water damage.',
    image: `${IMG}/service-roofing-exteriors.webp`,
    imageAlt:
      'A pitched roof part-way through re-shingling, with new charcoal architectural shingles laid in straight courses beside exposed decking.',
    sector: 'both',
    active: true,
  },
  {
    id: 'outdoor-construction',
    slug: 'outdoor-construction',
    name: 'Outdoor Construction',
    shortDescription:
      'Decks, patios, porches, and covered outdoor structures.',
    description:
      'Structures that extend usable space beyond the exterior walls. Built with attention to footings, drainage, framing connections, and the way the new structure ties back into the existing building.',
    image: `${IMG}/service-outdoor-construction.webp`,
    imageAlt:
      'A newly built covered deck with cedar posts, exposed rafters, composite decking, and a stone patio below.',
    sector: 'residential',
    active: true,
  },
  {
    id: 'repairs-improvements',
    slug: 'repairs-improvements',
    name: 'Repairs & Improvements',
    shortDescription:
      'Carpentry, doors, windows, trim, and targeted property repairs.',
    description:
      'Focused work that does not warrant a full renovation but still needs to be done properly. Carpentry, door and window replacement, trim, and repair of damage found during inspection or after a weather event.',
    image: `${IMG}/service-repairs-improvements.webp`,
    imageAlt:
      'A newly installed exterior door with crisp new trim beside a section of older weathered siding awaiting replacement.',
    sector: 'both',
    active: true,
  },
  {
    id: 'light-commercial',
    slug: 'light-commercial',
    name: 'Light Commercial',
    shortDescription:
      'Tenant improvements, office refreshes, and commercial interior build-outs.',
    description:
      'Interior and property work for small commercial spaces — offices, clinics, and retail units. Scoped and sequenced with occupied-space constraints, access hours, and tenant requirements in mind.',
    image: `${IMG}/service-light-commercial.webp`,
    imageAlt:
      'A light commercial interior build-out with new metal stud partitions and a partly installed suspended ceiling grid.',
    sector: 'commercial',
    active: true,
  },
];

export const services: readonly Service[] = [
  /* ---- Residential construction ---------------------------------------- */
  {
    id: 'svc-new-residential-construction',
    slug: 'new-residential-construction',
    category: 'residential-construction',
    name: 'New residential construction',
    shortDescription: 'Ground-up construction of a new single-family home.',
    description:
      'Building a new home from site preparation and foundation through framing, envelope, and interior completion, with the schedule and trade sequence managed as one plan.',
    active: true,
    relatedServices: ['svc-home-additions', 'svc-structural-improvements'],
  },
  {
    id: 'svc-home-additions',
    slug: 'home-additions',
    category: 'residential-construction',
    name: 'Home additions',
    shortDescription: 'Added square footage tied into the existing structure.',
    description:
      'Extending a home with new conditioned space, including the foundation, framing, roof tie-in, and the envelope and finish work needed for the addition to read as part of the original house.',
    active: true,
    relatedServices: [
      'svc-structural-improvements',
      'svc-room-additions',
      'svc-roof-replacement',
    ],
  },
  {
    id: 'svc-structural-improvements',
    slug: 'structural-improvements',
    category: 'residential-construction',
    name: 'Structural improvements',
    shortDescription: 'Beams, headers, and load-path changes.',
    description:
      'Modifications to a building structure — removing or relocating load-bearing walls, installing beams and headers, and correcting a load path so the finished layout is properly supported.',
    active: true,
    relatedServices: ['svc-whole-home-renovation', 'svc-home-additions'],
  },
  {
    id: 'svc-interior-build-outs',
    slug: 'interior-build-outs',
    category: 'residential-construction',
    name: 'Interior build-outs',
    shortDescription: 'Finishing unfinished space such as a basement or attic.',
    description:
      'Turning unfinished space into usable rooms — framing, insulation, drywall, flooring, and trim, coordinated with the mechanical and electrical work the new use requires.',
    active: true,
    relatedServices: ['svc-garage-conversions', 'svc-drywall'],
  },
  {
    id: 'svc-exterior-construction',
    slug: 'exterior-construction',
    category: 'residential-construction',
    name: 'Exterior construction',
    shortDescription: 'New exterior walls, entries, and building envelope work.',
    description:
      'New exterior construction and envelope assemblies, including sheathing, weather barriers, cladding substrate, and openings prepared for windows and doors.',
    active: true,
    relatedServices: ['svc-siding', 'svc-exterior-repairs'],
  },

  /* ---- Remodeling & renovation ----------------------------------------- */
  {
    id: 'svc-whole-home-renovation',
    slug: 'whole-home-renovation',
    category: 'remodeling-renovation',
    name: 'Whole-home renovation',
    shortDescription: 'A coordinated renovation across an entire residence.',
    description:
      'A full-house programme of work sequenced as one project, so demolition, structural changes, mechanical rough-in, and finishes happen in a sensible order rather than as isolated jobs.',
    active: true,
    relatedServices: [
      'svc-kitchen-remodeling',
      'svc-bathroom-remodeling',
      'svc-flooring',
      'svc-interior-painting',
    ],
  },
  {
    id: 'svc-kitchen-remodeling',
    slug: 'kitchen-remodeling',
    category: 'remodeling-renovation',
    name: 'Kitchen remodeling',
    shortDescription: 'Layout, cabinetry, surfaces, and finish work.',
    description:
      'Kitchen renovation from demolition through cabinetry, countertops, tile, and finish carpentry, with plumbing and electrical relocations coordinated around the new layout.',
    active: true,
    image: `${IMG}/detail-kitchen-cabinetry.webp`,
    relatedServices: ['svc-flooring', 'svc-drywall', 'svc-interior-painting'],
  },
  {
    id: 'svc-bathroom-remodeling',
    slug: 'bathroom-remodeling',
    category: 'remodeling-renovation',
    name: 'Bathroom remodeling',
    shortDescription: 'Wet-area detailing, tile, and fixture installation.',
    description:
      'Bathroom renovation with particular attention to waterproofing, slope, and substrate preparation behind the tile, followed by fixture and finish installation.',
    active: true,
    image: `${IMG}/detail-bath-tile.webp`,
    relatedServices: ['svc-flooring', 'svc-drywall', 'svc-trim-work'],
  },
  {
    id: 'svc-interior-renovation',
    slug: 'interior-renovation',
    category: 'remodeling-renovation',
    name: 'Interior renovation',
    shortDescription: 'Room-by-room updates to an existing interior.',
    description:
      'Renovation of individual interior spaces — surfaces, trim, doors, and lighting — where the layout is largely retained but the finish level is being raised.',
    active: true,
    relatedServices: ['svc-interior-painting', 'svc-flooring', 'svc-trim-work'],
  },
  {
    id: 'svc-garage-conversions',
    slug: 'garage-conversions',
    category: 'remodeling-renovation',
    name: 'Garage conversions',
    shortDescription: 'Converting garage space into conditioned rooms.',
    description:
      'Converting a garage into living space, including floor build-up, insulation, infilling the vehicle opening, and the envelope changes needed for the space to be conditioned.',
    active: true,
    relatedServices: ['svc-interior-build-outs', 'svc-drywall'],
  },
  {
    id: 'svc-room-additions',
    slug: 'room-additions',
    category: 'remodeling-renovation',
    name: 'Room additions',
    shortDescription: 'A single added room tied into the existing home.',
    description:
      'Adding one room to an existing home, with the foundation, framing, and roof tie-in detailed so the addition performs and looks like part of the original structure.',
    active: true,
    relatedServices: ['svc-home-additions', 'svc-structural-improvements'],
  },
  {
    id: 'svc-flooring',
    slug: 'flooring',
    category: 'remodeling-renovation',
    name: 'Flooring',
    shortDescription: 'Subfloor preparation and finished floor installation.',
    description:
      'Flooring installation across hardwood, engineered, luxury vinyl plank, and tile, with subfloor levelling and transition detailing handled before the finish goes down.',
    active: true,
    relatedServices: ['svc-trim-work', 'svc-interior-renovation'],
  },
  {
    id: 'svc-drywall',
    slug: 'drywall',
    category: 'remodeling-renovation',
    name: 'Drywall',
    shortDescription: 'Hanging, taping, and finishing to a specified level.',
    description:
      'Drywall hanging, taping, and finishing, including patching and blending into existing surfaces so repairs are not visible under finished paint.',
    active: true,
    relatedServices: ['svc-interior-painting', 'svc-damage-repair'],
  },
  {
    id: 'svc-interior-painting',
    slug: 'interior-painting',
    category: 'remodeling-renovation',
    name: 'Interior painting',
    shortDescription: 'Surface preparation, priming, and finish coats.',
    description:
      'Interior painting with the preparation work — filling, sanding, caulking, and priming — treated as part of the job rather than an optional extra.',
    active: true,
    relatedServices: ['svc-drywall', 'svc-trim-work'],
  },
  {
    id: 'svc-exterior-painting',
    slug: 'exterior-painting',
    category: 'remodeling-renovation',
    name: 'Exterior painting',
    shortDescription: 'Exterior preparation and weather-resistant coatings.',
    description:
      'Exterior painting including cleaning, scraping, priming bare material, and sealing joints before finish coats are applied.',
    active: true,
    relatedServices: ['svc-siding', 'svc-exterior-trim'],
  },

  /* ---- Roofing & exteriors -------------------------------------------- */
  {
    id: 'svc-roof-replacement',
    slug: 'roof-replacement',
    category: 'roofing-exteriors',
    name: 'Roof replacement',
    shortDescription: 'Full tear-off and replacement of a roof system.',
    description:
      'Complete roof replacement — tear-off, deck inspection and repair, underlayment, flashing, new covering, and ventilation — treated as a system rather than a surface.',
    active: true,
    image: `${IMG}/detail-roof-ridge.webp`,
    relatedServices: ['svc-roof-repair', 'svc-fascia-soffit', 'svc-shingle-roofing'],
  },
  {
    id: 'svc-roof-repair',
    slug: 'roof-repair',
    category: 'roofing-exteriors',
    name: 'Roof repair',
    shortDescription: 'Targeted repair of leaks, flashing, and damage.',
    description:
      'Diagnosing and repairing localised roof problems — failed flashing, damaged shingles, penetration leaks — and identifying whether repair or replacement is the sound choice.',
    active: true,
    relatedServices: ['svc-weather-repairs', 'svc-roof-replacement'],
  },
  {
    id: 'svc-shingle-roofing',
    slug: 'shingle-roofing',
    category: 'roofing-exteriors',
    name: 'Shingle roofing',
    shortDescription: 'Architectural and three-tab asphalt shingle systems.',
    description:
      'Asphalt shingle installation with correct course alignment, nailing pattern, valley and ridge detailing, and manufacturer-specified underlayment.',
    active: true,
    relatedServices: ['svc-roof-replacement'],
  },
  {
    id: 'svc-exterior-repairs',
    slug: 'exterior-repairs',
    category: 'roofing-exteriors',
    name: 'Exterior repairs',
    shortDescription: 'Repair of cladding, trim, and envelope failures.',
    description:
      'Repairing exterior assemblies where water has got in — rotted sheathing or trim, failed sealant joints, and damaged cladding — including the underlying cause, not just the visible surface.',
    active: true,
    relatedServices: ['svc-siding', 'svc-fascia-soffit', 'svc-weather-repairs'],
  },
  {
    id: 'svc-siding',
    slug: 'siding',
    category: 'roofing-exteriors',
    name: 'Siding',
    shortDescription: 'Fibre cement, vinyl, and wood cladding installation.',
    description:
      'Siding installation and replacement with weather barrier, flashing, and consistent reveal spacing, so the wall drains and the finished elevation lines up.',
    active: true,
    image: `${IMG}/detail-siding-trim.webp`,
    relatedServices: ['svc-exterior-trim', 'svc-exterior-painting'],
  },
  {
    id: 'svc-fascia-soffit',
    slug: 'fascia-and-soffit',
    category: 'roofing-exteriors',
    name: 'Fascia and soffit',
    shortDescription: 'Eave repair, replacement, and ventilation.',
    description:
      'Fascia and soffit replacement, including rot repair at the eave and restoring the ventilation path that the roof assembly depends on.',
    active: true,
    relatedServices: ['svc-roof-replacement', 'svc-exterior-repairs'],
  },
  {
    id: 'svc-exterior-trim',
    slug: 'exterior-trim',
    category: 'roofing-exteriors',
    name: 'Exterior trim',
    shortDescription: 'Corner boards, casings, and rake and frieze detail.',
    description:
      'Exterior trim carpentry — corners, window and door casings, and rake detail — installed and sealed so joints stay closed through seasonal movement.',
    active: true,
    relatedServices: ['svc-siding', 'svc-exterior-painting'],
  },
  {
    id: 'svc-weather-repairs',
    slug: 'weather-related-repairs',
    category: 'roofing-exteriors',
    name: 'Weather-related repairs',
    shortDescription: 'Repair of storm, wind, and water damage.',
    description:
      'Assessment and repair of damage following storm or water intrusion events, documented clearly so the scope of work is easy to review.',
    active: true,
    relatedServices: ['svc-roof-repair', 'svc-damage-repair'],
  },

  /* ---- Outdoor construction ------------------------------------------- */
  {
    id: 'svc-decks',
    slug: 'decks',
    category: 'outdoor-construction',
    name: 'Decks',
    shortDescription: 'Framed decks on engineered footings and connections.',
    description:
      'Deck construction with properly sized footings, code-compliant ledger attachment, galvanised connectors, and a finished surface in wood or composite.',
    active: true,
    image: `${IMG}/detail-deck-framing.webp`,
    relatedServices: ['svc-porches', 'svc-outdoor-structures'],
  },
  {
    id: 'svc-patios',
    slug: 'patios',
    category: 'outdoor-construction',
    name: 'Patios',
    shortDescription: 'Concrete and paver patios with drainage in mind.',
    description:
      'Patio construction with base preparation, slope set away from the building, and edge detailing that holds its line over time.',
    active: true,
    relatedServices: ['svc-outdoor-structures', 'svc-exterior-improvements'],
  },
  {
    id: 'svc-porches',
    slug: 'porches',
    category: 'outdoor-construction',
    name: 'Porches',
    shortDescription: 'Covered entries and full-width porch structures.',
    description:
      'Porch construction including footings, posts, beams, roof framing, and the flashing detail where the new roof meets the existing wall.',
    active: true,
    relatedServices: ['svc-decks', 'svc-outdoor-structures'],
  },
  {
    id: 'svc-outdoor-structures',
    slug: 'outdoor-structures',
    category: 'outdoor-construction',
    name: 'Outdoor structures',
    shortDescription: 'Pergolas, covered patios, and detached structures.',
    description:
      'Freestanding and attached outdoor structures built to carry real loads, with exposed framing detailed to be looked at as well as relied on.',
    active: true,
    relatedServices: ['svc-porches', 'svc-patios'],
  },
  {
    id: 'svc-exterior-improvements',
    slug: 'exterior-improvements',
    category: 'outdoor-construction',
    name: 'Exterior improvements',
    shortDescription: 'Steps, walkways, railings, and site detail.',
    description:
      'Smaller exterior improvements that affect daily use and safety — steps, walkways, railings, and grading corrections around the building.',
    active: true,
    relatedServices: ['svc-patios', 'svc-privacy-structures'],
  },
  {
    id: 'svc-privacy-structures',
    slug: 'privacy-structures',
    category: 'outdoor-construction',
    name: 'Privacy structures',
    shortDescription: 'Fencing, screens, and enclosure carpentry.',
    description:
      'Privacy fencing and screen construction set on properly placed posts, with layout planned around the property line and existing site conditions.',
    active: true,
    relatedServices: ['svc-outdoor-structures', 'svc-exterior-improvements'],
  },

  /* ---- Repairs & improvements ----------------------------------------- */
  {
    id: 'svc-general-home-repairs',
    slug: 'general-home-repairs',
    category: 'repairs-improvements',
    name: 'General home repairs',
    shortDescription: 'Grouped smaller repairs handled in one visit.',
    description:
      'A scheduled list of smaller repairs handled together, which is usually more efficient and less disruptive than booking each one separately.',
    active: true,
    relatedServices: ['svc-carpentry', 'svc-damage-repair'],
  },
  {
    id: 'svc-carpentry',
    slug: 'carpentry',
    category: 'repairs-improvements',
    name: 'Carpentry',
    shortDescription: 'Rough and finish carpentry work.',
    description:
      'Carpentry across framing, built-ins, and finish work, where the fit of the joint is the measure of the job.',
    active: true,
    image: `${IMG}/detail-carpentry-joint.webp`,
    relatedServices: ['svc-trim-work', 'svc-door-installation'],
  },
  {
    id: 'svc-door-installation',
    slug: 'door-installation',
    category: 'repairs-improvements',
    name: 'Door installation',
    shortDescription: 'Interior and exterior door replacement.',
    description:
      'Door installation set plumb, level, and square, with weatherproofing at exterior openings and hardware that operates correctly.',
    active: true,
    relatedServices: ['svc-carpentry', 'svc-trim-work'],
  },
  {
    id: 'svc-window-replacement',
    slug: 'window-replacement',
    category: 'repairs-improvements',
    name: 'Window replacement',
    shortDescription: 'Window units replaced and properly flashed.',
    description:
      'Window replacement with attention to the sill pan, flashing sequence, and air sealing, so the new unit performs as intended.',
    active: true,
    relatedServices: ['svc-exterior-trim', 'svc-exterior-repairs'],
  },
  {
    id: 'svc-trim-work',
    slug: 'trim-work',
    category: 'repairs-improvements',
    name: 'Trim work',
    shortDescription: 'Baseboard, casing, crown, and millwork detail.',
    description:
      'Interior trim carpentry — baseboard, casing, crown, and built-up profiles — scribed and mitred to sit tight against real-world walls.',
    active: true,
    relatedServices: ['svc-carpentry', 'svc-interior-painting'],
  },
  {
    id: 'svc-damage-repair',
    slug: 'damage-repair',
    category: 'repairs-improvements',
    name: 'Damage repair',
    shortDescription: 'Repair of water, impact, and wear damage.',
    description:
      'Repairing damaged assemblies back to sound condition, including removing affected material and addressing the cause before rebuilding.',
    active: true,
    relatedServices: ['svc-drywall', 'svc-weather-repairs'],
  },
  {
    id: 'svc-property-improvements',
    slug: 'property-improvements',
    category: 'repairs-improvements',
    name: 'Property improvements',
    shortDescription: 'Planned upgrades to a residential or rental property.',
    description:
      'Improvement work planned around a property owner’s priorities, useful where a building is being prepared for sale, rental, or long-term hold.',
    active: true,
    relatedServices: ['svc-general-home-repairs', 'svc-interior-renovation'],
  },

  /* ---- Light commercial ----------------------------------------------- */
  {
    id: 'svc-commercial-renovations',
    slug: 'commercial-renovations',
    category: 'light-commercial',
    name: 'Commercial renovations',
    shortDescription: 'Renovation of small commercial interiors.',
    description:
      'Renovation of small commercial premises, planned around operating hours, access, and the disruption a tenant can reasonably absorb.',
    active: true,
    relatedServices: ['svc-office-improvements', 'svc-commercial-build-outs'],
  },
  {
    id: 'svc-office-improvements',
    slug: 'office-improvements',
    category: 'light-commercial',
    name: 'Office improvements',
    shortDescription: 'Partitions, finishes, and workspace reconfiguration.',
    description:
      'Office alterations including partition changes, ceiling and lighting adjustments, flooring, and finishes to suit a revised workspace layout.',
    active: true,
    relatedServices: ['svc-tenant-improvements', 'svc-commercial-build-outs'],
  },
  {
    id: 'svc-tenant-improvements',
    slug: 'tenant-improvements',
    category: 'light-commercial',
    name: 'Tenant improvements',
    shortDescription: 'Fit-out work to meet an incoming tenant’s needs.',
    description:
      'Tenant improvement work carried out to an agreed scope, documented clearly so the landlord and tenant can both see what is included.',
    active: true,
    relatedServices: ['svc-commercial-build-outs', 'svc-office-improvements'],
  },
  {
    id: 'svc-commercial-build-outs',
    slug: 'commercial-interior-build-outs',
    category: 'light-commercial',
    name: 'Interior build-outs',
    shortDescription: 'Shell-to-finished commercial interiors.',
    description:
      'Building out commercial interior space from shell condition — partitions, ceilings, flooring, millwork, and finishes — coordinated with the trades involved.',
    active: true,
    image: `${IMG}/detail-commercial-millwork.webp`,
    relatedServices: ['svc-tenant-improvements', 'svc-commercial-renovations'],
  },
  {
    id: 'svc-commercial-property-repairs',
    slug: 'commercial-property-repairs',
    category: 'light-commercial',
    name: 'Property repairs',
    shortDescription: 'Reactive repair work on commercial premises.',
    description:
      'Repair work on commercial property where the priority is restoring use quickly without leaving an untidy result behind.',
    active: true,
    relatedServices: ['svc-damage-repair', 'svc-commercial-maintenance'],
  },
  {
    id: 'svc-commercial-maintenance',
    slug: 'commercial-maintenance-projects',
    category: 'light-commercial',
    name: 'Commercial maintenance projects',
    shortDescription: 'Planned maintenance grouped into a single project.',
    description:
      'Planned maintenance packaged as one scoped project, which makes budgeting and scheduling considerably easier than handling items ad hoc.',
    active: true,
    relatedServices: ['svc-commercial-property-repairs', 'svc-exterior-repairs'],
  },
];

/* ---- Derived lookups ---------------------------------------------------- */

const serviceById = new Map(services.map((service) => [service.id, service]));
const categoryById = new Map(
  serviceCategories.map((category) => [category.id, category]),
);

export const activeServices = services.filter((service) => service.active);

export const activeServiceCategories = serviceCategories.filter(
  (category) => category.active,
);

export function getServiceById(id: string): Service | undefined {
  return serviceById.get(id);
}

export function getServicesByIds(ids: readonly string[]): Service[] {
  return ids
    .map((id) => serviceById.get(id))
    .filter((service): service is Service => Boolean(service));
}

export function getServiceCategory(
  id: ServiceCategoryId,
): ServiceCategory | undefined {
  return categoryById.get(id);
}

export function getServicesInCategory(id: ServiceCategoryId): Service[] {
  return activeServices.filter((service) => service.category === id);
}

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.slug === slug);
}

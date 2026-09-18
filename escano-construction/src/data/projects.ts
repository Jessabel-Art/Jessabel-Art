import type { Project, ProjectCategory, ProjectCategoryOption } from '@/types/project';
import { asset } from '@/utils/asset';

/* =============================================================================
   Demonstration project concepts.

   These records show how Escano Construction scopes, approaches, and presents
   work. They are illustrative concepts, not verified completed client projects.

   Deliberately absent: customer names, property addresses, prices, and
   completion dates. Do not add them unless the details are real and the
   customer has agreed to their publication.
   ========================================================================== */

const IMG = asset('assets/images');

export const projectCategoryOptions: readonly ProjectCategoryOption[] = [
  { id: 'all', label: 'All Concepts' },
  { id: 'residential', label: 'Residential' },
  { id: 'renovation', label: 'Renovation' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bathroom' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'commercial', label: 'Commercial' },
];

export const projects: readonly Project[] = [
  {
    id: 'prj-modern-kitchen-renovation',
    slug: 'modern-kitchen-renovation',
    title: 'Modern Kitchen Renovation',
    category: 'kitchen',
    projectType: 'Kitchen renovation',
    summary:
      'A closed-off galley kitchen reworked into a single open cooking and gathering space, with the load path rebuilt to allow the change.',
    description:
      'This concept covers the renovation of a dated kitchen in an existing single-family home. The original layout separated cooking from the adjacent dining area with a full-height partition, which made the room feel narrow and pushed most of the storage into upper cabinets. The scope opens that wall, relocates the sink and range, and rebuilds the storage plan around how the space is actually used day to day.',
    serviceIds: [
      'svc-kitchen-remodeling',
      'svc-structural-improvements',
      'svc-flooring',
      'svc-interior-painting',
    ],
    hero: {
      src: `${IMG}/project-kitchen-renovation.webp`,
      alt: 'A renovated kitchen with deep navy lower cabinetry, white upper cabinets, a light stone island, and matte black fixtures.',
    },
    images: [
      {
        src: `${IMG}/project-kitchen-renovation.webp`,
        alt: 'The completed kitchen concept viewed across the island toward the range wall.',
        caption: 'Reworked layout with the range wall opened to the dining area.',
      },
      {
        src: `${IMG}/detail-kitchen-cabinetry.webp`,
        alt: 'Close view of a navy shaker cabinet door with a brushed brass pull and a tight, even gap at the frame.',
        caption: 'Cabinet fit and hardware alignment checked door by door.',
      },
      {
        src: `${IMG}/service-remodeling-renovation.webp`,
        alt: 'The same room during renovation, with one wall stripped to studs and the opposite wall finished in fresh drywall.',
        caption: 'Mid-renovation, after demolition and structural framing.',
      },
    ],
    scope: [
      'Selective demolition of existing cabinetry, flooring, and the partition wall',
      'Structural beam and post installation to carry the removed load-bearing section',
      'Plumbing and electrical relocation for the revised sink and range positions',
      'New cabinetry, countertops, and tile backsplash installation',
      'Flooring installation continued through to the adjoining dining space',
      'Drywall repair, priming, and finish painting',
    ],
    challenge:
      'The wall the client wanted removed was load-bearing, and the ceiling joists above it ran perpendicular to the span. Removing it without a properly sized beam and a continuous load path down to the foundation was not an option.',
    approach: [
      'Confirm the existing framing direction and bearing points before committing to a layout.',
      'Size and install a flush beam so the finished ceiling reads as one plane rather than a dropped bulkhead.',
      'Sequence the plumbing and electrical relocations while the walls are open, not after finishes are in place.',
      'Set cabinetry from a single level reference line so countertop and appliance gaps stay consistent.',
    ],
    result:
      'The concept produces one continuous cooking and dining space with the storage moved to full-height base and pantry runs. The structural work stays hidden behind a flat ceiling, which is what makes the open layout feel original to the house rather than added later.',
    featured: true,
  },

  {
    id: 'prj-primary-bathroom-remodel',
    slug: 'primary-bathroom-remodel',
    title: 'Primary Bathroom Remodel',
    category: 'bathroom',
    projectType: 'Bathroom remodel',
    summary:
      'A primary bathroom rebuilt from the substrate up, with waterproofing treated as the central detail rather than a finishing step.',
    description:
      'This concept addresses a primary bathroom where the existing shower had begun to fail at the base. Rather than resurfacing, the scope takes the wet area back to framing so the waterproofing assembly can be built correctly, then rebuilds the room with a larger shower, a double vanity, and improved ventilation.',
    serviceIds: [
      'svc-bathroom-remodeling',
      'svc-flooring',
      'svc-trim-work',
      'svc-drywall',
    ],
    hero: {
      src: `${IMG}/project-bathroom-remodel.webp`,
      alt: 'A remodelled bathroom with large-format light tile, a glass shower enclosure, and a floating wood vanity.',
    },
    images: [
      {
        src: `${IMG}/project-bathroom-remodel.webp`,
        alt: 'The completed bathroom concept with a walk-in shower and double vanity.',
        caption: 'Finished layout with the shower enlarged into former closet space.',
      },
      {
        src: `${IMG}/detail-bath-tile.webp`,
        alt: 'Close view of tile work meeting at an inside corner with consistent grout lines and a clean silicone joint.',
        caption: 'Tile layout planned so cuts land away from sightlines.',
      },
      {
        src: `${IMG}/service-remodeling-renovation.webp`,
        alt: 'Interior renovation in progress showing exposed framing beside newly finished wall surfaces.',
        caption: 'Wet area opened to framing before the waterproofing assembly.',
      },
    ],
    scope: [
      'Full demolition of the existing shower, vanity, flooring, and wall finishes',
      'Framing modifications to enlarge the shower footprint',
      'Plumbing rough-in for a relocated shower valve and a second vanity sink',
      'Waterproofing membrane, sloped mortar bed, and substrate preparation',
      'Tile installation to floor, shower walls, and shower base',
      'Vanity, fixture, glass enclosure, and exhaust ventilation installation',
    ],
    challenge:
      'Enlarging the shower meant moving a wall that carried plumbing for an adjacent room, and the existing floor had a noticeable dip toward the centre of the space. Both had to be resolved before any tile could be set.',
    approach: [
      'Level the floor with a self-levelling underlayment so large-format tile can be set without lippage.',
      'Reroute the affected supply and vent lines while the wall cavity is fully open.',
      'Build the shower base with a continuous membrane carried up the walls and over the curb.',
      'Dry-lay the tile pattern before setting, so cut pieces fall in the least visible positions.',
    ],
    result:
      'The concept delivers a larger, better-ventilated bathroom where the parts that matter most are the ones nobody sees. Correct slope, a continuous membrane, and a level substrate are what keep the visible finish intact over time.',
    featured: true,
  },

  {
    id: 'prj-residential-roof-replacement',
    slug: 'residential-roof-replacement',
    title: 'Residential Roof Replacement',
    category: 'roofing',
    projectType: 'Roof replacement',
    summary:
      'A full tear-off and replacement treated as a system — deck, underlayment, flashing, covering, and ventilation together.',
    description:
      'This concept covers the complete replacement of an ageing asphalt shingle roof on a single-family home. A previous repair had layered new shingles over old, which hid deteriorated decking and left flashing details unresolved. The scope removes everything down to the deck so the assembly can be rebuilt properly.',
    serviceIds: [
      'svc-roof-replacement',
      'svc-shingle-roofing',
      'svc-fascia-soffit',
      'svc-weather-repairs',
    ],
    hero: {
      src: `${IMG}/project-roof-replacement.webp`,
      alt: 'A residential roof part-way through replacement, with new charcoal architectural shingles beside exposed roof decking.',
    },
    images: [
      {
        src: `${IMG}/project-roof-replacement.webp`,
        alt: 'The roof during replacement, showing the transition between new shingle courses and stripped decking.',
        caption: 'Tear-off and replacement worked in sections to keep the roof covered.',
      },
      {
        src: `${IMG}/service-roofing-exteriors.webp`,
        alt: 'A pitched roof with new architectural shingles laid in straight, evenly spaced courses.',
        caption: 'Course alignment set from chalk lines across the full plane.',
      },
      {
        src: `${IMG}/detail-roof-ridge.webp`,
        alt: 'Close view of a roof ridge with ridge vent installed and cap shingles fastened over it.',
        caption: 'Ridge ventilation installed as part of the roof assembly.',
      },
    ],
    scope: [
      'Complete tear-off of existing roof coverings down to the deck',
      'Deck inspection with replacement of deteriorated sheathing',
      'Ice and water barrier at eaves, valleys, and penetrations',
      'Synthetic underlayment across the full roof area',
      'New step, valley, and penetration flashing',
      'Architectural shingle installation with ridge ventilation',
      'Fascia and soffit repair where rot was found at the eave',
    ],
    challenge:
      'The extent of deck damage could not be determined until the old layers came off, and the roof needed to stay weather-protected between working days.',
    approach: [
      'Work the tear-off in planned sections so no open area is left exposed overnight.',
      'Document and photograph deck conditions as they are uncovered, before covering them again.',
      'Replace flashing rather than reuse it, since reused flashing is a common source of later leaks.',
      'Confirm intake and exhaust ventilation balance rather than only adding ridge vent.',
    ],
    result:
      'The concept produces a roof where every layer is new and continuous, with ventilation working as a pair of intake and exhaust rather than one half of the system. Deck conditions are documented, so future work starts from a known baseline.',
    featured: false,
  },

  {
    id: 'prj-exterior-home-renovation',
    slug: 'exterior-home-renovation',
    title: 'Exterior Home Renovation',
    category: 'exterior',
    projectType: 'Exterior renovation',
    summary:
      'Siding, trim, and entry detail replaced together so the elevation reads as one considered composition.',
    description:
      'This concept covers the exterior renovation of a home whose cladding had reached the end of its service life, with soft spots around several window openings. Replacing the siding alone would have left the underlying water management problems in place, so the scope includes the weather barrier and flashing details behind it.',
    serviceIds: [
      'svc-siding',
      'svc-exterior-trim',
      'svc-exterior-repairs',
      'svc-window-replacement',
    ],
    hero: {
      src: `${IMG}/project-exterior-renovation.webp`,
      alt: 'A home exterior with new fibre cement siding, crisp white trim, and a dark entry door under clear daylight.',
    },
    images: [
      {
        src: `${IMG}/project-exterior-renovation.webp`,
        alt: 'The completed exterior concept showing new siding and trim across the front elevation.',
        caption: 'Finished elevation with consistent siding reveal and trim returns.',
      },
      {
        src: `${IMG}/detail-siding-trim.webp`,
        alt: 'Close view of siding meeting a corner board, with an even reveal and a sealed vertical joint.',
        caption: 'Corner and joint detailing where water management is decided.',
      },
      {
        src: `${IMG}/service-repairs-improvements.webp`,
        alt: 'A newly installed exterior door with new trim adjacent to a section of older weathered siding.',
        caption: 'Openings reworked and flashed before new cladding was installed.',
      },
    ],
    scope: [
      'Removal of existing siding and trim across the affected elevations',
      'Sheathing repair where moisture damage was found',
      'Weather-resistive barrier installation with correct lap sequence',
      'Window and door opening flashing, including sill pans',
      'New fibre cement siding with consistent reveal spacing',
      'Corner boards, casings, and rake trim installation',
      'Sealant joints and finish coating',
    ],
    challenge:
      'The full extent of sheathing damage was unknown at the start, and the existing window openings had never been flashed, which is what allowed the damage in the first place.',
    approach: [
      'Open one elevation at a time to keep the building protected and the scope readable.',
      'Treat the weather barrier and flashing as the actual water management system, with the siding as the rain screen over it.',
      'Set a consistent reveal from a story pole so courses line up across openings.',
      'Detail trim returns and joints so end grain is never left exposed.',
    ],
    result:
      'The concept delivers an exterior that is straighter and better sealed than the original, with the visible improvement resting on flashing and barrier work that will not be seen again once the cladding is on.',
    featured: true,
  },

  {
    id: 'prj-covered-patio-addition',
    slug: 'covered-patio-addition',
    title: 'Covered Patio Addition',
    category: 'outdoor',
    projectType: 'Outdoor structure',
    summary:
      'A covered outdoor structure with exposed framing, tied into the existing roof and detailed to be looked at closely.',
    description:
      'This concept adds a covered patio to the rear of an existing home, extending usable space into the yard. Because the structure attaches to the house and its framing stays visible, both the connection detailing and the quality of the exposed carpentry carry the project.',
    serviceIds: [
      'svc-outdoor-structures',
      'svc-decks',
      'svc-patios',
      'svc-carpentry',
    ],
    hero: {
      src: `${IMG}/project-covered-patio.webp`,
      alt: 'A covered patio at dusk with cedar posts, exposed rafters, warm recessed lighting, and a stone floor.',
    },
    images: [
      {
        src: `${IMG}/project-covered-patio.webp`,
        alt: 'The completed covered patio concept photographed at blue hour with lighting on.',
        caption: 'Finished structure with integrated lighting in the ceiling plane.',
      },
      {
        src: `${IMG}/detail-deck-framing.webp`,
        alt: 'Close view of deck framing with galvanised joist hangers and evenly spaced joists on a level plane.',
        caption: 'Framing connections and hardware sized for the actual span.',
      },
      {
        src: `${IMG}/service-outdoor-construction.webp`,
        alt: 'A newly built covered deck with cedar posts, exposed rafters, and composite decking over a stone patio.',
        caption: 'Post, beam, and rafter relationship set out before assembly.',
      },
    ],
    scope: [
      'Footing excavation and concrete placement below frost depth',
      'Post, beam, and rafter framing with galvanised connectors',
      'Roof tie-in to the existing structure with step and apron flashing',
      'Roof sheathing, underlayment, and covering',
      'Patio surface preparation and installation with slope away from the house',
      'Exposed carpentry finishing and exterior-grade coating',
      'Rough-in for ceiling lighting and exterior outlets',
    ],
    challenge:
      'Attaching a new roof to an existing wall is the point where most outdoor structures eventually leak, and the yard sloped back toward the house, which meant drainage had to be corrected rather than accepted.',
    approach: [
      'Flash the roof-to-wall connection with a step and apron assembly carried behind the existing cladding.',
      'Re-grade and set the patio slope away from the foundation before the surface goes down.',
      'Select and finish exposed framing members knowing they are the finished product, not a substrate.',
      'Run electrical rough-in before the ceiling plane is closed, so no surface conduit is needed later.',
    ],
    result:
      'The concept produces a structure that reads as part of the house rather than an attachment, with the connection detailing and drainage corrections doing the work that keeps it that way.',
    featured: false,
  },

  {
    id: 'prj-whole-home-interior-renovation',
    slug: 'whole-home-interior-renovation',
    title: 'Whole-Home Interior Renovation',
    category: 'renovation',
    projectType: 'Whole-home renovation',
    summary:
      'An entire interior renovated as one sequenced project instead of a series of disconnected rooms.',
    description:
      'This concept covers a full interior renovation of an existing residence. The value of handling it as one project is sequence: demolition, structural changes, mechanical rough-in, and finishes happen in an order that avoids reopening completed work, and a single set of finish decisions carries through every room.',
    serviceIds: [
      'svc-whole-home-renovation',
      'svc-flooring',
      'svc-drywall',
      'svc-interior-painting',
      'svc-trim-work',
    ],
    hero: {
      src: `${IMG}/project-whole-home-interior.webp`,
      alt: 'A renovated open interior with warm oak flooring, white walls, and clean trim detail in natural daylight.',
    },
    images: [
      {
        src: `${IMG}/project-whole-home-interior.webp`,
        alt: 'The completed interior concept looking through connected living spaces.',
        caption: 'Consistent flooring and trim carried across every room.',
      },
      {
        src: `${IMG}/detail-carpentry-joint.webp`,
        alt: 'Close view of an interior trim joint with a tight mitre and evenly caulked edge.',
        caption: 'Trim joinery is where a whole-house finish level becomes visible.',
      },
      {
        src: `${IMG}/service-remodeling-renovation.webp`,
        alt: 'A room mid-renovation with exposed studs on one side and finished, primed drywall on the other.',
        caption: 'Rooms worked in a planned sequence rather than all at once.',
      },
    ],
    scope: [
      'Whole-house interior demolition of finishes and selected partitions',
      'Structural modifications where the layout changes required them',
      'Coordination of electrical, plumbing, and mechanical rough-in',
      'Insulation and drywall throughout',
      'Flooring installation with consistent transitions between rooms',
      'Interior trim, doors, and hardware',
      'Priming, painting, and final finish detailing',
    ],
    challenge:
      'A whole-house scope has the greatest risk of finished work being damaged by later trades, and inconsistent finish decisions across rooms are obvious once the house is viewed as a whole.',
    approach: [
      'Fix the finish schedule before demolition starts, so material availability does not dictate late substitutions.',
      'Sequence rooms so finish trades enter only after all rough-in inspections are complete.',
      'Set one floor reference height for the whole house to keep transitions and door undercuts consistent.',
      'Protect completed rooms as work moves on rather than repairing them at the end.',
    ],
    result:
      'The concept delivers an interior that reads as one project, which is largely a result of decisions made before demolition and of sequencing during it, rather than corrections at the end.',
    featured: true,
  },

  {
    id: 'prj-commercial-interior-refresh',
    slug: 'commercial-interior-refresh',
    title: 'Commercial Interior Refresh',
    category: 'commercial',
    projectType: 'Light commercial improvement',
    summary:
      'A small commercial suite refreshed around an operating tenant, with the schedule built to protect business hours.',
    description:
      'This concept covers the refresh of a small commercial office suite that stays in use during the work. The construction itself is straightforward; the scheduling constraints and dust, noise, and access management are what make the project a different exercise from residential work.',
    serviceIds: [
      'svc-commercial-renovations',
      'svc-office-improvements',
      'svc-commercial-build-outs',
      'svc-tenant-improvements',
    ],
    hero: {
      src: `${IMG}/project-commercial-refresh.webp`,
      alt: 'A refreshed commercial office interior with new flooring, clean partitions, and even recessed ceiling lighting.',
    },
    images: [
      {
        src: `${IMG}/project-commercial-refresh.webp`,
        alt: 'The completed commercial interior concept with new finishes and lighting throughout.',
        caption: 'Finished suite with lighting and ceiling grid reset on a clean line.',
      },
      {
        src: `${IMG}/service-light-commercial.webp`,
        alt: 'A commercial interior build-out with new metal stud partitions and a partly installed ceiling grid.',
        caption: 'Partition and ceiling work staged outside business hours.',
      },
      {
        src: `${IMG}/detail-commercial-millwork.webp`,
        alt: 'Close view of commercial millwork with a clean edge profile and consistent reveal against the wall.',
        caption: 'Millwork detailing that holds up to daily commercial use.',
      },
    ],
    scope: [
      'Partition modifications to revise the workspace layout',
      'Ceiling grid and tile replacement with lighting adjustments',
      'Commercial-grade flooring installation',
      'Millwork and reception detail installation',
      'Wall preparation and repainting throughout',
      'Door, hardware, and signage substrate work',
      'Phased scheduling planned around tenant operating hours',
    ],
    challenge:
      'The tenant needed to keep working throughout, which ruled out a continuous schedule and meant every noisy or dusty operation had to be contained and timed.',
    approach: [
      'Divide the suite into zones so only one area is out of service at a time.',
      'Schedule demolition, cutting, and ceiling work outside operating hours.',
      'Use temporary dust partitions and negative air rather than relying on sheeting alone.',
      'Leave each zone usable at the end of every shift, even mid-scope.',
    ],
    result:
      'The concept shows a refreshed suite completed without the tenant closing, which depends far more on planning and containment than on the finishes specified.',
    featured: false,
  },

  {
    id: 'prj-residential-addition',
    slug: 'residential-addition',
    title: 'Residential Addition',
    category: 'residential',
    projectType: 'Home addition',
    summary:
      'New conditioned space added to an existing home, detailed at the connection so the addition does not read as an afterthought.',
    description:
      'This concept covers a single-storey addition that extends an existing home. An addition is judged almost entirely at the junction between old and new: the foundation, roof tie-in, floor height, and exterior lines all have to resolve, or the finished result looks bolted on regardless of the interior quality.',
    serviceIds: [
      'svc-home-additions',
      'svc-structural-improvements',
      'svc-roof-replacement',
      'svc-siding',
      'svc-interior-build-outs',
    ],
    hero: {
      src: `${IMG}/project-residential-addition.webp`,
      alt: 'A single-storey home addition under construction with new framing tied into the existing house.',
    },
    images: [
      {
        src: `${IMG}/project-residential-addition.webp`,
        alt: 'The addition concept during construction, showing the new structure joined to the existing home.',
        caption: 'New framing set to match the existing floor and roof planes.',
      },
      {
        src: `${IMG}/hero-framing-golden.webp`,
        alt: 'A framed residential structure at golden hour with roof trusses and sheathing in place on a tidy site.',
        caption: 'Framing complete and squared before the envelope is closed in.',
      },
      {
        src: `${IMG}/detail-framing-vertical.webp`,
        alt: 'Interior view of new wall framing with evenly spaced studs and a clean, organised work area.',
        caption: 'Stud layout kept regular so finish work has a predictable substrate.',
      },
    ],
    scope: [
      'Site preparation, excavation, and new foundation',
      'Floor system framed to match the existing finished floor height',
      'Wall and roof framing with a structural connection to the existing building',
      'Roof tie-in with flashing at the intersection',
      'Weather barrier, siding, windows, and doors to match the existing exterior',
      'Insulation, drywall, flooring, and trim inside the new space',
      'Coordination of electrical, plumbing, and mechanical extensions',
    ],
    challenge:
      'The existing floor framing sat at a height that did not align cleanly with a conventional new floor system, and the roof intersection created a valley that had to shed water reliably.',
    approach: [
      'Survey the existing floor and roof planes before designing the new framing, not after.',
      'Adjust the new foundation and floor framing to land flush with the existing finished floor.',
      'Build the roof valley with a full ice and water barrier and open metal valley flashing.',
      'Match siding exposure and trim profiles to the existing elevation so the joint is not obvious.',
    ],
    result:
      'The concept delivers usable new space that continues the existing floor plane and roofline. The measure of success is that the transition between old and new is difficult to identify from either inside or outside.',
    featured: false,
  },
];

/* ---- Derived lookups ---------------------------------------------------- */

const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projectBySlug.get(slug);
}

export function getProjectsByCategory(
  category: ProjectCategory | 'all',
): readonly Project[] {
  if (category === 'all') return projects;
  return projects.filter((project) => project.category === category);
}

/**
 * Related concepts: same category first, then any other concept sharing at
 * least one service, capped so the section stays readable.
 */
export function getRelatedProjects(project: Project, limit = 3): Project[] {
  const others = projects.filter((candidate) => candidate.id !== project.id);
  const scored = others
    .map((candidate) => {
      const sharedServices = candidate.serviceIds.filter((id) =>
        project.serviceIds.includes(id),
      ).length;
      const categoryMatch = candidate.category === project.category ? 3 : 0;
      return { candidate, score: categoryMatch + sharedServices };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const result = scored.map((entry) => entry.candidate);
  for (const candidate of others) {
    if (result.length >= limit) break;
    if (!result.includes(candidate)) result.push(candidate);
  }
  return result.slice(0, limit);
}

export function getCategoryLabel(category: ProjectCategory): string {
  return (
    projectCategoryOptions.find((option) => option.id === category)?.label ??
    category
  );
}

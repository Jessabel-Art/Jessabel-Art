/* =============================================================================
   Editorial content used on the Home and About pages.

   Kept out of the components so the copy can be reviewed and revised without
   touching layout code. Nothing here asserts licensing, insurance, bonding,
   certification, registration, trading history, or completed client volume.
   ========================================================================== */

export interface ProcessStep {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

export const constructionProcess: readonly ProcessStep[] = [
  {
    id: 'conversation',
    index: '01',
    title: 'Conversation',
    description:
      'The first step is understanding what you want out of the project and what is driving it — a failing roof, a layout that no longer works, or space you need to add. Nothing gets scoped before that is clear.',
  },
  {
    id: 'assessment',
    index: '02',
    title: 'Site Assessment',
    description:
      'Existing conditions get looked at directly: framing, drainage, moisture, access, and what is behind the finishes. This is where most surprises are found, and it is far cheaper to find them here.',
  },
  {
    id: 'scope',
    index: '03',
    title: 'Scope & Proposal',
    description:
      'A written scope sets out what is included, what is not, and the sequence of work. A clear exclusion list is as valuable as the inclusion list, because it is where misunderstandings usually start.',
  },
  {
    id: 'planning',
    index: '04',
    title: 'Planning & Scheduling',
    description:
      'Materials, trades, and inspections get sequenced before anyone starts. Sequence is what determines whether finished work has to be reopened later.',
  },
  {
    id: 'construction',
    index: '05',
    title: 'Construction',
    description:
      'Work proceeds with the site kept organised and protected, and with the same person accountable throughout. Where something needs a decision, you hear about it before it becomes a problem.',
  },
  {
    id: 'walkthrough',
    index: '06',
    title: 'Walkthrough & Close-Out',
    description:
      'The project ends with a walkthrough against the original scope, an agreed punch list, and that list actually being finished — not left as an open item after the trucks leave.',
  },
];

export interface ValueProposition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const whyEscano: readonly ValueProposition[] = [
  {
    id: 'scope-clarity',
    title: 'Scope written plainly',
    description:
      'A proposal should be readable without a construction background. Inclusions, exclusions, and sequence are set out in language you can hold the work against.',
  },
  {
    id: 'communication',
    title: 'One point of contact',
    description:
      'You should not have to work out who to call. Questions, changes, and scheduling all go through the same person, and answers come back the same way.',
  },
  {
    id: 'workmanship',
    title: 'Detail where it is not visible',
    description:
      'Flashing sequence, substrate preparation, waterproofing, and framing connections decide how long the visible finish lasts. That is where the attention goes first.',
  },
  {
    id: 'site-conduct',
    title: 'A site kept in order',
    description:
      'Material staged, work areas protected, and debris managed daily. On an occupied property, how a site is run matters as much as the finished result.',
  },
];

export interface ApproachPillar {
  readonly id: string;
  readonly heading: string;
  readonly body: readonly string[];
}

export const approachPillars: readonly ApproachPillar[] = [
  {
    id: 'our-approach',
    heading: 'Our Approach',
    body: [
      'Escano Construction is being built around a straightforward idea: most problems on a construction project are not caused by a lack of skill, they are caused by unclear scope, poor sequencing, and slow communication.',
      'The approach starts by removing those. Understand the actual objective, look at real existing conditions before committing to a scope, write down what is and is not included, and then run the work in an order that does not require undoing finished results.',
    ],
  },
  {
    id: 'project-planning',
    heading: 'Project Planning',
    body: [
      'Planning happens before demolition, not during it. Material selections, lead times, trade sequencing, and inspection points are worked out up front so the schedule reflects reality rather than optimism.',
      'That planning is also what makes a change in the middle of a project manageable. When the sequence is documented, the effect of a change on cost and schedule can be explained clearly instead of guessed at.',
    ],
  },
  {
    id: 'communication',
    heading: 'Communication',
    body: [
      'You should always know what is happening on your property this week, what is happening next, and whether anything needs a decision from you.',
      'When something unexpected is uncovered — and on existing buildings, something usually is — the conversation happens immediately, with options and their implications, rather than appearing later as a line on an invoice.',
    ],
  },
  {
    id: 'quality-of-work',
    heading: 'Quality of Work',
    body: [
      'Quality is decided by the parts of the work that get covered up. A waterproofing membrane carried correctly up a wall, a flashing lap in the right sequence, a level substrate under large-format tile — these determine whether the finish is still sound in ten years.',
      'Finish work is held to the same standard. Consistent reveals, tight joints, and square, plumb, level installation are the baseline, not an upgrade.',
    ],
  },
  {
    id: 'attention-to-detail',
    heading: 'Attention to Detail',
    body: [
      'Details are cumulative. Tile cuts placed where they are least visible, cabinet gaps set from one reference line, trim scribed to a wall that is not straight — individually small, collectively the difference between competent and careless.',
      'The same applies to the paperwork. An accurate scope, a clear allowance, and a punch list that actually gets closed out are details too.',
    ],
  },
  {
    id: 'residential-construction',
    heading: 'Residential Construction',
    body: [
      'Residential work usually happens in and around somebody\u2019s home, often while they are living in it. That shapes everything: how the site is protected, when noisy work is scheduled, and how the property is left at the end of each day.',
      'The work itself spans ground-up construction, additions, structural changes, and full interior renovation — with the connection between new and existing construction treated as the part that matters most.',
    ],
  },
  {
    id: 'commercial-improvements',
    heading: 'Commercial Improvements',
    body: [
      'Light commercial work is scoped around the constraint that the space usually has to keep operating. Zoned phasing, work outside business hours, dust containment, and leaving each area usable at the end of a shift are part of the scope, not afterthoughts.',
      'Typical work includes tenant improvements, office reconfiguration, interior build-outs, and planned maintenance packaged as a single project so it can actually be budgeted.',
    ],
  },
];


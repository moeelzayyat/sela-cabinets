export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServicePageContent {
  heading: string
  overview: readonly string[]
  included: readonly { title: string; description: string }[]
  process: readonly { title: string; description: string }[]
  preparation: readonly string[]
  timeline: readonly string[]
  exclusions: readonly string[]
  faqs: readonly ServiceFaq[]
}

export const servicePageContent = {
  supply: {
    heading: 'What cabinet supply includes',
    overview: [
      'Cabinet supply starts with the measured room, not a door-color decision by itself. SELA reviews the kitchen dimensions, appliance locations, storage priorities, cabinet construction, finish direction, and the installation scope before a cabinet order is finalized. That sequence helps keep the selected cabinets connected to the walls, openings, clearances, and daily use of the actual kitchen.',
      'The supply scope covers the cabinet products and documented cabinet components listed in the written quote. Samples and catalog images help narrow the direction, but finishes should be reviewed in the home because daylight, work lighting, counters, flooring, and wall color can change how a sample reads. The written quote is the controlling source for included cabinet pieces, accessories, delivery responsibilities, and installation work.',
    ],
    included: [
      { title: 'Measured cabinet plan', description: 'Kitchen dimensions and visible conditions are recorded so cabinet widths, fillers, panels, and clearances can be planned around the room rather than assumed from a generic layout.' },
      { title: 'Style and construction review', description: 'Homeowners can compare framed and frameless options, door profiles, finishes, storage priorities, and the published construction details that apply to the selected collection.' },
      { title: 'Itemized cabinet scope', description: 'The written quote identifies the cabinet pieces and approved cabinet accessories included in the order. Anything not written into that scope should not be assumed.' },
      { title: 'Order coordination', description: 'SELA keeps cabinet selection, measurement information, ordering, delivery readiness, and the approved installation scope connected through one project contact.' },
    ],
    process: [
      { title: 'Share the kitchen goals', description: 'Send current photos, appliance information, preferred styles, storage concerns, and any layout ideas you are considering.' },
      { title: 'Measure the room', description: 'An in-home visit records walls, openings, ceiling conditions, appliance spaces, and visible constraints that affect the cabinet plan.' },
      { title: 'Review cabinet choices', description: 'Compare door styles, finish direction, construction type, functional accessories, and how those choices fit the measured layout.' },
      { title: 'Confirm the written scope', description: 'Review the cabinet list, responsibilities, exclusions, delivery details, installation work, and price before authorizing an order.' },
      { title: 'Prepare for delivery and installation', description: 'SELA confirms the next project steps while the homeowner keeps access, appliance information, and site readiness current.' },
    ],
    preparation: [
      'Provide model numbers or accurate dimensions for appliances that must fit the cabinet layout.',
      'Identify items that must remain, including flooring, counters, plumbing locations, windows, soffits, or adjacent trim.',
      'Choose a practical storage priority list so the plan can balance drawers, doors, pantry space, and corner access.',
      'Review physical finish samples in the kitchen under daytime and evening lighting before approving the selection.',
    ],
    timeline: [
      'Planning time depends on how settled the layout and selections are. A straightforward measured replacement can move through review faster than a kitchen that still needs appliance decisions, layout changes, or several finish comparisons.',
      'Ordering and delivery timing depends on the selected cabinet collection and the confirmed order. SELA does not promise an arrival date until the project-specific timing is available. Installation scheduling is coordinated separately around delivery readiness and the written scope.',
    ],
    exclusions: [
      'Cabinet supply does not automatically include countertops, plumbing, electrical work, flooring, painting, wall repair, or appliance work.',
      'Decorative accessories, organizers, panels, moldings, and hardware are included only when they appear in the written quote.',
      'Catalog images are style references and are not representations of completed SELA projects.',
      'Unwritten layout revisions or site work discovered after approval require review before they become part of the scope.',
    ],
    faqs: [
      { question: 'Can I order cabinets before an in-home measurement?', answer: 'SELA bases the cabinet plan on the actual room. Existing dimensions and photos are useful for an early conversation, but an in-home measurement is the safer point for confirming widths, openings, appliance spaces, fillers, and visible constraints before the order is finalized.' },
      { question: 'Can I compare more than one cabinet style?', answer: 'Yes. You can compare door profiles, finish directions, and framed or frameless construction before approving a selection. Physical samples should be viewed beside the room’s fixed surfaces and under its real lighting rather than judged from a screen alone.' },
      { question: 'What determines cabinet supply pricing?', answer: 'Pricing depends on the measured layout, cabinet count and sizes, construction type, finish, panels, moldings, storage accessories, delivery requirements, and the work written into the quote. SELA provides the project price after those details are reviewed.' },
      { question: 'Are countertops and appliances part of cabinet supply?', answer: 'Not unless the written quote specifically says so. Cabinet supply is limited to the listed cabinet products and approved accessories. Countertops, plumbing, electrical work, appliances, flooring, and other trades remain outside the scope unless clearly added in writing.' },
      { question: 'How do I know what is included in my order?', answer: 'Use the written quote and approved cabinet list as the controlling record. It should identify cabinet pieces, approved accessories, responsibilities, exclusions, and related installation work. Ask for clarification before approval if an item is not clearly listed.' },
    ],
  },
  installation: {
    heading: 'What professional cabinet installation includes',
    overview: [
      'Cabinet installation turns the approved cabinet plan into a level, aligned, securely attached working layout. The work begins with the delivered cabinet pieces and the visible site conditions in the written scope. Each run is checked against the room because walls, floors, corners, and ceilings can vary even when the plan is accurate.',
      'The installation focus is cabinet work: placement, leveling, fastening, alignment, fitting, approved fillers or cabinet trim, door and drawer adjustment, and a final cabinet walkthrough. The exact tasks depend on the written quote. Work by other trades is not silently folded into the cabinet scope, which helps homeowners know who is responsible before installation day.',
    ],
    included: [
      { title: 'Layout verification', description: 'The installer checks the approved cabinet layout, cabinet pieces, appliance spaces, and visible room conditions before permanent attachment begins.' },
      { title: 'Leveling and secure attachment', description: 'Cabinets are positioned, shimmed where needed, fastened to suitable structure, and checked across cabinet runs for practical alignment.' },
      { title: 'Cabinet fitting and adjustment', description: 'Approved fillers, panels, and cabinet trim are fitted within the written scope, followed by door and drawer alignment and functional adjustments.' },
      { title: 'Cabinet walkthrough', description: 'The completed cabinet work is reviewed with the homeowner so visible cabinet questions can be identified before the installation visit closes.' },
    ],
    process: [
      { title: 'Confirm delivery and scope', description: 'Cabinet pieces, the approved layout, appliance information, site readiness, and the written installation responsibilities are checked before work starts.' },
      { title: 'Establish reference lines', description: 'The installer evaluates the floor, walls, corners, and ceiling conditions and establishes level and layout references for the cabinet runs.' },
      { title: 'Set and fasten cabinets', description: 'Base and wall cabinets are positioned, leveled, aligned, joined where appropriate, and securely attached within the approved scope.' },
      { title: 'Fit finishing components', description: 'Listed fillers, panels, moldings, and cabinet trim are fitted to the room conditions covered by the quote.' },
      { title: 'Adjust and walk through', description: 'Doors and drawers are adjusted, cabinet operation is checked, and the homeowner reviews the visible cabinet installation.' },
    ],
    preparation: [
      'Clear cabinet work zones and provide an unobstructed route from the entry to the kitchen.',
      'Keep children, pets, and personal items away from tools, materials, and active work areas.',
      'Confirm that required non-cabinet work and site preparation assigned to others is complete before the scheduled visit.',
      'Keep appliance specifications and the approved cabinet plan available, and report any site change before installation begins.',
    ],
    timeline: [
      'Installation duration depends on cabinet count, layout complexity, access, room conditions, listed trim, and whether the site matches the approved scope. A specific expectation is discussed for the measured project rather than promised from kitchen size alone.',
      'Conditions uncovered after existing cabinets are removed or once cabinets are set against the room may require a pause and a written scope review. SELA communicates the cabinet impact before extra work is treated as approved.',
    ],
    exclusions: [
      'Plumbing, electrical, gas, HVAC, countertop fabrication, flooring, painting, drywall repair, and appliance connections are not included unless written into the quote.',
      'Structural correction, hidden damage, mold, hazardous-material handling, and major wall or floor correction are outside normal cabinet installation.',
      'Removed cabinets and demolition debris remain onsite for customer disposal unless the written scope expressly states otherwise.',
      'Work caused by unreported product, appliance, or layout changes requires review before it is added to the installation scope.',
    ],
    faqs: [
      { question: 'How long does cabinet installation take?', answer: 'The duration depends on the number of cabinets, room access, layout complexity, trim details, and whether the visible site conditions match the approved plan. SELA discusses a project-specific expectation after measurement and scope review rather than promising a universal number of days.' },
      { question: 'Do I need to empty the kitchen before installation?', answer: 'Yes. Clear the cabinet work zones, counters, nearby floors, and the travel path into the room. Personal items, children, and pets should remain away from tools and materials. Complete any preparation assigned to the homeowner or another trade before the scheduled visit.' },
      { question: 'Does cabinet installation include plumbing or electrical work?', answer: 'No, not by default. Plumbing, electrical, gas, HVAC, appliance connections, countertops, flooring, painting, and wall repair remain outside cabinet installation unless a written quote specifically includes a defined task.' },
      { question: 'What happens to the old cabinets?', answer: 'Removed cabinets remain onsite for the customer to dispose of unless the written scope clearly includes another arrangement. The removal scope itself must also appear in writing; cabinet installation should not be assumed to include demolition.' },
      { question: 'What if the walls or floor are not level?', answer: 'Minor variation is addressed through normal cabinet fitting, leveling, and approved fillers. Conditions that require structural correction, major wall or floor repair, or work outside the written scope are reviewed with the homeowner before additional work proceeds.' },
      { question: 'When can countertops be measured?', answer: 'Countertop timing should be coordinated with the countertop provider. Cabinet placement generally needs to be complete and ready for that provider’s requirements, but SELA does not promise another company’s schedule or process.' },
    ],
  },
  measurement: {
    heading: 'What an in-home cabinet measurement includes',
    overview: [
      'An in-home cabinet measurement records the room that the cabinet plan must fit. The visit focuses on dimensions and visible conditions: walls, openings, ceiling changes, soffits, appliance spaces, plumbing locations, obstacles, and the relationships between cabinet runs. It is a planning step, not a substitute for destructive investigation or work by licensed trades.',
      'The visit also gives the homeowner a chance to explain storage problems, appliance plans, style preferences, and features that must remain. SELA uses that information to prepare the next cabinet conversation and written scope. Measurements support the plan, while final cabinet selections and responsibilities are still reviewed before an order is approved.',
    ],
    included: [
      { title: 'Room dimensions', description: 'Wall lengths, ceiling conditions, openings, and the general relationship of the kitchen work areas are recorded for cabinet planning.' },
      { title: 'Visible fixed conditions', description: 'Windows, doors, soffits, vents, visible plumbing points, and other apparent obstacles that may affect cabinets are noted.' },
      { title: 'Appliance planning information', description: 'Existing or planned appliance locations and available specifications are reviewed because cabinet clearances depend on the actual models and layout.' },
      { title: 'Project priorities', description: 'Storage needs, style direction, must-keep features, and practical concerns are discussed so the measured plan responds to how the kitchen is used.' },
    ],
    process: [
      { title: 'Pre-visit conversation', description: 'Share photos, goals, known constraints, appliance plans, and any existing dimensions so the visit can focus on the important questions.' },
      { title: 'Walk through the room', description: 'The homeowner identifies what stays, what may change, current frustrations, and any work expected from other contractors.' },
      { title: 'Record dimensions and conditions', description: 'The visible room geometry, openings, utility locations, appliance spaces, and cabinet-relevant obstacles are documented.' },
      { title: 'Review uncertainties', description: 'Items that cannot be confirmed visually, missing appliance specifications, or conditions requiring another trade are called out instead of guessed.' },
      { title: 'Plan the next review', description: 'The measurement information is used to continue cabinet selection, layout review, scope definition, and quote preparation.' },
    ],
    preparation: [
      'Clear counters and provide access to walls, corners, openings, appliance spaces, and visible utility locations.',
      'Gather appliance model numbers or official appliance specifications for any appliance that will remain or be replaced.',
      'List features that must stay, planned layout changes, storage priorities, and questions you want addressed during the visit.',
      'Tell SELA about known repairs, prior remodeling, access restrictions, or another contractor’s planned work before the appointment.',
    ],
    timeline: [
      'The visit length depends on kitchen complexity and the number of questions that need review. SELA confirms the appointment window directly; the website does not promise a fixed duration for every home.',
      'A measurement is followed by cabinet and scope review, not an automatic order. Timing for a written quote depends on complete appliance information, selection decisions, layout questions, and any conditions that need clarification from another trade.',
    ],
    exclusions: [
      'The visit does not include opening walls, destructive testing, structural evaluation, code inspection, or diagnosis of hidden conditions.',
      'It does not replace specifications or field verification required by countertop, plumbing, electrical, gas, HVAC, or appliance professionals.',
      'A measurement does not itself authorize a cabinet order, reserve an installation date, or guarantee that every requested layout change is feasible.',
      'Pricing remains project-specific and is provided through the written quote after the relevant choices and scope are reviewed.',
    ],
    faqs: [
      { question: 'What should I have ready for the measurement visit?', answer: 'Clear access to the kitchen walls, openings, appliance spaces, and visible utility locations. Gather appliance model numbers or specifications, photos or ideas you want to discuss, and a list of features that must remain. Share known site concerns before the appointment.' },
      { question: 'Can you measure before I choose a cabinet style?', answer: 'Yes. Measurement and style selection inform each other. The room can be documented before the finish is final, while construction type, door profile, storage accessories, and appliance choices are reviewed before the cabinet order is approved.' },
      { question: 'Does measurement include a structural or code inspection?', answer: 'No. The visit records cabinet-relevant dimensions and visible conditions. It does not open walls, diagnose hidden damage, certify structure, or replace inspections and field verification required by licensed trades or other product providers.' },
      { question: 'Do I need appliance model numbers?', answer: 'They are strongly helpful when appliances affect cabinet openings or clearances. If a model is not selected, the plan may need to remain provisional until official appliance specifications are available. SELA will not invent an appliance dimension.' },
      { question: 'Will I receive the final price during the visit?', answer: 'Not necessarily. The written quote follows review of the measured layout, cabinet selections, accessories, delivery requirements, site conditions, and installation scope. Unresolved appliances or layout decisions can delay a reliable final scope.' },
      { question: 'What if part of the kitchen is blocked or unfinished?', answer: 'Tell SELA before the appointment. Accessible visible conditions can be recorded, while blocked or changing areas are identified as unresolved. A follow-up check may be needed before an order if critical dimensions cannot be verified.' },
    ],
  },
} as const satisfies Record<'supply' | 'installation' | 'measurement', ServicePageContent>

export interface ServiceAreaPage {
  name: string
  slug: string
  introduction: string
  homeNotes: string
  planningNotes: string
}

export const serviceAreaPages: readonly ServiceAreaPage[] = [
  {
    name: 'Detroit',
    slug: 'detroit',
    introduction: 'SELA supplies and installs kitchen cabinets for Detroit homeowners who want a coordinated path from measurement and cabinet selection through installation.',
    homeNotes: 'Detroit kitchens can vary widely—from compact rooms in older homes to opened-up layouts created during later renovations. Careful field measurements help account for walls, floors, soffits, doorways, and appliance clearances before cabinets are ordered.',
    planningNotes: 'A Detroit cabinet project starts with the room, the desired cabinet style, and the installation scope. SELA documents those details and provides one point of contact through the final cabinet walkthrough.',
  },
  {
    name: 'Dearborn',
    slug: 'dearborn',
    introduction: 'SELA helps Dearborn homeowners compare kitchen cabinet styles, verify the room, and coordinate professional cabinet installation.',
    homeNotes: 'Dearborn projects may involve bungalow, colonial, ranch, or updated open-plan kitchens. Existing trim, window locations, heating elements, and adjacent rooms can all affect cabinet placement and usable storage.',
    planningNotes: 'The process connects in-home measurement with cabinet construction choices, written scope, ordering, delivery readiness, installation, and a final walkthrough.',
  },
  {
    name: 'Livonia',
    slug: 'livonia',
    introduction: 'Livonia homeowners can work with SELA for kitchen cabinet supply, in-home measurement, layout guidance, and professional installation.',
    homeNotes: 'Many Livonia kitchen projects involve ranch or colonial-style homes where appliance openings, soffits, breakfast areas, and connections to dining spaces deserve careful measurement before a cabinet order is finalized.',
    planningNotes: 'SELA reviews the kitchen as it exists, the cabinet collection selected, and the work included in the written scope so ordering and installation stay connected.',
  },
  {
    name: 'Troy',
    slug: 'troy',
    introduction: 'SELA provides Troy homeowners with kitchen cabinet options and professional installation coordinated through one direct point of contact.',
    homeNotes: 'Troy homes include both established neighborhoods and newer layouts. Cabinet planning may need to account for islands, tall pantry storage, larger appliance packages, or the relationship between the kitchen and nearby living areas.',
    planningNotes: 'Measurements and cabinet specifications are reviewed before ordering, while delivery and site readiness are confirmed before installation scheduling.',
  },
  {
    name: 'Warren',
    slug: 'warren',
    introduction: 'SELA serves Warren homeowners looking for quality kitchen cabinets, straightforward scope, and skilled cabinet installation.',
    homeNotes: 'Warren kitchens can include compact galley arrangements, L-shaped rooms, and expanded layouts. Door swings, corners, appliance widths, utility locations, and uneven existing surfaces can influence the final cabinet plan.',
    planningNotes: 'SELA uses an in-home review to connect cabinet selection with the measured room and the agreed installation work.',
  },
  {
    name: 'Sterling Heights',
    slug: 'sterling-heights',
    introduction: 'Sterling Heights homeowners can use SELA for cabinet selection, in-home measurement, ordering coordination, and kitchen cabinet installation.',
    homeNotes: 'Projects in Sterling Heights may range from replacing cabinets within an existing footprint to improving storage in a larger kitchen. Islands, pantry walls, appliance clearances, and traffic paths are reviewed against the actual room.',
    planningNotes: 'A written project scope identifies the cabinet work SELA will provide, while any surrounding trade work remains separately coordinated unless expressly included.',
  },
  {
    name: 'Ann Arbor',
    slug: 'ann-arbor',
    introduction: 'SELA works with Ann Arbor homeowners who want kitchen cabinets supplied and professionally installed with consistent communication.',
    homeNotes: 'Ann Arbor includes older homes, mid-century layouts, and newer construction. Cabinet decisions can be shaped by compact footprints, original trim, nonstandard walls, contemporary open plans, or a mix of old and new conditions.',
    planningNotes: 'The next step is determined after reviewing the project location, kitchen photos, cabinet needs, and whether an in-home measurement is appropriate.',
  },
  {
    name: 'Farmington Hills',
    slug: 'farmington-hills',
    introduction: 'SELA helps Farmington Hills homeowners select kitchen cabinets and coordinate professional installation from measurement to walkthrough.',
    homeNotes: 'Farmington Hills projects may include traditional compartmentalized kitchens or more open layouts. Corners, countertop runs, islands, pantry storage, and transitions into adjoining rooms all affect cabinet dimensions and fit.',
    planningNotes: 'SELA confirms cabinet style, measured conditions, written scope, delivery status, and site readiness before installation begins.',
  },
  {
    name: 'Southfield',
    slug: 'southfield',
    introduction: 'SELA offers Southfield homeowners a direct route to quality kitchen cabinets and professional cabinet installation.',
    homeNotes: 'Southfield homes include a variety of mid-century and later layouts. Projects may need to work around existing soffits, angled walls, appliance positions, or storage limitations while keeping circulation practical.',
    planningNotes: 'The cabinet plan is grounded in field measurements and current product specifications rather than assumptions from photos alone.',
  },
  {
    name: 'Royal Oak',
    slug: 'royal-oak',
    introduction: 'SELA supplies and installs kitchen cabinets for Royal Oak homeowners, with one point of contact throughout the cabinet project.',
    homeNotes: 'Royal Oak kitchens are often part of established homes where room size, original openings, additions, and previous renovations can create unique measurement and fit conditions. Efficient storage can matter as much as appearance.',
    planningNotes: 'SELA reviews those conditions, helps narrow the cabinet collection, and documents the installation scope before commitment.',
  },
  {
    name: 'Novi',
    slug: 'novi',
    introduction: 'Novi homeowners can work with SELA for kitchen cabinet supply, selection guidance, in-home measurement, and installation.',
    homeNotes: 'Novi projects may involve larger kitchens, islands, pantry walls, and open connections to dining or living areas. Appliance specifications, clearances, storage priorities, and finish coordination are reviewed together.',
    planningNotes: 'Cabinet availability, delivery condition, and site readiness are confirmed before an installation date is set.',
  },
  {
    name: 'Canton',
    slug: 'canton',
    introduction: 'SELA helps Canton homeowners purchase kitchen cabinets and coordinate skilled installation through a single contact.',
    homeNotes: 'Canton kitchens may include builder-era layouts that benefit from updated storage, island planning, or a refreshed cabinet footprint. Measurements verify how proposed changes interact with windows, appliances, flooring, and adjacent spaces.',
    planningNotes: 'The written scope explains the cabinet supply and installation work included, with the exact price established after measurement and selection review.',
  },
  {
    name: 'Westland',
    slug: 'westland',
    introduction: 'SELA serves Westland homeowners seeking quality kitchen cabinets at a fair price with professional installation.',
    homeNotes: 'Westland projects can involve compact ranch kitchens, galley layouts, or rooms opened during earlier renovations. Practical cabinet planning considers wall conditions, corners, utilities, appliance clearances, and delivery access.',
    planningNotes: 'SELA keeps communication centralized from the first project conversation through measurement, ordering, installation, and the final walkthrough.',
  },
] as const

export const serviceAreaPageBySlug = new Map(
  serviceAreaPages.map((area) => [area.slug, area])
)

export function getServiceAreaPage(slug: string): ServiceAreaPage | undefined {
  return serviceAreaPageBySlug.get(slug)
}

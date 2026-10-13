export type CabinetConstruction = 'framed' | 'frameless'

export interface CabinetProduct {
  id: string
  name: string
  construction: CabinetConstruction
  image: string
  designCharacter: string
  suits: string
  pairingSuggestions: string
  styleNotes: readonly [string, string, string]
}

export interface HandleProduct {
  id: string
  name: string
  image: string
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const cabinet = (
  name: string,
  construction: CabinetConstruction
): CabinetProduct => ({
  id: slug(name),
  name,
  construction,
  image: `/images/products/catalog/${slug(name)}.webp`,
  ...styleProfile(name, construction),
})

function styleProfile(name: string, construction: CabinetConstruction) {
  const lower = name.toLowerCase()
  const profile = lower.includes('shaker')
    ? 'a clean Shaker profile with balanced, familiar lines'
    : lower.includes('slim')
      ? 'a narrow-frame door profile with a streamlined appearance'
      : lower.includes('charleston')
        ? 'a traditional framed profile with added visual detail'
        : lower.includes('aspen')
          ? 'a versatile framed profile with a composed, transitional look'
          : construction === 'frameless'
            ? 'a flat, full-access profile with a contemporary appearance'
            : 'a framed door profile with a distinctive finish direction'

  const tone = lower.includes('white') || lower.includes('ivory')
    ? 'light counters, natural wood accents, brushed metal, or contrasting dark hardware'
    : lower.includes('black') || lower.includes('charcoal') || lower.includes('midnight')
      ? 'light counters, warm wood accents, simple backsplashes, or mixed-metal hardware'
      : lower.includes('oak') || lower.includes('wood') || lower.includes('saddle') || lower.includes('chest') || lower.includes('espresso')
        ? 'warm neutrals, stone-look counters, matte hardware, or a lighter contrasting cabinet color'
        : lower.includes('green') || lower.includes('sage') || lower.includes('navy')
          ? 'white or cream counters, warm metals, natural wood, or restrained neutral tile'
          : 'light or dark counters, neutral tile, wood accents, and hardware selected during consultation'

  const suits = construction === 'frameless'
    ? 'contemporary, modern, and streamlined kitchens'
    : lower.includes('slim')
      ? 'modern, transitional, and simplified traditional kitchens'
      : 'transitional, traditional, farmhouse-inspired, and updated classic kitchens'

  const colorCharacter = lower.includes('white') || lower.includes('ivory')
    ? 'Its light finish can keep a compact kitchen visually open while allowing wood, tile, or hardware to carry more contrast'
    : lower.includes('black') || lower.includes('charcoal') || lower.includes('midnight')
      ? 'Its deep finish creates strong contrast and usually benefits from a lighter counter, backsplash, or adjacent surface'
      : lower.includes('oak') || lower.includes('wood') || lower.includes('saddle') || lower.includes('chest') || lower.includes('espresso')
        ? 'Its warm finish works naturally with quiet stone looks, restrained metals, and lighter surrounding finishes'
        : lower.includes('green') || lower.includes('sage') || lower.includes('navy')
          ? 'Its colored finish can become the room’s focal point, especially when surrounding materials stay warm and restrained'
          : 'Its neutral finish can bridge warm and cool materials when counters, flooring, and hardware are reviewed together'

  const lightingCharacter = lower.includes('gloss') || lower.includes('glass')
    ? 'Because the surface is reflective, window light and under-cabinet lighting can make glare and surrounding colors more noticeable'
    : lower.includes('black') || lower.includes('charcoal') || lower.includes('midnight') || lower.includes('espresso')
      ? 'Dark finishes absorb more light, so sample placement near work lighting helps confirm that the room will not feel visually heavy'
      : lower.includes('white') || lower.includes('ivory')
        ? 'Light finishes reflect nearby colors, so warm and cool bulbs can noticeably change how the door reads beside the countertop'
        : lower.includes('oak') || lower.includes('wood') || lower.includes('saddle') || lower.includes('chest')
          ? 'Wood tones can look warmer or flatter as daylight changes, making an in-room sample useful before the final selection'
          : 'Morning daylight, evening light, and under-cabinet fixtures can shift the perceived undertone, so compare the sample at more than one time of day'

  return {
    designCharacter: `${name} offers ${profile}.`,
    suits,
    pairingSuggestions: `Consider pairing it with ${tone}. Final colors should be compared with physical samples in the room.`,
    styleNotes: [
      `${name} is a practical fit for ${suits}, particularly when the door profile supports the room’s architecture instead of competing with it.`,
      `${name} has a distinct color direction. ${colorCharacter}, with the final palette checked against fixed flooring and counters.`,
      `Lighting matters with ${name}. ${lightingCharacter}.`,
    ] as const,
  }
}

const framedNames = [
  'Shaker Charcoal',
  'Sage Breeze',
  'Slim Iron Black',
  'Slim Amber Oak',
  'Rustic Wood',
  'Lunar Gray',
  'Double Dove White',
  'Slim Aston Green',
  'Aston Green',
  'Treasure Chest',
  'Iron Black',
  'Shaker Espresso',
  'Slim White Oak',
  'Slim Dove White',
  'Navy Blue',
  'Charleston Saddle',
  'Aspen White',
  'Aspen Charcoal Gray',
  'Shaker Gray',
  'Shaker White',
  'Charleston White',
] as const

const framelessNames = [
  'High Gloss Gray',
  'High Gloss White',
  'Crystal Glass',
  'Matte Black',
  'Midnight Glass',
  'Oak Blonde',
  'Oak Shade',
  'Matte Ivory',
] as const

export const productsCatalog = {
  framed: framedNames.map((name) => cabinet(name, 'framed')),
  frameless: framelessNames.map((name) => cabinet(name, 'frameless')),
}

export const allCabinetProducts = [
  ...productsCatalog.framed,
  ...productsCatalog.frameless,
] as const

export const cabinetProductBySlug = new Map(
  allCabinetProducts.map((product) => [product.id, product])
)

export const cabinetConstruction = {
  framed: [
    'Full-overlay cabinet doors and drawer fronts',
    '3/4-inch solid-wood door components',
    'Six-way adjustable European-style soft-close hinges',
    '3/4-inch cabinet-grade plywood shelving with front-edge banding',
    'Full-extension dovetail drawers with solid-wood sides',
    'Concealed undermount, full-extension soft-close drawer glides',
    '1/2-inch cabinet-grade plywood box',
    'UV-coated natural-plywood interior',
    'Base-cabinet bracket reinforcement',
    'Double-doweled hardwood face-frame joints',
    'Door bumpers',
  ],
  frameless: [
    'European-style frameless doors and drawer fronts',
    '3/4-inch MDF flat doors with melamine finish on all sides',
    '3/4-inch plywood box with white melamine finish',
    'Finished exteriors with wood-color interiors',
    'Dovetail drawers with 5/8-inch solid-wood sides',
    'Concealed undermount, full-extension soft-close drawer glides',
    'DTC European-style soft-close hinges',
  ],
} as const

export const handleCatalog: HandleProduct[] = [
  {
    id: 'handle-01-black-96',
    name: 'Handle 01 — Black — 96 mm',
    image: '/images/products/catalog/handle-01-black-96.webp',
  },
]

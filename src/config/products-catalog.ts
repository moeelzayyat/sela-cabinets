export type CabinetConstruction = 'framed' | 'frameless'

export interface CabinetProduct {
  id: string
  name: string
  construction: CabinetConstruction
  image: string
  designCharacter: string
  suits: string
  pairingSuggestions: string
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

  return {
    designCharacter: `${name} offers ${profile}.`,
    suits,
    pairingSuggestions: `Consider pairing it with ${tone}. Final colors should be compared with physical samples in the room.`,
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

export type CabinetConstruction = 'framed' | 'frameless'

export interface CabinetProduct {
  id: string
  name: string
  construction: CabinetConstruction
  image: string
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
})

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

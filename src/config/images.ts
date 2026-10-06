/**
 * Rights-cleared generic launch imagery used only as style inspiration.
 * Replace with customer-approved SELA photography as projects are completed.
 */

const inspirationImages = {
  bright: '/images/hero/kitchen-1600.webp',
  warm: '/images/hero/kitchen-960.webp',
  neutral: '/images/hero/kitchen-1600.webp',
  compact: '/images/hero/kitchen-960.webp',
} as const

export const heroImages = {
  main: {
    src: inspirationImages.bright,
    alt: 'Bright kitchen shown as cabinet inspiration, not a completed SELA project',
  },
} as const

export const serviceImages = {
  'cabinet-supply': {
    src: inspirationImages.warm,
    alt: 'Kitchen inspiration for comparing cabinet finishes',
  },
  installation: {
    src: inspirationImages.neutral,
    alt: 'Kitchen inspiration for discussing cabinet installation',
  },
  measurement: {
    src: inspirationImages.compact,
    alt: 'Kitchen inspiration for discussing cabinet measurements',
  },
  'design-help': {
    src: inspirationImages.bright,
    alt: 'Kitchen inspiration for cabinet layout guidance',
  },
} as const

export const styleImages = {
  shaker: {
    src: inspirationImages.bright,
    alt: 'Kitchen inspiration with a shaker-style look',
  },
  'flat-panel': {
    src: inspirationImages.neutral,
    alt: 'Kitchen inspiration with a streamlined cabinet look',
  },
  'raised-panel': {
    src: inspirationImages.warm,
    alt: 'Kitchen inspiration with a traditional cabinet look',
  },
  beadboard: {
    src: inspirationImages.compact,
    alt: 'Kitchen inspiration with a textured cabinet look',
  },
  'glass-front': {
    src: inspirationImages.neutral,
    alt: 'Kitchen inspiration with display-storage details',
  },
} as const

export const galleryImages = [
  {
    id: 1,
    src: '/images/products/catalog/shaker-white.webp',
    alt: 'Shaker White cabinet style shown for kitchen inspiration',
    title: 'Shaker White',
    style: 'Shaker',
    finish: 'White',
  },
  {
    id: 2,
    src: '/images/products/catalog/shaker-charcoal.webp',
    alt: 'Shaker Charcoal cabinet style shown for kitchen inspiration',
    title: 'Shaker Charcoal',
    style: 'Shaker',
    finish: 'Charcoal',
  },
  {
    id: 3,
    src: '/images/products/catalog/slim-white-oak.webp',
    alt: 'Slim White Oak cabinet style shown for kitchen inspiration',
    title: 'Slim White Oak',
    style: 'Slim profile',
    finish: 'White oak',
  },
  {
    id: 4,
    src: '/images/products/catalog/slim-aston-green.webp',
    alt: 'Slim Aston Green cabinet style shown for kitchen inspiration',
    title: 'Slim Aston Green',
    style: 'Slim profile',
    finish: 'Aston green',
  },
  {
    id: 5,
    src: '/images/products/catalog/high-gloss-white.webp',
    alt: 'High Gloss White frameless cabinet style shown for kitchen inspiration',
    title: 'High Gloss White',
    style: 'Frameless',
    finish: 'High-gloss white',
  },
  {
    id: 6,
    src: '/images/products/catalog/high-gloss-gray.webp',
    alt: 'High Gloss Gray frameless cabinet style shown for kitchen inspiration',
    title: 'High Gloss Gray',
    style: 'Frameless',
    finish: 'High-gloss gray',
  },
] as const

export const aboutImages = {
  team: {
    src: inspirationImages.bright,
    alt: 'Generic kitchen inspiration; not represented as a SELA project or team photo',
  },
  workshop: {
    src: inspirationImages.warm,
    alt: 'Generic kitchen inspiration; not represented as a SELA showroom',
  },
} as const

export const estimateImages = {
  banner: {
    src: inspirationImages.bright,
    alt: 'Generic kitchen inspiration for planning an estimate',
  },
} as const

export const homeGalleryPreview = galleryImages.slice(0, 6)

export type GalleryImage = (typeof galleryImages)[number]
export type ServiceImageKey = keyof typeof serviceImages
export type StyleImageKey = keyof typeof styleImages

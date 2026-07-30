/**
 * Generic launch imagery used only as style inspiration.
 * Replace with rights-cleared SELA photography when available.
 */

const inspirationImages = {
  bright:
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&h=1080&q=80',
  warm:
    'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1200&h=900&q=80',
  neutral:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&h=900&q=80',
  compact:
    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&h=900&q=80',
} as const

export const heroImages = {
  main: {
    src: inspirationImages.bright,
    alt: 'Bright kitchen shown as cabinet-planning inspiration',
  },
} as const

export const serviceImages = {
  'cabinet-supply': {
    src: inspirationImages.warm,
    alt: 'Kitchen inspiration for comparing cabinet finishes',
  },
  installation: {
    src: inspirationImages.neutral,
    alt: 'Kitchen inspiration for discussing installation planning',
  },
  measurement: {
    src: inspirationImages.compact,
    alt: 'Kitchen inspiration for discussing cabinet measurements',
  },
  'design-help': {
    src: inspirationImages.bright,
    alt: 'Kitchen inspiration for cabinet layout planning',
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
    src: inspirationImages.bright,
    alt: 'Kitchen inspiration with a bright cabinet palette',
    title: 'Bright Kitchen Direction',
    style: 'Clean-lined',
    finish: 'Light neutral',
  },
  {
    id: 2,
    src: inspirationImages.warm,
    alt: 'Kitchen inspiration with a warm cabinet palette',
    title: 'Warm Kitchen Direction',
    style: 'Transitional',
    finish: 'Warm neutral',
  },
  {
    id: 3,
    src: inspirationImages.neutral,
    alt: 'Kitchen inspiration with a modern cabinet palette',
    title: 'Modern Kitchen Direction',
    style: 'Streamlined',
    finish: 'Neutral',
  },
  {
    id: 4,
    src: inspirationImages.compact,
    alt: 'Kitchen inspiration for a practical cabinet layout',
    title: 'Practical Layout Direction',
    style: 'Functional',
    finish: 'Light',
  },
  {
    id: 5,
    src: inspirationImages.bright,
    alt: 'Kitchen inspiration for a light cabinet layout',
    title: 'Light Layout Direction',
    style: 'Open',
    finish: 'Bright neutral',
  },
  {
    id: 6,
    src: inspirationImages.warm,
    alt: 'Kitchen inspiration for a welcoming cabinet layout',
    title: 'Welcoming Layout Direction',
    style: 'Layered',
    finish: 'Warm',
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

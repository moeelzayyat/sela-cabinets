/**
 * SELA Cabinets image configuration.
 *
 * When real SELA project photography is available, replace these URLs with
 * local assets in /public/images/ and keep the same aspect ratios.
 */

import { productsCatalog } from './products-catalog'

export const heroImages = {
  main: {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&h=1080&q=80',
    alt: 'Modern white kitchen cabinets with marble countertops in Detroit home',
  },
} as const

export const serviceImages = {
  'cabinet-supply': {
    src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Premium kitchen cabinets with various finishes available in Detroit',
  },
  installation: {
    src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Professional cabinet installation in progress in Metro Detroit kitchen',
  },
  measurement: {
    src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Kitchen space ready for professional cabinet measurement in Detroit home',
  },
  'design-help': {
    src: productsCatalog.framed[2].image,
    alt: 'White shaker kitchen cabinet layout for design planning',
  },
} as const

export const styleImages = {
  shaker: {
    src: productsCatalog.framed[2].image,
    alt: 'White shaker style kitchen cabinets',
  },
  'flat-panel': {
    src: productsCatalog.frameless[1].image,
    alt: 'Modern flat panel cabinet doors with a sleek white finish',
  },
  'raised-panel': {
    src: productsCatalog.framed[1].image,
    alt: 'Traditional raised panel kitchen cabinets in a bright white finish',
  },
  beadboard: {
    src: productsCatalog.framed[5].image,
    alt: 'Textured white cabinet style for a bright kitchen',
  },
  'glass-front': {
    src: productsCatalog.frameless[2].image,
    alt: 'Glass front cabinet doors for display storage',
  },
} as const

export const galleryImages = [
  {
    id: 1,
    src: productsCatalog.framed[2].image,
    alt: 'Shaker White cabinet style for bright Detroit kitchen projects',
    title: 'Bright Shaker Kitchen',
    location: 'Royal Oak, MI',
    style: 'Shaker',
    finish: 'Bright White',
  },
  {
    id: 2,
    src: productsCatalog.framed[3].image,
    alt: 'Shaker Gray cabinet style for a transitional kitchen',
    title: 'Transitional Gray Kitchen',
    location: 'Farmington Hills, MI',
    style: 'Shaker',
    finish: 'Dove Gray',
  },
  {
    id: 3,
    src: productsCatalog.framed[9].image,
    alt: 'Slim White Oak cabinet style with natural wood finish',
    title: 'Natural Oak Kitchen',
    location: 'Livonia, MI',
    style: 'Slim Shaker',
    finish: 'White Oak',
  },
  {
    id: 4,
    src: productsCatalog.framed[7].image,
    alt: 'Navy Blue shaker cabinet style for a statement kitchen',
    title: 'Contemporary Navy Kitchen',
    location: 'Ann Arbor, MI',
    style: 'Shaker',
    finish: 'Navy Blue',
  },
  {
    id: 5,
    src: productsCatalog.framed[1].image,
    alt: 'Charleston White raised panel cabinets for a classic kitchen',
    title: 'Classic White Kitchen',
    location: 'Canton, MI',
    style: 'Raised Panel',
    finish: 'Charleston White',
  },
  {
    id: 6,
    src: productsCatalog.framed[0].image,
    alt: 'Shaker Espresso cabinets with a rich dark finish',
    title: 'Elegant Espresso Kitchen',
    location: 'Troy, MI',
    style: 'Shaker',
    finish: 'Espresso',
  },
  {
    id: 7,
    src: productsCatalog.framed[5].image,
    alt: 'Aspen White cabinets with a subtle textured finish',
    title: 'Textured White Kitchen',
    location: 'Novi, MI',
    style: 'Textured',
    finish: 'Aspen White',
  },
  {
    id: 8,
    src: productsCatalog.framed[4].image,
    alt: 'Aspen Charcoal Gray cabinets for a modern kitchen',
    title: 'Modern Charcoal Kitchen',
    location: 'Sterling Heights, MI',
    style: 'Textured',
    finish: 'Charcoal Gray',
  },
  {
    id: 9,
    src: productsCatalog.frameless[1].image,
    alt: 'High Gloss White frameless cabinets for a modern kitchen',
    title: 'Modern Gloss Kitchen',
    location: 'Dearborn, MI',
    style: 'Frameless',
    finish: 'High Gloss White',
  },
  {
    id: 10,
    src: productsCatalog.frameless[3].image,
    alt: 'Matt Black frameless cabinets for a luxury kitchen',
    title: 'Luxury Dark Kitchen',
    location: 'Bloomfield Hills, MI',
    style: 'Frameless',
    finish: 'Matt Black',
  },
  {
    id: 11,
    src: productsCatalog.frameless[5].image,
    alt: 'Oak Blonde frameless cabinets with light natural wood tone',
    title: 'Light Oak Kitchen',
    location: 'Grosse Pointe, MI',
    style: 'Frameless',
    finish: 'Oak Blonde',
  },
  {
    id: 12,
    src: productsCatalog.frameless[7].image,
    alt: 'Matt Ivory frameless cabinets with a warm neutral finish',
    title: 'Warm Ivory Kitchen',
    location: 'Plymouth, MI',
    style: 'Frameless',
    finish: 'Matt Ivory',
  },
] as const

export const aboutImages = {
  team: {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'SELA Cabinets team - professional cabinet installers serving Detroit',
  },
  workshop: {
    src: productsCatalog.framed[1].image,
    alt: 'Kitchen cabinet showroom and workspace in Detroit, Michigan',
  },
} as const

export const estimateImages = {
  banner: {
    src: productsCatalog.framed[2].image,
    alt: 'Beautiful kitchen cabinets ready for your Detroit home renovation',
  },
} as const

export const homeGalleryPreview = galleryImages.slice(0, 6)

export type GalleryImage = (typeof galleryImages)[number]
export type ServiceImageKey = keyof typeof serviceImages
export type StyleImageKey = keyof typeof styleImages

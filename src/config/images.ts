/**
 * SELA Cabinets - Placeholder Images Configuration
 * =================================================
 * TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
 * 
 * All placeholder images are from Unsplash (royalty-free).
 * To replace with real photos:
 * 1. Upload real photos to /public/images/
 * 2. Update the URLs below to point to local files
 * 
 * Image aspect ratios:
 * - Hero: 16:9
 * - Product/Style cards: 1:1 or 4:3
 * - Gallery: 4:3 (masonry)
 * - Service sections: 3:2 or 4:3
 */

// ============================================
// HERO IMAGES (16:9 aspect ratio)
// ============================================
export const heroImages = {
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
  main: {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&h=1080&q=80',
    alt: 'Modern white kitchen cabinets with marble countertops in Detroit home',
  },
} as const

// ============================================
// SERVICE IMAGES (3:2 / 4:3 aspect ratio)
// ============================================
export const serviceImages = {
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
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
    src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Modern kitchen design with custom cabinet layout in Michigan home',
  },
} as const

// ============================================
// CABINET STYLE IMAGES (4:3 aspect ratio)
// ============================================
export const styleImages = {
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
  shaker: {
    src: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=600&h=450&q=80',
    alt: 'White shaker style kitchen cabinets installed in Detroit area home',
  },
  'flat-panel': {
    src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=600&h=450&q=80',
    alt: 'Modern flat panel cabinet doors with sleek hardware in contemporary kitchen',
  },
  'raised-panel': {
    src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&h=450&q=80',
    alt: 'Traditional raised panel kitchen cabinets with elegant wood finish',
  },
  beadboard: {
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&h=450&q=80',
    alt: 'Farmhouse beadboard cabinet style in bright white finish',
  },
  'glass-front': {
    src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&h=450&q=80',
    alt: 'Glass front cabinet doors displaying fine dishware in Detroit kitchen',
  },
} as const

// ============================================
// GALLERY IMAGES (4:3 aspect ratio for masonry)
// ============================================
export const galleryImages = [
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Modern white shaker kitchen cabinets installed in Royal Oak, Michigan',
    title: 'Modern White Kitchen',
    location: 'Royal Oak, MI',
    style: 'Shaker',
    finish: 'Bright White',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Transitional gray kitchen cabinets in Farmington Hills home',
    title: 'Transitional Gray Kitchen',
    location: 'Farmington Hills, MI',
    style: 'Shaker',
    finish: 'Dove Gray',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Classic oak kitchen cabinets with warm wood tones in Livonia',
    title: 'Classic Oak Kitchen',
    location: 'Livonia, MI',
    style: 'Raised Panel',
    finish: 'Natural Oak',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Contemporary navy blue kitchen cabinets in Ann Arbor residence',
    title: 'Contemporary Navy Kitchen',
    location: 'Ann Arbor, MI',
    style: 'Flat Panel',
    finish: 'Navy Blue',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Farmhouse style white cabinets with beadboard detail in Canton',
    title: 'Farmhouse Style Kitchen',
    location: 'Canton, MI',
    style: 'Beadboard',
    finish: 'Antique White',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Elegant walnut kitchen cabinets with brass hardware in Troy',
    title: 'Elegant Walnut Kitchen',
    location: 'Troy, MI',
    style: 'Shaker',
    finish: 'Rich Walnut',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Bright airy kitchen with white cabinets and natural light in Novi',
    title: 'Bright & Airy Kitchen',
    location: 'Novi, MI',
    style: 'Shaker',
    finish: 'Bright White',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Modern espresso kitchen cabinets in Sterling Heights home',
    title: 'Modern Espresso Kitchen',
    location: 'Sterling Heights, MI',
    style: 'Flat Panel',
    finish: 'Espresso',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Two-tone kitchen with white and gray cabinets in Dearborn',
    title: 'Two-Tone Kitchen Design',
    location: 'Dearborn, MI',
    style: 'Shaker',
    finish: 'White & Gray',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Luxurious kitchen with dark cabinets and gold accents in Bloomfield Hills',
    title: 'Luxury Dark Kitchen',
    location: 'Bloomfield Hills, MI',
    style: 'Shaker',
    finish: 'Matte Black',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Coastal inspired white kitchen cabinets with blue accents in Grosse Pointe',
    title: 'Coastal White Kitchen',
    location: 'Grosse Pointe, MI',
    style: 'Shaker',
    finish: 'Bright White',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Traditional kitchen renovation with cream cabinets in Plymouth',
    title: 'Traditional Cream Kitchen',
    location: 'Plymouth, MI',
    style: 'Raised Panel',
    finish: 'Antique White',
  },
] as const

// ============================================
// ABOUT PAGE IMAGES
// ============================================
export const aboutImages = {
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
  team: {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'SELA Cabinets team - professional cabinet installers serving Detroit',
  },
  workshop: {
    src: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Kitchen cabinet showroom and workspace in Detroit, Michigan',
  },
} as const

// ============================================
// ESTIMATE PAGE IMAGES
// ============================================
export const estimateImages = {
  // TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
  banner: {
    src: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=800&h=600&q=80',
    alt: 'Beautiful kitchen cabinets ready for your Detroit home renovation',
  },
} as const

// ============================================
// HOME PAGE GALLERY PREVIEW (subset of gallery)
// ============================================
export const homeGalleryPreview = galleryImages.slice(0, 6)

// ============================================
// TYPE EXPORTS
// ============================================
export type GalleryImage = (typeof galleryImages)[number]
export type ServiceImageKey = keyof typeof serviceImages
export type StyleImageKey = keyof typeof styleImages

/**
 * Aline Cabinet Products Catalog with Images
 * Based on Aline Cabinets product listings
 */

export interface AlineProduct {
  id: string
  name: string
  description: string
  tags: string[]
  isNew?: boolean
  construction: 'framed' | 'frameless'
  image: string
}

// Unsplash cabinet images by style/color
const cabinetImages = {
  // White cabinets
  whiteShaker: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=600&q=80',
  whiteRaised: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&h=600&q=80',
  whiteModern: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&h=600&q=80',
  whiteTextured: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&h=600&q=80',
  
  // Gray cabinets
  grayShaker: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=800&h=600&q=80',
  grayCharcoal: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=800&h=600&q=80',
  grayModern: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&h=600&q=80',
  
  // Dark cabinets
  espresso: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&h=600&q=80',
  navy: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&h=600&q=80',
  black: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&h=600&q=80',
  matteBlack: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=600&q=80',
  
  // Wood tones
  oakNatural: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&h=600&q=80',
  oakLight: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&h=600&q=80',
  oakDark: 'https://images.unsplash.com/photo-1600573472591-ee6c563aaec4?auto=format&fit=crop&w=800&h=600&q=80',
  walnut: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&h=600&q=80',
  chestnut: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&h=600&q=80',
  saddle: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=800&h=600&q=80',
  
  // Specialty
  highGloss: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&h=600&q=80',
  glassFront: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=800&h=600&q=80',
  green: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&h=600&q=80',
  ivory: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=800&h=600&q=80',
}

export const alineProducts = {
  framed: [
    {
      id: 'shaker-espresso',
      name: 'Shaker Espresso',
      description: 'Rich, deep brown finish on classic shaker-style doors. Warm and sophisticated for traditional kitchens.',
      tags: ['Shaker', 'Dark', 'Traditional'],
      construction: 'framed',
      image: cabinetImages.espresso,
    },
    {
      id: 'charleston-white',
      name: 'Charleston White',
      description: 'Elegant raised-panel design in bright white. Timeless appeal with detailed craftsmanship.',
      tags: ['Raised Panel', 'White', 'Classic'],
      construction: 'framed',
      image: cabinetImages.whiteRaised,
    },
    {
      id: 'shaker-white',
      name: 'Shaker White',
      description: 'Clean, bright white shaker doors. The most popular choice for modern and transitional kitchens.',
      tags: ['Shaker', 'White', 'Popular'],
      construction: 'framed',
      image: cabinetImages.whiteShaker,
    },
    {
      id: 'shaker-gray',
      name: 'Shaker Gray',
      description: 'Sophisticated gray shaker doors. Neutral tone that pairs beautifully with any countertop.',
      tags: ['Shaker', 'Gray', 'Versatile'],
      construction: 'framed',
      image: cabinetImages.grayShaker,
    },
    {
      id: 'aspen-charcoal-gray',
      name: 'Aspen Charcoal Gray',
      description: 'Deep charcoal finish with subtle wood grain texture. Bold and contemporary.',
      tags: ['Textured', 'Gray', 'Modern'],
      construction: 'framed',
      image: cabinetImages.grayCharcoal,
    },
    {
      id: 'aspen-white',
      name: 'Aspen White',
      description: 'Bright white with a subtle textured finish. Adds depth and interest to clean designs.',
      tags: ['Textured', 'White', 'Modern'],
      construction: 'framed',
      image: cabinetImages.whiteTextured,
    },
    {
      id: 'charleston-saddle',
      name: 'Charleston Saddle',
      description: 'Warm medium-brown wood tone with raised panel detail. Classic elegance.',
      tags: ['Raised Panel', 'Wood Tone', 'Traditional'],
      construction: 'framed',
      image: cabinetImages.saddle,
    },
    {
      id: 'navy-blue',
      name: 'Navy Blue',
      description: 'Bold navy blue shaker doors. Make a statement with this rich, deep color.',
      tags: ['Shaker', 'Blue', 'Statement'],
      construction: 'framed',
      image: cabinetImages.navy,
    },
    {
      id: 'slim-dove-white',
      name: 'Slim Dove White',
      description: 'Slender shaker profile in soft white. Minimalist design for contemporary spaces.',
      tags: ['Slim Shaker', 'White', 'Contemporary'],
      construction: 'framed',
      image: cabinetImages.whiteModern,
    },
    {
      id: 'slim-white-oak',
      name: 'Slim White Oak',
      description: 'Natural white oak with slim shaker profile. Scandinavian-inspired beauty.',
      tags: ['Slim Shaker', 'Oak', 'Natural'],
      isNew: true,
      construction: 'framed',
      image: cabinetImages.oakLight,
    },
    {
      id: 'shaker-charcoal',
      name: 'Shaker Charcoal',
      description: 'Deep charcoal shaker doors. Modern, dramatic, and endlessly versatile.',
      tags: ['Shaker', 'Charcoal', 'Modern'],
      construction: 'framed',
      image: cabinetImages.grayCharcoal,
    },
    {
      id: 'iron-black',
      name: 'Iron Black',
      description: 'Bold matte black shaker doors. Ultra-modern with serious visual impact.',
      tags: ['Shaker', 'Black', 'Bold'],
      construction: 'framed',
      image: cabinetImages.black,
    },
    {
      id: 'treasure-chest',
      name: 'Treasure Chest',
      description: 'Warm natural oak with traditional styling. Brings organic warmth to any kitchen.',
      tags: ['Oak', 'Natural', 'Warm'],
      isNew: true,
      construction: 'framed',
      image: cabinetImages.chestnut,
    },
    {
      id: 'aston-green',
      name: 'Aston Green',
      description: 'Rich forest green in a slim profile. On-trend color for design-forward kitchens.',
      tags: ['Slim Shaker', 'Green', 'Trending'],
      isNew: true,
      construction: 'framed',
      image: cabinetImages.green,
    },
    {
      id: 'slim-aston-green',
      name: 'Slim Aston Green',
      description: 'Elegant green with slender shaker detail. Sophisticated alternative to neutral.',
      tags: ['Slim Shaker', 'Green', 'Elegant'],
      isNew: true,
      construction: 'framed',
      image: cabinetImages.green,
    },
    {
      id: 'double-dove-white',
      name: 'Double Dove White',
      description: 'Double-step shaker profile in soft white. Extra detail for refined taste.',
      tags: ['Double Shaker', 'White', 'Refined'],
      construction: 'framed',
      image: cabinetImages.whiteModern,
    },
  ] as AlineProduct[],

  frameless: [
    {
      id: 'high-gloss-gray',
      name: 'High Gloss Gray',
      description: 'Sleek high-gloss finish in sophisticated gray. Ultra-modern and reflective.',
      tags: ['High Gloss', 'Gray', 'Modern'],
      construction: 'frameless',
      image: cabinetImages.highGloss,
    },
    {
      id: 'high-gloss-white',
      name: 'High Gloss White',
      description: 'Brilliant white high-gloss doors. Clean, bright, and contemporary.',
      tags: ['High Gloss', 'White', 'Contemporary'],
      construction: 'frameless',
      image: cabinetImages.highGloss,
    },
    {
      id: 'crystal-glass',
      name: 'Crystal Glass',
      description: 'Elegant glass-front cabinets with black framing. Showcase your dishes in style.',
      tags: ['Glass', 'Display', 'Elegant'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.glassFront,
    },
    {
      id: 'matt-black',
      name: 'Matt Black',
      description: 'Sophisticated matte black finish. Modern luxury with a soft touch.',
      tags: ['Matte', 'Black', 'Luxury'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.matteBlack,
    },
    {
      id: 'midnight-glass',
      name: 'Midnight Glass',
      description: 'Dramatic glass cabinets with dark frames. Perfect for display and ambiance.',
      tags: ['Glass', 'Display', 'Dramatic'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.glassFront,
    },
    {
      id: 'oak-blonde',
      name: 'Oak Blonde',
      description: 'Light natural oak with modern frameless construction. Scandinavian minimalism.',
      tags: ['Oak', 'Natural', 'Light'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.oakLight,
    },
    {
      id: 'oak-shade',
      name: 'Oak Shade',
      description: 'Darker oak tone with rich wood grain. Natural beauty meets modern design.',
      tags: ['Oak', 'Natural', 'Rich'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.oakDark,
    },
    {
      id: 'matt-ivory',
      name: 'Matt Ivory',
      description: 'Soft ivory with matte finish. Warm, welcoming, and perfectly understated.',
      tags: ['Matte', 'Ivory', 'Warm'],
      isNew: true,
      construction: 'frameless',
      image: cabinetImages.ivory,
    },
  ] as AlineProduct[],
}

export type AlineProductId = typeof alineProducts.framed[number]['id'] | typeof alineProducts.frameless[number]['id']

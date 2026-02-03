/**
 * Aline Cabinet Products Catalog
 * Based on Aline Cabinets product listings
 */

export interface AlineProduct {
  id: string
  name: string
  description: string
  tags: string[]
  isNew?: boolean
  construction: 'framed' | 'frameless'
}

export const alineProducts = {
  framed: [
    {
      id: 'shaker-espresso',
      name: 'Shaker Espresso',
      description: 'Rich, deep brown finish on classic shaker-style doors. Warm and sophisticated for traditional kitchens.',
      tags: ['Shaker', 'Dark', 'Traditional'],
      construction: 'framed',
    },
    {
      id: 'charleston-white',
      name: 'Charleston White',
      description: 'Elegant raised-panel design in bright white. Timeless appeal with detailed craftsmanship.',
      tags: ['Raised Panel', 'White', 'Classic'],
      construction: 'framed',
    },
    {
      id: 'shaker-white',
      name: 'Shaker White',
      description: 'Clean, bright white shaker doors. The most popular choice for modern and transitional kitchens.',
      tags: ['Shaker', 'White', 'Popular'],
      construction: 'framed',
    },
    {
      id: 'shaker-gray',
      name: 'Shaker Gray',
      description: 'Sophisticated gray shaker doors. Neutral tone that pairs beautifully with any countertop.',
      tags: ['Shaker', 'Gray', 'Versatile'],
      construction: 'framed',
    },
    {
      id: 'aspen-charcoal-gray',
      name: 'Aspen Charcoal Gray',
      description: 'Deep charcoal finish with subtle wood grain texture. Bold and contemporary.',
      tags: ['Textured', 'Gray', 'Modern'],
      construction: 'framed',
    },
    {
      id: 'aspen-white',
      name: 'Aspen White',
      description: 'Bright white with a subtle textured finish. Adds depth and interest to clean designs.',
      tags: ['Textured', 'White', 'Modern'],
      construction: 'framed',
    },
    {
      id: 'charleston-saddle',
      name: 'Charleston Saddle',
      description: 'Warm medium-brown wood tone with raised panel detail. Classic elegance.',
      tags: ['Raised Panel', 'Wood Tone', 'Traditional'],
      construction: 'framed',
    },
    {
      id: 'navy-blue',
      name: 'Navy Blue',
      description: 'Bold navy blue shaker doors. Make a statement with this rich, deep color.',
      tags: ['Shaker', 'Blue', 'Statement'],
      construction: 'framed',
    },
    {
      id: 'slim-dove-white',
      name: 'Slim Dove White',
      description: 'Slender shaker profile in soft white. Minimalist design for contemporary spaces.',
      tags: ['Slim Shaker', 'White', 'Contemporary'],
      construction: 'framed',
    },
    {
      id: 'slim-white-oak',
      name: 'Slim White Oak',
      description: 'Natural white oak with slim shaker profile. Scandinavian-inspired beauty.',
      tags: ['Slim Shaker', 'Oak', 'Natural'],
      isNew: true,
      construction: 'framed',
    },
    {
      id: 'shaker-charcoal',
      name: 'Shaker Charcoal',
      description: 'Deep charcoal shaker doors. Modern, dramatic, and endlessly versatile.',
      tags: ['Shaker', 'Charcoal', 'Modern'],
      construction: 'framed',
    },
    {
      id: 'iron-black',
      name: 'Iron Black',
      description: 'Bold matte black shaker doors. Ultra-modern with serious visual impact.',
      tags: ['Shaker', 'Black', 'Bold'],
      construction: 'framed',
    },
    {
      id: 'treasure-chest',
      name: 'Treasure Chest',
      description: 'Warm natural oak with traditional styling. Brings organic warmth to any kitchen.',
      tags: ['Oak', 'Natural', 'Warm'],
      isNew: true,
      construction: 'framed',
    },
    {
      id: 'aston-green',
      name: 'Aston Green',
      description: 'Rich forest green in a slim profile. On-trend color for design-forward kitchens.',
      tags: ['Slim Shaker', 'Green', 'Trending'],
      isNew: true,
      construction: 'framed',
    },
    {
      id: 'slim-aston-green',
      name: 'Slim Aston Green',
      description: 'Elegant green with slender shaker detail. Sophisticated alternative to neutral.',
      tags: ['Slim Shaker', 'Green', 'Elegant'],
      isNew: true,
      construction: 'framed',
    },
    {
      id: 'double-dove-white',
      name: 'Double Dove White',
      description: 'Double-step shaker profile in soft white. Extra detail for refined taste.',
      tags: ['Double Shaker', 'White', 'Refined'],
      construction: 'framed',
    },
  ] as AlineProduct[],

  frameless: [
    {
      id: 'high-gloss-gray',
      name: 'High Gloss Gray',
      description: 'Sleek high-gloss finish in sophisticated gray. Ultra-modern and reflective.',
      tags: ['High Gloss', 'Gray', 'Modern'],
      construction: 'frameless',
    },
    {
      id: 'high-gloss-white',
      name: 'High Gloss White',
      description: 'Brilliant white high-gloss doors. Clean, bright, and contemporary.',
      tags: ['High Gloss', 'White', 'Contemporary'],
      construction: 'frameless',
    },
    {
      id: 'crystal-glass',
      name: 'Crystal Glass',
      description: 'Elegant glass-front cabinets with black framing. Showcase your dishes in style.',
      tags: ['Glass', 'Display', 'Elegant'],
      isNew: true,
      construction: 'frameless',
    },
    {
      id: 'matt-black',
      name: 'Matt Black',
      description: 'Sophisticated matte black finish. Modern luxury with a soft touch.',
      tags: ['Matte', 'Black', 'Luxury'],
      isNew: true,
      construction: 'frameless',
    },
    {
      id: 'midnight-glass',
      name: 'Midnight Glass',
      description: 'Dramatic glass cabinets with dark frames. Perfect for display and ambiance.',
      tags: ['Glass', 'Display', 'Dramatic'],
      isNew: true,
      construction: 'frameless',
    },
    {
      id: 'oak-blonde',
      name: 'Oak Blonde',
      description: 'Light natural oak with modern frameless construction. Scandinavian minimalism.',
      tags: ['Oak', 'Natural', 'Light'],
      isNew: true,
      construction: 'frameless',
    },
    {
      id: 'oak-shade',
      name: 'Oak Shade',
      description: 'Darker oak tone with rich wood grain. Natural beauty meets modern design.',
      tags: ['Oak', 'Natural', 'Rich'],
      isNew: true,
      construction: 'frameless',
    },
    {
      id: 'matt-ivory',
      name: 'Matt Ivory',
      description: 'Soft ivory with matte finish. Warm, welcoming, and perfectly understated.',
      tags: ['Matte', 'Ivory', 'Warm'],
      isNew: true,
      construction: 'frameless',
    },
  ] as AlineProduct[],
}

export type AlineProductId = typeof alineProducts.framed[number]['id'] | typeof alineProducts.frameless[number]['id']

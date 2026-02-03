/**
 * Aline Cabinet Products Catalog with Images
 * Based on Aline Cabinets product listings
 * Images sourced from https://shop.alinecabinets.com/
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

// Aline cabinet images from their official website
const alineImages = {
  // Framed Cabinets
  shakerEspresso: 'https://shop.alinecabinets.com/media/catalog/category/009a_1-min.jpg',
  charlestonWhite: 'https://shop.alinecabinets.com/media/catalog/category/012a_1-min.jpg',
  shakerWhite: 'https://shop.alinecabinets.com/media/catalog/category/010a_1-min_1.jpg',
  shakerGray: 'https://shop.alinecabinets.com/media/catalog/category/011a_2-min.jpg',
  aspenCharcoalGray: 'https://shop.alinecabinets.com/media/catalog/category/Aspen_Charcoal_Gray-min_2.jpg',
  aspenWhite: 'https://shop.alinecabinets.com/media/catalog/category/AW2_2.jpg',
  charlestonSaddle: 'https://shop.alinecabinets.com/media/catalog/category/0_Charleston_Seddle-min_1.jpg',
  navyBlue: 'https://shop.alinecabinets.com/media/catalog/category/Navy_Blue.jpg',
  slimDoveWhite: 'https://shop.alinecabinets.com/media/catalog/category/SDW_2_3.jpg',
  slimWhiteOak: 'https://shop.alinecabinets.com/media/catalog/category/SWO_4.jpg',
  shakerCharcoal: 'https://shop.alinecabinets.com/media/catalog/category/SC.jpg',
  ironBlack: 'https://shop.alinecabinets.com/media/catalog/category/IB1.png',
  treasureChest: 'https://shop.alinecabinets.com/media/catalog/category/TC1.png',
  astonGreen: 'https://shop.alinecabinets.com/media/catalog/category/AG1.png',
  slimAstonGreen: 'https://shop.alinecabinets.com/media/catalog/category/SAG1_1.png',
  doubleDoveWhite: 'https://shop.alinecabinets.com/media/catalog/category/DDW1_1.png',

  // Frameless Cabinets
  highGlossGray: 'https://shop.alinecabinets.com/media/catalog/category/HG_3.jpg',
  highGlossWhite: 'https://shop.alinecabinets.com/media/catalog/category/HW_Horizental.jpg',
  crystalGlass: 'https://shop.alinecabinets.com/media/catalog/category/CG_2.jpg',
  mattBlack: 'https://shop.alinecabinets.com/media/catalog/category/MB_2.jpg',
  midnightGlass: 'https://shop.alinecabinets.com/media/catalog/category/MG_2.jpg',
  oakBlonde: 'https://shop.alinecabinets.com/media/catalog/category/OB_2.jpg',
  oakShade: 'https://shop.alinecabinets.com/media/catalog/category/OS_2.jpg',
  mattIvory: 'https://shop.alinecabinets.com/media/catalog/category/MI_2.jpg',
}

export const alineProducts = {
  framed: [
    {
      id: 'shaker-espresso',
      name: 'Shaker Espresso',
      description: 'Rich, deep brown finish on classic shaker-style doors. Warm and sophisticated for traditional kitchens.',
      tags: ['Shaker', 'Dark', 'Traditional'],
      construction: 'framed',
      image: alineImages.shakerEspresso,
    },
    {
      id: 'charleston-white',
      name: 'Charleston White',
      description: 'Elegant raised-panel design in bright white. Timeless appeal with detailed craftsmanship.',
      tags: ['Raised Panel', 'White', 'Classic'],
      construction: 'framed',
      image: alineImages.charlestonWhite,
    },
    {
      id: 'shaker-white',
      name: 'Shaker White',
      description: 'Clean, bright white shaker doors. The most popular choice for modern and transitional kitchens.',
      tags: ['Shaker', 'White', 'Popular'],
      construction: 'framed',
      image: alineImages.shakerWhite,
    },
    {
      id: 'shaker-gray',
      name: 'Shaker Gray',
      description: 'Sophisticated gray shaker doors. Neutral tone that pairs beautifully with any countertop.',
      tags: ['Shaker', 'Gray', 'Versatile'],
      construction: 'framed',
      image: alineImages.shakerGray,
    },
    {
      id: 'aspen-charcoal-gray',
      name: 'Aspen Charcoal Gray',
      description: 'Deep charcoal finish with subtle wood grain texture. Bold and contemporary.',
      tags: ['Textured', 'Gray', 'Modern'],
      construction: 'framed',
      image: alineImages.aspenCharcoalGray,
    },
    {
      id: 'aspen-white',
      name: 'Aspen White',
      description: 'Bright white with a subtle textured finish. Adds depth and interest to clean designs.',
      tags: ['Textured', 'White', 'Modern'],
      construction: 'framed',
      image: alineImages.aspenWhite,
    },
    {
      id: 'charleston-saddle',
      name: 'Charleston Saddle',
      description: 'Warm medium-brown wood tone with raised panel detail. Classic elegance.',
      tags: ['Raised Panel', 'Wood Tone', 'Traditional'],
      construction: 'framed',
      image: alineImages.charlestonSaddle,
    },
    {
      id: 'navy-blue',
      name: 'Navy Blue',
      description: 'Bold navy blue shaker doors. Make a statement with this rich, deep color.',
      tags: ['Shaker', 'Blue', 'Statement'],
      construction: 'framed',
      image: alineImages.navyBlue,
    },
    {
      id: 'slim-dove-white',
      name: 'Slim Dove White',
      description: 'Slender shaker profile in soft white. Minimalist design for contemporary spaces.',
      tags: ['Slim Shaker', 'White', 'Contemporary'],
      construction: 'framed',
      image: alineImages.slimDoveWhite,
    },
    {
      id: 'slim-white-oak',
      name: 'Slim White Oak',
      description: 'Natural white oak with slim shaker profile. Scandinavian-inspired beauty.',
      tags: ['Slim Shaker', 'Oak', 'Natural'],
      isNew: true,
      construction: 'framed',
      image: alineImages.slimWhiteOak,
    },
    {
      id: 'shaker-charcoal',
      name: 'Shaker Charcoal',
      description: 'Deep charcoal shaker doors. Modern, dramatic, and endlessly versatile.',
      tags: ['Shaker', 'Charcoal', 'Modern'],
      construction: 'framed',
      image: alineImages.shakerCharcoal,
    },
    {
      id: 'iron-black',
      name: 'Iron Black',
      description: 'Bold matte black shaker doors. Ultra-modern with serious visual impact.',
      tags: ['Shaker', 'Black', 'Bold'],
      construction: 'framed',
      image: alineImages.ironBlack,
    },
    {
      id: 'treasure-chest',
      name: 'Treasure Chest',
      description: 'Warm natural oak with traditional styling. Brings organic warmth to any kitchen.',
      tags: ['Oak', 'Natural', 'Warm'],
      isNew: true,
      construction: 'framed',
      image: alineImages.treasureChest,
    },
    {
      id: 'aston-green',
      name: 'Aston Green',
      description: 'Rich forest green in a slim profile. On-trend color for design-forward kitchens.',
      tags: ['Slim Shaker', 'Green', 'Trending'],
      isNew: true,
      construction: 'framed',
      image: alineImages.astonGreen,
    },
    {
      id: 'slim-aston-green',
      name: 'Slim Aston Green',
      description: 'Elegant green with slender shaker detail. Sophisticated alternative to neutral.',
      tags: ['Slim Shaker', 'Green', 'Elegant'],
      isNew: true,
      construction: 'framed',
      image: alineImages.slimAstonGreen,
    },
    {
      id: 'double-dove-white',
      name: 'Double Dove White',
      description: 'Double-step shaker profile in soft white. Extra detail for refined taste.',
      tags: ['Double Shaker', 'White', 'Refined'],
      construction: 'framed',
      image: alineImages.doubleDoveWhite,
    },
  ] as AlineProduct[],

  frameless: [
    {
      id: 'high-gloss-gray',
      name: 'High Gloss Gray',
      description: 'Sleek high-gloss finish in sophisticated gray. Ultra-modern and reflective.',
      tags: ['High Gloss', 'Gray', 'Modern'],
      construction: 'frameless',
      image: alineImages.highGlossGray,
    },
    {
      id: 'high-gloss-white',
      name: 'High Gloss White',
      description: 'Brilliant white high-gloss doors. Clean, bright, and contemporary.',
      tags: ['High Gloss', 'White', 'Contemporary'],
      construction: 'frameless',
      image: alineImages.highGlossWhite,
    },
    {
      id: 'crystal-glass',
      name: 'Crystal Glass',
      description: 'Elegant glass-front cabinets with black framing. Showcase your dishes in style.',
      tags: ['Glass', 'Display', 'Elegant'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.crystalGlass,
    },
    {
      id: 'matt-black',
      name: 'Matt Black',
      description: 'Sophisticated matte black finish. Modern luxury with a soft touch.',
      tags: ['Matte', 'Black', 'Luxury'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.mattBlack,
    },
    {
      id: 'midnight-glass',
      name: 'Midnight Glass',
      description: 'Dramatic glass cabinets with dark frames. Perfect for display and ambiance.',
      tags: ['Glass', 'Display', 'Dramatic'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.midnightGlass,
    },
    {
      id: 'oak-blonde',
      name: 'Oak Blonde',
      description: 'Light natural oak with modern frameless construction. Scandinavian minimalism.',
      tags: ['Oak', 'Natural', 'Light'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.oakBlonde,
    },
    {
      id: 'oak-shade',
      name: 'Oak Shade',
      description: 'Darker oak tone with rich wood grain. Natural beauty meets modern design.',
      tags: ['Oak', 'Natural', 'Rich'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.oakShade,
    },
    {
      id: 'matt-ivory',
      name: 'Matt Ivory',
      description: 'Soft ivory with matte finish. Warm, welcoming, and perfectly understated.',
      tags: ['Matte', 'Ivory', 'Warm'],
      isNew: true,
      construction: 'frameless',
      image: alineImages.mattIvory,
    },
  ] as AlineProduct[],
}

export type AlineProductId = typeof alineProducts.framed[number]['id'] | typeof alineProducts.frameless[number]['id']

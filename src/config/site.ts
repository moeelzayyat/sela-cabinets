/**
 * SELA Cabinets - Site Configuration
 * =====================================
 * This is the SINGLE SOURCE OF TRUTH for all site content.
 * Update this file to change business info, service areas, and content.
 */

export const siteConfig = {
  // ============================================
  // BUSINESS INFORMATION
  // ============================================
  name: 'SELA Cabinets',
  tagline: 'Premium Kitchen Cabinets for Detroit Homes',
  description: 'Professional kitchen cabinet supply and installation in Detroit, Michigan. Expert in-home measurement, custom design help, and quality installation services.',
  
  phone: '313-246-7903',
  phoneFormatted: '(313) 246-7903',
  phoneLink: 'tel:+13132467903',
  
  email: 'info@selacabinets.com',
  
  location: {
    city: 'Detroit',
    state: 'Michigan',
    stateAbbr: 'MI',
    full: 'Detroit, Michigan',
  },
  
  // ============================================
  // SERVICE AREAS
  // Update this list to change where you serve
  // ============================================
  serviceAreas: [
    'Detroit',
    'Dearborn',
    'Livonia',
    'Troy',
    'Warren',
    'Sterling Heights',
    'Ann Arbor',
    'Farmington Hills',
    'Southfield',
    'Royal Oak',
    'Novi',
    'Canton',
    'Westland',
    'Redford',
    'Taylor',
  ],
  
  // ============================================
  // CALENDLY LINKS
  // Replace these with your actual Calendly URLs
  // or set via environment variables
  // ============================================
  calendly: {
    phoneConsultation: process.env.NEXT_PUBLIC_CALENDLY_PHONE_CONSULTATION || 'https://calendly.com/sela-cabinets/phone-consultation',
    inhomeMeasurement: process.env.NEXT_PUBLIC_CALENDLY_INHOME_MEASUREMENT || 'https://calendly.com/sela-cabinets/inhome-measurement',
    virtualDesign: process.env.NEXT_PUBLIC_CALENDLY_VIRTUAL_DESIGN || 'https://calendly.com/sela-cabinets/virtual-design',
  },
  
  // ============================================
  // SOCIAL LINKS (add as you create accounts)
  // ============================================
  social: {
    facebook: '',
    instagram: '',
    pinterest: '',
    houzz: '',
  },
  
  // ============================================
  // SEO DEFAULTS
  // ============================================
  seo: {
    titleTemplate: '%s | SELA Cabinets - Detroit Kitchen Cabinets',
    defaultTitle: 'SELA Cabinets | Premium Kitchen Cabinets in Detroit, MI | Save 66% vs Big Box',
    defaultDescription: 'Transform your Detroit kitchen with SELA Cabinets. Premium semi-custom cabinets, professional installation, and free in-home measurement. 10x10 kitchens from $3,999. Serving Detroit, Dearborn, Troy, Sterling Heights, Ann Arbor, and 15+ metro cities. Save up to 66% vs Home Depot & Lowes.',
    keywords: [
      // Primary keywords
      'kitchen cabinets Detroit',
      'cabinet installation Detroit MI',
      'kitchen remodel Detroit',
      'cabinet supply Detroit',
      // Location-specific
      'kitchen cabinets Dearborn',
      'kitchen cabinets Troy Michigan',
      'kitchen cabinets Sterling Heights',
      'kitchen cabinets Ann Arbor',
      'kitchen cabinets Royal Oak',
      'kitchen cabinets Farmington Hills',
      'kitchen cabinets Livonia',
      'kitchen cabinets Canton MI',
      // Service keywords
      'cabinet installation services',
      'in-home cabinet measurement',
      'kitchen design consultation Detroit',
      'custom kitchen cabinets Michigan',
      'semi-custom cabinets',
      // Comparison keywords
      'cheap kitchen cabinets Detroit',
      'affordable kitchen cabinets Michigan',
      'kitchen cabinet deals Detroit',
      'cabinet wholesale Detroit',
      // Long-tail keywords
      '10x10 kitchen cabinets Detroit',
      'kitchen cabinet installation cost Michigan',
      'best kitchen cabinet company Detroit',
      'kitchen renovation Detroit metro',
      'cabinet replacement Detroit',
      // Product keywords
      'shaker cabinets Detroit',
      'white kitchen cabinets',
      'modern kitchen cabinets Michigan',
      'wood kitchen cabinets Detroit',
      // Action keywords
      'buy kitchen cabinets Detroit',
      'order cabinets online Michigan',
      'get kitchen quote Detroit',
      'free cabinet estimate',
    ],
    url: 'https://selacabinets.com',
  },
  
  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Products', href: '/products' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'About', href: '/about' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: [
      { label: 'Get an Estimate', href: '/estimate', variant: 'outline' as const },
      { label: 'Book a Consultation', href: '/book', variant: 'default' as const },
    ],
  },
  
  // ============================================
  // PROCESS STEPS
  // ============================================
  process: [
    {
      step: 1,
      title: 'Tell Us About Your Kitchen',
      description: 'Share photos, dimensions, or schedule a call. We\'ll tell you what\'s possible.',
      icon: 'Calendar',
    },
    {
      step: 2,
      title: 'We Come to You (Free)',
      description: 'Exact measurements at your home. No obligation. See samples. Get a real quote.',
      icon: 'Ruler',
    },
    {
      step: 3,
      title: 'See Your Price — No Surprises',
      description: 'Clear pricing with no hidden fees. Know exactly what you\'re getting before you commit.',
      icon: 'PenTool',
    },
    {
      step: 4,
      title: 'Your New Kitchen, Done',
      description: 'Professional install with a clean worksite. Most projects finished in 1-3 days.',
      icon: 'Truck',
    },
  ],
  
  // ============================================
  // SERVICES
  // ============================================
  services: [
    {
      id: 'cabinet-supply',
      title: 'Cabinet Supply',
      shortDescription: 'Premium cabinets direct to you. No big-box markup.',
      description: 'We offer a curated selection of high-quality kitchen cabinets. From classic shaker to modern flat-panel designs, find the perfect cabinets to match your style and budget.',
      features: [
        'Wide selection of styles and finishes',
        'Quality materials and construction',
        'Competitive pricing',
        'Fast ordering and delivery',
      ],
      icon: 'Package',
    },
    {
      id: 'installation',
      title: 'Professional Installation',
      shortDescription: 'Installed by pros who measure twice. Done in 1-3 days.',
      description: 'Our skilled installation team brings years of experience to every project. We handle everything from removing old cabinets to the final adjustments, ensuring your new cabinets are installed perfectly.',
      features: [
        'Experienced installation team',
        'Careful removal of old cabinets',
        'Precise leveling and alignment',
        'Clean, professional worksite',
      ],
      icon: 'Wrench',
    },
    {
      id: 'measurement',
      title: 'In-Home Measurement',
      shortDescription: 'We come to you. Free measuring with your order.',
      description: 'Accurate measurements are crucial for a successful cabinet project. Our experts visit your home to take detailed measurements, ensuring your new cabinets fit perfectly in your space.',
      features: [
        'Complimentary with cabinet order',
        'Detailed digital measurements',
        'Assessment of existing conditions',
        'Same-week appointments available',
      ],
      icon: 'Ruler',
    },
    {
      id: 'design-help',
      title: 'Design Help',
      shortDescription: 'Need ideas? We\'ll show you what\'s possible.',
      description: 'Not sure where to start? Our design consultants help you plan your perfect kitchen. We can create 3D renderings so you can see exactly how your new cabinets will look before ordering.',
      features: [
        'Virtual design consultations',
        '3D kitchen renderings',
        'Style and finish recommendations',
        'Layout optimization',
      ],
      icon: 'Palette',
    },
  ],
  
  // ============================================
  // CABINET STYLES
  // ============================================
  cabinetStyles: [
    {
      id: 'shaker',
      name: 'Shaker',
      description: 'Timeless and versatile, the shaker style features a five-piece door with a recessed center panel. Perfect for traditional, transitional, and modern kitchens.',
      image: '/images/styles/shaker.jpg',
    },
    {
      id: 'flat-panel',
      name: 'Flat Panel (Slab)',
      description: 'Clean, minimalist doors with a completely flat surface. Ideal for contemporary and modern kitchen designs.',
      image: '/images/styles/flat-panel.jpg',
    },
    {
      id: 'raised-panel',
      name: 'Raised Panel',
      description: 'Classic elegance with a center panel that is raised above the frame. A traditional choice that adds depth and dimension.',
      image: '/images/styles/raised-panel.jpg',
    },
    {
      id: 'beadboard',
      name: 'Beadboard',
      description: 'Vertical grooved panels that add texture and cottage charm. Great for farmhouse and coastal kitchen styles.',
      image: '/images/styles/beadboard.jpg',
    },
    {
      id: 'glass-front',
      name: 'Glass Front',
      description: 'Showcase your dishes with elegant glass-front cabinet doors. Available in clear, frosted, or textured glass.',
      image: '/images/styles/glass-front.jpg',
    },
  ],
  
  // ============================================
  // CABINET FINISHES
  // ============================================
  cabinetFinishes: [
    {
      id: 'white',
      name: 'Bright White',
      hex: '#FFFFFF',
      description: 'Crisp, clean white that brightens any kitchen and pairs beautifully with any countertop.',
    },
    {
      id: 'antique-white',
      name: 'Antique White',
      hex: '#FAEBD7',
      description: 'Warm, creamy white with subtle undertones for a softer, more inviting look.',
    },
    {
      id: 'gray',
      name: 'Dove Gray',
      hex: '#6B7280',
      description: 'Sophisticated neutral gray that works well in modern and transitional kitchens.',
    },
    {
      id: 'navy',
      name: 'Navy Blue',
      hex: '#1E3A5F',
      description: 'Bold, dramatic navy for statement islands or full kitchen transformations.',
    },
    {
      id: 'natural-oak',
      name: 'Natural Oak',
      hex: '#C4A77D',
      description: 'Warm, natural wood grain that brings organic beauty to your kitchen.',
    },
    {
      id: 'walnut',
      name: 'Rich Walnut',
      hex: '#5D4037',
      description: 'Deep, luxurious walnut finish for a sophisticated, warm aesthetic.',
    },
    {
      id: 'espresso',
      name: 'Espresso',
      hex: '#3C2415',
      description: 'Dark, rich brown that makes a bold statement in any kitchen.',
    },
    {
      id: 'black',
      name: 'Matte Black',
      hex: '#1A1A1A',
      description: 'Sleek, modern black for contemporary kitchens and dramatic contrasts.',
    },
  ],
  
  // ============================================
  // FAQs
  // ============================================
  faqs: [
    {
      question: 'How long does a typical cabinet installation take?',
      answer: 'Most kitchen cabinet installations take 1-3 days depending on the size of your kitchen and complexity of the project. A standard 10x10 kitchen typically takes about 1-2 days. We\'ll provide a specific timeline during your consultation.',
    },
    {
      question: 'Do you offer in-home measurement?',
      answer: 'Yes! We offer professional in-home measurement services. Our experts will visit your home to take precise measurements of your kitchen space, assess existing conditions, and discuss your layout options. This service is complimentary when you order cabinets from us.',
    },
    {
      question: 'What information do I need to get a quote?',
      answer: 'To provide an accurate quote, we need: your kitchen dimensions (or photos if you\'re not sure), your preferred cabinet style and finish, any special requirements (corner solutions, pantry cabinets, etc.), and your timeline. The more details you provide, the more accurate your estimate will be.',
    },
    {
      question: 'Do you remove old cabinets?',
      answer: 'Yes, our installation service includes careful removal and disposal of your existing cabinets. We take care to protect your floors and walls during removal. If you\'d like to keep your old cabinets for donation or reuse, just let us know.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve Detroit and the surrounding metro area including Dearborn, Livonia, Troy, Warren, Sterling Heights, Ann Arbor, Farmington Hills, Southfield, Royal Oak, Novi, Canton, Westland, Redford, and Taylor. Contact us if you\'re outside these areas—we may still be able to help!',
    },
    {
      question: 'Can you help with kitchen design?',
      answer: 'Absolutely! We offer design consultation services to help you plan your perfect kitchen. This includes style recommendations, layout optimization, and 3D renderings so you can visualize your new kitchen before making decisions. We can meet virtually or in-person.',
    },
    {
      question: 'What cabinet brands do you carry?',
      answer: 'We work with several quality cabinet manufacturers to offer a range of options at different price points. During your consultation, we\'ll discuss the best options for your style preferences and budget.',
    },
    {
      question: 'How do I get started?',
      answer: 'Getting started is easy! You can book a free phone consultation, request an estimate through our website, or call us directly at 313-246-7903. We\'ll discuss your project, answer your questions, and schedule a measurement visit if needed.',
    },
  ],
  
  // ============================================
  // FORM OPTIONS
  // ============================================
  formOptions: {
    timelines: [
      'As soon as possible',
      'Within 1 month',
      '1-3 months',
      '3-6 months',
      '6+ months / Just planning',
    ],
    budgets: [
      'Under $5,000',
      '$5,000 - $10,000',
      '$10,000 - $20,000',
      '$20,000 - $35,000',
      '$35,000+',
      'Not sure yet',
    ],
    styles: [
      'Modern / Contemporary',
      'Traditional',
      'Transitional',
      'Farmhouse / Rustic',
      'Coastal',
      'Not sure - need help deciding',
    ],
  },
} as const

export type SiteConfig = typeof siteConfig


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
  
  phone: '313-468-3225',
  phoneFormatted: '(313) 468-3225',
  phoneLink: 'tel:+13134683225',
  
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
  // CALENDLY LINK
  // ============================================
  calendly: {
    kitchenPlanningCall: 'https://calendly.com/admin-selatrade/sela-kitchen-planning-call',
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
    defaultTitle: 'SELA Cabinets | Premium Kitchen Cabinets in Detroit, MI',
    defaultDescription: 'Transform your Detroit kitchen with SELA Cabinets. Premium semi-custom cabinets, professional installation, design guidance, and in-home measurement for Detroit, Dearborn, Troy, Sterling Heights, Ann Arbor, and nearby metro communities.',
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
      'premium kitchen cabinets Detroit',
      'luxury kitchen cabinets Michigan',
      'kitchen cabinet consultation Detroit',
      'cabinet showroom consultation Detroit',
      // Long-tail keywords
      'kitchen cabinet design Detroit',
      'professional cabinet installation Michigan',
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
      'cabinet consultation Detroit',
      'cabinet estimate Detroit',
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
      title: 'We Come to You',
      description: 'Exact measurements at your home. See cabinet samples and discuss the best options for your space.',
      icon: 'Ruler',
    },
    {
      step: 3,
      title: 'Review the Plan',
      description: 'Review your layout, finish selections, timeline, and project scope before you commit.',
      icon: 'PenTool',
    },
    {
      step: 4,
      title: 'Your New Kitchen, Done',
      description: 'Professional installation after inspection, ordering, delivery, and site readiness are confirmed.',
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
      shortDescription: 'Curated premium cabinet lines selected for Detroit homes.',
      description: 'We offer a curated selection of high-quality kitchen cabinets. From classic shaker to modern flat-panel designs, find cabinets that match your home, lifestyle, and design goals.',
      features: [
        'Wide selection of styles and finishes',
        'Quality materials and construction',
        'Premium cabinet lines',
        'Coordinated ordering and delivery',
      ],
      icon: 'Package',
    },
    {
      id: 'installation',
      title: 'Professional Installation',
      shortDescription: 'Installed by pros after inspection, ordering, delivery, and site readiness are confirmed.',
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
      shortDescription: 'We come to you. Precise measuring with your order.',
      description: 'Accurate measurements are crucial for a successful cabinet project. Our experts visit your home to take detailed measurements, ensuring your new cabinets fit perfectly in your space.',
      features: [
        'Included with cabinet order',
        'Detailed digital measurements',
        'Assessment of existing conditions',
        'Inspection-based project planning',
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
      question: 'How is cabinet project timing determined?',
      answer: 'Cabinet project timing is confirmed after inspection. We first review the layout, site conditions, cabinet selections, supplier ordering lead time, delivery schedule, and installation scope, then provide a realistic project timeline.',
    },
    {
      question: 'Do you offer in-home measurement?',
      answer: 'Yes. We offer professional in-home measurement services. Our experts will visit your home to take precise measurements of your kitchen space, assess existing conditions, and discuss your layout options.',
    },
    {
      question: 'What information do I need to get a quote?',
      answer: 'To prepare a detailed estimate, we need your kitchen dimensions (or photos if you\'re not sure), your preferred cabinet style and finish, any special requirements (corner solutions, pantry cabinets, etc.), and your timeline. The more details you provide, the clearer your project plan will be.',
    },
    {
      question: 'Do you remove old cabinets?',
      answer: 'Yes, our installation service includes careful removal and disposal of your existing cabinets. We take care to protect your floors and walls during removal. If you\'d like to keep your old cabinets for donation or reuse, just let us know.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve Detroit and the surrounding metro area including Dearborn, Livonia, Troy, Warren, Sterling Heights, Ann Arbor, Farmington Hills, Southfield, Royal Oak, Novi, Canton, Westland, Redford, and Taylor. Contact us if you\'re outside these areas; we may still be able to help.',
    },
    {
      question: 'Can you help with kitchen design?',
      answer: 'Absolutely! We offer design consultation services to help you plan your perfect kitchen. This includes style recommendations, layout optimization, and 3D renderings so you can visualize your new kitchen before making decisions. We can meet virtually or in-person.',
    },
    {
      question: 'What cabinet brands do you carry?',
      answer: 'We work with several quality cabinet manufacturers to offer a range of premium options. During your consultation, we\'ll discuss the best cabinet line, finish, and construction details for your style preferences and project goals.',
    },
    {
      question: 'How do I get started?',
      answer: 'Getting started is easy. You can book a phone consultation, request an estimate through our website, or call us directly at 313-468-3225. We\'ll discuss your project, answer your questions, and schedule a measurement visit if needed.',
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
      'Starter refresh',
      'Standard kitchen project',
      'Large kitchen project',
      'Premium kitchen transformation',
      'Multi-room cabinetry',
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

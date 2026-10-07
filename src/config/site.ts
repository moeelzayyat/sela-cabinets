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
  tagline: 'Kitchen Cabinets & Professional Installation in Metro Detroit',
  description: 'SELA supplies quality kitchen cabinets and coordinates professional installation for Metro Detroit homeowners, with one point of contact from measurement to final walkthrough.',
  
  phone: '313-468-3225',
  phoneInternational: '+1-313-468-3225',
  phoneFormatted: '(313) 468-3225',
  phoneLink: 'tel:+13134683225',
  
  email: 'info@selacabinets.com',
  
  location: {
    city: 'Detroit',
    state: 'Michigan',
    stateAbbr: 'MI',
    full: 'Detroit, Michigan',
  },

  // Unknown business facts remain hidden until they are verified.
  businessFacts: {
    address: '[BUSINESS ADDRESS OR "service-area business, no public address"]',
    hours: '[HOURS]',
    license: '[LICENSE TYPE AND NUMBER]',
    insured: '[INSURED: YES/NO]',
    warranty: '[WARRANTY TERMS]',

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
    titleTemplate: '%s | SELA Cabinets',
    defaultTitle: 'Kitchen Cabinets & Installation in Metro Detroit | SELA',
    defaultDescription: 'Quality kitchen cabinets at a fair price, professionally installed across Metro Detroit with one point of contact from measurement to walkthrough.',
    url: 'https://selacabinets.com',
    logo: '/brand/sela-icon-contained.svg',
    image: '/images/seo/home-og.jpg',
  },
  
  // ============================================
  // NAVIGATION
  // ============================================
  navigation: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Cabinet Styles', href: '/products' },
      { label: 'Style Inspiration', href: '/gallery' },
      { label: 'About', href: '/about' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: [
      { label: 'Plan My Kitchen', href: '/book', variant: 'default' as const },
      { label: 'Request an Estimate', href: '/estimate', variant: 'outline' as const },
    ],
  },
  
  // ============================================
  // PROCESS STEPS
  // ============================================
  process: [
    {
      step: 1,
      title: 'Tell Us About Your Kitchen',
      description: 'Share your goals, kitchen photos, preferred cabinet styles, and any dimensions you already have.',
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
      title: 'Review Cabinets & Scope',
      description: 'Review the measured layout, cabinet selections, written scope, and exact estimate before you commit.',
      icon: 'PenTool',
    },
    {
      step: 4,
      title: 'Install & Walk Through',
      description: 'A cabinet installation specialist fits and adjusts the cabinets, followed by a final cabinet walkthrough.',
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
      shortDescription: 'Curated cabinet styles and construction options for Detroit-area homes.',
      description: 'We offer a curated selection of high-quality kitchen cabinets. From classic shaker to modern flat-panel designs, find cabinets that match your home, lifestyle, and design goals.',
      features: [
        'Wide selection of styles and finishes',
        'Quality materials and construction',
        'Framed and frameless options',
        'Coordinated ordering and delivery',
      ],
      icon: 'Package',
    },
    {
      id: 'installation',
      title: 'Professional Installation',
      shortDescription: 'Skilled cabinet fitting, leveling, alignment, secure attachment, and final adjustment.',
      description: 'Professional cabinet installation connects the measured layout with careful placement, leveling, alignment, secure attachment, trim work in the approved scope, and final adjustments.',
      features: [
        'Cabinet installation specialist',
        'Careful scribing and cabinet fit',
        'Precise leveling and alignment',
        'Final cabinet adjustments',
      ],
      icon: 'Wrench',
    },
    {
      id: 'measurement',
      title: 'In-Home Measurement',
      shortDescription: 'We come to you. Precise measuring with your order.',
      description: 'In-home measurement records kitchen dimensions and visible conditions so cabinet selection and installation can be based on the actual space.',
      features: [
        'Included with cabinet order',
        'Detailed digital measurements',
        'Assessment of existing conditions',
        'Measured cabinet layout decisions',
      ],
      icon: 'Ruler',
    },
    {
      id: 'design-help',
      title: 'Design Help',
      shortDescription: 'Need ideas? We\'ll show you what\'s possible.',
      description: 'Layout guidance helps compare cabinet styles, finishes, storage needs, and placement options before ordering.',
      features: [
        'Cabinet selection consultations',
        'Measured layout guidance',
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
      question: 'When can my cabinet installation date be confirmed?',
      answer: 'We confirm the installation date after measurements and layout are approved, the cabinets are available and inspected, and the kitchen is ready for the agreed work. This avoids promising a date before the parts and site conditions are ready.',
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
      answer: 'Cabinet removal can be included in the written project scope. Removed cabinets remain at the property, and the customer is responsible for disposal unless a different qualified service is expressly arranged in writing.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve Detroit and the surrounding metro area including Dearborn, Livonia, Troy, Warren, Sterling Heights, Ann Arbor, Farmington Hills, Southfield, Royal Oak, Novi, Canton, Westland, Redford, and Taylor. Contact us if you\'re outside these areas; we may still be able to help.',
    },
    {
      question: 'Can you help with cabinet layout and style choices?',
      answer: 'Yes. SELA helps compare cabinet construction, door styles, finishes, storage needs, and measured layout options before an order is finalized.',
    },
    {
      question: 'What cabinet brands do you carry?',
      answer: 'SELA presents its available framed and frameless cabinet collections by style, finish, and confirmed construction details. Current availability is verified before an order is finalized.',
    },
    {
      question: 'What should be ready before cabinet installation?',
      answer: 'The agreed work area must be accessible and ready for the cabinet scope. SELA reviews cabinet delivery, removal status, walls and floors, visible utility conflicts, appliance information, and coordination with other trades before confirming installation readiness.',
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
      'Kitchen transformation',
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

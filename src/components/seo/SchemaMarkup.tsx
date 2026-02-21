export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://selacabinets.com/#localbusiness",
    "name": "SELA Cabinets",
    "alternateName": "SELA Cabinets Detroit",
    "description": "Premium kitchen cabinet supply and installation services in Detroit, Michigan. Professional in-home measurement, custom design help, and quality installation. 10x10 kitchens starting at $3,999.",
    "url": "https://selacabinets.com",
    "telephone": "+1-313-246-7903",
    "email": "info@selacabinets.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Detroit",
      "addressRegion": "MI",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "42.3314",
      "longitude": "-83.0458"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Detroit",
        "sameAs": "https://en.wikipedia.org/wiki/Detroit"
      },
      {
        "@type": "City",
        "name": "Dearborn"
      },
      {
        "@type": "City",
        "name": "Troy"
      },
      {
        "@type": "City",
        "name": "Sterling Heights"
      },
      {
        "@type": "City",
        "name": "Ann Arbor"
      },
      {
        "@type": "City",
        "name": "Royal Oak"
      },
      {
        "@type": "City",
        "name": "Farmington Hills"
      },
      {
        "@type": "City",
        "name": "Livonia"
      },
      {
        "@type": "City",
        "name": "Canton"
      },
      {
        "@type": "City",
        "name": "Southfield"
      },
      {
        "@type": "City",
        "name": "West Bloomfield"
      },
      {
        "@type": "City",
        "name": "Novi"
      },
      {
        "@type": "City",
        "name": "Warren"
      },
      {
        "@type": "City",
        "name": "Westland"
      },
      {
        "@type": "City",
        "name": "Redford Township"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00"
      }
    ],
    "priceRange": "$$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Check",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kitchen Cabinet Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kitchen Cabinet Supply",
            "description": "Premium semi-custom kitchen cabinets at wholesale prices"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Professional Installation",
            "description": "Expert cabinet installation by experienced professionals"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "In-Home Measurement",
            "description": "Free in-home measurement service with cabinet order"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Kitchen Design Consultation",
            "description": "Professional design help and 3D renderings for your kitchen project"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "sameAs": [
      "https://www.facebook.com/selacabinets",
      "https://www.instagram.com/selacabinets"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ServiceSchema({ serviceName, serviceDescription }: { serviceName: string; serviceDescription: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": "SELA Cabinets",
      "telephone": "+1-313-246-7903",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Detroit",
        "addressRegion": "MI",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Michigan"
    },
    "description": serviceDescription,
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "areaServed": {
        "@type": "State",
        "name": "Michigan"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://selacabinets.com${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebPageSchema({ title, description, path }: { title: string; description: string; path: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://selacabinets.com${path}/#webpage`,
    "url": `https://selacabinets.com${path}`,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": "https://selacabinets.com/#website"
    },
    "inLanguage": "en-US",
    "potentialAction": [{
      "@type": "ReadAction",
      "target": [`https://selacabinets.com${path}`]
    }]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

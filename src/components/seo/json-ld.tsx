import { siteConfig } from '@/config/site'
import { serializeJsonLd } from '@/components/seo/serialize-json-ld'

const businessId = `${siteConfig.seo.url}/#business`

export function LocalBusinessJsonLd() {
  const hasVerifiedHours = !siteConfig.businessFacts.hours.startsWith('[')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phoneInternational,
    email: siteConfig.email,
    url: siteConfig.seo.url,
    logo: `${siteConfig.seo.url}${siteConfig.seo.logo}`,
    image: `${siteConfig.seo.url}${siteConfig.seo.image}`,
    ...(hasVerifiedHours ? { openingHours: siteConfig.businessFacts.hours } : {}),

    areaServed: siteConfig.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}

export function ServiceJsonLd() {
  const services = siteConfig.services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: { '@id': businessId },
    areaServed: {
      '@type': 'City',
      name: siteConfig.location.city,
    },
  }))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(services) }}
    />
  )
}

interface FAQJsonLdProps {
  faqs: readonly { readonly question: string; readonly answer: string }[]
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}

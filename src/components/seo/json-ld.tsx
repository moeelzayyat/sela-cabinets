import { siteConfig } from '@/config/site'
import { serviceAreaPages } from '@/config/service-area-pages'
import { dedicatedServiceRoutes, type DedicatedServiceId } from '@/config/internal-links'
import { serializeJsonLd } from '@/components/seo/serialize-json-ld'

const businessId = `${siteConfig.seo.url}/#business`
const areaServed = serviceAreaPages.map((area) => ({
  '@type': 'City',
  name: area.name,
}))

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phoneInternational,
    email: siteConfig.email,
    url: siteConfig.seo.homepageUrl,
    logo: `${siteConfig.seo.url}${siteConfig.seo.logo}`,
    image: `${siteConfig.seo.url}${siteConfig.seo.image}`,
    priceRange: '$$',
    // Social profiles stay omitted until verified public URLs are supplied.
    areaServed,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}

export function ServiceJsonLd() {
  const services = siteConfig.services.map((service) => {
    const path = dedicatedServiceRoutes[service.id as DedicatedServiceId]
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      serviceType: service.title,
      description: service.description,
      provider: { '@id': businessId },
      areaServed,
      ...(path ? { url: `${siteConfig.seo.url}${path}` } : {}),
    }
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(services) }}
    />
  )
}

export function ServicePageJsonLd({
  name,
  serviceType,
  description,
  path,
}: {
  name: string
  serviceType: string
  description: string
  path: string
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    provider: { '@id': businessId },
    areaServed,
    url: `${siteConfig.seo.url}${path}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
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

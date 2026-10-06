'use client'

import { usePathname } from 'next/navigation'

import { serializeJsonLd } from '@/components/seo/serialize-json-ld'
import { siteConfig } from '@/config/site'

const explicitSchemaPaths = new Set([
  '/about',
  '/estimate',
  '/services/kitchen-cabinet-installation-detroit',
  '/blog/kitchen-cabinet-planning-detroit',
])

const labels: Record<string, string> = {
  services: 'Services',
  products: 'Cabinet Styles',
  gallery: 'Style Inspiration',
  process: 'Process',
  pricing: 'Pricing',
  estimate: 'Estimate',
  book: 'Book a Consultation',
  faqs: 'FAQs',
  contact: 'Contact',
  'service-areas': 'Service Areas',
  blog: 'Cabinet Guides',
  privacy: 'Privacy Policy',
  terms: 'Terms',
}

function titleCase(segment: string) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AutomaticBreadcrumbSchema() {
  const pathname = usePathname()

  if (
    !pathname ||
    pathname === '/' ||
    explicitSchemaPaths.has(pathname) ||
    pathname.startsWith('/products/') ||
    (pathname.startsWith('/service-areas/') && pathname !== '/service-areas/metro-detroit') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth')
  ) {
    return null
  }

  const segments = pathname.split('/').filter(Boolean)
  const items = [
    { name: 'Home', item: siteConfig.seo.url },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        name: labels[segment] ?? titleCase(segment),
        item: `${siteConfig.seo.url}${path}`,
      }
    }),
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}

import { siteConfig } from '@/config/site'
import { serializeJsonLd } from '@/components/seo/serialize-json-ld'

export function FAQSchema({
  faqs,
}: {
  faqs: readonly { readonly question: string; readonly answer: string }[]
}) {
  const schema = {
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
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}

export function ArticleSchema({
  headline,
  description,
  canonicalPath,
  datePublished,
  dateModified,
}: {
  headline: string
  description: string
  canonicalPath: string
  datePublished: string
  dateModified: string
}) {
  const canonicalUrl = `${siteConfig.seo.url}${canonicalPath}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    headline,
    description,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@id': `${siteConfig.seo.url}/#business`,
    },
    image: `${siteConfig.seo.url}/images/seo/sela-cabinets-og.png`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: readonly { readonly name: string; readonly url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.seo.url}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}

import type { Metadata } from 'next'

import { siteConfig } from '@/config/site'

const socialImage = {
  url: '/images/seo/sela-cabinets-og.png',
  width: 1200,
  height: 630,
  alt: 'SELA Cabinets kitchen cabinet planning in Metro Detroit',
}

export function createPageSocialMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  absoluteTitle?: boolean
  type?: 'website' | 'article'
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const resolvedTitle = absoluteTitle
    ? title
    : siteConfig.seo.titleTemplate.replace('%s', title)
  const url = path === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${path}`

  return {
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_US',
      type,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [socialImage.url],
    },
  }
}

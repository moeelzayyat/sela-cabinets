import type { Metadata } from 'next'

import { siteConfig } from '@/config/site'

export function createPageSocialMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = 'website',
  image = '/images/seo/sela-cabinets-og.png',
  imageWidth = 1200,
  imageHeight = 630,
  includeUrl = true,
}: {
  title: string
  description: string
  path: string
  absoluteTitle?: boolean
  type?: 'website' | 'article'
  image?: string
  imageWidth?: number
  imageHeight?: number
  includeUrl?: boolean
}): Pick<Metadata, 'openGraph' | 'twitter' | 'other'> {
  const resolvedTitle = absoluteTitle
    ? title
    : siteConfig.seo.titleTemplate.replace('%s', title)
  const url = path === '/' ? siteConfig.seo.homepageUrl : `${siteConfig.seo.url}${path}`
  const socialImage = {
    url: image,
    width: imageWidth,
    height: imageHeight,
    alt: `${title} — SELA Cabinets`,
  }

  return {
    openGraph: {
      title: resolvedTitle,
      description,
      ...(includeUrl ? { url } : {}),
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
    ...(includeUrl ? { other: { 'twitter:url': url } } : {}),
  }
}

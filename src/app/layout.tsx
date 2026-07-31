import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { SiteShell } from '@/components/layout/site-shell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.seo.url),
  ...createPageSocialMetadata({
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '/',
    absoluteTitle: true,
  }),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <GoogleAnalytics />
        <LocalBusinessJsonLd />
        <meta name="geo.region" content="US-MI" />
        <meta name="geo.placename" content="Detroit" />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}

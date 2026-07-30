import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { siteConfig } from '@/config/site'
import { galleryImages } from '@/config/images'

const source = (...segments: string[]) =>
  readFileSync(resolve(process.cwd(), 'src', ...segments), 'utf8')

function allApplicationSource(directory = resolve(process.cwd(), 'src')): string {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = resolve(directory, entry.name)
      if (entry.isDirectory()) return allApplicationSource(path)
      return /\.(?:ts|tsx)$/.test(entry.name) ? readFileSync(path, 'utf8') : []
    })
    .join('\n')
}

describe('launch messaging and inspiration claims', () => {
  it('uses Plan My Kitchen as the single primary navigation CTA', () => {
    expect(siteConfig.navigation.cta[0]).toMatchObject({
      label: 'Plan My Kitchen',
      href: '/book',
      variant: 'default',
    })
    expect(siteConfig.navigation.main).toContainEqual({
      label: 'Style Inspiration',
      href: '/gallery',
    })
    expect(siteConfig.navigation.main).not.toContainEqual(
      expect.objectContaining({ href: '/products' })
    )
  })

  it('does not represent inspiration images as completed local projects', () => {
    expect(galleryImages.length).toBeGreaterThan(0)
    for (const image of galleryImages) {
      expect(image).not.toHaveProperty('location')
      expect(image.alt.toLowerCase()).toContain('inspiration')
    }

    const publicCopy = [
      source('app', 'page.tsx'),
      source('app', 'gallery', 'page.tsx'),
      source('config', 'images.ts'),
    ].join('\n')

    expect(publicCopy).not.toMatch(/Project Gallery|completed kitchen|See Our Work/i)
    expect(publicCopy).toMatch(/Style Inspiration/)
  })

  it('positions SELA as a planning and coordination guide, not a manufacturer', () => {
    const messaging = [
      siteConfig.tagline,
      siteConfig.description,
      source('components', 'sections', 'hero-section.tsx'),
      source('components', 'sections', 'cta-section.tsx'),
    ].join('\n')

    expect(messaging).toMatch(/measured/i)
    expect(messaging).toMatch(/coordinated/i)
    expect(messaging).not.toMatch(/we manufacture|our factory|made in our/i)
    expect(messaging.match(/Plan My Kitchen/g)?.length).toBeGreaterThanOrEqual(2)
  })

  it('excludes obsolete CTA labels and unsupported public claims', () => {
    const applicationSource = allApplicationSource()

    expect(applicationSource).not.toMatch(
      /Book a Consultation|Get an Estimate|Project Gallery|Detroit-born/
    )
    expect(source('components', 'seo', 'SchemaMarkup.tsx')).not.toMatch(
      /aggregateRating|ratingValue|reviewCount|4\.9|127/
    )
  })

  it('does not publish supplier-private catalog identity or hosted URLs', () => {
    const catalogSource = source('config', 'products-catalog.ts')
    const nextConfig = readFileSync(
      resolve(process.cwd(), 'next.config.js'),
      'utf8'
    )

    expect(catalogSource).not.toMatch(/aline|supplier|https?:\/\//i)
    expect(nextConfig).not.toMatch(/aline|shop\.aline/i)
    expect(catalogSource).toMatch(/framed:\s*\[\]/)
    expect(catalogSource).toMatch(/frameless:\s*\[\]/)
  })
})

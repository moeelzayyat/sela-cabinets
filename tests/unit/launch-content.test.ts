import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { siteConfig } from '@/config/site'
import { galleryImages } from '@/config/images'
import { productsCatalog } from '@/config/products-catalog'

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
    expect(siteConfig.navigation.main).toContainEqual({
      label: 'Cabinet Styles',
      href: '/products',
    })
  })

  it('uses current SELA catalog assets for style inspiration', () => {
    const catalogProducts = [
      ...productsCatalog.framed,
      ...productsCatalog.frameless,
    ]
    const catalogByName = new Map(
      catalogProducts.map((product) => [product.name, product])
    )

    expect(galleryImages).toHaveLength(6)
    for (const image of galleryImages) {
      const product = catalogByName.get(image.title)

      expect(product, image.title).toBeDefined()
      expect(image.src).toBe(product?.image)
      expect(image.src).toMatch(/^\/images\/products\/catalog\/[a-z0-9-]+\.webp$/)
      expect(image.src).not.toMatch(/^https?:\/\//)
      expect(image.alt).toContain(image.title)
    }
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

  it('positions SELA around kitchen cabinets, installation, and direct coordination', () => {
    const messaging = [
      siteConfig.tagline,
      siteConfig.description,
      source('components', 'sections', 'hero-section.tsx'),
      source('components', 'sections', 'cta-section.tsx'),
    ].join('\n')

    expect(messaging).toMatch(/kitchen cabinets/i)
    expect(messaging).toMatch(/professional installation/i)
    expect(messaging).toMatch(/one point of contact/i)
    expect(messaging).not.toMatch(/we manufacture|our factory|made in our/i)
    expect(messaging).toMatch(/You pick the cabinets\. We handle the rest\./i)
  })

  it('excludes obsolete CTA labels and unsupported public claims', () => {
    const applicationSource = allApplicationSource()

    expect(applicationSource).not.toMatch(
      /Project Gallery|Detroit-born/
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

    const prohibitedBrand = ['al', 'ine'].join('')
    expect(catalogSource).not.toMatch(new RegExp(`${prohibitedBrand}|supplier|https?:\\/\\/`, 'i'))
    expect(nextConfig).not.toMatch(new RegExp(`${prohibitedBrand}|shop\\.${prohibitedBrand}`, 'i'))
    expect(catalogSource).toMatch(/Shaker Charcoal/)
    expect(catalogSource).toMatch(/Matte Ivory/)
  })
})

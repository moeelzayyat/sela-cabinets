import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  cabinetConstruction,
  handleCatalog,
  productsCatalog,
} from '@/config/products-catalog'

const pageSource = readFileSync(
  resolve(process.cwd(), 'src', 'app', 'products', 'page.tsx'),
  'utf8'
)

const framedNames = [
  'Shaker Charcoal',
  'Sage Breeze',
  'Slim Iron Black',
  'Slim Amber Oak',
  'Rustic Wood',
  'Lunar Gray',
  'Double Dove White',
  'Slim Aston Green',
  'Aston Green',
  'Treasure Chest',
  'Iron Black',
  'Shaker Espresso',
  'Slim White Oak',
  'Slim Dove White',
  'Navy Blue',
  'Charleston Saddle',
  'Aspen White',
  'Aspen Charcoal Gray',
  'Shaker Gray',
  'Shaker White',
  'Charleston White',
]

const framelessNames = [
  'High Gloss Gray',
  'High Gloss White',
  'Crystal Glass',
  'Matte Black',
  'Midnight Glass',
  'Oak Blonde',
  'Oak Shade',
  'Matte Ivory',
]

describe('current SELA cabinet catalog', () => {
  it('publishes every current framed and frameless collection', () => {
    expect(productsCatalog.framed.map(({ name }) => name)).toEqual(framedNames)
    expect(productsCatalog.frameless.map(({ name }) => name)).toEqual(
      framelessNames
    )
    expect(productsCatalog.framed).toHaveLength(21)
    expect(productsCatalog.frameless).toHaveLength(8)

    for (const product of [
      ...productsCatalog.framed,
      ...productsCatalog.frameless,
    ]) {
      expect(product.image).toMatch(/^\/images\/products\/catalog\/[a-z0-9-]+\.webp$/)
    }
  })

  it('publishes construction details and the available handle model', () => {
    expect(cabinetConstruction.framed.length).toBeGreaterThanOrEqual(10)
    expect(cabinetConstruction.frameless.length).toBeGreaterThanOrEqual(7)
    expect(handleCatalog).toEqual([
      expect.objectContaining({
        name: 'Handle 01 — Black — 96 mm',
        image: '/images/products/catalog/handle-01-black-96.webp',
      }),
    ])
  })

  it('keeps every catalog section visible without supplier-private commerce data', () => {
    expect(pageSource).toMatch(/Framed Cabinet Styles/)
    expect(pageSource).toMatch(/Frameless Cabinet Styles/)
    expect(pageSource).toMatch(/Framed Construction/)
    expect(pageSource).toMatch(/Frameless Construction/)
    expect(pageSource).toMatch(/Handles & Hardware/)
    expect(pageSource).not.toMatch(/notFound\(|<Tabs|wholesale|dealer|price|aline/i)
    expect(pageSource).not.toMatch(/<main[\s>]/)
    expect(pageSource).toContain('sticky top-[72px]')
    expect(pageSource.match(/scroll-mt-36/g)).toHaveLength(4)
  })
})

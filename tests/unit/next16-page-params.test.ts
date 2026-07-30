// @vitest-environment node

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const dynamicClientPages = [
  'src/app/admin/invoices/[id]/page.tsx',
  'src/app/admin/invoices/[id]/edit/page.tsx',
  'src/app/admin/quotes/[id]/page.tsx',
] as const

describe('Next 16 client page params', () => {
  it.each(dynamicClientPages)('%s unwraps its Promise params before using the route id', (file) => {
    const source = readFileSync(file, 'utf8')

    expect(source).toMatch(/params:\s*Promise<\{\s*id:\s*string\s*\}>/)
    expect(source).toMatch(/use\(params\)/)
    expect(source).not.toMatch(/params\.id/)
  })
})

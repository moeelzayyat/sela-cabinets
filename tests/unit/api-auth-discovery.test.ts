import { describe, expect, it } from 'vitest'

import { discoverExportedMethods } from '../../scripts/api-auth-discovery.mjs'

describe('API auth route discovery', () => {
  it('rejects malformed route source instead of silently discovering zero handlers', () => {
    expect(() =>
      discoverExportedMethods(
        'src/app/api/broken/route.ts',
        'export async function GET( {'
      )
    ).toThrow(/parse/i)
  })

  it('discovers supported JavaScript route handlers', () => {
    expect(
      discoverExportedMethods(
        'src/app/api/example/route.js',
        'export async function GET() {}\nexport const POST = async () => {}'
      )
    ).toEqual({ methods: ['GET', 'POST'], unsupportedExports: [] })
  })

  it('fails closed on export-star and destructured handler exports', () => {
    const result = discoverExportedMethods(
      'src/app/api/example/route.ts',
      "export * from './handlers'\nexport const { GET } = handlers"
    )

    expect(result.methods).toEqual([])
    expect(result.unsupportedExports).toHaveLength(2)
  })
})

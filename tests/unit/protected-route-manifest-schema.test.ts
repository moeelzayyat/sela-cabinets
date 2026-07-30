import { describe, expect, it } from 'vitest'

import { parseProtectedRouteManifest } from '../security/protected-route-manifest-schema.mjs'

const validEntry = () => ({
  sourceRouteFile: 'src/app/api/jobs/[id]/route.ts',
  routePattern: '/api/jobs/[id]',
  samplePath: '/api/jobs/999999999',
  method: 'GET',
  audience: 'admin',
  classification: 'admin-only',
  desiredAuth: 'admin-session',
  sensitiveData: true,
  sideEffects: false,
})

describe('protected route manifest runtime schema', () => {
  it('accepts a structurally consistent contract entry', () => {
    expect(parseProtectedRouteManifest([validEntry()])).toHaveLength(1)
    expect(
      parseProtectedRouteManifest([
        {
          ...validEntry(),
          sourceRouteFile: 'src/app/api/jobs/[id]/route.js',
        },
      ])
    ).toHaveLength(1)
  })

  it.each([
    ['invalid audience', { audience: 'everyone' }],
    ['classification/auth mismatch', { desiredAuth: 'none' }],
    ['classification/audience mismatch', { audience: 'customer' }],
    ['unsupported method', { method: 'TRACE' }],
    ['invalid sensitive-data flag', { sensitiveData: 'yes' }],
    ['invalid invariant', { requiredInvariant: '' }],
  ])('rejects %s', (_label, change) => {
    expect(() =>
      parseProtectedRouteManifest([{ ...validEntry(), ...change }])
    ).toThrow('Invalid protected route manifest')
  })

  it('rejects missing and unknown fields', () => {
    const missingMethod = { ...validEntry() } as Record<string, unknown>
    delete missingMethod.method

    expect(() => parseProtectedRouteManifest([missingMethod])).toThrow(
      'Invalid protected route manifest'
    )
    expect(() =>
      parseProtectedRouteManifest([{ ...validEntry(), unexpected: true }])
    ).toThrow('Invalid protected route manifest')
  })

  it('rejects duplicate method/route pairs', () => {
    expect(() =>
      parseProtectedRouteManifest([validEntry(), validEntry()])
    ).toThrow('duplicate GET /api/jobs/[id]')
  })

  it('rejects source and route-pattern mismatches', () => {
    expect(() =>
      parseProtectedRouteManifest([
        {
          ...validEntry(),
          sourceRouteFile: 'src/app/api/contacts/[id]/route.ts',
        },
      ])
    ).toThrow('sourceRouteFile and routePattern do not correspond')
  })

  it.each([
    '/api/contacts/999999999',
    '/api/jobs',
    '/api/jobs/999999999/extra',
    '/api/jobs/../contacts',
    'https://example.invalid/api/jobs/999999999',
  ])('rejects sample paths that do not concretize the route pattern: %s', (samplePath) => {
    expect(() =>
      parseProtectedRouteManifest([{ ...validEntry(), samplePath }])
    ).toThrow('Invalid protected route manifest')
  })
})

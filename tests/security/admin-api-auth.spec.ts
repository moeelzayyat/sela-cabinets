import { expect, test } from '@playwright/test'
import { SignJWT } from 'jose'

import {
  resolvePlaywrightTarget,
  safeLocalWebServerEnvironment,
} from '../../playwright.config'
import {
  protectedRouteManifest,
  type ProtectedRouteManifestEntry,
} from './protected-route-manifest'

const publicAllowlist = new Set([
  'POST /api/admin/login',
  'POST /api/admin/logout',
  'GET /api/admin/google/start',
  'GET /api/admin/google/callback',
  'POST /api/chat',
])
const isolatedEnvironment = safeLocalWebServerEnvironment({})
const legacyBearer = isolatedEnvironment.ADMIN_API_KEY
let validAdminSession = ''

function key(entry: ProtectedRouteManifestEntry) {
  return `${entry.method} ${entry.routePattern}`
}

function requestOptions(
  entry: ProtectedRouteManifestEntry,
  headers?: Record<string, string>
) {
  return {
    method: entry.method,
    data: entry.method === 'GET' || entry.method === 'HEAD' ? undefined : {},
    headers,
    failOnStatusCode: false,
    maxRedirects: 0,
    timeout: 15_000,
  }
}

test.beforeAll(async ({ baseURL }) => {
  resolvePlaywrightTarget(
    baseURL,
    process.env.SELA_PLAYWRIGHT_ALLOW_EXTERNAL === 'true',
    true
  )

  validAdminSession = await new SignJWT({
    authenticated: true,
    userId: 1,
    email: 'admin@example.invalid',
    provider: 'password',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(isolatedEnvironment.ADMIN_SECRET))
})

test('@auth public credential and entry methods are explicitly allowlisted', () => {
  const actual = protectedRouteManifest
    .filter((entry) => entry.classification === 'public-entry')
    .map(key)
    .sort()

  expect(actual).toEqual(Array.from(publicAllowlist).sort())
  expect(
    protectedRouteManifest.find(
      (entry) => key(entry) === 'GET /api/admin/google/callback'
    )?.requiredInvariant
  ).toContain('allowlist')

})

for (const entry of protectedRouteManifest) {
  if (entry.classification === 'public-entry') continue

  test(`@auth ${entry.method} ${entry.routePattern} enforces ${entry.classification}`, async ({
    baseURL,
    request,
  }) => {
    const unauthenticated = await request.fetch(
      entry.samplePath,
      requestOptions(entry)
    )

    if (entry.classification === 'disabled-for-launch') {
      expect(unauthenticated.status()).toBe(404)
      return
    }

    expect
      .soft(
        [401, 403],
        `${key(entry)} must deny a request without credentials`
      )
      .toContain(unauthenticated.status())

    const withAdminSession = await request.fetch(
      entry.samplePath,
      requestOptions(entry, {
        cookie: `admin_session=${validAdminSession}`,
        origin: new URL(baseURL!).origin,
      })
    )
    expect(
      withAdminSession.headers()['x-sela-admin-authorization'],
      `${key(entry)} must reach the handler with the isolated admin contract fixture`
    ).toBe('accepted')

    if (entry.sideEffects) {
      const crossOrigin = await request.fetch(
        entry.samplePath,
        requestOptions(entry, {
          cookie: `admin_session=${validAdminSession}`,
          origin: 'https://attacker.example',
        })
      )
      expect(
        crossOrigin.status(),
        `${key(entry)} must reject a cross-origin cookie-authenticated mutation`
      ).toBe(403)
    }

    const withLegacyBearer = await request.fetch(
      entry.samplePath,
      requestOptions(entry, {
        authorization: `Bearer ${legacyBearer}`,
      })
    )
    expect
      .soft(
        [401, 403],
        `${key(entry)} must reject the legacy browser bearer mechanism`
      )
      .toContain(withLegacyBearer.status())
  })
}

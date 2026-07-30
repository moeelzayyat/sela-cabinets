// @vitest-environment node

import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { describe, expect, it, vi } from 'vitest'

const { ADMIN_SECRET } = vi.hoisted(() => ({
  ADMIN_SECRET: 'synthetic-middleware-admin-secret-32-chars',
}))

vi.mock('@/env/server-runtime', () => ({
  serverEnv: { ADMIN_SECRET },
}))

import { config, middleware } from '@/middleware'

async function session(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(Buffer.from(ADMIN_SECRET))
}

function adminRequest(token: string) {
  return new NextRequest('http://127.0.0.1:3013/admin', {
    headers: { cookie: `admin_session=${token}` },
  })
}

function publicRequest(pathname: string) {
  return new NextRequest(`http://127.0.0.1:3013${pathname}`)
}

describe('admin page middleware', () => {
  it('redirects a legacy authenticated token without a user ID', async () => {
    const token = await session({ authenticated: true })

    const response = await middleware(adminRequest(token))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe(
      '/admin/login'
    )
  })

  it('accepts a signed authenticated token with a positive user ID', async () => {
    const token = await session({ authenticated: true, userId: 7 })

    const response = await middleware(adminRequest(token))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it.each([
    '/admin/register',
    '/account',
    '/account/login',
    '/account/register',
    '/products',
    '/products/shaker-white',
    '/api/chat',
  ])('returns an exact 404 for disabled public surface %s', async (pathname) => {
    const response = await middleware(publicRequest(pathname))

    expect(response.status).toBe(404)
    expect(response.headers.get('x-middleware-next')).toBeNull()
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
  })

  it('matches all protected and disabled route families', () => {
    expect(config.matcher).toEqual([
      '/admin/:path*',
      '/account/:path*',
      '/products/:path*',
      '/api/chat',
    ])
  })
})

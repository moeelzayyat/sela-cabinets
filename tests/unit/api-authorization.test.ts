import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const { findUserById, getAdminSession } = vi.hoisted(() => ({
  findUserById: vi.fn(),
  getAdminSession: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({ getAdminSession }))
vi.mock('@/lib/admin-users', () => ({ findUserById }))
vi.mock('@/env/server-runtime', () => ({
  serverEnv: {
    NODE_ENV: 'test',
    NEXT_PUBLIC_APP_URL: undefined,
  },
}))

import {
  disabledForLaunch,
  withAdminSession,
} from '@/lib/api-authorization'

function request(method = 'GET', origin?: string) {
  const headers = new Headers({ host: '127.0.0.1:3013' })
  if (origin !== undefined) headers.set('origin', origin)

  return new NextRequest('http://127.0.0.1:3013/api/protected', {
    method,
    headers,
  })
}

function activeAdmin() {
  return { id: 7, is_admin: true, is_active: true }
}

describe('central API authorization', () => {
  beforeEach(() => {
    findUserById.mockReset()
    getAdminSession.mockReset()
  })

  it('denies a missing admin session before invoking the handler', async () => {
    getAdminSession.mockResolvedValue(null)
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(401)
    expect(findUserById).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('denies a session that is not explicitly authenticated', async () => {
    getAdminSession.mockResolvedValue({ authenticated: false })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(401)
    expect(findUserById).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('denies an authenticated token without an immutable user ID', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(401)
    expect(findUserById).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('denies a demoted administrator before invoking the handler', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockResolvedValue({ ...activeAdmin(), is_admin: false })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(403)
    expect(handler).not.toHaveBeenCalled()
  })

  it('denies a disabled administrator before invoking the handler', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockResolvedValue({ ...activeAdmin(), is_active: false })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(403)
    expect(handler).not.toHaveBeenCalled()
  })

  it('fails closed when current administrator status cannot be loaded', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockRejectedValue(new Error('unavailable'))
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(503)
    expect(handler).not.toHaveBeenCalled()
  })

  it('allows a current active administrator to make a safe request', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockResolvedValue(activeAdmin())
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(200)
    expect(response.headers.get('x-sela-admin-authorization')).toBe('accepted')
    expect(findUserById).toHaveBeenCalledWith(7)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('marks handler failures as authorization-accepted without leaking the exception', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockResolvedValue(activeAdmin())
    const handler = vi.fn(async () => {
      throw new Error('sensitive synthetic failure')
    })

    const response = await withAdminSession(handler)(request())

    expect(response.status).toBe(500)
    expect(response.headers.get('x-sela-admin-authorization')).toBe('accepted')
    await expect(response.text()).resolves.not.toContain('sensitive synthetic failure')
  })

  it('rejects an authenticated mutation without an Origin', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(request('POST'))

    expect(response.status).toBe(403)
    expect(findUserById).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('rejects an authenticated cross-origin mutation', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(
      request('PATCH', 'https://attacker.example')
    )

    expect(response.status).toBe(403)
    expect(findUserById).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('allows a current active administrator to make a same-origin mutation', async () => {
    getAdminSession.mockResolvedValue({ authenticated: true, userId: 7 })
    findUserById.mockResolvedValue(activeAdmin())
    const handler = vi.fn(async () => NextResponse.json({ ok: true }))

    const response = await withAdminSession(handler)(
      request('DELETE', 'http://127.0.0.1:3013')
    )

    expect(response.status).toBe(200)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('returns exact 404 for a route disabled for launch', async () => {
    const response = await disabledForLaunch(request('POST'))

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({ error: 'Not found' })
  })
})

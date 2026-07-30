import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { AdminUser } from '@/lib/admin-users'

const loginDependencies = vi.hoisted(() => ({
  createSession: vi.fn(async () => 'synthetic-session'),
  findUserByEmail: vi.fn<
    (email: string) => Promise<AdminUser | null>
  >(async () => null),
  passwordMatches: vi.fn(() => false),
  setAdminSession: vi.fn(async () => undefined),
}))

vi.mock('@/lib/auth', () => ({
  createSession: loginDependencies.createSession,
  setAdminSession: loginDependencies.setAdminSession,
}))
vi.mock('@/lib/admin-users', () => ({
  findUserByEmail: loginDependencies.findUserByEmail,
  passwordMatches: loginDependencies.passwordMatches,
}))

describe('admin password login', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    for (const mock of Object.values(loginDependencies)) mock.mockClear()
  })

  it('does not accept environment fallback credentials without a database admin', async () => {
    vi.stubEnv('ADMIN_EMAIL', 'env-admin@example.invalid')
    vi.stubEnv('ADMIN_PASSWORD', 'env-fallback-password')

    const { POST } = await import('@/app/api/admin/login/route')
    const response = await POST(
      new NextRequest('http://127.0.0.1:3013/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'env-admin@example.invalid',
          password: 'env-fallback-password',
        }),
        headers: { 'content-type': 'application/json' },
      })
    )

    expect(response.status).toBe(401)
    expect(loginDependencies.findUserByEmail).toHaveBeenCalledWith(
      'env-admin@example.invalid'
    )
    expect(loginDependencies.createSession).not.toHaveBeenCalled()
    expect(loginDependencies.setAdminSession).not.toHaveBeenCalled()
  })

  it('rejects a disabled password administrator before issuing a session', async () => {
    loginDependencies.findUserByEmail.mockResolvedValueOnce({
      id: 41,
      email: 'disabled@example.invalid',
      full_name: null,
      phone: null,
      password_hash: 'synthetic-hash',
      provider: 'password',
      is_admin: true,
      is_active: false,
      created_at: '2026-01-01T00:00:00.000Z',
    })
    loginDependencies.passwordMatches.mockReturnValueOnce(true)

    const { POST } = await import('@/app/api/admin/login/route')
    const response = await POST(
      new NextRequest('http://127.0.0.1:3013/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'disabled@example.invalid',
          password: 'correct-password',
        }),
        headers: { 'content-type': 'application/json' },
      })
    )

    expect(response.status).toBe(401)
    expect(loginDependencies.createSession).not.toHaveBeenCalled()
    expect(loginDependencies.setAdminSession).not.toHaveBeenCalled()
  })
})

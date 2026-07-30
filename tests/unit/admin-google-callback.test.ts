import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

const callbackDependencies = vi.hoisted(() => ({
  createSession: vi.fn(async () => 'synthetic-session'),
  jwtVerify: vi.fn(async () => ({
    payload: {
      email: 'verified-but-unlisted@example.invalid',
      email_verified: true,
    },
  })),
  setAdminSession: vi.fn(async () => undefined),
  upsertGoogleUser: vi.fn(async () => undefined),
}))

vi.mock('jose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jose')>()
  return {
    ...actual,
    createRemoteJWKSet: vi.fn(() => Symbol('test-jwks')),
    jwtVerify: callbackDependencies.jwtVerify,
  }
})
vi.mock('@/lib/auth', () => ({
  createSession: callbackDependencies.createSession,
  setAdminSession: callbackDependencies.setAdminSession,
}))
vi.mock('@/lib/admin-users', () => ({
  upsertGoogleUser: callbackDependencies.upsertGoogleUser,
}))

describe('admin Google OAuth callback', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
    for (const mock of Object.values(callbackDependencies)) mock.mockClear()
  })

  it('rejects a verified Google identity when the admin allowlist is empty', async () => {
    vi.stubEnv('ADMIN_GOOGLE_EMAILS', '')
    vi.stubEnv('GOOGLE_CLIENT_ID', 'test-client-id')
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-client-secret')
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3013')

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id_token: 'synthetic-id-token' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const { GET } = await import('@/app/api/admin/google/callback/route')
    const response = await GET(
      new NextRequest(
        'http://127.0.0.1:3013/api/admin/google/callback?code=test-code&state=expected-state',
        { headers: { cookie: 'admin_google_state=expected-state' } }
      )
    )

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(callbackDependencies.jwtVerify).toHaveBeenCalledTimes(1)
    expect(response.headers.get('location')).toBe(
      'http://127.0.0.1:3013/admin/login?error=google_email_not_allowed'
    )
    expect(callbackDependencies.upsertGoogleUser).not.toHaveBeenCalled()
    expect(callbackDependencies.createSession).not.toHaveBeenCalled()
    expect(callbackDependencies.setAdminSession).not.toHaveBeenCalled()
  })

  it('does not request promotion when an allowlisted Google user signs in', async () => {
    vi.stubEnv('ADMIN_GOOGLE_EMAILS', 'admin@example.invalid')
    vi.stubEnv('GOOGLE_CLIENT_ID', 'test-client-id')
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-client-secret')
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://127.0.0.1:3013')
    callbackDependencies.jwtVerify.mockResolvedValueOnce({
      payload: { email: 'admin@example.invalid', email_verified: true },
    } as never)
    callbackDependencies.upsertGoogleUser.mockResolvedValueOnce({
      id: 42,
      email: 'admin@example.invalid',
      is_admin: false,
      is_active: true,
    } as never)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id_token: 'synthetic-id-token' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      )
    )

    const { GET } = await import('@/app/api/admin/google/callback/route')
    const response = await GET(
      new NextRequest(
        'http://127.0.0.1:3013/api/admin/google/callback?code=test-code&state=expected-state',
        { headers: { cookie: 'admin_google_state=expected-state' } }
      )
    )

    expect(callbackDependencies.upsertGoogleUser).toHaveBeenCalledWith(
      'admin@example.invalid'
    )
    expect(response.headers.get('location')).toContain('google_admin_disabled')
    expect(callbackDependencies.createSession).not.toHaveBeenCalled()
  })
})

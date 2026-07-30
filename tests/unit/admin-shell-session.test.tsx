import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const navigation = vi.hoisted(() => ({
  pathname: '/admin',
  replace: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
}))
vi.mock('@/app/admin/logout-button', () => ({
  LogoutButton: () => <button type="button">Log out</button>,
}))

import { AdminShell } from '@/app/admin/admin-shell'

describe('admin page session boundary', () => {
  beforeEach(() => {
    navigation.pathname = '/admin'
    navigation.replace.mockReset()
    vi.unstubAllGlobals()
  })

  it('withholds protected children until current admin status is confirmed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    render(
      <AdminShell>
        <div>Protected dashboard content</div>
      </AdminShell>
    )

    expect(screen.queryByText('Protected dashboard content')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('Protected dashboard content')).toBeInTheDocument()
    )
    expect(fetchMock).toHaveBeenCalledWith('/api/admin/users?session_check=1', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
  })

  it('redirects a stale signed session when current admin status is denied', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 403 }))
    )

    render(
      <AdminShell>
        <div>Protected dashboard content</div>
      </AdminShell>
    )

    expect(screen.queryByText('Protected dashboard content')).not.toBeInTheDocument()
    await waitFor(() => expect(navigation.replace).toHaveBeenCalledWith('/admin/login'))
  })

  it('renders the login route without a protected-session request', () => {
    navigation.pathname = '/admin/login'
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(
      <AdminShell>
        <div>Admin login form</div>
      </AdminShell>
    )

    expect(screen.getByText('Admin login form')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

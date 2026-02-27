import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const ADMIN_SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'sela-cabinets-admin-secret-2026'
)

const USER_SECRET_KEY = new TextEncoder().encode(
  process.env.USER_AUTH_SECRET || process.env.ADMIN_SECRET || 'sela-cabinets-user-secret-2026'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/register')
  ) {
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jwtVerify(token, ADMIN_SECRET_KEY)
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect account routes
  if (
    pathname.startsWith('/account') &&
    !pathname.startsWith('/account/login') &&
    !pathname.startsWith('/account/register')
  ) {
    const token = request.cookies.get('user_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/account/login', request.url))
    }

    try {
      await jwtVerify(token, USER_SECRET_KEY)
    } catch {
      return NextResponse.redirect(new URL('/account/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { serverEnv } from '@/env/server-runtime'

const ADMIN_SECRET_KEY = new TextEncoder().encode(serverEnv.ADMIN_SECRET)
const DISABLED_PUBLIC_PATHS = new Set([
  '/admin/register',
  '/account',
  '/account/login',
  '/account/register',
  '/api/chat',
])
const DISABLED_PUBLIC_PREFIXES = ['/locations/', '/service-areas/'] as const
const ENABLED_PUBLIC_PATHS = new Set(['/service-areas/metro-detroit'])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const normalizedPathname =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (
    !ENABLED_PUBLIC_PATHS.has(normalizedPathname) &&
    (DISABLED_PUBLIC_PATHS.has(normalizedPathname) ||
      DISABLED_PUBLIC_PREFIXES.some((prefix) => normalizedPathname.startsWith(prefix)))
  ) {
    return new NextResponse(null, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

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
      const { payload } = await jwtVerify(token, ADMIN_SECRET_KEY)
      if (
        payload.authenticated !== true ||
        !Number.isSafeInteger(payload.userId) ||
        Number(payload.userId) <= 0
      ) {
        throw new Error('Invalid admin session')
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/api/chat',
    '/locations/:path*',
    '/service-areas/:path*',
  ],
}

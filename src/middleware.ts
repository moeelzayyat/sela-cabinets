import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { serverEnv } from '@/env/server-runtime'

const ADMIN_SECRET_KEY = new TextEncoder().encode(serverEnv.ADMIN_SECRET)

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
  matcher: ['/admin/:path*'],
}

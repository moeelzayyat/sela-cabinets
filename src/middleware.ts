import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'sela-cabinets-admin-secret-2026'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but not /admin/login or /admin/api)
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') && 
      !pathname.startsWith('/admin/register') && 
      !pathname.startsWith('/admin/api')) {
    
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      await jwtVerify(token, SECRET_KEY)
      return NextResponse.next()
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

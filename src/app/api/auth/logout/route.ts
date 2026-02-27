import { NextRequest, NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/user-auth'
import { getAppBaseUrl } from '@/lib/url'

export async function POST(request: NextRequest) {
  await clearUserSession()

  const accept = request.headers.get('accept') || ''
  if (accept.includes('application/json')) {
    return NextResponse.json({ success: true })
  }

  const baseUrl = getAppBaseUrl(request.nextUrl.origin)
  return NextResponse.redirect(new URL('/', baseUrl))
}

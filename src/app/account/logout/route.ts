import { NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/user-auth'
import { getAppBaseUrl } from '@/lib/url'

export async function GET(request: Request) {
  await clearUserSession()
  const baseUrl = getAppBaseUrl(new URL(request.url).origin)
  return NextResponse.redirect(new URL('/', baseUrl))
}

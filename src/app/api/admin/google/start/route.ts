import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

function getBaseUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(new URL('/admin/login?error=google_not_configured', baseUrl))
  }

  const state = randomBytes(16).toString('hex')
  const baseUrl = getBaseUrl(request)
  const redirectUri = `${baseUrl}/api/admin/google/callback`

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('admin_google_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  })

  return response
}

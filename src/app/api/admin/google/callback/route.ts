import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { createSession, setAdminSession } from '@/lib/auth'
import { upsertGoogleUser } from '@/lib/admin-users'

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export const dynamic = 'force-dynamic'

function getBaseUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
}

function getAllowedEmails() {
  const configured = process.env.ADMIN_GOOGLE_EMAILS || ''
  return configured
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      const baseUrl = getBaseUrl(request)
      return NextResponse.redirect(new URL('/admin/login?error=google_not_configured', baseUrl))
    }

    const url = request.nextUrl
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const cookieState = request.cookies.get('admin_google_state')?.value
    const baseUrl = getBaseUrl(request)

    if (!code || !state || !cookieState || state !== cookieState) {
      return NextResponse.redirect(new URL('/admin/login?error=invalid_google_state', baseUrl))
    }
    const redirectUri = `${baseUrl}/api/admin/google/callback`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/admin/login?error=google_token_exchange_failed', baseUrl))
    }

    const tokenJson = await tokenRes.json()
    const idToken = tokenJson.id_token as string | undefined

    if (!idToken) {
      return NextResponse.redirect(new URL('/admin/login?error=missing_google_id_token', baseUrl))
    }

    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    })

    const email = String(payload.email || '').toLowerCase()
    const emailVerified = payload.email_verified === true

    if (!email || !emailVerified) {
      return NextResponse.redirect(new URL('/admin/login?error=google_email_not_verified', baseUrl))
    }

    const allowedEmails = getAllowedEmails()
    if (allowedEmails.length > 0 && !allowedEmails.includes(email)) {
      return NextResponse.redirect(new URL('/admin/login?error=google_email_not_allowed', baseUrl))
    }

    await upsertGoogleUser(email, true)

    const session = await createSession({ authenticated: true, email, provider: 'google' })
    await setAdminSession(session)

    const response = NextResponse.redirect(new URL('/admin', baseUrl))
    response.cookies.delete('admin_google_state')
    return response
  } catch (error) {
    console.error('Google admin login callback error:', error)
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(new URL('/admin/login?error=google_callback_failed', baseUrl))
  }
}

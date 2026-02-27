import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { getAppBaseUrl } from '@/lib/url'
import { upsertGoogleUser } from '@/lib/admin-users'
import { createUserSession, setUserSession } from '@/lib/user-auth'

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const baseUrl = getAppBaseUrl(request.nextUrl.origin)

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/account/login?error=google_not_configured', baseUrl))
    }

    const code = request.nextUrl.searchParams.get('code')
    const state = request.nextUrl.searchParams.get('state')
    const cookieState = request.cookies.get('user_google_state')?.value

    if (!code || !state || !cookieState || state !== cookieState) {
      return NextResponse.redirect(new URL('/account/login?error=invalid_google_state', baseUrl))
    }

    const redirectUri = `${baseUrl}/api/auth/google/callback`

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
      return NextResponse.redirect(new URL('/account/login?error=google_token_exchange_failed', baseUrl))
    }

    const tokenJson = await tokenRes.json()
    const idToken = tokenJson.id_token as string | undefined
    if (!idToken) {
      return NextResponse.redirect(new URL('/account/login?error=missing_google_id_token', baseUrl))
    }

    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    })

    const email = String(payload.email || '').toLowerCase().trim()
    const fullName = String(payload.name || '').trim() || undefined
    const emailVerified = payload.email_verified === true

    if (!email || !emailVerified) {
      return NextResponse.redirect(new URL('/account/login?error=google_email_not_verified', baseUrl))
    }

    const user = await upsertGoogleUser(email, false, fullName)
    if (!user) {
      return NextResponse.redirect(new URL('/account/login?error=user_upsert_failed', baseUrl))
    }

    const token = await createUserSession({
      userId: user.id,
      email: user.email,
      fullName: user.full_name || fullName,
      isAdmin: user.is_admin,
    })
    await setUserSession(token)

    const response = NextResponse.redirect(new URL('/account', baseUrl))
    response.cookies.delete('user_google_state')
    return response
  } catch (error) {
    console.error('Google user login callback error:', error)
    const baseUrl = getAppBaseUrl(request.nextUrl.origin)
    return NextResponse.redirect(new URL('/account/login?error=google_callback_failed', baseUrl))
  }
}

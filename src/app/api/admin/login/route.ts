import { NextRequest, NextResponse } from 'next/server'
import { createSession, setAdminSession } from '@/lib/auth'
import { findUserByEmail, passwordMatches } from '@/lib/admin-users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body?.email || '').toLowerCase().trim()
    const password = body?.password

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(email)

    const validDbLogin =
      !!user &&
      user.is_admin &&
      user.is_active &&
      user.provider === 'password' &&
      passwordMatches(password, user.password_hash)

    if (!validDbLogin) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session token
    const token = await createSession({
      authenticated: true,
      userId: user.id,
      email,
      provider: 'password',
    })
    
    // Set session cookie
    await setAdminSession(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

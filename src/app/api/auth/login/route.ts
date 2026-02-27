import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, passwordMatches } from '@/lib/admin-users'
import { createUserSession, setUserSession } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body?.email || '').toLowerCase().trim()
    const password = body?.password || ''

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    const valid = !!user && user.provider === 'password' && passwordMatches(password, user.password_hash)

    if (!valid || !user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createUserSession({ userId: user.id, email: user.email, fullName: user.full_name || undefined, isAdmin: user.is_admin })
    await setUserSession(token)

    return NextResponse.json({ success: true, isAdmin: user.is_admin })
  } catch (error) {
    console.error('User login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

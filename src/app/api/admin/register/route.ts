import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/admin-users'
import { createSession, setAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body?.email || '').toLowerCase().trim()
    const password = body?.password || ''

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const exists = await findUserByEmail(email)
    if (exists) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
    }

    const allowedEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
    if (allowedEmail && email !== allowedEmail) {
      return NextResponse.json({ success: false, error: 'Not allowed to self-register as admin' }, { status: 403 })
    }

    const user = await createUser(email, password, undefined, undefined, true)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Failed to create account' }, { status: 500 })
    }

    const token = await createSession({ authenticated: true, email: user.email, provider: 'password' })
    await setAdminSession(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin register error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

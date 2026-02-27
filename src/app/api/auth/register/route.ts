import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/admin-users'
import { createUserSession, setUserSession } from '@/lib/user-auth'
import { pool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body?.email || '').toLowerCase().trim()
    const password = body?.password || ''
    const fullName = (body?.fullName || '').trim()
    const phone = (body?.phone || '').trim()

    if (!email || !password || !fullName) {
      return NextResponse.json({ success: false, error: 'Full name, email, and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
    }

    const user = await createUser(email, password, fullName, phone, false)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Failed to create account' }, { status: 500 })
    }

    // Add to contacts so admin sees all registered users
    try {
      await pool.query(
        `INSERT INTO contacts (name, phone, email, contact_type, notes, tags)
         VALUES ($1, $2, $3, 'customer', $4, $5)
         ON CONFLICT DO NOTHING`,
        [fullName, phone || null, email, 'Registered website account', ['portal-user']]
      )
    } catch (e) {
      console.warn('Could not create contact for registered user:', e)
    }

    const token = await createUserSession({ userId: user.id, email: user.email, fullName: user.full_name || fullName, isAdmin: user.is_admin })
    await setUserSession(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User register error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

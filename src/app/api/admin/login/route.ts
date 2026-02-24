import { NextRequest, NextResponse } from 'next/server'
import { createSession, setAdminSession } from '@/lib/auth'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sela2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create session token
    const token = await createSession()
    
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

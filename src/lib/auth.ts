import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'sela-cabinets-admin-secret-2026'
)

export interface AdminSession {
  authenticated: boolean
  email?: string
  provider?: 'password' | 'google'
  exp?: number
}

export async function createSession(payload: AdminSession = { authenticated: true }): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET_KEY)
  
  return token
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as AdminSession
  } catch (err) {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  
  if (!token) return null
  
  return verifySession(token)
}

export async function setAdminSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { serverEnv } from '@/env/server-runtime'

const SECRET_KEY = new TextEncoder().encode(serverEnv.USER_AUTH_SECRET)

export interface UserSession {
  userId: number
  email: string
  fullName?: string
  isAdmin?: boolean
  exp?: number
}

export async function createUserSession(payload: Omit<UserSession, 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('14d')
    .sign(SECRET_KEY)
}

export async function verifyUserSession(token: string): Promise<UserSession | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    return verified.payload as unknown as UserSession
  } catch {
    return null
  }
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value
  if (!token) return null
  return verifyUserSession(token)
}

export async function setUserSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('user_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete('user_session')
}

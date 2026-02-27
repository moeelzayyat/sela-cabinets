import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { pool } from '@/lib/db'

export interface AdminUser {
  id: number
  email: string
  password_hash: string | null
  provider: 'password' | 'google'
  created_at: string
}

export async function ensureAdminUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      provider TEXT NOT NULL DEFAULT 'password',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':')
  const keyBuffer = Buffer.from(key, 'hex')
  const derived = scryptSync(password, salt, 64)
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  await ensureAdminUsersTable()
  const result = await pool.query(
    'SELECT id, email, password_hash, provider, created_at FROM admin_users WHERE email = $1 LIMIT 1',
    [email.toLowerCase().trim()]
  )
  return result.rows[0] || null
}

export async function createAdminUser(email: string, password: string) {
  await ensureAdminUsersTable()
  const passwordHash = hashPassword(password)
  const result = await pool.query(
    `INSERT INTO admin_users (email, password_hash, provider)
     VALUES ($1, $2, 'password')
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, password_hash, provider, created_at`,
    [email.toLowerCase().trim(), passwordHash]
  )
  return result.rows[0] || null
}

export async function upsertGoogleAdminUser(email: string) {
  await ensureAdminUsersTable()
  const result = await pool.query(
    `INSERT INTO admin_users (email, provider)
     VALUES ($1, 'google')
     ON CONFLICT (email) DO UPDATE SET provider = 'google'
     RETURNING id, email, password_hash, provider, created_at`,
    [email.toLowerCase().trim()]
  )
  return result.rows[0] || null
}

export function passwordMatches(password: string, hash: string | null) {
  if (!hash) return false
  return verifyPassword(password, hash)
}

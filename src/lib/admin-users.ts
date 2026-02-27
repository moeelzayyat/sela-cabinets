import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { pool } from '@/lib/db'

export interface AdminUser {
  id: number
  email: string
  full_name: string | null
  phone: string | null
  password_hash: string | null
  provider: 'password' | 'google'
  is_admin: boolean
  created_at: string
}

export async function ensureAdminUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      phone TEXT,
      password_hash TEXT,
      provider TEXT NOT NULL DEFAULT 'password',
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Safe incremental upgrades for existing table
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT`)
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone TEXT`)
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false`)
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

export async function listUsers(): Promise<AdminUser[]> {
  await ensureAdminUsersTable()
  const result = await pool.query(
    `SELECT id, email, full_name, phone, password_hash, provider, is_admin, created_at
     FROM admin_users ORDER BY created_at DESC`
  )
  return result.rows
}

export async function findUserByEmail(email: string): Promise<AdminUser | null> {
  await ensureAdminUsersTable()
  const result = await pool.query(
    'SELECT id, email, full_name, phone, password_hash, provider, is_admin, created_at FROM admin_users WHERE email = $1 LIMIT 1',
    [email.toLowerCase().trim()]
  )
  return result.rows[0] || null
}

export async function findUserById(id: number): Promise<AdminUser | null> {
  await ensureAdminUsersTable()
  const result = await pool.query(
    'SELECT id, email, full_name, phone, password_hash, provider, is_admin, created_at FROM admin_users WHERE id = $1 LIMIT 1',
    [id]
  )
  return result.rows[0] || null
}

export async function createUser(email: string, password: string, fullName?: string, phone?: string, isAdmin = false) {
  await ensureAdminUsersTable()
  const passwordHash = hashPassword(password)
  const result = await pool.query(
    `INSERT INTO admin_users (email, full_name, phone, password_hash, provider, is_admin)
     VALUES ($1, $2, $3, $4, 'password', $5)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, full_name, phone, password_hash, provider, is_admin, created_at`,
    [email.toLowerCase().trim(), fullName || null, phone || null, passwordHash, isAdmin]
  )
  return result.rows[0] || null
}

export async function upsertGoogleUser(email: string, isAdmin = false) {
  await ensureAdminUsersTable()
  const result = await pool.query(
    `INSERT INTO admin_users (email, provider, is_admin)
     VALUES ($1, 'google', $2)
     ON CONFLICT (email) DO UPDATE SET provider = 'google'
     RETURNING id, email, full_name, phone, password_hash, provider, is_admin, created_at`,
    [email.toLowerCase().trim(), isAdmin]
  )
  return result.rows[0] || null
}

export async function setUserAdminAccess(id: number, isAdmin: boolean) {
  await ensureAdminUsersTable()
  const result = await pool.query(
    `UPDATE admin_users SET is_admin = $1 WHERE id = $2
     RETURNING id, email, full_name, phone, password_hash, provider, is_admin, created_at`,
    [isAdmin, id]
  )
  return result.rows[0] || null
}

export function passwordMatches(password: string, hash: string | null) {
  if (!hash) return false
  return verifyPassword(password, hash)
}

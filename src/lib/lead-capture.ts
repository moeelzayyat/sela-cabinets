/**
 * Lead Capture - Direct PostgreSQL Integration
 * Writes leads directly to the coolify-db PostgreSQL database
 */

import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://coolify:dFVc16CJwW02ogeO9pQt5rBPSE0/KPp6Tyjar2w6eS4=@coolify-db:5432/coolify',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

export interface LeadData {
  name: string
  phone: string
  email: string
  address?: string
  city?: string
  zip?: string
  source: 'estimate' | 'booking' | 'contact'
  timeline?: string
  style_preference?: string
  notes?: string
  appointment_type?: string
  appointment_date?: Date
  photos?: string[]
}

/**
 * Add a new lead to the database
 */
export async function addLead(data: LeadData): Promise<{ success: boolean; id?: number; error?: string }> {
  const client = await pool.connect()
  
  try {
    const result = await client.query(
      `INSERT INTO leads (
        name, phone, email, address, city, zip, source, timeline, 
        style_preference, notes, appointment_type, appointment_date, photos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [
        data.name,
        data.phone,
        data.email,
        data.address || null,
        data.city || null,
        data.zip || null,
        data.source,
        data.timeline || null,
        data.style_preference || null,
        data.notes || null,
        data.appointment_type || null,
        data.appointment_date || null,
        data.photos || []
      ]
    )

    return { success: true, id: result.rows[0].id }
  } catch (error) {
    console.error('Error adding lead:', error)
    return { success: false, error: 'Failed to save lead' }
  } finally {
    client.release()
  }
}

/**
 * Get all leads with optional filters
 */
export async function getLeads(filters?: {
  status?: string
  source?: string
  limit?: number
  offset?: number
}): Promise<any[]> {
  const client = await pool.connect()
  
  try {
    let query = 'SELECT * FROM leads'
    const conditions: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (filters?.status) {
      conditions.push(`status = $${paramCount++}`)
      values.push(filters.status)
    }
    if (filters?.source) {
      conditions.push(`source = $${paramCount++}`)
      values.push(filters.source)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY created_at DESC'

    if (filters?.limit) {
      query += ` LIMIT $${paramCount++}`
      values.push(filters.limit)
    }
    if (filters?.offset) {
      query += ` OFFSET $${paramCount++}`
      values.push(filters.offset)
    }

    const result = await client.query(query, values)
    return result.rows
  } finally {
    client.release()
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(id: number, status: string): Promise<boolean> {
  const client = await pool.connect()
  
  try {
    await client.query(
      'UPDATE leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    )
    return true
  } catch (error) {
    console.error('Error updating lead status:', error)
    return false
  } finally {
    client.release()
  }
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: number): Promise<any | null> {
  const client = await pool.connect()
  
  try {
    const result = await client.query('SELECT * FROM leads WHERE id = $1', [id])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

/**
 * Get lead statistics
 */
export async function getLeadStats(): Promise<{
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
}> {
  const client = await pool.connect()
  
  try {
    const [totalResult, statusResult, sourceResult] = await Promise.all([
      client.query('SELECT COUNT(*) FROM leads'),
      client.query('SELECT status, COUNT(*) as count FROM leads GROUP BY status'),
      client.query('SELECT source, COUNT(*) as count FROM leads GROUP BY source')
    ])

    const byStatus: Record<string, number> = {}
    statusResult.rows.forEach(row => {
      byStatus[row.status] = parseInt(row.count)
    })

    const bySource: Record<string, number> = {}
    sourceResult.rows.forEach(row => {
      bySource[row.source] = parseInt(row.count)
    })

    return {
      total: parseInt(totalResult.rows[0].count),
      byStatus,
      bySource
    }
  } finally {
    client.release()
  }
}

/**
 * Find lead by email
 */
export async function findLeadByEmail(email: string): Promise<any | null> {
  const client = await pool.connect()
  
  try {
    const result = await client.query('SELECT * FROM leads WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [email])
    return result.rows[0] || null
  } finally {
    client.release()
  }
}

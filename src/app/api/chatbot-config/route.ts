import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://coolify:dFVc16CJwW02ogeO9pQt5rBPSE0%2FKPp6Tyjar2w6eS4%3D@coolify-db:5432/coolify?sslmode=disable',
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// GET - Retrieve chatbot configuration
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT key, value, updated_at FROM chatbot_config ORDER BY key'
      )
      
      const config: Record<string, { value: string; updated_at: string }> = {}
      result.rows.forEach(row => {
        config[row.key] = {
          value: row.value,
          updated_at: row.updated_at
        }
      })

      return NextResponse.json({ config })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching chatbot config:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

// POST - Update chatbot configuration
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, value } = await request.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query(
        `INSERT INTO chatbot_config (key, value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key)
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      )

      return NextResponse.json({ success: true, message: 'Configuration updated' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating chatbot config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}

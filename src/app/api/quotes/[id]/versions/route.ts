import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// GET - Get quote versions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT id, version_number, subtotal, total, created_at, created_by, notes
         FROM quote_versions 
         WHERE quote_id = $1 
         ORDER BY version_number DESC`,
        [parseInt(params.id)]
      )

      return NextResponse.json({ versions: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching quote versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

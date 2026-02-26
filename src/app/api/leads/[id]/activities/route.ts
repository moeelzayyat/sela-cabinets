import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// GET - Get activities for a lead
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
        `SELECT * FROM lead_activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [parseInt(params.id)]
      )

      return NextResponse.json({ activities: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

// POST - Log new activity
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { activity_type, description, old_value, new_value, created_by } = body

    if (!activity_type) {
      return NextResponse.json({ error: 'Activity type is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO lead_activities (lead_id, activity_type, description, old_value, new_value, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [parseInt(params.id), activity_type, description, old_value, new_value, created_by || 'Way']
      )

      return NextResponse.json({ success: true, activity: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}

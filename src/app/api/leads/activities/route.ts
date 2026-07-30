import { NextRequest, NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/api-authorization'
import { pool } from '@/lib/db'

async function GETHandler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const leadId = searchParams.get('lead_id')

    if (!leadId) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT id, activity_type, description, old_value, new_value, created_by, created_at
        FROM lead_activities
        WHERE lead_id = $1
        ORDER BY created_at DESC
        LIMIT 50
      `, [parseInt(leadId)])

      return NextResponse.json({ activities: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

async function POSTHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id, activity_type, description, old_value, new_value, created_by } = body

    if (!lead_id || !activity_type) {
      return NextResponse.json({ error: 'lead_id and activity_type are required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(`
        INSERT INTO lead_activities (lead_id, activity_type, description, old_value, new_value, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [lead_id, activity_type, description, old_value, new_value, created_by || 'Way'])

      return NextResponse.json({ success: true, activity: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}

export const GET = withAdminSession(GETHandler)
export const POST = withAdminSession(POSTHandler)

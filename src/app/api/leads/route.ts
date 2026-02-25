import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getLeadStats, updateLeadStatus } from '@/lib/lead-capture'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

// Simple API key check (in production, use proper auth)
const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function GET(request: NextRequest) {
  try {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const [leads, stats] = await Promise.all([
      getLeads({ status, source, limit, offset }),
      getLeadStats()
    ])

    return NextResponse.json({
      leads,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 })
    }

    const body = await request.json()
    
    // Support all new fields from Phase 1.2
    const allowedFields = [
      'status', 'notes', 'timeline', 'style_preference',
      'budget', 'project_type', 'room_size', 'cabinet_line',
      'referral_source', 'priority', 'next_follow_up', 'assigned_to'
    ]

    const client = await pool.connect()
    try {
      // Get old values for activity logging
      const oldLead = await client.query('SELECT * FROM leads WHERE id = $1', [parseInt(id)])
      if (oldLead.rows.length === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }

      // Build dynamic update query
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updates.push(`${field} = $${paramCount++}`)
          values.push(body[field])
        }
      }

      if (updates.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(parseInt(id))

      const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`
      const result = await client.query(query, values)

      // Log activity for status changes
      if (body.status && body.status !== oldLead.rows[0].status) {
        await client.query(
          `INSERT INTO lead_activities (lead_id, activity_type, description, old_value, new_value)
           VALUES ($1, 'status_change', $2, $3, $4)`,
          [parseInt(id), `Status changed to ${body.status}`, oldLead.rows[0].status, body.status]
        )
      }

      // Log activity for other significant changes
      if (body.notes !== undefined && body.notes !== oldLead.rows[0].notes && body.notes) {
        await client.query(
          `INSERT INTO lead_activities (lead_id, activity_type, description)
           VALUES ($1, 'note_added', 'Note added')`,
          [parseInt(id)]
        )
      }

      return NextResponse.json({ success: true, lead: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('DELETE FROM leads WHERE id = $1', [parseInt(id)])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    )
  }
}

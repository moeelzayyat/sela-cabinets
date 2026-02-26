import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getLeadStats } from '@/lib/lead-capture'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    const client = await pool.connect()
    try {
      if (id) {
        // Get single lead
        const result = await client.query('SELECT * FROM leads WHERE id = $1', [parseInt(id)])
        if (result.rows.length === 0) {
          return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
        }
        return NextResponse.json({ lead: result.rows[0] })
      }

      // List leads
      const status = searchParams.get('status') || undefined
      const source = searchParams.get('source') || undefined
      const limit = parseInt(searchParams.get('limit') || '50')
      const offset = parseInt(searchParams.get('offset') || '0')

      const [leads, stats] = await Promise.all([
        getLeads({ status, source, limit, offset }),
        getLeadStats()
      ])

      return NextResponse.json({
        leads,
        stats,
        pagination: { limit, offset, total: stats.total }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
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
    const { 
      status, notes, timeline, style_preference, 
      budget, project_type, room_size, cabinet_line, 
      referral_source, priority, next_follow_up 
    } = body

    const client = await pool.connect()
    try {
      // Get current lead for activity logging
      const currentResult = await client.query('SELECT * FROM leads WHERE id = $1', [parseInt(id)])
      if (currentResult.rows.length === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      }
      const current = currentResult.rows[0]

      // Build dynamic update query
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (status && status !== current.status) {
        updates.push(`status = $${paramCount++}`)
        values.push(status)
        // Log status change
        await client.query(
          'INSERT INTO lead_activities (lead_id, activity_type, description, old_value, new_value) VALUES ($1, $2, $3, $4, $5)',
          [parseInt(id), 'status_change', `Status changed from ${current.status} to ${status}`, current.status, status]
        )
      }
      if (notes !== undefined && notes !== current.notes) {
        updates.push(`notes = $${paramCount++}`)
        values.push(notes)
        if (notes && !current.notes) {
          await client.query(
            'INSERT INTO lead_activities (lead_id, activity_type, description) VALUES ($1, $2, $3)',
            [parseInt(id), 'note_added', 'Note added']
          )
        }
      }
      if (timeline !== undefined) {
        updates.push(`timeline = $${paramCount++}`)
        values.push(timeline)
      }
      if (style_preference !== undefined) {
        updates.push(`style_preference = $${paramCount++}`)
        values.push(style_preference)
      }
      if (budget !== undefined) {
        updates.push(`budget = $${paramCount++}`)
        values.push(budget)
      }
      if (project_type !== undefined) {
        updates.push(`project_type = $${paramCount++}`)
        values.push(project_type)
      }
      if (room_size !== undefined) {
        updates.push(`room_size = $${paramCount++}`)
        values.push(room_size)
      }
      if (cabinet_line !== undefined) {
        updates.push(`cabinet_line = $${paramCount++}`)
        values.push(cabinet_line)
      }
      if (referral_source !== undefined) {
        updates.push(`referral_source = $${paramCount++}`)
        values.push(referral_source)
      }
      if (priority !== undefined) {
        updates.push(`priority = $${paramCount++}`)
        values.push(priority)
      }
      if (next_follow_up !== undefined) {
        updates.push(`next_follow_up = $${paramCount++}`)
        values.push(next_follow_up || null)
      }

      if (updates.length === 0) {
        return NextResponse.json({ success: true, lead: current })
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(parseInt(id))

      const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`
      const result = await client.query(query, values)

      return NextResponse.json({ success: true, lead: result.rows[0] })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}

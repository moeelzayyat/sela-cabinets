import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/appointments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query(`
      SELECT 
        a.*,
        l.name as lead_name,
        l.phone as lead_phone,
        c.name as customer_name
      FROM appointments a
      LEFT JOIN leads l ON a.lead_id = l.id
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE a.id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

// PUT /api/appointments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    const {
      title,
      start,
      end,
      allDay,
      eventType,
      notes,
      crewMembers,
      leadId,
      customerId,
      status
    } = data
    
    const result = await pool.query(`
      UPDATE appointments SET
        title = COALESCE($1, title),
        appointment_date = COALESCE($2, appointment_date),
        end_time = $3,
        all_day = COALESCE($4, all_day),
        event_type = COALESCE($5, event_type),
        notes = $6,
        crew_members = $7,
        lead_id = $8,
        customer_id = $9,
        status = COALESCE($10, status),
        updated_at = now()
      WHERE id = $11
      RETURNING *
    `, [
      title, start, end, allDay, eventType,
      notes, crewMembers, leadId, customerId, status, id
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Instead of deleting, mark as cancelled
    const result = await pool.query(`
      UPDATE appointments SET
        status = 'cancelled',
        updated_at = now()
      WHERE id = $1
      RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Appointment cancelled' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}

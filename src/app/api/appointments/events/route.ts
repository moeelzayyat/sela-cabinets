import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/appointments/events - Get all appointments for calendar
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    
    let query = `
      SELECT 
        a.id,
        a.title,
        a.appointment_date as start,
        a.end_time as end,
        a.all_day as "allDay",
        a.event_type as "eventType",
        a.status,
        a.notes,
        a.color,
        a.crew_members as "crewMembers",
        a.lead_id as "leadId",
        a.customer_id as "customerId",
        a.appointment_type as "appointmentType",
        l.name as "leadName",
        l.phone as "leadPhone",
        c.name as "customerName"
      FROM appointments a
      LEFT JOIN leads l ON a.lead_id = l.id
      LEFT JOIN customers c ON a.customer_id = c.id
      WHERE a.status != 'cancelled'
    `
    
    const params: any[] = []
    if (startDate && endDate) {
      query += ` AND a.appointment_date >= $1 AND a.appointment_date <= $2`
      params.push(startDate, endDate)
    }
    
    query += ` ORDER BY a.appointment_date ASC`
    
    const result = await pool.query(query, params)
    
    // Transform data for calendar
    const events = result.rows.map(row => ({
      id: row.id,
      title: row.title || row.leadName || row.customerName || 'Untitled Event',
      start: row.start,
      end: row.end,
      allDay: row.allDay,
      eventType: row.eventType,
      status: row.status,
      notes: row.notes,
      color: getEventColor(row.eventType, row.status),
      crewMembers: row.crewMembers || [],
      leadId: row.leadId,
      customerId: row.customerId,
      leadName: row.leadName,
      leadPhone: row.leadPhone,
      appointmentType: row.appointmentType
    }))
    
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST /api/appointments/events - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      title,
      start,
      end,
      allDay = false,
      eventType = 'consultation',
      notes,
      crewMembers = [],
      leadId,
      customerId,
      appointmentType = 'in-home'
    } = data
    
    // Generate title from lead if not provided
    let eventTitle = title
    if (!eventTitle && leadId) {
      const leadResult = await pool.query('SELECT name FROM leads WHERE id = $1', [leadId])
      if (leadResult.rows[0]) {
        eventTitle = `${leadResult.rows[0].name} - ${eventType.replace('_', ' ')}`
      }
    }
    
    const result = await pool.query(`
      INSERT INTO appointments (
        title, appointment_date, end_time, all_day, event_type,
        notes, crew_members, lead_id, customer_id, appointment_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled')
      RETURNING *
    `, [
      eventTitle, start, end, allDay, eventType,
      notes, crewMembers, leadId, customerId, appointmentType
    ])
    
    return NextResponse.json({ appointment: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}

function getEventColor(eventType: string, status: string): string {
  if (status === 'completed') return 'emerald'
  if (status === 'cancelled') return 'slate'
  
  switch (eventType) {
    case 'consultation': return 'amber'
    case 'installation': return 'blue'
    case 'follow_up': return 'purple'
    case 'delivery': return 'green'
    default: return 'slate'
  }
}

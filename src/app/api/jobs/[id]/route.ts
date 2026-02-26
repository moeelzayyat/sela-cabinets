import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/jobs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query(`
      SELECT 
        j.*,
        l.name as lead_name,
        l.phone as lead_phone,
        l.email as lead_email,
        l.address as lead_address,
        l.city as lead_city,
        q.quote_number,
        q.total as quote_total
      FROM jobs j
      LEFT JOIN leads l ON j.lead_id = l.id
      LEFT JOIN quotes q ON j.quote_id = q.id
      WHERE j.id = $1
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    return NextResponse.json({ job: result.rows[0] })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

// PUT /api/jobs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    const {
      jobNumber,
      startDate,
      completionDate,
      cabinetLine,
      orderDetails,
      crewMembers,
      phase,
      photos,
      punchList,
      address,
      customerPhone,
      customerEmail,
      totalAmount,
      notes,
      status
    } = data
    
    const result = await pool.query(`
      UPDATE jobs SET
        job_number = COALESCE($1, job_number),
        start_date = $2,
        completion_date = $3,
        cabinet_line = $4,
        order_details = $5,
        crew_members = $6,
        phase = COALESCE($7, phase),
        photos = COALESCE($8, photos),
        punch_list = COALESCE($9, punch_list),
        address = $10,
        customer_phone = $11,
        customer_email = $12,
        total_amount = $13,
        notes = $14,
        status = COALESCE($15, status),
        updated_at = now()
      WHERE id = $16
      RETURNING *
    `, [
      jobNumber, startDate, completionDate, cabinetLine, orderDetails,
      crewMembers, phase, photos, punchList, address, customerPhone,
      customerEmail, totalAmount, notes, status, id
    ])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    return NextResponse.json({ job: result.rows[0] })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query(`
      UPDATE jobs SET
        status = 'cancelled',
        updated_at = now()
      WHERE id = $1
      RETURNING *
    `, [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Job cancelled' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}

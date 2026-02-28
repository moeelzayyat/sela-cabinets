import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// Helper to ensure appointments table has job_id column
async function ensureJobIdColumn() {
  try {
    await pool.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS job_id UUID
    `)
  } catch (error) {
    // Column might already exist, ignore
  }
}

// Helper to update calendar appointment when job changes
async function syncJobToCalendar(jobId: string, job: any) {
  await ensureJobIdColumn()
  
  // Get lead name for the event title
  let leadName: string | undefined
  if (job.lead_id) {
    const leadResult = await pool.query('SELECT name FROM leads WHERE id = $1', [job.lead_id])
    if (leadResult.rows[0]) {
      leadName = leadResult.rows[0].name
    }
  }
  
  // Check if appointment exists for this job
  const existingResult = await pool.query(
    'SELECT id FROM appointments WHERE job_id = $1',
    [jobId]
  )
  
  if (job.start_date) {
    const eventTitle = `Installation: ${leadName || job.job_number || 'Job'}`
    
    if (existingResult.rows.length > 0) {
      // Update existing appointment
      await pool.query(`
        UPDATE appointments SET
          title = $1,
          appointment_date = $2,
          notes = $3,
          crew_members = $4,
          status = CASE 
            WHEN $5 = 'completed' THEN 'completed'
            WHEN $5 = 'cancelled' THEN 'cancelled'
            ELSE 'scheduled'
          END,
          updated_at = now()
        WHERE job_id = $6
      `, [
        eventTitle,
        job.start_date,
        job.notes || `Job: ${job.job_number}${job.order_details ? '\n\n' + job.order_details : ''}`,
        job.crew_members || [],
        job.status,
        jobId
      ])
    } else {
      // Create new appointment if job has a date but no appointment exists
      await pool.query(`
        INSERT INTO appointments (
          title, appointment_date, end_time, all_day, event_type,
          notes, crew_members, lead_id, job_id, appointment_type, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled')
      `, [
        eventTitle,
        job.start_date,
        null,
        true,
        'installation',
        job.notes || `Job: ${job.job_number}${job.order_details ? '\n\n' + job.order_details : ''}`,
        job.crew_members || [],
        job.lead_id,
        jobId,
        'in-home'
      ])
    }
  } else if (existingResult.rows.length > 0) {
    // Job no longer has a date, cancel the appointment
    await pool.query(
      "UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1",
      [jobId]
    )
  }
}

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
    
    const job = result.rows[0]
    
    // Sync to calendar when start_date, status, or other relevant fields change
    if (startDate !== undefined || status !== undefined || crewMembers !== undefined) {
      await syncJobToCalendar(id, job)
    }
    
    return NextResponse.json({ job })
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
    
    const job = result.rows[0]
    
    // Also cancel the calendar appointment
    await ensureJobIdColumn()
    await pool.query(
      "UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1",
      [id]
    )
    
    return NextResponse.json({ message: 'Job cancelled' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/jobs - List all jobs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const phase = searchParams.get('phase')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = `
      SELECT 
        j.*,
        l.name as lead_name,
        l.phone as lead_phone,
        l.email as lead_email,
        q.quote_number,
        q.total as quote_total
      FROM jobs j
      LEFT JOIN leads l ON j.lead_id = l.id
      LEFT JOIN quotes q ON j.quote_id = q.id
      WHERE 1=1
    `
    const params: any[] = []
    
    if (status) {
      params.push(status)
      query += ` AND j.status = $${params.length}`
    }
    
    if (phase) {
      params.push(phase)
      query += ` AND j.phase = $${params.length}`
    }
    
    query += ` ORDER BY j.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)
    
    const result = await pool.query(query, params)
    
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM jobs')
    const total = parseInt(countResult.rows[0].count)
    
    return NextResponse.json({
      jobs: result.rows,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

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

// Helper to create calendar appointment from job
async function createJobAppointment(job: any, leadName?: string) {
  if (!job.start_date) return null
  
  await ensureJobIdColumn()
  
  const eventTitle = `Installation: ${leadName || job.job_number || 'New Job'}`
  
  const result = await pool.query(`
    INSERT INTO appointments (
      title, appointment_date, end_time, all_day, event_type,
      notes, crew_members, lead_id, job_id, appointment_type, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled')
    RETURNING *
  `, [
    eventTitle,
    job.start_date,
    null, // end_time - could calculate if needed
    true, // all_day for installations
    'installation',
    job.notes || `Job: ${job.job_number}${job.order_details ? '\n\n' + job.order_details : ''}`,
    job.crew_members || [],
    job.lead_id,
    job.id,
    'in-home'
  ])
  
  return result.rows[0]
}

// Helper to update calendar appointment when job changes
async function updateJobAppointment(jobId: string, job: any, leadName?: string) {
  await ensureJobIdColumn()
  
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
      await createJobAppointment(job, leadName)
    }
  } else if (existingResult.rows.length > 0) {
    // Job no longer has a date, cancel the appointment
    await pool.query(
      "UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1",
      [jobId]
    )
  }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      leadId,
      quoteId,
      jobNumber,
      startDate,
      cabinetLine,
      orderDetails,
      crewMembers,
      address,
      customerPhone,
      customerEmail,
      totalAmount,
      notes
    } = data
    
    // Generate job number if not provided
    let jobNum = jobNumber
    if (!jobNum) {
      const countResult = await pool.query('SELECT COUNT(*) FROM jobs')
      const count = parseInt(countResult.rows[0].count) + 1
      jobNum = `JOB-${String(count).padStart(4, '0')}`
    }
    
    // Get lead info if not provided
    let leadName: string | undefined
    if (leadId) {
      const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [leadId])
      if (leadResult.rows[0]) {
        const lead = leadResult.rows[0]
        leadName = lead.name
        if (!address) data.address = `${lead.address || ''} ${lead.city || ''}`.trim()
        if (!customerPhone) data.customerPhone = lead.phone
        if (!customerEmail) data.customerEmail = lead.email
      }
    }
    
    const result = await pool.query(`
      INSERT INTO jobs (
        lead_id, quote_id, job_number, start_date, cabinet_line,
        order_details, crew_members, phase, photos, punch_list,
        address, customer_phone, customer_email, total_amount, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'measure', '{}', '[]', $8, $9, $10, $11, $12, 'scheduled')
      RETURNING *
    `, [
      leadId, quoteId, jobNum, startDate, cabinetLine,
      orderDetails, crewMembers, address, data.customerPhone, data.customerEmail,
      totalAmount, notes
    ])
    
    const job = result.rows[0]
    
    // Automatically create calendar appointment if job has a start date
    if (startDate) {
      await createJobAppointment(job, leadName)
    }
    
    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}

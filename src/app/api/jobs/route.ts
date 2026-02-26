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
    if (leadId && (!address || !customerPhone)) {
      const leadResult = await pool.query('SELECT * FROM leads WHERE id = $1', [leadId])
      if (leadResult.rows[0]) {
        const lead = leadResult.rows[0]
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
    
    return NextResponse.json({ job: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}

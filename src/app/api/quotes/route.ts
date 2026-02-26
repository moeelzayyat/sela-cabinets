import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// Generate quote number: Q-2026-0001
async function generateQuoteNumber(client: any): Promise<string> {
  const year = new Date().getFullYear()
  const result = await client.query(
    `SELECT quote_number FROM quotes WHERE quote_number LIKE $1 ORDER BY quote_number DESC LIMIT 1`,
    [`Q-${year}-%`]
  )
  
  if (result.rows.length === 0) {
    return `Q-${year}-0001`
  }
  
  const lastNumber = parseInt(result.rows[0].quote_number.split('-')[2])
  return `Q-${year}-${String(lastNumber + 1).padStart(4, '0')}`
}

// GET - List quotes
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const leadId = searchParams.get('lead_id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '25')
    const offset = parseInt(searchParams.get('offset') || '0')

    const client = await pool.connect()
    try {
      let query = `
        SELECT q.*, 
          (SELECT COUNT(*) FROM quote_items WHERE quote_id = q.id) as item_count
        FROM quotes q
        WHERE 1=1
      `
      const params: any[] = []
      let paramCount = 1

      if (status) {
        query += ` AND q.status = $${paramCount++}`
        params.push(status)
      }
      if (leadId) {
        query += ` AND q.lead_id = $${paramCount++}`
        params.push(parseInt(leadId))
      }
      if (search) {
        query += ` AND (q.customer_name ILIKE $${paramCount} OR q.quote_number ILIKE $${paramCount})`
        params.push(`%${search}%`)
        paramCount++
      }

      query += ` ORDER BY q.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`
      params.push(limit, offset)

      const result = await client.query(query, params)

      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM quotes WHERE 1=1`
      const countParams: any[] = []
      let countParamCount = 1

      if (status) {
        countQuery += ` AND status = $${countParamCount++}`
        countParams.push(status)
      }
      if (leadId) {
        countQuery += ` AND lead_id = $${countParamCount++}`
        countParams.push(parseInt(leadId))
      }
      if (search) {
        countQuery += ` AND (customer_name ILIKE $${countParamCount} OR quote_number ILIKE $${countParamCount})`
        countParams.push(`%${search}%`)
      }

      const countResult = await client.query(countQuery, countParams)

      return NextResponse.json({
        quotes: result.rows,
        pagination: {
          limit,
          offset,
          total: parseInt(countResult.rows[0].total)
        }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

// POST - Create new quote
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      lead_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items = [],
      tax_rate = 6,
      discount_percent = 0,
      deposit_percent = 50,
      valid_until,
      terms,
      internal_notes
    } = body

    // Validation
    if (!customer_name) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 })
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one line item is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Generate quote number
      const quoteNumber = await generateQuoteNumber(client)

      // Calculate totals
      let subtotal = 0
      for (const item of items) {
        const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
        subtotal += lineTotal
      }

      const discountAmount = subtotal * (discount_percent / 100)
      const taxableAmount = subtotal - discountAmount
      const taxAmount = taxableAmount * (tax_rate / 100)
      const total = taxableAmount + taxAmount
      const depositAmount = total * (deposit_percent / 100)

      // Insert quote
      const quoteResult = await client.query(`
        INSERT INTO quotes (
          quote_number, lead_id, customer_name, customer_email, customer_phone,
          customer_address, subtotal, tax_rate, tax_amount, discount_percent,
          discount_amount, total, deposit_amount, deposit_percent, valid_until,
          terms, internal_notes, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'draft')
        RETURNING *
      `, [
        quoteNumber, lead_id, customer_name, customer_email, customer_phone,
        customer_address, subtotal, tax_rate, taxAmount, discount_percent,
        discountAmount, total, depositAmount, deposit_percent, valid_until,
        terms, internal_notes
      ])

      const quote = quoteResult.rows[0]

      // Insert line items
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
        
        await client.query(`
          INSERT INTO quote_items (quote_id, section, description, quantity, unit_price, discount_percent, line_total, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [quote.id, item.section || 'cabinets', item.description, item.quantity || 1, item.unit_price || 0, item.discount_percent || 0, lineTotal, i])
      }

      // Log activity if lead is linked
      if (lead_id) {
        await client.query(`
          INSERT INTO lead_activities (lead_id, activity_type, description, new_value)
          VALUES ($1, 'quote_created', 'Quote created', $2)
        `, [lead_id, quoteNumber])
      }

      await client.query('COMMIT')

      return NextResponse.json({ success: true, quote })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}

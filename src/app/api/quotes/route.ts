import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// Generate quote number
function generateQuoteNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `Q${year}${month}-${random}`
}

// GET - List quotes or get single quote
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
        // Get single quote with items
        const quoteResult = await client.query(`
          SELECT q.*, 
            json_agg(json_build_object(
              'id', qi.id,
              'section', qi.section,
              'description', qi.description,
              'quantity', qi.quantity,
              'unit_price', qi.unit_price,
              'discount_percent', qi.discount_percent,
              'line_total', qi.line_total,
              'sort_order', qi.sort_order
            ) ORDER BY qi.sort_order, qi.id) as items
          FROM quotes q
          LEFT JOIN quote_items qi ON q.id = qi.quote_id
          WHERE q.id = $1
          GROUP BY q.id
        `, [parseInt(id)])
        
        if (quoteResult.rows.length === 0) {
          return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
        }
        
        return NextResponse.json({ quote: quoteResult.rows[0] })
      }
      
      // List quotes
      const limit = parseInt(searchParams.get('limit') || '25')
      const offset = parseInt(searchParams.get('offset') || '0')
      const search = searchParams.get('search')
      const status = searchParams.get('status')
      
      let whereClause = '1=1'
      const params: any[] = []
      let paramCount = 1
      
      if (search) {
        whereClause += ` AND (customer_name ILIKE $${paramCount} OR quote_number ILIKE $${paramCount})`
        params.push(`%${search}%`)
        paramCount++
      }
      
      if (status) {
        whereClause += ` AND status = $${paramCount}`
        params.push(status)
        paramCount++
      }
      
      // Get total count
      const countResult = await client.query(
        `SELECT COUNT(*) as total FROM quotes WHERE ${whereClause}`,
        params
      )
      const total = parseInt(countResult.rows[0].total)
      
      // Get quotes
      params.push(limit, offset)
      const quotesResult = await client.query(`
        SELECT id, quote_number, lead_id, customer_name, customer_email, customer_phone,
               subtotal, tax_rate, tax_amount, discount_percent, discount_amount, total,
               deposit_amount, deposit_percent, status, valid_until, created_at, sent_at
        FROM quotes
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `, params)
      
      return NextResponse.json({
        quotes: quotesResult.rows,
        total
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

    // Validate required fields
    if (!customer_name) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one line item is required' }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    const processedItems = items.map((item: any, index: number) => {
      const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
      subtotal += lineTotal
      return {
        ...item,
        line_total: lineTotal,
        sort_order: index
      }
    })

    const discountAmount = subtotal * (discount_percent / 100)
    const taxableAmount = subtotal - discountAmount
    const taxAmount = taxableAmount * (tax_rate / 100)
    const total = taxableAmount + taxAmount
    const depositAmount = total * (deposit_percent / 100)

    const quoteNumber = generateQuoteNumber()

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Insert quote
      const quoteResult = await client.query(`
        INSERT INTO quotes (
          quote_number, lead_id, customer_name, customer_email, customer_phone, customer_address,
          subtotal, tax_rate, tax_amount, discount_percent, discount_amount, total,
          deposit_amount, deposit_percent, valid_until, terms, internal_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `, [
        quoteNumber, lead_id, customer_name, customer_email, customer_phone, customer_address,
        subtotal, tax_rate, tax_amount, discount_percent, discount_amount, total,
        deposit_amount, deposit_percent, valid_until || null, terms, internal_notes
      ])

      const quote = quoteResult.rows[0]

      // Insert items
      for (const item of processedItems) {
        await client.query(`
          INSERT INTO quote_items (quote_id, section, description, quantity, unit_price, discount_percent, line_total, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          quote.id, item.section || 'cabinets', item.description, item.quantity, item.unit_price,
          item.discount_percent, item.line_total, item.sort_order
        ])
      }

      // Log activity if linked to lead
      if (lead_id) {
        await client.query(`
          INSERT INTO lead_activities (lead_id, activity_type, description, new_value)
          VALUES ($1, 'quote_created', 'Quote created', $2)
        `, [lead_id, quoteNumber])
      }

      await client.query('COMMIT')

      return NextResponse.json({ success: true, quote })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}

// PATCH - Update quote
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items,
      tax_rate,
      discount_percent,
      deposit_percent,
      valid_until,
      terms,
      internal_notes,
      status
    } = body

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Get existing quote
      const existingResult = await client.query('SELECT * FROM quotes WHERE id = $1', [parseInt(id)])
      if (existingResult.rows.length === 0) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }
      const existing = existingResult.rows[0]

      // If items provided, recalculate totals
      let subtotal = existing.subtotal
      let taxAmount = existing.tax_amount
      let discountAmount = existing.discount_amount
      let total = existing.total
      let depositAmount = existing.deposit_amount

      if (items && items.length > 0) {
        subtotal = 0
        const processedItems = items.map((item: any, index: number) => {
          const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
          subtotal += lineTotal
          return { ...item, line_total: lineTotal, sort_order: index }
        })

        const finalDiscountPercent = discount_percent ?? existing.discount_percent
        const finalTaxRate = tax_rate ?? existing.tax_rate
        const finalDepositPercent = deposit_percent ?? existing.deposit_percent

        discountAmount = subtotal * (finalDiscountPercent / 100)
        const taxableAmount = subtotal - discountAmount
        taxAmount = taxableAmount * (finalTaxRate / 100)
        total = taxableAmount + taxAmount
        depositAmount = total * (finalDepositPercent / 100)

        // Delete existing items and insert new ones
        await client.query('DELETE FROM quote_items WHERE quote_id = $1', [parseInt(id)])
        
        for (const item of processedItems) {
          await client.query(`
            INSERT INTO quote_items (quote_id, section, description, quantity, unit_price, discount_percent, line_total, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            parseInt(id), item.section || 'cabinets', item.description, item.quantity, item.unit_price,
            item.discount_percent, item.line_total, item.sort_order
          ])
        }
      }

      // Update quote
      const updateResult = await client.query(`
        UPDATE quotes SET
          customer_name = COALESCE($1, customer_name),
          customer_email = COALESCE($2, customer_email),
          customer_phone = COALESCE($3, customer_phone),
          customer_address = COALESCE($4, customer_address),
          subtotal = $5,
          tax_rate = COALESCE($6, tax_rate),
          tax_amount = $7,
          discount_percent = COALESCE($8, discount_percent),
          discount_amount = $9,
          total = $10,
          deposit_amount = $11,
          deposit_percent = COALESCE($12, deposit_percent),
          valid_until = COALESCE($13, valid_until),
          terms = COALESCE($14, terms),
          internal_notes = COALESCE($15, internal_notes),
          status = COALESCE($16, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $17
        RETURNING *
      `, [
        customer_name, customer_email, customer_phone, customer_address,
        subtotal, tax_rate, taxAmount, discount_percent, discountAmount,
        total, depositAmount, deposit_percent, valid_until, terms, internal_notes, status,
        parseInt(id)
      ])

      await client.query('COMMIT')

      return NextResponse.json({ success: true, quote: updateResult.rows[0] })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}

// DELETE - Delete quote
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    const client = await pool.connect()
    
    try {
      // Items will be deleted automatically due to CASCADE
      await client.query('DELETE FROM quotes WHERE id = $1', [parseInt(id)])
      
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 })
  }
}

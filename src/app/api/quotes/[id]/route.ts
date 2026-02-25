import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

// GET - Get single quote with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      const quoteResult = await client.query('SELECT * FROM quotes WHERE id = $1', [parseInt(params.id)])
      
      if (quoteResult.rows.length === 0) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }

      const itemsResult = await client.query(
        'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY section, sort_order',
        [parseInt(params.id)]
      )

      return NextResponse.json({
        quote: quoteResult.rows[0],
        items: itemsResult.rows
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

// PUT - Update quote
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      const existingQuote = await client.query('SELECT * FROM quotes WHERE id = $1', [parseInt(params.id)])
      if (existingQuote.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }

      const oldQuote = existingQuote.rows[0]

      // Get existing items for version history
      const existingItems = await client.query(
        'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY section, sort_order',
        [parseInt(params.id)]
      )

      // Get next version number
      const versionResult = await client.query(
        'SELECT COALESCE(MAX(version_number), 0) + 1 as next_version FROM quote_versions WHERE quote_id = $1',
        [parseInt(params.id)]
      )
      const nextVersion = versionResult.rows[0].next_version

      // Save current version before updating (only if items or totals are changing)
      if (items && items.length > 0) {
        await client.query(`
          INSERT INTO quote_versions (quote_id, version_number, subtotal, tax_rate, tax_amount, discount_percent, discount_amount, total, items, created_by, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Way', $10)
        `, [
          parseInt(params.id),
          nextVersion,
          oldQuote.subtotal,
          oldQuote.tax_rate,
          oldQuote.tax_amount,
          oldQuote.discount_percent,
          oldQuote.discount_amount,
          oldQuote.total,
          JSON.stringify(existingItems.rows),
          `Auto-saved before update (v${nextVersion})`
        ])
      }

      // If items provided, recalculate totals
      let subtotal = existingQuote.rows[0].subtotal
      let taxAmount = existingQuote.rows[0].tax_amount
      let discountAmount = existingQuote.rows[0].discount_amount
      let total = existingQuote.rows[0].total
      let depositAmount = existingQuote.rows[0].deposit_amount

      const finalTaxRate = tax_rate ?? existingQuote.rows[0].tax_rate
      const finalDiscountPercent = discount_percent ?? existingQuote.rows[0].discount_percent
      const finalDepositPercent = deposit_percent ?? existingQuote.rows[0].deposit_percent

      if (items && items.length > 0) {
        subtotal = 0
        for (const item of items) {
          const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
          subtotal += lineTotal
        }
      }

      discountAmount = subtotal * (finalDiscountPercent / 100)
      const taxableAmount = subtotal - discountAmount
      taxAmount = taxableAmount * (finalTaxRate / 100)
      total = taxableAmount + taxAmount
      depositAmount = total * (finalDepositPercent / 100)

      // Update quote
      const updateResult = await client.query(`
        UPDATE quotes SET
          customer_name = COALESCE($1, customer_name),
          customer_email = COALESCE($2, customer_email),
          customer_phone = COALESCE($3, customer_phone),
          customer_address = COALESCE($4, customer_address),
          subtotal = $5,
          tax_rate = $6,
          tax_amount = $7,
          discount_percent = $8,
          discount_amount = $9,
          total = $10,
          deposit_amount = $11,
          deposit_percent = $12,
          valid_until = COALESCE($13, valid_until),
          terms = COALESCE($14, terms),
          internal_notes = COALESCE($15, internal_notes),
          status = COALESCE($16, status),
          sent_at = CASE WHEN $16 = 'sent' AND status != 'sent' THEN NOW() ELSE sent_at END,
          viewed_at = CASE WHEN $16 = 'viewed' AND status != 'viewed' THEN NOW() ELSE viewed_at END,
          accepted_at = CASE WHEN $16 = 'accepted' AND status != 'accepted' THEN NOW() ELSE accepted_at END,
          updated_at = NOW()
        WHERE id = $17
        RETURNING *
      `, [
        customer_name, customer_email, customer_phone, customer_address,
        subtotal, finalTaxRate, taxAmount, finalDiscountPercent,
        discountAmount, total, depositAmount, finalDepositPercent,
        valid_until, terms, internal_notes, status, parseInt(params.id)
      ])

      // Update items if provided
      if (items && items.length > 0) {
        await client.query('DELETE FROM quote_items WHERE quote_id = $1', [parseInt(params.id)])
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const lineTotal = (item.quantity || 1) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
          
          await client.query(`
            INSERT INTO quote_items (quote_id, section, description, quantity, unit_price, discount_percent, line_total, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [parseInt(params.id), item.section || 'cabinets', item.description, item.quantity || 1, item.unit_price || 0, item.discount_percent || 0, lineTotal, i])
        }
      }

      // Log activity if status changed
      if (status && status !== existingQuote.rows[0].status && existingQuote.rows[0].lead_id) {
        await client.query(`
          INSERT INTO lead_activities (lead_id, activity_type, description, old_value, new_value)
          VALUES ($1, 'status_change', $2, $3, $4)
        `, [existingQuote.rows[0].lead_id, 'Quote status updated', existingQuote.rows[0].status, status])
      }

      await client.query('COMMIT')

      return NextResponse.json({ success: true, quote: updateResult.rows[0] })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}

// DELETE - Delete quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      // Get quote info first for activity log
      const quoteResult = await client.query('SELECT * FROM quotes WHERE id = $1', [parseInt(params.id)])
      
      if (quoteResult.rows.length === 0) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }

      const quote = quoteResult.rows[0]

      // Delete (cascade will handle items)
      await client.query('DELETE FROM quotes WHERE id = $1', [parseInt(params.id)])

      // Log activity
      if (quote.lead_id) {
        await client.query(`
          INSERT INTO lead_activities (lead_id, activity_type, description)
          VALUES ($1, 'quote_deleted', $2)
        `, [quote.lead_id, `Quote ${quote.quote_number} deleted`])
      }

      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 })
  }
}

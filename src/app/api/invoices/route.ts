import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { ensureInvoicesTables, makeInvoiceNumber, recalcInvoiceTotals } from '@/lib/invoices'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const search = request.nextUrl.searchParams.get('search')
  const status = request.nextUrl.searchParams.get('status')

  let query = 'SELECT * FROM invoices WHERE 1=1'
  const params: any[] = []

  if (status) {
    params.push(status)
    query += ` AND status = $${params.length}`
  }
  if (search) {
    params.push(`%${search}%`)
    query += ` AND (invoice_number ILIKE $${params.length} OR customer_name ILIKE $${params.length} OR customer_email ILIKE $${params.length})`
  }

  query += ' ORDER BY created_at DESC LIMIT 200'
  const result = await pool.query(query, params)
  return NextResponse.json({ invoices: result.rows })
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const body = await request.json()

  const nextCount = await pool.query('SELECT COUNT(*) FROM invoices')
  const invoiceNumber = body.invoiceNumber || makeInvoiceNumber(parseInt(nextCount.rows[0].count, 10) + 1)

  const result = await pool.query(
    `INSERT INTO invoices (
      quote_id, lead_id, customer_name, customer_email, customer_phone,
      invoice_number, status, issue_date, due_date, tax_rate, discount_amount, notes
    ) VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7,'draft'),$8,$9,COALESCE($10,0),COALESCE($11,0),$12)
    RETURNING *`,
    [
      body.quoteId || null,
      body.leadId || null,
      body.customerName || null,
      body.customerEmail || null,
      body.customerPhone || null,
      invoiceNumber,
      body.status || 'draft',
      body.issueDate || new Date().toISOString().slice(0, 10),
      body.dueDate || null,
      body.taxRate || 0,
      body.discountAmount || 0,
      body.notes || null,
    ]
  )

  const invoice = result.rows[0]
  const items = Array.isArray(body.items) ? body.items : []
  for (const item of items) {
    const qty = Number(item.qty || 1)
    const unitPrice = Number(item.unitPrice || 0)
    const lineTotal = Number((qty * unitPrice).toFixed(2))
    await pool.query(
      `INSERT INTO invoice_items (invoice_id, description, qty, unit_price, line_total)
       VALUES ($1,$2,$3,$4,$5)`,
      [invoice.id, item.description || 'Item', qty, unitPrice, lineTotal]
    )
  }

  await recalcInvoiceTotals(invoice.id)
  const refreshed = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoice.id])
  return NextResponse.json({ invoice: refreshed.rows[0] }, { status: 201 })
}

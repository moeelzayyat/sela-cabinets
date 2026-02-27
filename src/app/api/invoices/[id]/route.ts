import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { ensureInvoicesTables, recalcInvoiceTotals } from '@/lib/invoices'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const id = parseInt(params.id, 10)
  const invoiceRes = await pool.query('SELECT * FROM invoices WHERE id = $1', [id])
  if (!invoiceRes.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const itemsRes = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id', [id])
  const paymentsRes = await pool.query('SELECT * FROM invoice_payments WHERE invoice_id = $1 ORDER BY payment_date DESC, id DESC', [id])

  return NextResponse.json({ invoice: invoiceRes.rows[0], items: itemsRes.rows, payments: paymentsRes.rows })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const id = parseInt(params.id, 10)
  const body = await request.json()

  await pool.query(
    `UPDATE invoices SET
      customer_name = COALESCE($1, customer_name),
      customer_email = COALESCE($2, customer_email),
      customer_phone = COALESCE($3, customer_phone),
      status = COALESCE($4, status),
      issue_date = COALESCE($5, issue_date),
      due_date = COALESCE($6, due_date),
      tax_rate = COALESCE($7, tax_rate),
      discount_amount = COALESCE($8, discount_amount),
      notes = COALESCE($9, notes),
      updated_at = now()
     WHERE id = $10`,
    [
      body.customerName ?? null,
      body.customerEmail ?? null,
      body.customerPhone ?? null,
      body.status ?? null,
      body.issueDate ?? null,
      body.dueDate ?? null,
      body.taxRate ?? null,
      body.discountAmount ?? null,
      body.notes ?? null,
      id,
    ]
  )

  if (Array.isArray(body.items)) {
    await pool.query('DELETE FROM invoice_items WHERE invoice_id = $1', [id])
    for (const item of body.items) {
      const qty = Number(item.qty || 1)
      const unitPrice = Number(item.unitPrice || 0)
      const lineTotal = Number((qty * unitPrice).toFixed(2))
      await pool.query(
        `INSERT INTO invoice_items (invoice_id, description, qty, unit_price, line_total)
         VALUES ($1,$2,$3,$4,$5)`,
        [id, item.description || 'Item', qty, unitPrice, lineTotal]
      )
    }
  }

  await recalcInvoiceTotals(id)
  const invoice = await pool.query('SELECT * FROM invoices WHERE id = $1', [id])
  return NextResponse.json({ invoice: invoice.rows[0] })
}

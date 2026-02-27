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
      project_name = COALESCE($4, project_name),
      tags = COALESCE($5, tags),
      payment_methods = COALESCE($6, payment_methods),
      currency = COALESCE($7, currency),
      sale_agent = COALESCE($8, sale_agent),
      discount_type = COALESCE($9, discount_type),
      adjustment_amount = COALESCE($10, adjustment_amount),
      client_note = COALESCE($11, client_note),
      terms_conditions = COALESCE($12, terms_conditions),
      recurring_invoice = COALESCE($13, recurring_invoice),
      prevent_overdue_reminders = COALESCE($14, prevent_overdue_reminders),
      status = COALESCE($15, status),
      issue_date = COALESCE($16, issue_date),
      due_date = COALESCE($17, due_date),
      tax_rate = COALESCE($18, tax_rate),
      discount_amount = COALESCE($19, discount_amount),
      notes = COALESCE($20, notes),
      updated_at = now()
     WHERE id = $21`,
    [
      body.customerName ?? null,
      body.customerEmail ?? null,
      body.customerPhone ?? null,
      body.projectName ?? null,
      Array.isArray(body.tags) ? body.tags : null,
      Array.isArray(body.paymentMethods) ? body.paymentMethods : null,
      body.currency ?? null,
      body.saleAgent ?? null,
      body.discountType ?? null,
      body.adjustmentAmount ?? null,
      body.clientNote ?? null,
      body.termsConditions ?? null,
      typeof body.recurringInvoice === 'boolean' ? body.recurringInvoice : null,
      typeof body.preventOverdueReminders === 'boolean' ? body.preventOverdueReminders : null,
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
        `INSERT INTO invoice_items (invoice_id, description, long_description, qty, unit, unit_price, tax_rate, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          id,
          item.description || 'Item',
          item.longDescription || null,
          qty,
          item.unit || 'Unit',
          unitPrice,
          Number(item.taxRate || 0),
          lineTotal,
        ]
      )
    }
  }

  await recalcInvoiceTotals(id)
  const invoice = await pool.query('SELECT * FROM invoices WHERE id = $1', [id])
  return NextResponse.json({ invoice: invoice.rows[0] })
}

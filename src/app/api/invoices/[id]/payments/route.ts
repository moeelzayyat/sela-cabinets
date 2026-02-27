import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { ensureInvoicesTables, recalcInvoiceTotals } from '@/lib/invoices'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const id = parseInt(params.id, 10)
  const body = await request.json()

  if (!body.amount) return NextResponse.json({ error: 'Amount is required' }, { status: 400 })

  await pool.query(
    `INSERT INTO invoice_payments (invoice_id, payment_date, amount, method, reference, notes)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      id,
      body.paymentDate || new Date().toISOString().slice(0, 10),
      Number(body.amount),
      body.method || null,
      body.reference || null,
      body.notes || null,
    ]
  )

  await recalcInvoiceTotals(id)
  const invoice = await pool.query('SELECT * FROM invoices WHERE id = $1', [id])
  const payments = await pool.query('SELECT * FROM invoice_payments WHERE invoice_id = $1 ORDER BY payment_date DESC, id DESC', [id])
  return NextResponse.json({ invoice: invoice.rows[0], payments: payments.rows })
}

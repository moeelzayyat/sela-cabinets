import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/user-auth'
import { pool } from '@/lib/db'
import { ensureInvoicesTables } from '@/lib/invoices'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getUserSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureInvoicesTables()
  const result = await pool.query(
    `SELECT id, invoice_number, status, issue_date, due_date, total, amount_paid, balance_due
     FROM invoices
     WHERE lower(customer_email) = lower($1)
     ORDER BY created_at DESC`,
    [session.email]
  )

  return NextResponse.json({ invoices: result.rows })
}

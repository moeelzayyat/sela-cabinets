import { pool } from '@/lib/db'

export async function ensureInvoicesTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      quote_id INTEGER,
      lead_id INTEGER,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      invoice_number TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      issue_date DATE,
      due_date DATE,
      subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
      tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
      tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      total NUMERIC(12,2) NOT NULL DEFAULT 0,
      amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
      balance_due NUMERIC(12,2) NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      qty NUMERIC(12,2) NOT NULL DEFAULT 1,
      unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_payments (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      payment_date DATE NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      method TEXT,
      reference TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function recalcInvoiceTotals(invoiceId: number) {
  await pool.query(
    `WITH item_sum AS (
       SELECT COALESCE(SUM(line_total), 0)::numeric(12,2) AS subtotal
       FROM invoice_items WHERE invoice_id = $1
     ), payment_sum AS (
       SELECT COALESCE(SUM(amount), 0)::numeric(12,2) AS paid
       FROM invoice_payments WHERE invoice_id = $1
     )
     UPDATE invoices i
     SET subtotal = item_sum.subtotal,
         tax_amount = ROUND((item_sum.subtotal * (i.tax_rate / 100.0))::numeric, 2),
         total = ROUND((item_sum.subtotal + (item_sum.subtotal * (i.tax_rate / 100.0)) - i.discount_amount)::numeric, 2),
         amount_paid = payment_sum.paid,
         balance_due = ROUND((item_sum.subtotal + (item_sum.subtotal * (i.tax_rate / 100.0)) - i.discount_amount - payment_sum.paid)::numeric, 2),
         updated_at = now()
     FROM item_sum, payment_sum
     WHERE i.id = $1`,
    [invoiceId]
  )
}

export function makeInvoiceNumber(n: number) {
  return `INV-${String(n).padStart(5, '0')}`
}

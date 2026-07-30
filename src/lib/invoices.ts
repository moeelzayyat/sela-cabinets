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
      project_name TEXT,
      tags TEXT[],
      payment_methods TEXT[],
      currency TEXT DEFAULT 'USD',
      sale_agent TEXT,
      discount_type TEXT DEFAULT 'fixed',
      adjustment_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      client_note TEXT,
      terms_conditions TEXT,
      recurring_invoice BOOLEAN DEFAULT false,
      prevent_overdue_reminders BOOLEAN DEFAULT false,
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

  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS project_name TEXT`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tags TEXT[]`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_methods TEXT[]`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD'`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS sale_agent TEXT`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'fixed'`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS adjustment_amount NUMERIC(12,2) NOT NULL DEFAULT 0`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS client_note TEXT`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS terms_conditions TEXT`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS recurring_invoice BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS prevent_overdue_reminders BOOLEAN DEFAULT false`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      long_description TEXT,
      qty NUMERIC(12,2) NOT NULL DEFAULT 1,
      unit TEXT DEFAULT 'Unit',
      unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
      line_total NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS long_description TEXT`)
  await pool.query(`ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'Unit'`)
  await pool.query(`ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0`)

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
         total = ROUND((
           item_sum.subtotal
           + (item_sum.subtotal * (i.tax_rate / 100.0))
           - CASE WHEN i.discount_type = 'percent' THEN (item_sum.subtotal * (i.discount_amount / 100.0)) ELSE i.discount_amount END
           + i.adjustment_amount
         )::numeric, 2),
         amount_paid = payment_sum.paid,
         balance_due = ROUND((
           item_sum.subtotal
           + (item_sum.subtotal * (i.tax_rate / 100.0))
           - CASE WHEN i.discount_type = 'percent' THEN (item_sum.subtotal * (i.discount_amount / 100.0)) ELSE i.discount_amount END
           + i.adjustment_amount
           - payment_sum.paid
         )::numeric, 2),
         updated_at = now()
     FROM item_sum, payment_sum
     WHERE i.id = $1`,
    [invoiceId]
  )
}

export function makeInvoiceNumber(n: number) {
  return `INV-${String(n).padStart(5, '0')}`
}

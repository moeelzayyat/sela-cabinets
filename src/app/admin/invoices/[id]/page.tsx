'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null)

  const load = async () => {
    const res = await fetch(`/api/invoices/${params.id}`)
    const json = await res.json()
    setData(json)
  }

  useEffect(() => { load() }, [params.id])

  if (!data) return <div>Loading...</div>
  const { invoice, items, payments } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{invoice.invoice_number}</h1>
          <p className="text-slate-500">{invoice.status}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/invoices/${invoice.id}/edit`} className="px-3 py-2 border rounded">Edit</Link>
          <button onClick={() => window.print()} className="px-3 py-2 border rounded">Download</button>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <div className="font-semibold mb-2">Bill To</div>
            <div>{invoice.customer_name || '—'}</div>
            <div className="text-slate-500">{invoice.customer_email || '—'}</div>
            <div className="text-slate-500">{invoice.customer_phone || '—'}</div>
          </div>
          <div className="text-right">
            <div>Invoice Date: {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : '—'}</div>
            <div>Due Date: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '—'}</div>
            <div>Sale Agent: {invoice.sale_agent || '—'}</div>
          </div>
        </div>

        <table className="w-full text-sm mt-6">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Rate</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((it: any) => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.description}</td>
                <td className="p-2 text-slate-600">{it.long_description || '—'}</td>
                <td className="p-2 text-right">{it.qty}</td>
                <td className="p-2 text-right">${Number(it.unit_price).toFixed(2)}</td>
                <td className="p-2 text-right">${Number(it.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto max-w-sm text-sm space-y-1">
          <div className="flex justify-between"><span>Sub Total</span><span>${Number(invoice.subtotal || 0).toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${Number(invoice.tax_amount || 0).toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Total</span><span>${Number(invoice.total || 0).toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Paid</span><span>${Number(invoice.amount_paid || 0).toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold text-red-600"><span>Amount Due</span><span>${Number(invoice.balance_due || 0).toFixed(2)}</span></div>
        </div>

        <div className="mt-8 border-t pt-4">
          <div className="font-semibold mb-2">Transactions</div>
          {(payments || []).length === 0 ? (
            <p className="text-sm text-slate-500">No payments found for this invoice</p>
          ) : (
            <ul className="text-sm space-y-1">
              {payments.map((p: any) => <li key={p.id}>{p.payment_date}: ${Number(p.amount).toFixed(2)} ({p.method || 'manual'})</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

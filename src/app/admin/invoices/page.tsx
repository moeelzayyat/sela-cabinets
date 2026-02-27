'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string | null
  customer_email: string | null
  project_name?: string | null
  status: string
  issue_date: string | null
  due_date: string | null
  total: string
  tax_amount?: string
  amount_paid: string
  balance_due: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    taxRate: '0',
    discountAmount: '0',
    dueDate: '',
    itemDesc: '',
    itemQty: '1',
    itemUnit: '0'
  })

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/invoices?search=${encodeURIComponent(search)}`)
    const data = await res.json()
    setInvoices(data.invoices || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        taxRate: Number(form.taxRate),
        discountAmount: Number(form.discountAmount),
        dueDate: form.dueDate || null,
        items: [{ description: form.itemDesc || 'Cabinet Package', qty: Number(form.itemQty), unitPrice: Number(form.itemUnit) }]
      })
    })
    setShowNew(false)
    await load()
  }

  const markSent = async (inv: Invoice) => {
    await fetch(`/api/invoices/${inv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' })
    })
    await load()
  }

  const addPayment = async (inv: Invoice) => {
    const amount = prompt('Payment amount?')
    if (!amount) return
    await fetch(`/api/invoices/${inv.id}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), method: 'manual' })
    })
    await load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500">Create, send, and track payments</p>
        </div>
        <Link href="/admin/invoices/new" className="px-4 py-2 bg-amber-600 text-white rounded">New Invoice</Link>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoice, customer, email" className="border rounded px-3 py-2 flex-1" />
          <button onClick={load} className="px-4 py-2 border rounded">Search</button>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Invoice #</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Total Tax</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Project</th>
              <th className="text-left p-3">Due Date</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={9} className="p-4">Loading...</td></tr> : invoices.length === 0 ? <tr><td colSpan={9} className="p-4 text-slate-500">No invoices yet</td></tr> : invoices.map(inv => (
              <tr key={inv.id} className="border-t">
                <td className="p-3 font-medium text-blue-700">
                  <Link href={`/admin/invoices/${inv.id}`}>{inv.invoice_number}</Link>
                </td>
                <td className="p-3">${Number(inv.total || 0).toLocaleString()}</td>
                <td className="p-3">${Number(inv.tax_amount || 0).toLocaleString()}</td>
                <td className="p-3">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '—'}</td>
                <td className="p-3">{inv.customer_name || '—'}</td>
                <td className="p-3">{inv.project_name || '—'}</td>
                <td className="p-3">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                <td className="p-3">{inv.status}</td>
                <td className="p-3 space-x-2">
                  <Link href={`/admin/invoices/${inv.id}`} className="px-2 py-1 text-xs border rounded inline-block">View</Link>
                  <Link href={`/admin/invoices/${inv.id}/edit`} className="px-2 py-1 text-xs border rounded inline-block">Edit</Link>
                  {inv.status === 'draft' && <button onClick={() => markSent(inv)} className="px-2 py-1 text-xs border rounded">Send</button>}
                  <button onClick={() => addPayment(inv)} className="px-2 py-1 text-xs border rounded">Pay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={createInvoice} className="bg-white w-full max-w-xl rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold">Create Invoice</h2>
            <input className="w-full border rounded px-3 py-2" placeholder="Customer name" value={form.customerName} onChange={e=>setForm({...form, customerName:e.target.value})} required />
            <input className="w-full border rounded px-3 py-2" type="email" placeholder="Customer email" value={form.customerEmail} onChange={e=>setForm({...form, customerEmail:e.target.value})} required />
            <div className="grid grid-cols-3 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Item" value={form.itemDesc} onChange={e=>setForm({...form, itemDesc:e.target.value})} />
              <input className="border rounded px-3 py-2" type="number" placeholder="Qty" value={form.itemQty} onChange={e=>setForm({...form, itemQty:e.target.value})} />
              <input className="border rounded px-3 py-2" type="number" placeholder="Unit Price" value={form.itemUnit} onChange={e=>setForm({...form, itemUnit:e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input className="border rounded px-3 py-2" type="number" placeholder="Tax %" value={form.taxRate} onChange={e=>setForm({...form, taxRate:e.target.value})} />
              <input className="border rounded px-3 py-2" type="number" placeholder="Discount" value={form.discountAmount} onChange={e=>setForm({...form, discountAmount:e.target.value})} />
              <input className="border rounded px-3 py-2" type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setShowNew(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

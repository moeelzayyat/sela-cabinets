'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewInvoicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    projectName: '',
    tags: '',
    paymentMethods: ['bank', 'stripe'],
    currency: 'USD',
    saleAgent: 'Mohamed Elzayyat',
    recurringInvoice: false,
    discountType: 'fixed',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    taxRate: 0,
    discountAmount: 0,
    adjustmentAmount: 0,
    notes: '',
    clientNote: '',
    termsConditions: '',
    preventOverdueReminders: false,
    items: [
      { description: '', longDescription: '', qty: 1, unit: 'Unit', unitPrice: 0, taxRate: 0 },
    ],
  })

  const subtotal = useMemo(() => form.items.reduce((s: number, i: any) => s + Number(i.qty || 0) * Number(i.unitPrice || 0), 0), [form.items])
  const tax = useMemo(() => (subtotal * Number(form.taxRate || 0)) / 100, [subtotal, form.taxRate])
  const discount = useMemo(() => {
    const v = Number(form.discountAmount || 0)
    return form.discountType === 'percent' ? (subtotal * v) / 100 : v
  }, [subtotal, form.discountType, form.discountAmount])
  const total = useMemo(() => subtotal + tax - discount + Number(form.adjustmentAmount || 0), [subtotal, tax, discount, form.adjustmentAmount])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: String(form.tags || '').split(',').map((x: string) => x.trim()).filter(Boolean),
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) return alert(data?.error || 'Failed to create invoice')
    router.push(`/admin/invoices/${data.invoice.id}`)
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.push('/admin/invoices')} className="px-4 py-2 border rounded">Cancel</button>
          <button disabled={saving} className="px-4 py-2 bg-amber-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-white border rounded-xl p-4">
        <input className="border rounded px-3 py-2" placeholder="Customer" value={form.customerName} onChange={e=>setForm({...form, customerName:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Project" value={form.projectName} onChange={e=>setForm({...form, projectName:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Allowed payment methods (bank,stripe,zelle)" value={form.paymentMethods.join(',')} onChange={e=>setForm({...form, paymentMethods:e.target.value.split(',').map((x:string)=>x.trim()).filter(Boolean)})} />
        <input className="border rounded px-3 py-2" type="email" placeholder="Customer email" value={form.customerEmail} onChange={e=>setForm({...form, customerEmail:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Sale Agent" value={form.saleAgent} onChange={e=>setForm({...form, saleAgent:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Customer phone" value={form.customerPhone} onChange={e=>setForm({...form, customerPhone:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}>
          <option>USD</option><option>CAD</option><option>EUR</option>
        </select>

        <input className="border rounded px-3 py-2" type="date" value={form.issueDate} onChange={e=>setForm({...form, issueDate:e.target.value})} />
        <input className="border rounded px-3 py-2" type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} />

        <div className="flex items-center gap-2">
          <label className="text-sm">Recurring?</label>
          <select className="border rounded px-2 py-1" value={form.recurringInvoice ? 'yes' : 'no'} onChange={e=>setForm({...form, recurringInvoice:e.target.value==='yes'})}><option value="no">No</option><option value="yes">Yes</option></select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Discount Type</label>
          <select className="border rounded px-2 py-1" value={form.discountType} onChange={e=>setForm({...form, discountType:e.target.value})}><option value="fixed">No/Fixed</option><option value="percent">%</option></select>
        </div>

        <textarea className="col-span-2 border rounded px-3 py-2" placeholder="Admin Note" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={3} />

        <label className="col-span-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.preventOverdueReminders} onChange={e=>setForm({...form, preventOverdueReminders:e.target.checked})} />
          Prevent sending overdue reminders for this invoice
        </label>
      </div>

      <div className="bg-white border rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Items</div>
          <button type="button" className="px-3 py-1 border rounded" onClick={()=>setForm({...form, items:[...form.items,{description:'', longDescription:'', qty:1, unit:'Unit', unitPrice:0, taxRate:0}]})}>Add Item</button>
        </div>
        {form.items.map((item:any, idx:number)=>(
          <div key={idx} className="grid grid-cols-6 gap-2 border rounded p-2">
            <input className="border rounded px-2 py-1" placeholder="Item" value={item.description} onChange={e=>{const items=[...form.items];items[idx].description=e.target.value;setForm({...form,items})}} />
            <input className="border rounded px-2 py-1 col-span-2" placeholder="Long description" value={item.longDescription} onChange={e=>{const items=[...form.items];items[idx].longDescription=e.target.value;setForm({...form,items})}} />
            <input className="border rounded px-2 py-1" type="number" placeholder="Qty" value={item.qty} onChange={e=>{const items=[...form.items];items[idx].qty=Number(e.target.value);setForm({...form,items})}} />
            <input className="border rounded px-2 py-1" type="number" placeholder="Rate" value={item.unitPrice} onChange={e=>{const items=[...form.items];items[idx].unitPrice=Number(e.target.value);setForm({...form,items})}} />
            <button type="button" className="border rounded" onClick={()=>{const items=form.items.filter((_:any,i:number)=>i!==idx);setForm({...form,items})}}>Remove</button>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div>
            <textarea className="w-full border rounded p-2 mb-2" rows={3} placeholder="Client Note" value={form.clientNote} onChange={e=>setForm({...form, clientNote:e.target.value})} />
            <textarea className="w-full border rounded p-2" rows={3} placeholder="Terms & Conditions" value={form.termsConditions} onChange={e=>setForm({...form, termsConditions:e.target.value})} />
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Sub Total:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="grid grid-cols-2 gap-2 items-center"><span>Tax %</span><input className="border rounded px-2 py-1" type="number" value={form.taxRate} onChange={e=>setForm({...form, taxRate:Number(e.target.value)})} /></div>
            <div className="grid grid-cols-2 gap-2 items-center"><span>Discount</span><input className="border rounded px-2 py-1" type="number" value={form.discountAmount} onChange={e=>setForm({...form, discountAmount:Number(e.target.value)})} /></div>
            <div className="grid grid-cols-2 gap-2 items-center"><span>Adjustment</span><input className="border rounded px-2 py-1" type="number" value={form.adjustmentAmount} onChange={e=>setForm({...form, adjustmentAmount:Number(e.target.value)})} /></div>
            <div className="flex justify-between font-semibold"><span>Total:</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => router.push('/admin/invoices')} className="px-4 py-2 border rounded">Cancel</button>
        <button disabled={saving} className="px-4 py-2 bg-amber-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}

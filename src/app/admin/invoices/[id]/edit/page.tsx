'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InvoiceEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`).then(r=>r.json()).then((d)=>{
      setForm({
        customerName: d.invoice.customer_name || '',
        customerEmail: d.invoice.customer_email || '',
        customerPhone: d.invoice.customer_phone || '',
        projectName: d.invoice.project_name || '',
        saleAgent: d.invoice.sale_agent || '',
        issueDate: d.invoice.issue_date?.slice(0,10) || '',
        dueDate: d.invoice.due_date?.slice(0,10) || '',
        status: d.invoice.status || 'draft',
        discountType: d.invoice.discount_type || 'fixed',
        discountAmount: Number(d.invoice.discount_amount || 0),
        adjustmentAmount: Number(d.invoice.adjustment_amount || 0),
        taxRate: Number(d.invoice.tax_rate || 0),
        clientNote: d.invoice.client_note || '',
        termsConditions: d.invoice.terms_conditions || '',
        tags: (d.invoice.tags || []).join(', '),
        paymentMethods: d.invoice.payment_methods || ['bank', 'stripe'],
        items: (d.items || []).map((i:any)=>({
          description: i.description,
          longDescription: i.long_description || '',
          qty: Number(i.qty),
          unit: i.unit || 'Unit',
          unitPrice: Number(i.unit_price),
          taxRate: Number(i.tax_rate || 0)
        }))
      })
      setLoading(false)
    })
  }, [params.id])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/invoices/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: String(form.tags || '').split(',').map((x:string)=>x.trim()).filter(Boolean),
      })
    })
    router.push(`/admin/invoices/${params.id}`)
  }

  if (loading || !form) return <div>Loading...</div>

  return (
    <form onSubmit={save} className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Invoice</h1>
      <div className="grid grid-cols-2 gap-3 bg-white border rounded-xl p-4">
        <input className="border rounded px-3 py-2" placeholder="Customer" value={form.customerName} onChange={e=>setForm({...form, customerName:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={form.customerEmail} onChange={e=>setForm({...form, customerEmail:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Project" value={form.projectName} onChange={e=>setForm({...form, projectName:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Sale Agent" value={form.saleAgent} onChange={e=>setForm({...form, saleAgent:e.target.value})} />
        <input className="border rounded px-3 py-2" type="date" value={form.issueDate} onChange={e=>setForm({...form, issueDate:e.target.value})} />
        <input className="border rounded px-3 py-2" type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Tax %" value={form.taxRate} onChange={e=>setForm({...form, taxRate:Number(e.target.value)})} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Discount" value={form.discountAmount} onChange={e=>setForm({...form, discountAmount:Number(e.target.value)})} />
      </div>

      <div className="bg-white border rounded-xl p-4 space-y-2">
        <div className="font-semibold">Items</div>
        {form.items.map((item:any, idx:number)=>(
          <div key={idx} className="grid grid-cols-5 gap-2">
            <input className="border rounded px-2 py-1" placeholder="Item" value={item.description} onChange={e=>{const items=[...form.items];items[idx].description=e.target.value;setForm({...form,items})}} />
            <input className="border rounded px-2 py-1" type="number" placeholder="Qty" value={item.qty} onChange={e=>{const items=[...form.items];items[idx].qty=Number(e.target.value);setForm({...form,items})}} />
            <input className="border rounded px-2 py-1" type="number" placeholder="Rate" value={item.unitPrice} onChange={e=>{const items=[...form.items];items[idx].unitPrice=Number(e.target.value);setForm({...form,items})}} />
            <input className="border rounded px-2 py-1" placeholder="Unit" value={item.unit} onChange={e=>{const items=[...form.items];items[idx].unit=e.target.value;setForm({...form,items})}} />
            <button type="button" className="border rounded" onClick={()=>{const items=form.items.filter((_:any,i:number)=>i!==idx);setForm({...form,items})}}>Remove</button>
          </div>
        ))}
        <button type="button" className="px-3 py-1 border rounded" onClick={()=>setForm({...form, items:[...form.items,{description:'',longDescription:'',qty:1,unit:'Unit',unitPrice:0,taxRate:0}]})}>Add Item</button>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <textarea className="w-full border rounded p-2 mb-2" rows={3} placeholder="Client Note" value={form.clientNote} onChange={e=>setForm({...form, clientNote:e.target.value})} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Terms & Conditions" value={form.termsConditions} onChange={e=>setForm({...form, termsConditions:e.target.value})} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" className="px-4 py-2 border rounded" onClick={()=>router.back()}>Cancel</button>
        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Save Invoice</button>
      </div>
    </form>
  )
}

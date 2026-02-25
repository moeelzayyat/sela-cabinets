'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  Send,
  Download,
  Trash2,
  Plus,
  Calculator,
  X,
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react'

interface LineItem {
  id?: number
  section: string
  description: string
  quantity: number
  unit_price: number
  discount_percent: number
  line_total: number
}

interface Quote {
  id: number
  quote_number: string
  lead_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_percent: number
  discount_amount: number
  total: number
  deposit_amount: number
  deposit_percent: number
  status: string
  valid_until: string
  terms: string
  internal_notes: string
  created_at: string
  items: LineItem[]
}

const sections = [
  { id: 'cabinets', label: 'Cabinets' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'labor', label: 'Labor' },
  { id: 'countertops', label: 'Countertops' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'other', label: 'Other' },
]

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700',
}

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [items, setItems] = useState<LineItem[]>([])
  const [taxRate, setTaxRate] = useState(6)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [depositPercent, setDepositPercent] = useState(50)
  const [validUntil, setValidUntil] = useState('')
  const [terms, setTerms] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [status, setStatus] = useState('draft')

  const API_KEY = 'sela-admin-2026'

  useEffect(() => {
    fetchQuote()
  }, [id])

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quotes?id=${id}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      
      if (!response.ok) throw new Error('Failed to fetch quote')
      
      const data = await response.json()
      const q = data.quote
      
      setQuote(q)
      setCustomerName(q.customer_name || '')
      setCustomerEmail(q.customer_email || '')
      setCustomerPhone(q.customer_phone || '')
      setCustomerAddress(q.customer_address || '')
      setItems(q.items || [])
      setTaxRate(q.tax_rate || 6)
      setDiscountPercent(q.discount_percent || 0)
      setDepositPercent(q.deposit_percent || 50)
      setValidUntil(q.valid_until?.split('T')[0] || '')
      setTerms(q.terms || '')
      setInternalNotes(q.internal_notes || '')
      setStatus(q.status || 'draft')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = (item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
    return sum + lineTotal
  }, 0)

  const discountAmount = subtotal * (discountPercent / 100)
  const taxableAmount = subtotal - discountAmount
  const taxAmount = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxAmount
  const depositAmount = total * (depositPercent / 100)

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    const item = newItems[index]
    item.line_total = (item.quantity || 0) * (item.unit_price || 0) * (1 - (item.discount_percent || 0) / 100)
    
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, {
      section: 'cabinets',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_percent: 0,
      line_total: 0
    }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const validate = (): boolean => {
    const errors: string[] = []
    if (!customerName.trim()) errors.push('Customer name is required')
    const hasValidItem = items.some(item => item.description.trim() && item.unit_price > 0)
    if (!hasValidItem) errors.push('At least one line item with description and price is required')
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    
    setSaving(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/quotes?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          items: items.filter(item => item.description.trim()),
          tax_rate: taxRate,
          discount_percent: discountPercent,
          deposit_percent: depositPercent,
          valid_until: validUntil || null,
          terms,
          internal_notes: internalNotes,
          status
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to update quote')
      
      setQuote(data.quote)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quote')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quote?')) return
    
    try {
      const response = await fetch(`/api/quotes?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      
      if (!response.ok) throw new Error('Failed to delete quote')
      
      router.push('/admin/quotes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading quote...</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">Quote not found</h2>
        <button
          onClick={() => router.push('/admin/quotes')}
          className="mt-4 text-orange-600 hover:text-orange-700"
        >
          Back to Quotes
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{quote.quote_number}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}>
                {status}
              </span>
            </div>
            <p className="text-slate-500 mt-1">Created {formatDate(quote.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <ul className="text-sm text-red-700 list-disc list-inside">
              {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Status Change */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Update Status:</span>
          <div className="flex gap-2">
            {['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  status === s ? statusColors[s] : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Section</label>
                        <select
                          value={item.section}
                          onChange={(e) => updateItem(index, 'section', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {sections.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          min="0" step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          min="0" step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Total</label>
                        <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium">
                          {formatCurrency(item.line_total)}
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg mt-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Terms & Conditions</h2>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Internal Notes</h2>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-500" />
              Quote Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Discount</span>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                    min="0" max="100"
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                <span className="text-sm text-red-600">-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Tax</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                    min="0" max="100"
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                <span className="text-sm">{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-800">Deposit Required</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-orange-200 rounded text-sm text-center bg-white"
                      min="0" max="100"
                    />
                    <span className="text-sm text-orange-600">%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(depositAmount)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

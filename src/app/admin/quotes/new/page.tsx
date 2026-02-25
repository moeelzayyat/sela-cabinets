'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Calculator,
  X,
  AlertCircle
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

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  address: string
  city: string
}

const sections = [
  { id: 'cabinets', label: 'Cabinets' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'labor', label: 'Labor' },
  { id: 'countertops', label: 'Countertops' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'other', label: 'Other' },
]

const defaultTerms = `50% deposit required to begin work. Balance due upon completion.

Payment methods: Cash, Check, Credit Card (3% processing fee), Zelle, Venmo.

Quote valid for 30 days from date of issue.

All cabinets come with a 5-year warranty on materials and workmanship.

Installation typically takes 1-3 days depending on project scope.`

export default function NewQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get('lead')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  
  // Lead data (if creating from lead)
  const [lead, setLead] = useState<Lead | null>(null)

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  
  const [items, setItems] = useState<LineItem[]>([
    { section: 'cabinets', description: '', quantity: 1, unit_price: 0, discount_percent: 0, line_total: 0 }
  ])
  
  const [taxRate, setTaxRate] = useState(6)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [depositPercent, setDepositPercent] = useState(50)
  const [validUntil, setValidUntil] = useState('')
  const [terms, setTerms] = useState(defaultTerms)
  const [internalNotes, setInternalNotes] = useState('')

  const API_KEY = 'sela-admin-2026'

  // Fetch lead data if creating from lead
  useEffect(() => {
    if (leadId) {
      fetch(`/api/leads?id=${leadId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.lead) {
            setLead(data.lead)
            setCustomerName(data.lead.name || '')
            setCustomerEmail(data.lead.email || '')
            setCustomerPhone(data.lead.phone || '')
            setCustomerAddress([data.lead.address, data.lead.city].filter(Boolean).join(', ') || '')
          }
        })
        .catch(console.error)
    }
  }, [leadId])

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

  // Set default expiry date (30 days from now)
  useEffect(() => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    setValidUntil(date.toISOString().split('T')[0])
  }, [])

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate line total
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
    
    if (!customerName.trim()) {
      errors.push('Customer name is required')
    }
    
    const hasValidItem = items.some(item => item.description.trim() && item.unit_price > 0)
    if (!hasValidItem) {
      errors.push('At least one line item with description and price is required')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSave = async (asDraft: boolean = true) => {
    if (!validate()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lead_id: leadId ? parseInt(leadId) : null,
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
          internal_notes: internalNotes
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quote')
      }
      
      router.push('/admin/quotes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save quote')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Group items by section
  const groupedItems = sections.map(section => ({
    ...section,
    items: items.filter((_, i) => items[i]?.section === section.id)
  })).filter(g => g.items.length > 0 || g.id === 'cabinets')

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
            <h1 className="text-2xl font-bold text-slate-900">New Quote</h1>
            <p className="text-slate-500 mt-1">
              {lead ? `Creating quote for ${lead.name}` : 'Create a new customer quote'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Save & Send
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Please fix the following errors:</p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="(313) 000-0000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Street address, City"
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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., 10x10 Kitchen Cabinet Package"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Section</label>
                        <select
                          value={item.section}
                          onChange={(e) => updateItem(index, 'section', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {sections.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Unit Price</label>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Disc %</label>
                        <input
                          type="number"
                          value={item.discount_percent}
                          onChange={(e) => updateItem(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Line Total</label>
                        <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900">
                          {formatCurrency(item.line_total)}
                        </div>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-5"
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Internal Notes</h2>
            <p className="text-xs text-slate-500 mb-2">These notes are not visible to the customer</p>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              placeholder="Any internal notes about this quote..."
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
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Discount</span>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                <span className="text-sm text-red-600">-{formatCurrency(discountAmount)}</span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Tax</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-slate-400">%</span>
                </div>
                <span className="text-sm text-slate-900">{formatCurrency(taxAmount)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Deposit */}
              <div className="bg-orange-50 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-800">Deposit Required</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 border border-orange-200 rounded text-sm text-center bg-white"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-orange-600">%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(depositAmount)}</div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

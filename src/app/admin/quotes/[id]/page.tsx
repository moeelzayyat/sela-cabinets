'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, Download, Send, Edit, Trash2, Copy, Check, 
  FileText, User, MapPin, Mail, Phone, Calendar, Clock,
  RefreshCw, X, Printer, History, Loader2
} from 'lucide-react'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700' },
  sent: { label: 'Sent', bg: 'bg-blue-100', text: 'text-blue-700' },
  viewed: { label: 'Viewed', bg: 'bg-purple-100', text: 'text-purple-700' },
  accepted: { label: 'Accepted', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  declined: { label: 'Declined', bg: 'bg-red-100', text: 'text-red-700' },
  expired: { label: 'Expired', bg: 'bg-amber-100', text: 'text-amber-700' },
}

const sectionLabels: Record<string, string> = {
  cabinets: 'Cabinets',
  hardware: 'Hardware',
  labor: 'Labor',
  countertops: 'Countertops',
  delivery: 'Delivery',
  other: 'Other',
}

const API_KEY = 'sela-admin-2026'

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quoteId = params.id
  const [quote, setQuote] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  useEffect(() => {
    fetchQuote()
    fetchVersions()
  }, [quoteId])

  const fetchQuote = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (!response.ok) throw new Error('Failed to fetch quote')
      const data = await response.json()
      setQuote(data.quote)
      setItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote')
    } finally {
      setLoading(false)
    }
  }

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/versions`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (response.ok) {
        const data = await response.json()
        setVersions(data.versions || [])
      }
    } catch (err) {
      console.error('Failed to fetch versions:', err)
    }
  }

  const downloadPdf = async () => {
    setDownloadingPdf(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${quote.quote_number}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF')
    } finally {
      setDownloadingPdf(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      const data = await response.json()
      setQuote(data.quote)
      setShowStatusMenu(false)
      setSuccess('Status updated')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const sendEmail = async (emailData: { to: string; subject: string; message: string }) => {
    setSendingEmail(true)
    setError(null)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }
      
      setShowEmailModal(false)
      setSuccess('Quote sent successfully!')
      setTimeout(() => setSuccess(null), 5000)
      
      // Refresh quote to get updated status
      fetchQuote()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // Group items by section
  const groupedItems = items.reduce((acc, item) => {
    const section = item.section || 'other'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {} as Record<string, any[]>)

  const sectionOrder = ['cabinets', 'hardware', 'labor', 'countertops', 'delivery', 'other']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    )
  }

  if (error && !quote) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <Link href="/admin/quotes" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
          ← Back to Quotes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Success/Error Toasts */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4 ml-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/quotes" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{quote.quote_number}</h1>
            <p className="text-slate-500">
              Created {formatDate(quote.created_at)} by {quote.created_by}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {versions.length > 0 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <History className="w-4 h-4" />
              v{versions.length + 1}
            </button>
          )}
          <button
            onClick={downloadPdf}
            disabled={downloadingPdf}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {downloadingPdf ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            PDF
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
            Send to Customer
          </button>
        </div>
      </div>

      {/* Version History Panel */}
      {showVersions && versions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-amber-500" />
            Version History
          </h3>
          <div className="space-y-2">
            {versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="font-medium text-slate-900">Version {version.version_number}</span>
                  <span className="text-slate-500 ml-2">- {formatCurrency(version.total)}</span>
                </div>
                <div className="text-sm text-slate-400">
                  {formatDateTime(version.created_at)} by {version.created_by}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <span className="font-medium text-amber-900">Current Version {versions.length + 1}</span>
                <span className="text-amber-700 ml-2">- {formatCurrency(quote.total)}</span>
              </div>
              <div className="text-sm text-amber-600">Latest</div>
            </div>
          </div>
        </div>
      )}

      {/* Status & Quick Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                  statusConfig[quote.status]?.bg || 'bg-slate-100'
                } ${statusConfig[quote.status]?.text || 'text-slate-700'}`}
              >
                {statusConfig[quote.status]?.label || quote.status}
                {updatingStatus && <RefreshCw className="w-3 h-3 animate-spin" />}
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 min-w-[150px]">
                  {Object.entries(statusConfig).map(([key, { label, bg, text }]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(key)}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 ${text}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {quote.valid_until && (
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Valid until {formatDate(quote.valid_until)}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(quote.total)}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Bill To</p>
            <p className="font-semibold text-slate-900 text-lg">{quote.customer_name}</p>
            {quote.customer_phone && (
              <p className="text-sm text-slate-600 flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4 text-slate-400" />
                {quote.customer_phone}
              </p>
            )}
            {quote.customer_email && (
              <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-400" />
                {quote.customer_email}
              </p>
            )}
            {quote.customer_address && (
              <p className="text-sm text-slate-600 flex items-start gap-2 mt-1">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                {quote.customer_address}
              </p>
            )}
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deposit Required</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(quote.deposit_amount)}</p>
            <p className="text-sm text-slate-500">{quote.deposit_percent}% of total</p>
            {quote.sent_at && (
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Sent {formatDateTime(quote.sent_at)}
              </p>
            )}
            {quote.viewed_at && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Viewed {formatDateTime(quote.viewed_at)}
              </p>
            )}
            {quote.accepted_at && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Accepted {formatDateTime(quote.accepted_at)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Line Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Disc</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sectionOrder.map(section => {
                const sectionItems = groupedItems[section]
                if (!sectionItems || sectionItems.length === 0) return null

                return (
                  <>
                    <tr key={section} className="bg-slate-100">
                      <td colSpan={5} className="px-6 py-2 text-xs font-semibold text-slate-600 uppercase">
                        {sectionLabels[section] || section}
                      </td>
                    </tr>
                    {sectionItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-700">{item.description}</td>
                        <td className="px-6 py-3 text-right text-slate-600">{item.quantity}</td>
                        <td className="px-6 py-3 text-right text-slate-600">{formatCurrency(item.unit_price)}</td>
                        <td className="px-6 py-3 text-right text-slate-600">{item.discount_percent}%</td>
                        <td className="px-6 py-3 text-right font-medium text-slate-900">{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">{formatCurrency(quote.subtotal)}</span>
              </div>
              {quote.discount_percent > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Discount ({quote.discount_percent}%)</span>
                  <span className="text-red-600">-{formatCurrency(quote.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax ({quote.tax_rate}%)</span>
                <span className="text-slate-900">{formatCurrency(quote.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Internal Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quote.terms && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Terms & Conditions</h3>
            <p className="text-sm text-slate-600 whitespace-pre-line">{quote.terms}</p>
          </div>
        )}
        {quote.internal_notes && (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="font-semibold text-amber-900 mb-3">📝 Internal Notes</h3>
            <p className="text-sm text-amber-800 whitespace-pre-line">{quote.internal_notes}</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          quote={quote}
          onClose={() => setShowEmailModal(false)}
          onSend={sendEmail}
          sending={sendingEmail}
        />
      )}
    </div>
  )
}

// Email Modal Component
function EmailModal({ quote, onClose, onSend, sending }: { 
  quote: any
  onClose: () => void
  onSend: (data: { to: string; subject: string; message: string }) => void
  sending: boolean
}) {
  const [to, setTo] = useState(quote.customer_email || '')
  const [subject, setSubject] = useState(`Your Quote from SELA Cabinets - ${quote.quote_number}`)
  const [message, setMessage] = useState(`Dear ${quote.customer_name},

Thank you for considering SELA Cabinets for your kitchen project!

Please find attached your detailed quote (${quote.quote_number}).

If you have any questions or would like to proceed, please don't hesitate to contact us at (313) 246-7903 or reply to this email.

We look forward to working with you!

Best regards,
The SELA Cabinets Team
(313) 246-7903
selacabinets.com`)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!to.trim()) return
    onSend({ to, subject, message })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Quote</h2>
            <p className="text-sm text-slate-500">Email {quote.quote_number} to customer</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To *</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              📎 <strong>Attachment:</strong> {quote.quote_number}.pdf ({formatCurrency(quote.total)})
            </p>
          </div>
        </form>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending || !to.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

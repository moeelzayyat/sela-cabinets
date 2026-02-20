'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Calendar, Filter, RefreshCw } from 'lucide-react'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  address: string | null
  city: string | null
  zip: string | null
  source: string
  status: string
  timeline: string | null
  style_preference: string | null
  notes: string | null
  created_at: string
}

interface Stats {
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')

  const API_KEY = 'sela-admin-2026'

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (sourceFilter) params.append('source', sourceFilter)
      
      const response = await fetch(`/api/leads?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch leads')

      const data = await response.json()
      setLeads(data.leads)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [statusFilter, sourceFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      scheduled: 'bg-green-100 text-green-800',
      installed: 'bg-teal-100 text-teal-800',
      complete: 'bg-gray-100 text-gray-800',
      lost: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SELA Cabinets - Leads</h1>
            <p className="text-gray-600 mt-1">Lead tracking and management</p>
          </div>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-sm font-medium text-gray-600">Total Leads</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-sm font-medium text-gray-600">By Source</div>
              <div className="mt-2 space-y-1">
                {Object.entries(stats.bySource).map(([source, count]) => (
                  <div key={source} className="flex justify-between text-sm">
                    <span className="capitalize">{source}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-sm font-medium text-gray-600">By Status</div>
              <div className="mt-2 space-y-1">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quoted">Quoted</option>
              <option value="scheduled">Scheduled</option>
              <option value="installed">Installed</option>
              <option value="complete">Complete</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">All Sources</option>
            <option value="estimate">Estimate</option>
            <option value="booking">Booking</option>
            <option value="contact">Contact</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Leads Table */}
        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="text-gray-500">Loading leads...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="text-gray-500">No leads found</div>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        {lead.timeline && (
                          <div className="text-xs text-gray-500">{lead.timeline}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Mail className="h-3 w-3" />
                          <a href={`mailto:${lead.email}`} className="hover:underline">
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.city ? (
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <MapPin className="h-3 w-3" />
                            {lead.city}, {lead.zip}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 capitalize">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(lead.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>API Key: sela-admin-2026 | Total: {leads.length} leads</p>
        </div>
      </div>
    </div>
  )
}

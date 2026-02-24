'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  X,
  GripVertical,
  RefreshCw,
  Users,
  Save,
  Check,
  Edit3
} from 'lucide-react'

// Pipeline stages
const stages = [
  { id: 'new', label: 'New Inquiry', color: 'bg-slate-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
  { id: 'consultation', label: 'Consultation', color: 'bg-cyan-500' },
  { id: 'quoted', label: 'Quote Sent', color: 'bg-amber-500' },
  { id: 'deposit', label: 'Deposit Paid', color: 'bg-purple-500' },
  { id: 'ordered', label: 'Cabinets Ordered', color: 'bg-orange-500' },
  { id: 'installing', label: 'Installation', color: 'bg-teal-500' },
  { id: 'complete', label: 'Complete', color: 'bg-emerald-500' },
]

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  address?: string
  city?: string
  zip?: string
  source: string
  status: string
  timeline?: string
  style_preference?: string
  notes?: string
  budget?: string
  created_at: string
  updated_at: string
}

export default function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [draggedLead, setDraggedLead] = useState<number | null>(null)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)

  const API_KEY = 'sela-admin-2026'

  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (!response.ok) throw new Error('Failed to fetch leads')
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Update notes when selected lead changes
  useEffect(() => {
    if (selectedLead) {
      setNotes(selectedLead.notes || '')
      setNotesSaved(false)
    }
  }, [selectedLead])

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.status === stageId)
  }

  const handleDragStart = (leadId: number) => {
    setDraggedLead(leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (stageId: string) => {
    if (draggedLead) {
      setUpdating(true)
      try {
        const response = await fetch(`/api/leads?id=${draggedLead}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: stageId })
        })
        
        if (!response.ok) throw new Error('Failed to update lead')
        
        setLeads(leads.map(lead => 
          lead.id === draggedLead 
            ? { ...lead, status: stageId }
            : lead
        ))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update')
      } finally {
        setDraggedLead(null)
        setUpdating(false)
      }
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedLead) return
    
    setSavingNotes(true)
    try {
      const response = await fetch(`/api/leads?id=${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      })
      
      if (!response.ok) throw new Error('Failed to save notes')
      
      // Update local state
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, notes }
          : lead
      ))
      
      setSelectedLead({ ...selectedLead, notes })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      estimate: 'bg-amber-100 text-amber-700',
      booking: 'bg-blue-100 text-blue-700',
      contact: 'bg-purple-100 text-purple-700',
      chatbot: 'bg-green-100 text-green-700',
    }
    return colors[source] || 'bg-slate-100 text-slate-600'
  }

  const getStatusColor = (status: string) => {
    const stage = stages.find(s => s.id === status)
    return stage?.color || 'bg-slate-500'
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads Pipeline</h1>
            <p className="text-slate-500 mt-1">Loading...</p>
          </div>
          <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Pipeline</h1>
          <p className="text-slate-500 mt-1">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} • Drag to update status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20">
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {stages.map((stage) => (
            <div 
              key={stage.id}
              className="w-80 flex flex-col bg-slate-100 rounded-xl"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${stage.color} rounded-full`} />
                    <h3 className="font-semibold text-slate-700">{stage.label}</h3>
                  </div>
                  <span className="bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {getLeadsByStage(stage.id).length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {getLeadsByStage(stage.id).map((lead) => (
                  <div
                    key={lead.id}
                    draggable={!updating}
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                          {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-amber-600 transition-colors">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>
                      <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-2 text-sm text-slate-500">
                      {lead.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{lead.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {lead.timeline && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {lead.timeline}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceBadge(lead.source)}`}>
                          {lead.source}
                        </span>
                      </div>
                      {lead.notes && (
                        <p className="text-xs text-slate-400 truncate mt-2">
                          📝 {lead.notes.substring(0, 40)}{lead.notes.length > 40 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {getLeadsByStage(stage.id).length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No leads
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Slide-out */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-slate-900">Lead Details</h2>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900">
                  {selectedLead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 ${getStatusColor(selectedLead.status)} rounded-full`} />
                    <p className="text-slate-500 capitalize">{selectedLead.status}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <a 
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-medium hover:bg-emerald-200 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </a>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-3 rounded-xl font-medium hover:bg-purple-200 transition-colors">
                  <Calendar className="w-5 h-5" />
                  Schedule
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contact Info</label>
                  <div className="mt-2 space-y-2">
                    <p className="text-slate-700">{selectedLead.phone}</p>
                    <p className="text-slate-700">{selectedLead.email}</p>
                    {(selectedLead.address || selectedLead.city) && (
                      <p className="text-slate-700">
                        {[selectedLead.address, selectedLead.city, selectedLead.zip].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Source</label>
                    <p className="mt-2 capitalize text-slate-700">{selectedLead.source}</p>
                  </div>
                  {selectedLead.timeline && (
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Timeline</label>
                      <p className="mt-2 text-slate-700">{selectedLead.timeline}</p>
                    </div>
                  )}
                </div>

                {selectedLead.style_preference && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Style Preference</label>
                    <p className="mt-2 text-slate-700">{selectedLead.style_preference}</p>
                  </div>
                )}

                {/* Editable Notes Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</label>
                    {notesSaved && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Saved
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value)
                        setNotesSaved(false)
                      }}
                      placeholder="Add notes about this lead..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes || notes === (selectedLead.notes || '')}
                      className={`absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        savingNotes 
                          ? 'bg-slate-100 text-slate-400' 
                          : notes === (selectedLead.notes || '')
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      {savingNotes ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    <Edit3 className="w-3 h-3 inline mr-1" />
                    Edit notes above and click Save
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</label>
                  <p className="mt-2 text-slate-700">{formatDate(selectedLead.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20">
                  Create Quote
                </button>
                <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

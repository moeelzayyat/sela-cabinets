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
  Edit3,
  FileText,
  Clock,
  MessageCircle,
  Flame,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink
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

// Budget options
const budgetOptions = ['Under $5k', '$5k–$10k', '$10k–$20k', '$20k+', 'Unknown']

// Project types
const projectTypes = ['Kitchen', 'Bathroom', 'Laundry', 'Office', 'Other']

// Referral sources
const referralSources = ['Google Search', 'Google Maps', 'Instagram', 'Facebook', 'Referral', 'Website', 'Walk-in', 'Other']

// Priority levels
const priorities = [
  { id: 'hot', label: 'Hot', emoji: '🔥', color: 'text-red-500' },
  { id: 'warm', label: 'Warm', emoji: '🟡', color: 'text-amber-500' },
  { id: 'cold', label: 'Cold', emoji: '🔵', color: 'text-blue-500' },
]

interface Activity {
  id: number
  activity_type: string
  description: string
  old_value: string
  new_value: string
  created_by: string
  created_at: string
}

interface Quote {
  id: number
  quote_number: string
  total: number
  status: string
  created_at: string
}

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
  project_type?: string[]
  room_size?: number
  cabinet_line?: string
  referral_source?: string
  priority?: string
  next_follow_up?: string
  assigned_to?: string
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
  
  // Edit state
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  
  // Additional fields
  const [budget, setBudget] = useState('')
  const [projectType, setProjectType] = useState<string[]>([])
  const [roomSize, setRoomSize] = useState<number | undefined>()
  const [cabinetLine, setCabinetLine] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [priority, setPriority] = useState('warm')
  const [nextFollowUp, setNextFollowUp] = useState('')
  const [savingFields, setSavingFields] = useState(false)
  
  // Activity timeline
  const [activities, setActivities] = useState<Activity[]>([])
  const [linkedQuotes, setLinkedQuotes] = useState<Quote[]>([])
  const [showActivities, setShowActivities] = useState(true)

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

  // Load additional data when lead is selected
  useEffect(() => {
    if (selectedLead) {
      setNotes(selectedLead.notes || '')
      setNotesSaved(false)
      setBudget(selectedLead.budget || '')
      setProjectType(selectedLead.project_type || [])
      setRoomSize(selectedLead.room_size)
      setCabinetLine(selectedLead.cabinet_line || '')
      setReferralSource(selectedLead.referral_source || '')
      setPriority(selectedLead.priority || 'warm')
      setNextFollowUp(selectedLead.next_follow_up?.split('T')[0] || '')
      
      // Fetch activities and quotes
      fetchActivities(selectedLead.id)
      fetchLinkedQuotes(selectedLead.id)
    }
  }, [selectedLead?.id])

  const fetchActivities = async (leadId: number) => {
    try {
      const response = await fetch(`/api/leads/activities?lead_id=${leadId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    }
  }

  const fetchLinkedQuotes = async (leadId: number) => {
    try {
      const response = await fetch(`/api/quotes?lead_id=${leadId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (response.ok) {
        const data = await response.json()
        setLinkedQuotes(data.quotes || [])
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err)
    }
  }

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
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, notes }
          : lead
      ))
      
      setSelectedLead({ ...selectedLead, notes })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
      
      // Log activity
      fetchActivities(selectedLead.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const handleSaveFields = async () => {
    if (!selectedLead) return
    
    setSavingFields(true)
    try {
      const response = await fetch(`/api/leads?id=${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          budget,
          project_type: projectType,
          room_size: roomSize,
          cabinet_line: cabinetLine,
          referral_source: referralSource,
          priority,
          next_follow_up: nextFollowUp || null
        })
      })
      
      if (!response.ok) throw new Error('Failed to save')
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, budget, project_type: projectType, room_size: roomSize, cabinet_line: cabinetLine, referral_source: referralSource, priority, next_follow_up: nextFollowUp }
          : lead
      ))
      
      setSelectedLead({ ...selectedLead, budget, project_type: projectType, room_size: roomSize, cabinet_line: cabinetLine, referral_source: referralSource, priority, next_follow_up: nextFollowUp })
      
      // Refresh activities
      fetchActivities(selectedLead.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSavingFields(false)
    }
  }

  const toggleProjectType = (type: string) => {
    setProjectType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      estimate: 'bg-orange-100 text-orange-700',
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return '↻'
      case 'note_added': return '📝'
      case 'quote_created': return '📄'
      case 'call_logged': return '📞'
      case 'email_sent': return '✉️'
      default: return '•'
    }
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
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20">
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

              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {getLeadsByStage(stage.id).map((lead) => (
                  <div
                    key={lead.id}
                    draggable={!updating}
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                          {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lead.priority === 'hot' && (
                          <Flame className="w-4 h-4 text-red-500" />
                        )}
                        <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
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

      {/* Lead Detail Slide-out - Enhanced */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
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
              {/* Profile + Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-900">
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
                
                {/* Priority Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id)}
                      className={`px-2 py-1 rounded text-sm transition-colors ${
                        priority === p.id 
                          ? 'bg-white shadow-sm font-medium' 
                          : 'hover:bg-slate-50'
                      }`}
                      title={p.label}
                    >
                      {p.emoji}
                    </button>
                  ))}
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

              {/* Contact Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Contact Info</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-700">{selectedLead.phone}</p>
                  <p className="text-slate-700">{selectedLead.email}</p>
                  {(selectedLead.address || selectedLead.city) && (
                    <p className="text-slate-700">
                      {[selectedLead.address, selectedLead.city, selectedLead.zip].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project Details</h4>
                  <button
                    onClick={handleSaveFields}
                    disabled={savingFields}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                  >
                    {savingFields ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Budget */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Budget</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="">Select...</option>
                      {budgetOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Room Size */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Room Size (sq ft)</label>
                    <input
                      type="number"
                      value={roomSize || ''}
                      onChange={(e) => setRoomSize(parseInt(e.target.value) || undefined)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Project Type</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleProjectType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          projectType.includes(type)
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cabinet Line */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Cabinet Line/Brand</label>
                  <input
                    type="text"
                    value={cabinetLine}
                    onChange={(e) => setCabinetLine(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="e.g., Shaker, Traditional"
                  />
                </div>

                {/* Referral Source */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Referral Source</label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="">Select...</option>
                    {referralSources.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                {/* Next Follow-up */}
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Next Follow-up</label>
                  <input
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                {/* Style Preference (existing) */}
                {selectedLead.style_preference && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Style Preference</label>
                    <p className="text-slate-700">{selectedLead.style_preference}</p>
                  </div>
                )}

                {/* Timeline (existing) */}
                {selectedLead.timeline && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Timeline</label>
                    <p className="text-slate-700">{selectedLead.timeline}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes || notes === (selectedLead.notes || '')}
                    className={`absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      savingNotes 
                        ? 'bg-slate-100 text-slate-400' 
                        : notes === (selectedLead.notes || '')
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
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
              </div>

              {/* Linked Quotes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Linked Quotes</h4>
                  <a
                    href={`/admin/quotes/new?lead=${selectedLead.id}`}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    + Create Quote
                  </a>
                </div>
                {linkedQuotes.length > 0 ? (
                  <div className="space-y-2">
                    {linkedQuotes.map(quote => (
                      <a
                        key={quote.id}
                        href={`/admin/quotes/${quote.id}`}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">{quote.quote_number}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(quote.total)}</p>
                          <p className="text-xs text-slate-500 capitalize">{quote.status}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No quotes yet</p>
                )}
              </div>

              {/* Activity Timeline */}
              <div>
                <button
                  onClick={() => setShowActivities(!showActivities)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Activity Timeline</h4>
                  {showActivities ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                
                {showActivities && (
                  <div className="space-y-3">
                    {activities.length > 0 ? (
                      activities.map(activity => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">{activity.description}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {formatDate(activity.created_at)} • {activity.created_by}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No activity yet</p>
                    )}
                    
                    {/* Initial creation activity */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs">
                        🎯
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">Lead created from {selectedLead.source}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(selectedLead.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <a
                  href={`/admin/quotes/new?lead=${selectedLead.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
                >
                  <FileText className="w-5 h-5" />
                  Create Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

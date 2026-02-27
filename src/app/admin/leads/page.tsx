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
  MessageSquare,
  Clock,
  Flame,
  FileText,
  ChevronRight,
  Briefcase,
  Home,
  Building,
  Loader2
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

const budgetOptions = [
  { value: '', label: 'Not specified' },
  { value: 'under_5k', label: 'Under $5,000' },
  { value: '5k_10k', label: '$5,000 - $10,000' },
  { value: '10k_20k', label: '$10,000 - $20,000' },
  { value: '20k_plus', label: '$20,000+' },
]

const projectTypes = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
]

const referralSources = [
  { value: '', label: 'Not specified' },
  { value: 'google_search', label: 'Google Search' },
  { value: 'google_maps', label: 'Google Maps' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'other', label: 'Other' },
]

const priorityConfig: Record<string, { label: string; emoji: string; bg: string; text: string }> = {
  hot: { label: 'Hot', emoji: '🔥', bg: 'bg-red-100', text: 'text-red-700' },
  warm: { label: 'Warm', emoji: '🟡', bg: 'bg-amber-100', text: 'text-amber-700' },
  cold: { label: 'Cold', emoji: '🔵', bg: 'bg-blue-100', text: 'text-blue-700' },
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

interface Activity {
  id: number
  lead_id: number
  activity_type: string
  description?: string
  old_value?: string
  new_value?: string
  created_by: string
  created_at: string
}

interface LinkedQuote {
  id: number
  quote_number: string
  total: number
  status: string
  created_at: string
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [linkedQuotes, setLinkedQuotes] = useState<LinkedQuote[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false)

  // Editable fields
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editBudget, setEditBudget] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editProjectType, setEditProjectType] = useState<string[]>([])
  const [editRoomSize, setEditRoomSize] = useState('')
  const [editCabinetLine, setCabinetLine] = useState('')
  const [editReferralSource, setEditReferralSource] = useState('')
  const [editNextFollowUp, setEditNextFollowUp] = useState('')
  const [editAssignedTo, setEditAssignedTo] = useState('')

  const API_KEY = 'sela-admin-2026'

  const fetchLeads = useCallback(async () => {
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
  }, [statusFilter, sourceFilter])

  const fetchLeadDetails = async (leadId: number) => {
    setLoadingActivities(true)
    try {
      // Fetch activities
      const activitiesRes = await fetch(`/api/leads/${leadId}/activities`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (activitiesRes.ok) {
        const data = await activitiesRes.json()
        setActivities(data.activities || [])
      }

      // Fetch linked quotes
      const quotesRes = await fetch(`/api/quotes?lead_id=${leadId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (quotesRes.ok) {
        const data = await quotesRes.json()
        setLinkedQuotes(data.quotes || [])
      }
    } catch (err) {
      console.error('Error fetching lead details:', err)
    } finally {
      setLoadingActivities(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Fetch details when lead selected
  useEffect(() => {
    if (selectedLead) {
      setNotes(selectedLead.notes || '')
      setNotesSaved(false)
      setEditBudget(selectedLead.budget || '')
      setEditPriority(selectedLead.priority || 'warm')
      setEditProjectType(selectedLead.project_type || [])
      setEditRoomSize(selectedLead.room_size?.toString() || '')
      setCabinetLine(selectedLead.cabinet_line || '')
      setEditReferralSource(selectedLead.referral_source || '')
      setEditNextFollowUp(selectedLead.next_follow_up?.split('T')[0] || '')
      setEditAssignedTo(selectedLead.assigned_to || 'Way')
      fetchLeadDetails(selectedLead.id)
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

  const handleUpdateField = async (field: string, value: any) => {
    if (!selectedLead) return

    try {
      const response = await fetch(`/api/leads?id=${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: value })
      })
      
      if (!response.ok) throw new Error('Failed to update')
      
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, [field]: value }
          : lead
      ))
      
      setSelectedLead({ ...selectedLead, [field]: value })
      setEditingField(null)

      // Refresh activities
      fetchLeadDetails(selectedLead.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return <ChevronRight className="w-4 h-4 text-blue-500" />
      case 'note_added': return <Edit3 className="w-4 h-4 text-purple-500" />
      case 'quote_created': return <FileText className="w-4 h-4 text-amber-500" />
      case 'quote_sent': return <Mail className="w-4 h-4 text-green-500" />
      default: return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const toggleProjectType = (type: string) => {
    if (editProjectType.includes(type)) {
      setEditProjectType(editProjectType.filter(t => t !== type))
    } else {
      setEditProjectType([...editProjectType, type])
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
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {lead.priority === 'hot' && (
                            <span className="absolute -top-1 -right-1 text-xs">🔥</span>
                          )}
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
                        {lead.budget && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {budgetOptions.find(b => b.value === lead.budget)?.label || lead.budget}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSourceBadge(lead.source)}`}>
                          {lead.source}
                        </span>
                      </div>
                      {lead.next_follow_up && new Date(lead.next_follow_up) > new Date() && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">Follow-up: {formatDate(lead.next_follow_up)}</span>
                        </div>
                      )}
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
            onClick={() => {
              setSelectedLead(null)
              setShowQuoteBuilder(false)
            }}
          />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-lg font-bold text-slate-900">
                  {selectedLead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{selectedLead.name}</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${getStatusColor(selectedLead.status)} rounded-full`} />
                    <p className="text-sm text-slate-500 capitalize">{selectedLead.status}</p>
                    {selectedLead.priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig[selectedLead.priority]?.bg} ${priorityConfig[selectedLead.priority]?.text}`}>
                        {priorityConfig[selectedLead.priority]?.emoji} {priorityConfig[selectedLead.priority]?.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedLead(null)
                  setShowQuoteBuilder(false)
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-5 gap-2">
                <a 
                  href={`tel:${selectedLead.phone}`}
                  className="flex flex-col items-center gap-1 bg-emerald-50 text-emerald-700 py-3 rounded-xl font-medium hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-xs">Call</span>
                </a>
                <a 
                  href={`mailto:${selectedLead.email}`}
                  className="flex flex-col items-center gap-1 bg-blue-50 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-xs">Email</span>
                </a>
                <button className="flex flex-col items-center gap-1 bg-purple-50 text-purple-700 py-3 rounded-xl font-medium hover:bg-purple-100 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">SMS</span>
                </button>
                <button className="flex flex-col items-center gap-1 bg-cyan-50 text-cyan-700 py-3 rounded-xl font-medium hover:bg-cyan-100 transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Schedule</span>
                </button>
                <button 
                  onClick={() => setShowQuoteBuilder(true)}
                  className="flex flex-col items-center gap-1 bg-amber-50 text-amber-700 py-3 rounded-xl font-medium hover:bg-amber-100 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Quote</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selectedLead.phone}
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedLead.email}
                  </p>
                  {(selectedLead.address || selectedLead.city) && (
                    <p className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span>{[selectedLead.address, selectedLead.city, selectedLead.zip].filter(Boolean).join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Lead Details - New Fields */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Budget */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Budget</label>
                    {editingField === 'budget' ? (
                      <select
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        onBlur={() => handleUpdateField('budget', editBudget)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      >
                        {budgetOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField('budget')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {budgetOptions.find(b => b.value === selectedLead.budget)?.label || 'Not specified'}
                      </button>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Priority</label>
                    {editingField === 'priority' ? (
                      <select
                        value={editPriority}
                        onChange={(e) => {
                          setEditPriority(e.target.value)
                          handleUpdateField('priority', e.target.value)
                        }}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      >
                        <option value="hot">🔥 Hot</option>
                        <option value="warm">🟡 Warm</option>
                        <option value="cold">🔵 Cold</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField('priority')}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${priorityConfig[selectedLead.priority || 'warm']?.bg} ${priorityConfig[selectedLead.priority || 'warm']?.text}`}
                      >
                        {priorityConfig[selectedLead.priority || 'warm']?.emoji} {priorityConfig[selectedLead.priority || 'warm']?.label}
                      </button>
                    )}
                  </div>

                  {/* Project Type */}
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Project Type</label>
                    {editingField === 'project_type' ? (
                      <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-lg">
                        {projectTypes.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => toggleProjectType(type.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              editProjectType.includes(type.value)
                                ? 'bg-amber-500 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                        <button
                          onClick={() => handleUpdateField('project_type', editProjectType)}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingField('project_type')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {selectedLead.project_type?.length 
                          ? selectedLead.project_type.map(t => projectTypes.find(p => p.value === t)?.label || t).join(', ')
                          : 'Not specified'}
                      </button>
                    )}
                  </div>

                  {/* Room Size */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Room Size (sq ft)</label>
                    {editingField === 'room_size' ? (
                      <input
                        type="number"
                        value={editRoomSize}
                        onChange={(e) => setEditRoomSize(e.target.value)}
                        onBlur={() => handleUpdateField('room_size', editRoomSize ? parseInt(editRoomSize) : null)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField('room_size')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {selectedLead.room_size ? `${selectedLead.room_size} sq ft` : 'Not specified'}
                      </button>
                    )}
                  </div>

                  {/* Cabinet Line */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Cabinet Line</label>
                    {editingField === 'cabinet_line' ? (
                      <input
                        type="text"
                        value={editCabinetLine}
                        onChange={(e) => setCabinetLine(e.target.value)}
                        onBlur={() => handleUpdateField('cabinet_line', editCabinetLine)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField('cabinet_line')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {selectedLead.cabinet_line || 'Not specified'}
                      </button>
                    )}
                  </div>

                  {/* Referral Source */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Referral Source</label>
                    {editingField === 'referral_source' ? (
                      <select
                        value={editReferralSource}
                        onChange={(e) => setEditReferralSource(e.target.value)}
                        onBlur={() => handleUpdateField('referral_source', editReferralSource)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      >
                        {referralSources.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField('referral_source')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {referralSources.find(r => r.value === selectedLead.referral_source)?.label || 'Not specified'}
                      </button>
                    )}
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Assigned To</label>
                    {editingField === 'assigned_to' ? (
                      <input
                        type="text"
                        value={editAssignedTo}
                        onChange={(e) => setEditAssignedTo(e.target.value)}
                        onBlur={() => handleUpdateField('assigned_to', editAssignedTo)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField('assigned_to')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors"
                      >
                        {selectedLead.assigned_to || 'Way'}
                      </button>
                    )}
                  </div>

                  {/* Next Follow-up */}
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Next Follow-up</label>
                    {editingField === 'next_follow_up' ? (
                      <input
                        type="datetime-local"
                        value={editNextFollowUp}
                        onChange={(e) => setEditNextFollowUp(e.target.value)}
                        onBlur={() => handleUpdateField('next_follow_up', editNextFollowUp || null)}
                        className="w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => setEditingField('next_follow_up')}
                        className="w-full text-left px-2 py-1.5 bg-slate-50 rounded-lg text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        {selectedLead.next_follow_up ? formatDateTime(selectedLead.next_follow_up) : 'Not scheduled'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Style Preference */}
                {selectedLead.style_preference && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Style Preference</label>
                    <p className="text-sm text-slate-700 bg-slate-50 px-2 py-1.5 rounded-lg">{selectedLead.style_preference}</p>
                  </div>
                )}

                {/* Timeline */}
                {selectedLead.timeline && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Timeline</label>
                    <p className="text-sm text-slate-700 bg-slate-50 px-2 py-1.5 rounded-lg">{selectedLead.timeline}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
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
              </div>

              {/* Linked Quotes */}
              {linkedQuotes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Linked Quotes</h3>
                  <div className="space-y-2">
                    {linkedQuotes.map(quote => (
                      <div key={quote.id} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <div>
                          <p className="font-mono text-sm font-medium text-slate-900">{quote.quote_number}</p>
                          <p className="text-xs text-slate-500">{formatDate(quote.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">{formatCurrency(quote.total)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            quote.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                            quote.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity Timeline</h3>
                {loadingActivities ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
                  </div>
                ) : activities.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {activities.slice(0, 10).map(activity => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700">{activity.description}</p>
                          <p className="text-xs text-slate-400">
                            {formatDateTime(activity.created_at)} • {activity.created_by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button 
                  onClick={() => setShowQuoteBuilder(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                >
                  Create Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

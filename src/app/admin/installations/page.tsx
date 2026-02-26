'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Plus, Search, MapPin, Phone, Calendar, Users, Wrench, CheckCircle2, Clock, Camera, X, ChevronRight } from 'lucide-react'

interface Job {
  id: string
  job_number: string
  lead_id: number
  quote_id: number
  start_date: string
  completion_date: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  phase: string
  cabinet_line: string
  order_details: string
  crew_members: string[]
  photos: string[]
  punch_list: PunchItem[]
  address: string
  customer_phone: string
  customer_email: string
  total_amount: number
  notes: string
  lead_name: string
  lead_phone: string
  lead_email: string
  quote_number: string
  quote_total: number
}

interface PunchItem {
  id: string
  text: string
  completed: boolean
}

interface Lead {
  id: number
  name: string
  phone: string
  city: string
  address: string
}

const phases = [
  { value: 'measure', label: 'Measure Complete', icon: '📏' },
  { value: 'order_placed', label: 'Order Placed', icon: '📦' },
  { value: 'order_confirmed', label: 'Order Confirmed', icon: '✅' },
  { value: 'delivered', label: 'Cabinets Delivered', icon: '🚚' },
  { value: 'installing', label: 'Install In Progress', icon: '🔧' },
  { value: 'walkthrough', label: 'Final Walkthrough', icon: '👀' },
  { value: 'punch_list', label: 'Punch List', icon: '📋' },
  { value: 'complete', label: 'Complete', icon: '🎉' }
]

const statusColors: Record<string, { bg: string; text: string }> = {
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-800' },
  'in-progress': { bg: 'bg-amber-100', text: 'text-amber-800' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  cancelled: { bg: 'bg-slate-100', text: 'text-slate-800' }
}

const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
  measure: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  order_placed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  order_confirmed: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
  delivered: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  installing: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  walkthrough: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  punch_list: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  complete: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
}

export default function InstallationsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  
  const [formData, setFormData] = useState({
    leadId: '',
    quoteId: '',
    startDate: '',
    cabinetLine: '',
    orderDetails: '',
    crewMembers: '',
    address: '',
    customerPhone: '',
    customerEmail: '',
    totalAmount: '',
    notes: ''
  })

  useEffect(() => {
    fetchJobs()
    fetchLeads()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/jobs?limit=100')
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads?limit=200&status=deposit,ordered')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const handleCreateJob = () => {
    setSelectedJob(null)
    setFormData({
      leadId: '',
      quoteId: '',
      startDate: '',
      cabinetLine: '',
      orderDetails: '',
      crewMembers: '',
      address: '',
      customerPhone: '',
      customerEmail: '',
      totalAmount: '',
      notes: ''
    })
    setShowModal(true)
  }

  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setShowDetailPanel(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const jobData = {
      leadId: formData.leadId ? parseInt(formData.leadId) : null,
      quoteId: formData.quoteId ? parseInt(formData.quoteId) : null,
      startDate: formData.startDate || null,
      cabinetLine: formData.cabinetLine,
      orderDetails: formData.orderDetails,
      crewMembers: formData.crewMembers.split(',').map(s => s.trim()).filter(Boolean),
      address: formData.address,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : null,
      notes: formData.notes
    }

    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      setShowModal(false)
      fetchJobs()
    } catch (error) {
      console.error('Error creating job:', error)
    }
  }

  const handlePhaseChange = async (jobId: string, newPhase: string) => {
    try {
      const phaseIndex = phases.findIndex(p => p.value === newPhase)
      const newStatus = newPhase === 'complete' ? 'completed' : 
                       phaseIndex >= 4 ? 'in-progress' : 'scheduled'
      
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase, status: newStatus })
      })
      fetchJobs()
      if (selectedJob?.id === jobId) {
        setSelectedJob({ ...selectedJob, phase: newPhase, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating phase:', error)
    }
  }

  const handlePunchListToggle = async (itemId: string) => {
    if (!selectedJob) return
    
    const updatedPunchList = selectedJob.punch_list.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    
    try {
      await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchList: updatedPunchList })
      })
      setSelectedJob({ ...selectedJob, punch_list: updatedPunchList })
    } catch (error) {
      console.error('Error updating punch list:', error)
    }
  }

  const handleAddPunchItem = async () => {
    if (!selectedJob) return
    
    const text = prompt('Enter punch list item:')
    if (!text) return
    
    const newItem: PunchItem = {
      id: `item-${Date.now()}`,
      text,
      completed: false
    }
    
    const updatedPunchList = [...selectedJob.punch_list, newItem]
    
    try {
      await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punchList: updatedPunchList })
      })
      setSelectedJob({ ...selectedJob, punch_list: updatedPunchList })
    } catch (error) {
      console.error('Error adding punch item:', error)
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.job_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.lead_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getProgressPercentage = (phase: string) => {
    const index = phases.findIndex(p => p.value === phase)
    return Math.round(((index + 1) / phases.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Installations</h1>
          <p className="text-slate-500 mt-1">Track active jobs and crew assignments</p>
        </div>
        <button onClick={handleCreateJob} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === 'scheduled').length}</div>
              <div className="text-sm text-slate-500">Scheduled</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === 'in-progress').length}</div>
              <div className="text-sm text-slate-500">In Progress</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{jobs.filter(j => j.status === 'completed').length}</div>
              <div className="text-sm text-slate-500">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{jobs.reduce((sum, j) => sum + (j.photos?.length || 0), 0)}</div>
              <div className="text-sm text-slate-500">Photos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by number, customer, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Jobs Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-4">
            {searchQuery || statusFilter ? 'Try adjusting your filters.' : 'Create your first installation job to get started.'}
          </p>
          {!searchQuery && !statusFilter && (
            <button onClick={handleCreateJob} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Create First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const phaseInfo = phases.find(p => p.value === job.phase) || phases[0]
            const phaseColor = phaseColors[job.phase] || phaseColors.measure
            const statusColor = statusColors[job.status] || statusColors.scheduled
            
            return (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:border-amber-300 transition-colors cursor-pointer"
                onClick={() => handleViewJob(job)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-semibold text-slate-600">{job.job_number}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}>
                        {job.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${phaseColor.bg} ${phaseColor.text} ${phaseColor.border}`}>
                        {phaseInfo.icon} {phaseInfo.label}
                      </span>
                    </div>
                    
                    <div className="font-semibold text-slate-900 mb-1">{job.lead_name || 'No Customer'}</div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      {job.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.address}
                        </div>
                      )}
                      {job.customer_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {job.customer_phone}
                        </div>
                      )}
                      {job.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(job.start_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                    
                    {job.crew_members && job.crew_members.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <div className="flex -space-x-2">
                          {job.crew_members.slice(0, 3).map((member, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                              title={member}
                            >
                              {member.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {job.crew_members.length > 3 && (
                            <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                              +{job.crew_members.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{job.crew_members.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:w-48">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(job.phase)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(job.phase)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="lg:text-right">
                    <div className="text-lg font-bold text-slate-900">
                      ${job.total_amount?.toLocaleString() || job.quote_total?.toLocaleString() || '—'}
                    </div>
                    <div className="text-xs text-slate-500">{job.photos?.length || 0} photos</div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-400 hidden lg:block" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">New Installation Job</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link to Lead</label>
                <select
                  value={formData.leadId}
                  onChange={(e) => {
                    const leadId = e.target.value
                    setFormData({ ...formData, leadId })
                    const lead = leads.find(l => l.id === parseInt(leadId))
                    if (lead) {
                      setFormData(prev => ({
                        ...prev,
                        leadId,
                        address: `${lead.address || ''} ${lead.city || ''}`.trim(),
                        customerPhone: lead.phone
                      }))
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a lead...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} - {lead.city}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cabinet Line</label>
                  <input
                    type="text"
                    value={formData.cabinetLine}
                    onChange={(e) => setFormData({ ...formData, cabinetLine: e.target.value })}
                    placeholder="e.g., Shaker White"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Install Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, Detroit, MI"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Crew Members</label>
                <input
                  type="text"
                  value={formData.crewMembers}
                  onChange={(e) => setFormData({ ...formData, crewMembers: e.target.value })}
                  placeholder="Comma separated: John, Mike, Sarah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Order Details</label>
                <textarea
                  value={formData.orderDetails}
                  onChange={(e) => setFormData({ ...formData, orderDetails: e.target.value })}
                  placeholder="Cabinet specifications, special requirements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Detail Panel */}
      {showDetailPanel && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 font-mono">{selectedJob.job_number}</div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedJob.lead_name}</h3>
                </div>
                <button onClick={() => setShowDetailPanel(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Phase Progress */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">Job Phase</label>
                <div className="flex flex-wrap gap-2">
                  {phases.map((phase, index) => {
                    const isActive = selectedJob.phase === phase.value
                    const isPast = phases.findIndex(p => p.value === selectedJob.phase) > index
                    const color = isActive ? 'bg-amber-500 text-white border-amber-500' :
                                 isPast ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                                 'bg-slate-50 text-slate-500 border-slate-200'
                    
                    return (
                      <button
                        key={phase.value}
                        onClick={() => handlePhaseChange(selectedJob.id, phase.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${color} hover:border-amber-400`}
                      >
                        {phase.icon} {phase.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Address</div>
                  <div className="font-medium text-slate-900">{selectedJob.address || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Phone</div>
                  <div className="font-medium text-slate-900">{selectedJob.customer_phone || selectedJob.lead_phone || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Start Date</div>
                  <div className="font-medium text-slate-900">
                    {selectedJob.start_date ? format(new Date(selectedJob.start_date), 'MMM d, yyyy') : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="font-bold text-lg text-slate-900">
                    ${selectedJob.total_amount?.toLocaleString() || selectedJob.quote_total?.toLocaleString() || '—'}
                  </div>
                </div>
              </div>

              {/* Crew */}
              {selectedJob.crew_members && selectedJob.crew_members.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Crew</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.crew_members.map((member, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">{member}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cabinet Line */}
              {selectedJob.cabinet_line && (
                <div>
                  <div className="text-sm text-slate-500">Cabinet Line</div>
                  <div className="font-medium text-slate-900">{selectedJob.cabinet_line}</div>
                </div>
              )}

              {/* Order Details */}
              {selectedJob.order_details && (
                <div>
                  <div className="text-sm text-slate-500">Order Details</div>
                  <div className="text-slate-900 bg-slate-50 rounded-lg p-3 mt-1">{selectedJob.order_details}</div>
                </div>
              )}

              {/* Punch List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-700">Punch List</div>
                  <button onClick={handleAddPunchItem} className="px-3 py-1 text-xs font-medium text-amber-600 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">
                    + Add Item
                  </button>
                </div>
                {selectedJob.punch_list && selectedJob.punch_list.length > 0 ? (
                  <div className="space-y-2">
                    {selectedJob.punch_list.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handlePunchListToggle(item.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          item.completed ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                        }`}>
                          {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-900'}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">No punch list items yet</div>
                )}
              </div>

              {/* Photos */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Progress Photos</div>
                {selectedJob.photos && selectedJob.photos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {selectedJob.photos.map((photo, i) => (
                      <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <img src={photo} alt={`Progress ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No photos uploaded yet
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedJob.notes && (
                <div>
                  <div className="text-sm text-slate-500">Notes</div>
                  <div className="text-slate-900 bg-slate-50 rounded-lg p-3 mt-1">{selectedJob.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

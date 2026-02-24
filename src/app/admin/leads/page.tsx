'use client'

import { useState } from 'react'
import { 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  MoreVertical,
  X,
  GripVertical
} from 'lucide-react'

// Pipeline stages
const stages = [
  { id: 'new', label: 'New Inquiry', color: 'bg-slate-500' },
  { id: 'consultation', label: 'Consultation Booked', color: 'bg-blue-500' },
  { id: 'quoted', label: 'Quote Sent', color: 'bg-amber-500' },
  { id: 'deposit', label: 'Deposit Paid', color: 'bg-purple-500' },
  { id: 'ordered', label: 'Cabinets Ordered', color: 'bg-orange-500' },
  { id: 'installing', label: 'Installation', color: 'bg-cyan-500' },
  { id: 'complete', label: 'Complete', color: 'bg-emerald-500' },
]

// Mock leads data
const initialLeads = [
  {
    id: 1,
    name: 'Mike Thompson',
    phone: '(313) 555-0101',
    email: 'mike.t@email.com',
    address: '2403 Bailey St, Dearborn',
    source: 'estimate',
    stage: 'new',
    budget: '$4,000 - $6,000',
    timeline: '1-3 months',
    notes: 'Looking for 10x10 kitchen remodel',
    createdAt: '2026-02-24',
  },
  {
    id: 2,
    name: 'Sarah Davis',
    phone: '(248) 555-0202',
    email: 'sarah.d@email.com',
    address: '456 Oak Ave, Troy',
    source: 'booking',
    stage: 'consultation',
    budget: '$5,000 - $8,000',
    timeline: 'ASAP',
    notes: 'Wants white shaker cabinets',
    createdAt: '2026-02-23',
  },
  {
    id: 3,
    name: 'Johnson Family',
    phone: '(734) 555-0303',
    email: 'johnson@email.com',
    address: '789 Maple Dr, Ann Arbor',
    source: 'chatbot',
    stage: 'quoted',
    budget: '$6,500',
    timeline: 'Flexible',
    notes: 'Quote: $6,500 for L-shaped kitchen',
    createdAt: '2026-02-22',
  },
  {
    id: 4,
    name: 'Patel Residence',
    phone: '(586) 555-0404',
    email: 'patel@email.com',
    address: '123 Main St, Sterling Heights',
    source: 'estimate',
    stage: 'deposit',
    budget: '$8,000',
    timeline: 'Installation Wed',
    notes: 'Deposit received, cabinets ordered',
    createdAt: '2026-02-20',
  },
  {
    id: 5,
    name: 'Williams',
    phone: '(313) 555-0505',
    email: 'williams@email.com',
    address: '555 Elm St, Royal Oak',
    source: 'booking',
    stage: 'ordered',
    budget: '$5,500',
    timeline: 'Cabinets arriving Friday',
    notes: 'Waiting on cabinet delivery',
    createdAt: '2026-02-18',
  },
]

export default function LeadsKanban() {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<typeof initialLeads[0] | null>(null)
  const [draggedLead, setDraggedLead] = useState<number | null>(null)

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId)
  }

  const handleDragStart = (leadId: number) => {
    setDraggedLead(leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (stageId: string) => {
    if (draggedLead) {
      setLeads(leads.map(lead => 
        lead.id === draggedLead 
          ? { ...lead, stage: stageId }
          : lead
      ))
      setDraggedLead(null)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Pipeline</h1>
          <p className="text-slate-500 mt-1">Drag leads between stages to update their status</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20">
          <Plus className="w-5 h-5" />
          Add Lead
        </button>
      </div>

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
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-amber-600 transition-colors">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-400">{lead.timeline}</p>
                        </div>
                      </div>
                      <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{lead.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {lead.budget}
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {lead.source}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
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
                  {selectedLead.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedLead.name}</h3>
                  <p className="text-slate-500">Lead from {selectedLead.source}</p>
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
                    <p className="text-slate-700">{selectedLead.address}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Budget & Timeline</label>
                  <div className="mt-2 flex gap-4">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedLead.budget}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedLead.timeline}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</label>
                  <p className="mt-2 text-slate-700">{selectedLead.notes}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created</label>
                  <p className="mt-2 text-slate-700">{new Date(selectedLead.createdAt).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20">
                  Create Quote
                </button>
                <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  Convert to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, addWeeks, subWeeks, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  eventType: string
  status: string
  notes?: string
  color: string
  crewMembers: string[]
  leadId?: number
  leadName?: string
  leadPhone?: string
}

interface Lead {
  id: number
  name: string
  phone: string
  city: string
}

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  consultation: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  installation: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  follow_up: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  delivery: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  other: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' }
}

const eventTypeLabels: Record<string, string> = {
  consultation: 'Consultation',
  installation: 'Installation',
  follow_up: 'Follow-up',
  delivery: 'Delivery',
  other: 'Other'
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    eventType: 'consultation',
    notes: '',
    crewMembers: '',
    leadId: ''
  })

  useEffect(() => {
    fetchEvents()
    fetchLeads()
  }, [currentDate])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')
      const res = await fetch(`/api/appointments/events?start=${start}&end=${end}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads?limit=100')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const handlePrev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setFormData({
      title: '',
      start: format(date, "yyyy-MM-dd'T'HH:mm"),
      end: format(date, "yyyy-MM-dd'T'HH:mm"),
      eventType: 'consultation',
      notes: '',
      crewMembers: '',
      leadId: ''
    })
    setShowModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSelectedDate(parseISO(event.start))
    setFormData({
      title: event.title,
      start: format(parseISO(event.start), "yyyy-MM-dd'T'HH:mm"),
      end: event.end ? format(parseISO(event.end), "yyyy-MM-dd'T'HH:mm") : '',
      eventType: event.eventType,
      notes: event.notes || '',
      crewMembers: event.crewMembers?.join(', ') || '',
      leadId: event.leadId?.toString() || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData = {
      title: formData.title,
      start: formData.start,
      end: formData.end || null,
      eventType: formData.eventType,
      notes: formData.notes,
      crewMembers: formData.crewMembers.split(',').map(s => s.trim()).filter(Boolean),
      leadId: formData.leadId ? parseInt(formData.leadId) : null
    }

    try {
      if (selectedEvent) {
        await fetch(`/api/appointments/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        })
      } else {
        await fetch('/api/appointments/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        })
      }
      setShowModal(false)
      fetchEvents()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      await fetch(`/api/appointments/${selectedEvent.id}`, { method: 'DELETE' })
      setShowModal(false)
      fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const days: Date[] = []
    let day = startDate
    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }
    return days
  }, [currentDate])

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate)
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i))
    }
    return days
  }, [currentDate])

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.start), date))
  }

  const renderEventPill = (event: CalendarEvent, compact: boolean = false) => {
    const colors = eventTypeColors[event.eventType] || eventTypeColors.other
    return (
      <div
        key={event.id}
        onClick={(e) => { e.stopPropagation(); handleEventClick(event) }}
        className={`${colors.bg} ${colors.text} ${colors.border} border-l-2 px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${compact ? 'truncate' : ''}`}
      >
        <div className="font-medium truncate">{event.title}</div>
        {!compact && !event.allDay && (
          <div className="flex items-center gap-1 mt-0.5 opacity-75">
            <Clock className="w-3 h-3" />
            {format(parseISO(event.start), 'h:mm a')}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-500 mt-1">Manage appointments and installations</p>
        </div>
        <button 
          onClick={() => handleDateClick(new Date())}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
              {format(currentDate, view === 'month' ? 'MMMM yyyy' : "'Week of' MMM d, yyyy")}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
          {Object.entries(eventTypeLabels).map(([key, label]) => {
            const colors = eventTypeColors[key]
            return (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`}></div>
                <span className="text-sm text-slate-600">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading calendar...</p>
        </div>
      ) : view === 'month' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-slate-600 bg-slate-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, i) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              
              return (
                <div
                  key={i}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[120px] p-2 border-b border-r border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !isCurrentMonth ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day) ? 'w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center' :
                    isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => renderEventPill(event, true))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-slate-500 pl-2">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-8 border-b border-slate-200">
            <div className="p-3 text-center text-sm font-semibold text-slate-600 bg-slate-50 border-r border-slate-200">Time</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className={`p-3 text-center border-r border-slate-200 ${isToday(day) ? 'bg-amber-50' : 'bg-slate-50'}`}>
                <div className="text-sm font-semibold text-slate-600">{format(day, 'EEE')}</div>
                <div className={`text-lg font-bold ${isToday(day) ? 'text-amber-600' : 'text-slate-900'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-100">
                <div className="p-2 text-xs text-slate-500 text-right pr-3 border-r border-slate-100">
                  {format(new Date().setHours(hour, 0), 'h:mm a')}
                </div>
                {weekDays.map(day => {
                  const hourEvents = getEventsForDate(day).filter(event => parseISO(event.start).getHours() === hour)
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => {
                        const dateWithTime = new Date(day)
                        dateWithTime.setHours(hour, 0, 0, 0)
                        handleDateClick(dateWithTime)
                      }}
                      className="min-h-[60px] p-1 border-r border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      {hourEvents.map(event => renderEventPill(event))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedEvent ? 'Edit Event' : 'New Event'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Kitchen consultation with John"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.entries(eventTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link to Lead (Optional)</label>
                <select
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a lead...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name} - {lead.city}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                {selectedEvent ? (
                  <>
                    <button type="button" onClick={handleDelete} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                        Update Event
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                      Create Event
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

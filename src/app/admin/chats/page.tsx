'use client'

import { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Users, 
  Clock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Trash2,
  X,
  Filter,
  AlertTriangle
} from 'lucide-react'

interface ChatSession {
  session_id: string
  first_message_at: string
  last_message_at: string
  message_count: number
  lead_captured: boolean
  contact_info: any
  first_user_message: string
}

interface ChatMessage {
  session_id: string
  message: string
  sender: string
  created_at: string
}

interface Stats {
  total_sessions: string
  total_messages: string
  user_messages: string
  bot_messages: string
}

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([])
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  
  // Date filter state
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'session' | 'all', sessionId?: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const API_KEY = 'sela-admin-2026'

  const fetchChatLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/chat-logs', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch chat logs')

      const data = await response.json()
      setSessions(data.sessions)
      setRecentMessages(data.recentMessages)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Apply date filter
  useEffect(() => {
    let filtered = [...sessions]
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter(s => new Date(s.first_message_at) >= fromDate)
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(s => new Date(s.first_message_at) <= toDate)
    }
    
    setFilteredSessions(filtered)
  }, [sessions, dateFrom, dateTo])

  useEffect(() => {
    fetchChatLogs()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSessionMessages = (sessionId: string) => {
    return recentMessages.filter(msg => msg.session_id === sessionId)
  }

  const clearFilters = () => {
    setDateFrom('')
    setDateTo('')
  }

  const handleDeleteSession = async (sessionId: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/chat-logs?session_id=${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete session')

      // Remove from local state
      setSessions(prev => prev.filter(s => s.session_id !== sessionId))
      setRecentMessages(prev => prev.filter(m => m.session_id !== sessionId))
      setDeleteConfirm(null)
      setExpandedSession(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    setDeleting(true)
    try {
      const response = await fetch('/api/chat-logs?all=true', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete all sessions')

      setSessions([])
      setRecentMessages([])
      setFilteredSessions([])
      setStats(null)
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 mt-1">View and manage chat conversations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showFilters || dateFrom || dateTo
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {(dateFrom || dateTo) && (
              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
          <button
            onClick={fetchChatLogs}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Filter by Date</h3>
            {(dateFrom || dateTo) && (
              <button
                onClick={clearFilters}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {(dateFrom || dateTo) && (
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredSessions.length} of {sessions.length} sessions
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.total_sessions}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Total Messages</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.total_messages}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">User Messages</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.user_messages}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Bot Responses</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.bot_messages}</div>
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

      {/* Bulk Actions */}
      {filteredSessions.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <span className="text-sm text-slate-600">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setDeleteConfirm({ type: 'all' })}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete All
          </button>
        </div>
      )}

      {/* Sessions List */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto mb-2" />
          <div className="text-slate-500">Loading chat sessions...</div>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500">
            {sessions.length === 0 ? 'No chat sessions yet' : 'No sessions match your filters'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <div key={session.session_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Session Header */}
              <div className="flex items-center">
                <button
                  onClick={() => setExpandedSession(
                    expandedSession === session.session_id ? null : session.session_id
                  )}
                  className="flex-1 px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">
                      {session.first_user_message || 'No user message'}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {formatDate(session.first_message_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                      <MessageCircle className="w-3 h-3" />
                      {session.message_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.last_message_at)}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'session', sessionId: session.session_id })}
                  className="p-4 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExpandedSession(
                    expandedSession === session.session_id ? null : session.session_id
                  )}
                  className="p-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {expandedSession === session.session_id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Expanded Messages */}
              {expandedSession === session.session_id && (
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getSessionMessages(session.session_id).reverse().map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-xl px-4 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                              : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                          <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-amber-100' : 'text-slate-400'}`}>
                            {formatDate(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {deleteConfirm.type === 'all' ? 'Delete All Sessions?' : 'Delete Session?'}
                </h3>
                <p className="text-sm text-slate-500">
                  {deleteConfirm.type === 'all' 
                    ? 'This will permanently delete all chat history.'
                    : 'This will permanently delete this chat session.'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'all') {
                    handleDeleteAll()
                  } else if (deleteConfirm.sessionId) {
                    handleDeleteSession(deleteConfirm.sessionId)
                  }
                }}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

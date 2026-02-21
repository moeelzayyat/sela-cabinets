'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Users, Clock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

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
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Logs</h1>
            <p className="text-gray-600 mt-1">View all website chat conversations</p>
          </div>
          <button
            onClick={fetchChatLogs}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Total Sessions</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_sessions}</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Total Messages</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total_messages}</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">User Messages</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.user_messages}</div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Bot Responses</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.bot_messages}</div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="text-gray-500">Loading chat sessions...</div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <div className="text-gray-500">No chat sessions yet</div>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.session_id} className="rounded-lg bg-white shadow overflow-hidden">
                {/* Session Header */}
                <button
                  onClick={() => setExpandedSession(
                    expandedSession === session.session_id ? null : session.session_id
                  )}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {session.first_user_message || 'No user message'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Session: {session.session_id.split('_').slice(-1)[0]}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {session.message_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(session.last_message_at)}
                      </span>
                    </div>
                  </div>
                  {expandedSession === session.session_id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Messages */}
                {expandedSession === session.session_id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {getSessionMessages(session.session_id).reverse().map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-900 shadow-sm'
                            }`}
                          >
                            <div className="text-sm">{msg.message}</div>
                            <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>API Key: sela-admin-2026 | Total: {sessions.length} sessions</p>
        </div>
      </div>
    </div>
  )
}

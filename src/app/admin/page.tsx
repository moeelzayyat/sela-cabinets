'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Wrench,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  RefreshCw
} from 'lucide-react'

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  address?: string
  city?: string
  source: string
  status: string
  created_at: string
  updated_at: string
}

interface ChatSession {
  session_id: string
  first_message_at: string
  last_message_at: string
  message_count: number
  first_user_message: string
}

interface Stats {
  total_sessions: string
  total_messages: string
}

interface DashboardStats {
  totalLeads: number
  newLeads: number
  contactedLeads: number
  quotedLeads: number
  wonLeads: number
  activeJobs: number
  totalChats: number
  totalMessages: number
  recentLeads: Lead[]
  recentChats: ChatSession[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_KEY = 'sela-admin-2026'
  
  // Monthly revenue target
  const REVENUE_TARGET = 83333 // $1M/year / 12 months

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch leads
      const leadsRes = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (!leadsRes.ok) throw new Error('Failed to fetch leads')
      const leadsData = await leadsRes.json()

      // Fetch chat logs
      const chatsRes = await fetch('/api/chat-logs', {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      })
      if (!chatsRes.ok) throw new Error('Failed to fetch chats')
      const chatsData = await chatsRes.json()

      const leads: Lead[] = leadsData.leads || []
      const sessions: ChatSession[] = chatsData.sessions || []
      const chatStats: Stats = chatsData.stats || { total_sessions: '0', total_messages: '0' }

      // Calculate pipeline stats based on lead status
      const newLeads = leads.filter(l => l.status === 'new').length
      const contactedLeads = leads.filter(l => l.status === 'contacted').length
      const quotedLeads = leads.filter(l => l.status === 'quoted').length
      const wonLeads = leads.filter(l => l.status === 'won' || l.status === 'complete').length
      const activeJobs = leads.filter(l => ['deposit', 'ordered', 'installing'].includes(l.status)).length

      setStats({
        totalLeads: leads.length,
        newLeads,
        contactedLeads,
        quotedLeads,
        wonLeads,
        activeJobs,
        totalChats: parseInt(chatStats.total_sessions) || 0,
        totalMessages: parseInt(chatStats.total_messages) || 0,
        recentLeads: leads.slice(0, 5),
        recentChats: sessions.slice(0, 5)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Needs action items based on real data
  const getNeedsAction = () => {
    const items = []
    if (stats && stats.newLeads > 0) {
      items.push({ id: 1, type: 'lead', message: `${stats.newLeads} new lead${stats.newLeads > 1 ? 's' : ''} need follow-up`, priority: 'high' })
    }
    if (stats && stats.quotedLeads > 0) {
      items.push({ id: 2, type: 'quote', message: `${stats.quotedLeads} quote${stats.quotedLeads > 1 ? 's' : ''} pending decision`, priority: 'medium' })
    }
    if (items.length === 0) {
      items.push({ id: 0, type: 'none', message: 'All caught up! No urgent items.', priority: 'low' })
    }
    return items
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Loading your data...</p>
          </div>
          <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-red-500 mt-1">{error}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  const needsAction = getNeedsAction()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Way. Here&apos;s what&apos;s happening today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card - placeholder until we track revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Won Deals</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.wonLeads || 0}</p>
            <p className="text-xs text-slate-400 mt-2">closed this month</p>
          </div>
        </div>

        {/* Total Leads Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            {stats && stats.newLeads > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {stats.newLeads} new
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Total Leads</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalLeads || 0}</p>
            <p className="text-xs text-slate-400 mt-2">all time</p>
          </div>
        </div>

        {/* Chat Sessions Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Chat Sessions</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalChats || 0}</p>
            <p className="text-xs text-slate-400 mt-2">{stats?.totalMessages || 0} messages</p>
          </div>
        </div>

        {/* Active Jobs Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Active Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.activeJobs || 0}</p>
            <p className="text-xs text-slate-400 mt-2">in progress</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Pipeline Snapshot */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Lead Pipeline</h2>
            <Link href="/admin/leads" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Pipeline Funnel */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {[
              { label: 'New', count: stats?.newLeads || 0, color: 'bg-slate-500' },
              { label: 'Contacted', count: stats?.contactedLeads || 0, color: 'bg-blue-500' },
              { label: 'Quoted', count: stats?.quotedLeads || 0, color: 'bg-amber-500' },
              { label: 'Won', count: stats?.wonLeads || 0, color: 'bg-emerald-500' },
            ].map((stage, i) => (
              <div key={stage.label} className="flex items-center">
                <div className="text-center">
                  <div className={`w-16 h-16 ${stage.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {stage.count}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">{stage.label}</p>
                </div>
                {i < 3 && (
                  <div className="w-8 h-0.5 bg-slate-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Needs Action */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Needs Action</h2>
            {needsAction.length > 0 && needsAction[0].type !== 'none' && (
              <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                {needsAction.length}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {needsAction.map((item) => (
              <div 
                key={item.id}
                className={`p-3 rounded-lg border-l-4 ${
                  item.priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : item.priority === 'medium'
                    ? 'bg-amber-50 border-amber-400'
                    : 'bg-slate-50 border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {item.priority !== 'low' && (
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      item.priority === 'high' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                  )}
                  <p className="text-sm text-slate-700">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
            <Link href="/admin/leads" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats && stats.recentLeads.length > 0 ? (
            <div className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                      {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.city || lead.address || lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lead.status === 'new' ? 'bg-slate-100 text-slate-600' :
                      lead.status === 'quoted' ? 'bg-amber-100 text-amber-700' :
                      lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No leads yet</p>
            </div>
          )}
        </div>

        {/* Recent Chats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Chats</h2>
            <Link href="/admin/chats" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {stats && stats.recentChats.length > 0 ? (
            <div className="space-y-3">
              {stats.recentChats.map((chat) => (
                <div 
                  key={chat.session_id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">
                        {chat.first_user_message || 'Chat session'}
                      </p>
                      <p className="text-xs text-slate-400">{chat.message_count} messages</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{formatDate(chat.last_message_at)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No chats yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

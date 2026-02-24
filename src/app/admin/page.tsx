import Link from 'next/link'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target, 
  Wrench,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Clock,
  Phone,
  Mail
} from 'lucide-react'

// Mock data - will be replaced with real data from DB
const stats = {
  revenue: {
    current: 24500,
    target: 83333,
    lastMonth: 18000
  },
  conversion: {
    rate: 32,
    change: 5,
    newLeads: 5,
    consultations: 3,
    quotes: 2,
    won: 1
  },
  activeJobs: [
    { id: 1, customer: 'Johnson', status: 'Cabinets arriving today', address: 'Dearborn' },
    { id: 2, customer: 'Patel', status: 'Install scheduled Wed', address: 'Troy' },
    { id: 3, customer: 'Williams', status: 'Measurement complete', address: 'Royal Oak' },
    { id: 4, customer: 'Chen', status: 'Awaiting deposit', address: 'Ann Arbor' },
  ],
  needsAction: [
    { id: 1, type: 'lead', message: '3 new leads need follow-up', priority: 'high' },
    { id: 2, type: 'quote', message: '2 quotes pending approval', priority: 'medium' },
    { id: 3, type: 'install', message: 'Confirm crew for Friday install', priority: 'medium' },
  ],
  recentActivity: [
    { id: 1, action: 'New lead from estimate form', customer: 'Mike Thompson', time: '2 hours ago' },
    { id: 2, action: 'Consultation booked', customer: 'Sarah Davis', time: '4 hours ago' },
    { id: 3, action: 'Quote approved', customer: 'Johnson Family', time: 'Yesterday' },
    { id: 4, action: 'Install completed', customer: 'Martinez', time: 'Yesterday' },
  ]
}

export default function AdminDashboard() {
  const revenueProgress = (stats.revenue.current / stats.revenue.target) * 100
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Way. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +{Math.round(((stats.revenue.current - stats.revenue.lastMonth) / stats.revenue.lastMonth) * 100)}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Revenue This Month</p>
            <p className="text-2xl font-bold text-slate-900">${stats.revenue.current.toLocaleString()}</p>
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>of ${stats.revenue.target.toLocaleString()} target</span>
                <span>{Math.round(revenueProgress)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" 
                  style={{ width: `${revenueProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{stats.conversion.change}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-900">{stats.conversion.rate}%</p>
            <p className="text-xs text-slate-400 mt-2">vs last month</p>
          </div>
        </div>

        {/* Active Jobs Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Active Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{stats.activeJobs.length}</p>
            <p className="text-xs text-slate-400 mt-2">in progress</p>
          </div>
        </div>

        {/* Total Leads Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Total Leads</p>
            <p className="text-2xl font-bold text-slate-900">47</p>
            <p className="text-xs text-slate-400 mt-2">this month</p>
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
              { label: 'New', count: stats.conversion.newLeads, color: 'bg-slate-500' },
              { label: 'Consultation', count: stats.conversion.consultations, color: 'bg-blue-500' },
              { label: 'Quoted', count: stats.conversion.quotes, color: 'bg-amber-500' },
              { label: 'Won', count: stats.conversion.won, color: 'bg-emerald-500' },
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
            <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
              {stats.needsAction.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {stats.needsAction.map((item) => (
              <div 
                key={item.id}
                className={`p-3 rounded-lg border-l-4 ${
                  item.priority === 'high' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-amber-50 border-amber-400'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    item.priority === 'high' ? 'text-red-500' : 'text-amber-500'
                  }`} />
                  <p className="text-sm text-slate-700">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Active Jobs</h2>
            <Link href="/admin/installations" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.activeJobs.map((job) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                    {job.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{job.customer}</p>
                    <p className="text-sm text-slate-500">{job.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">{job.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="font-medium text-slate-600">{activity.customer}</span>
                    <span className="mx-2">•</span>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Wrench, 
  MessageSquare, 
  Bot, 
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Package,
  DollarSign,
  BookUser
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/invoices', label: 'Invoices', icon: DollarSign },
  { href: '/admin/installations', label: 'Installs', icon: Wrench },
  { href: '/admin/contacts', label: 'Contacts', icon: BookUser },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/chats', label: 'Messages', icon: MessageSquare },
  { href: '/admin/chatbot', label: 'Chatbot', icon: Bot },
]

const bottomNavItems = [
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex print:block print:bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col fixed h-full z-40 print:hidden">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-bold text-slate-900 text-lg shadow-lg shadow-amber-500/20">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SELA CRM</h1>
              <p className="text-xs text-slate-400">Operations Hub</p>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700/50 space-y-1">
          {bottomNavItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="pt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 print:ml-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-4">
            {/* Breadcrumb or page title will go here */}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-900">
                W
              </div>
              <span className="text-sm font-medium text-slate-700">Way</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-8 print:p-0 print:m-0">
          {children}
        </main>
      </div>
    </div>
  )
}

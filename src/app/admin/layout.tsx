import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { MessageSquare, Users, Settings, Database, Home } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-800 text-white flex flex-col">
        <div className="p-4 border-b border-amber-700">
          <h1 className="text-xl font-bold">SELA Admin</h1>
          <p className="text-amber-200 text-sm">Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/leads" 
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Leads</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/chats" 
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat History</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/chatbot" 
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Chatbot Config</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-amber-700">
          <LogoutButton />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

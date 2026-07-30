'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  BookUser,
  Bot,
  Calendar,
  DollarSign,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { LogoutButton } from './logout-button'

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

function isActivePath(pathname: string, href: string) {
  if (href === '/admin') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="border-b border-slate-700/50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-lg font-bold text-slate-900 shadow-lg shadow-amber-500/20">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">SELA CRM</h1>
            <p className="text-xs text-slate-400">Operations Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-700/50 p-4">
        {bottomNavItems.map((item) => {
          const active = isActivePath(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
        <div className="pt-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const isAuthRoute = pathname === '/admin/login' || pathname === '/admin/register'

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isAuthRoute) return

    let cancelled = false
    setSessionActive(false)
    void fetch('/api/admin/users?session_check=1', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then((response) => {
        if (cancelled) return
        if (response.ok) {
          setSessionActive(true)
        } else {
          replace('/admin/login')
        }
      })
      .catch(() => {
        if (!cancelled) replace('/admin/login')
      })

    return () => {
      cancelled = true
    }
  }, [isAuthRoute, pathname, replace])

  if (isAuthRoute) {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  if (!sessionActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p role="status" className="text-sm text-slate-600">
          Verifying administrator session…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 print:block print:bg-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 print:hidden lg:block">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 print:hidden lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[86vw] shadow-2xl">
            <button
              type="button"
              aria-label="Close navigation menu"
              title="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-64 print:pl-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 print:hidden sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              title="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-slate-500 lg:hidden">SELA CRM</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              aria-label="View notifications"
              title="Notifications"
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-slate-900">
                W
              </div>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">Way</span>
            </div>
          </div>
        </header>

        <main className="max-w-full overflow-x-hidden p-4 print:m-0 print:p-0 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

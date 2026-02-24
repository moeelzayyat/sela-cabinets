'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const [logging, setLogging] = useState(false)

  const handleLogout = async () => {
    setLogging(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLogging(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={logging}
      className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 px-4 py-2 rounded-lg transition disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {logging ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}

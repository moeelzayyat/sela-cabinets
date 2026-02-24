import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogoutButton } from './logout-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-amber-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">SELA Cabinets Admin</h1>
            <p className="text-amber-200 text-sm">Secure Dashboard</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        {children}
      </main>
    </div>
  )
}

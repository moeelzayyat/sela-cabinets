'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-amber-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SELA Cabinets</h1>
          <p className="text-gray-600 mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="you@company.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Signing in...' : 'Sign In with Email'}
          </button>

          <a
            href="/api/admin/google/start"
            className="mt-3 block w-full border border-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-50 font-medium transition text-center"
          >
            Continue with Google
          </a>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Don&apos;t have an account yet?</p>
          <a href="/admin/register" className="text-amber-700 hover:text-amber-800 font-medium">Create one now</a>
        </div>
      </div>
    </div>
  )
}

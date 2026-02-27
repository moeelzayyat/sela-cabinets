'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountRegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Registration failed')
      router.push('/account')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Create Client Account</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password (min 8 chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-amber-600 text-white py-2 rounded">{loading ? 'Creating...' : 'Register'}</button>
        <a href="/api/auth/google/start" className="block w-full text-center border rounded py-2 hover:bg-gray-50">Continue with Google</a>
        <p className="text-sm text-gray-600 text-center">Already have an account? <a className="text-amber-700" href="/account/login">Login</a></p>
      </form>
    </div>
  )
}

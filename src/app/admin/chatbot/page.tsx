'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Info } from 'lucide-react'

interface ChatbotConfig {
  [key: string]: {
    value: string
    updated_at: string
  }
}

export default function ChatbotConfigPage() {
  const [config, setConfig] = useState<ChatbotConfig>({})
  const [systemPrompt, setSystemPrompt] = useState('')
  const [welcomeMessage, setWelcomeMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const API_KEY = 'sela-admin-2026'

  const fetchConfig = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/chatbot-config', {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch config')

      const data = await response.json()
      setConfig(data.config)
      setSystemPrompt(data.config.system_prompt?.value || '')
      setWelcomeMessage(data.config.welcome_message?.value || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const saveConfig = async (key: string, value: string) => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/chatbot-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
      })

      if (!response.ok) throw new Error('Failed to save config')

      setSuccess('Configuration saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
      await fetchConfig()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    await saveConfig('system_prompt', systemPrompt)
    await saveConfig('welcome_message', welcomeMessage)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-gray-600">Loading configuration...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chatbot Configuration</h1>
            <p className="text-gray-600 mt-1">Customize your AI assistant's behavior and responses</p>
          </div>
          <button
            onClick={fetchConfig}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Tips for better responses:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Be specific in your instructions - tell the bot exactly how to answer</li>
                <li>Include examples of how to respond to common questions</li>
                <li>Test changes by chatting with the bot after saving</li>
                <li>Use clear, simple language that the AI can follow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* System Prompt */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt (Bot Instructions)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            This tells the bot how to behave. Include company info, FAQs, and response guidelines.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter system prompt..."
          />
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {config.system_prompt?.updated_at ? new Date(config.system_prompt.updated_at).toLocaleString() : 'Never'}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Welcome Message
          </label>
          <p className="text-sm text-gray-500 mb-3">
            The first message visitors see when they open the chat.
          </p>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enter welcome message..."
          />
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {config.welcome_message?.updated_at ? new Date(config.welcome_message.updated_at).toLocaleString() : 'Never'}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>API Key: sela-admin-2026 | Changes take effect immediately</p>
        </div>
      </div>
    </div>
  )
}

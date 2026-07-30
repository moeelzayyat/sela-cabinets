'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface QuickReply {
  text: string
  message: string
}

const quickReplies: QuickReply[] = [
  { text: 'Service Areas', message: 'What areas do you serve?' },
  { text: 'Estimate', message: 'How do cabinet estimates work?' },
  { text: 'Timeline', message: 'How long does installation take?' },
  { text: 'Start Request', message: 'I want to start a cabinet estimate' },
]

const STORAGE_KEY = 'selacabinets_chat_session_v2'
const WELCOME_MESSAGE =
  'Hi, welcome to SELA Cabinets. I can help with service areas, cabinet estimates, timelines, and consultations. How can I help today?'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load session from localStorage or initialize
  useEffect(() => {
    const loadSession = async () => {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined') return
      
      // Try to load from localStorage
      try {
        const savedSession = localStorage.getItem(STORAGE_KEY)
        
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession)
            // Only restore if session is less than 1 hour old
            const sessionAge = Date.now() - parsed.timestamp
            if (sessionAge < 3600000 && parsed.messages?.length > 0) {
              setMessages(parsed.messages.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp)
              })))
              setSessionId(parsed.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
              setIsLoading(false)
              return
            }
          } catch (parseError) {
            console.error('Error parsing session:', parseError)
          }
        }
      } catch (storageError) {
        console.error('Error accessing localStorage:', storageError)
      }
      
      // Generate new session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
      
      const initialMessages = [{
        id: 1,
        text: WELCOME_MESSAGE,
        sender: 'bot' as const,
        timestamp: new Date()
      }]

      setMessages(initialMessages)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          messages: initialMessages,
          timestamp: Date.now(),
          sessionId: newSessionId
        }))
      } catch (e) {
        // Ignore localStorage errors
      }
      setIsLoading(false)
    }

    loadSession()
  }, [])

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (messages.length > 0 && sessionId) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          messages,
          timestamp: Date.now(),
          sessionId
        }))
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [messages, sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Prevent duplicate messages with same timestamp
    const userMessageId = Date.now()
    
    // Add user message immediately
    const userMessage: Message = {
      id: userMessageId,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => {
      // Check if message already exists
      if (prev.some(m => m.id === userMessageId)) {
        return prev
      }
      const newMessages = [...prev, userMessage]
      return newMessages
    })
    
    setInputValue('')
    setIsTyping(true)

    try {
      // Call AI chat API - only send user's message, not entire history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionId
        })
      })

      const data = await response.json()

      const botMessageId = Date.now() + 1
      const botMessage: Message = {
        id: botMessageId,
        text: data.message,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => {
        // Check if bot message already exists
        if (prev.some(m => m.id === botMessageId)) {
          return prev
        }
        return [...prev, botMessage]
      })
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessageId = Date.now() + 2
      const errorMessage: Message = {
        id: errorMessageId,
        text: "I'm having a little trouble right now. For immediate help, please call us at (313) 468-3225!",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => {
        if (prev.some(m => m.id === errorMessageId)) {
          return prev
        }
        return [...prev, errorMessage]
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (message: string) => {
    handleSendMessage(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-900 text-white shadow-lg transition-all hover:scale-110 hover:bg-charcoal-800 md:bottom-6 md:right-6 md:h-16 md:w-16"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wood-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-wood-400"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 z-50 flex h-[min(600px,calc(100vh-8rem))] flex-col overflow-hidden rounded-2xl border border-charcoal-200 bg-white shadow-2xl md:bottom-6 md:left-auto md:right-6 md:h-[600px] md:w-[380px]">
          {/* Header */}
          <div className="bg-charcoal-900 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">SELA Cabinets</div>
                  <div className="text-xs text-white/80">We typically reply in a few minutes</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    if (confirm('Clear chat history?')) {
                      try {
                        localStorage.removeItem(STORAGE_KEY)
                      } catch (e) {
                        // Ignore localStorage errors
                      }
                      window.location.reload()
                    }
                  }}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors text-xs"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-charcoal-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-white text-charcoal-900 rounded-bl-md shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-charcoal-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 bg-charcoal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-charcoal-100 bg-white">
              <div className="text-xs text-charcoal-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.message)}
                    className="rounded-full px-3 py-1.5 text-xs font-medium bg-charcoal-100 text-charcoal-800 hover:bg-wood-100 hover:text-charcoal-950 transition-colors"
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-charcoal-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-charcoal-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:bg-[#184A47] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

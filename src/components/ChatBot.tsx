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
  { text: '📍 Service Areas', message: 'What areas do you serve?' },
  { text: '💰 Pricing', message: 'How much does it cost?' },
  { text: '⏱️ Timeline', message: 'How long does installation take?' },
  { text: '📞 Get Quote', message: 'I want to get a quote' },
]

// FAQ responses
const botResponses: Record<string, string> = {
  'service area': `We serve Detroit and 15+ surrounding cities including:\n\n• Dearborn\n• Troy\n• Sterling Heights\n• Ann Arbor\n• Royal Oak\n• Farmington Hills\n• Livonia\n• Canton\n• Southfield\n• West Bloomfield\n\nAnd more! If you're in the Detroit metro area, we've got you covered.`,
  
  'cost': `Great question! Our pricing is straightforward:\n\n**10×10 kitchens start at $3,999 installed**\n\nThis includes:\n• Semi-custom cabinets\n• Professional installation\n• All hardware and materials\n\n**You save up to 66%** vs Home Depot or Lowes.\n\nFor a precise quote, I can help you book a free in-home measurement. Would you like to schedule one?`,
  
  'timeline': `Most kitchen installations are quick:\n\n• **1-3 days** for typical installations\n• **Same-week appointments** available for measurements\n• **Free in-home measurement** with your order\n\nWe respect your time and keep disruptions minimal. Want to see available appointment times?`,
  
  'quote': `I'd be happy to help you get a quote!\n\nYou have two options:\n\n1️⃣ **Quick Estimate Online**\nGet a preliminary estimate in 24 hours: [Get Estimate](/estimate)\n\n2️⃣ **Free In-Home Measurement**\nMost accurate - we come to you: [Book Consultation](/book)\n\nWhich would you prefer?`,
  
  'default': `Thanks for your message! I'm here to help with:\n\n• Pricing and quotes\n• Service areas\n• Installation timeline\n• General questions\n\nWhat would you like to know? Or if you'd like to speak with someone directly, call us at (313) 246-7903.`,
}

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('city') || lowerMessage.includes('detroit')) {
    return botResponses['service area']
  }
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('much') || lowerMessage.includes('$') || lowerMessage.includes('dollar')) {
    return botResponses['cost']
  }
  if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('day') || lowerMessage.includes('week') || lowerMessage.includes('install')) {
    return botResponses['timeline']
  }
  if (lowerMessage.includes('quote') || lowerMessage.includes('estimate') || lowerMessage.includes('price') || lowerMessage.includes('interested')) {
    return botResponses['quote']
  }
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return `Hello! 👋 Welcome to SELA Cabinets!\n\nI'm here to help you with your kitchen cabinet project. I can answer questions about:\n\n• Pricing and quotes\n• Service areas\n• Installation timeline\n\nWhat would you like to know?`
  }
  if (lowerMessage.includes('thank')) {
    return `You're welcome! 😊\n\nIf you have any other questions, I'm here 24/7. Or feel free to call us at (313) 246-7903.\n\nHave a great day!`
  }
  if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact')) {
    return `You can reach us at:\n\n📞 **(313) 246-7903**\n\nOur hours:\n• Monday–Friday: 8:00 AM – 6:00 PM\n• Saturday: 9:00 AM – 3:00 PM\n• Sunday: Closed\n\nOr I can help you book an appointment online right now!`
  }
  
  return botResponses['default']
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! 👋 I'm here to help with your kitchen cabinet questions. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000))

    // Get bot response
    const botResponse = getBotResponse(text)
    const botMessage: Message = {
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)
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
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-wood-600 text-white shadow-lg hover:bg-wood-700 transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-charcoal-200">
          {/* Header */}
          <div className="bg-wood-600 px-6 py-4 text-white">
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
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
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
                      ? 'bg-wood-600 text-white rounded-br-md'
                      : 'bg-white text-charcoal-900 rounded-bl-md shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-charcoal-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    className="rounded-full px-3 py-1.5 text-xs font-medium bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200 transition-colors"
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
                className="flex-1 rounded-xl border border-charcoal-300 px-4 py-2 text-sm focus:border-wood-500 focus:outline-none focus:ring-2 focus:ring-wood-500/20"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="rounded-xl bg-wood-600 px-4 py-2 text-white hover:bg-wood-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { addLead } from '@/lib/lead-capture'
import { pool } from '@/lib/db'
import { sendLeadNotification } from '@/lib/email-notifications'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

async function getSystemPrompt(): Promise<string> {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        "SELECT value FROM chatbot_config WHERE key = 'system_prompt' LIMIT 1"
      )
      return result.rows[0]?.value || getDefaultPrompt()
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching system prompt:', error)
    return getDefaultPrompt()
  }
}

function getDefaultPrompt(): string {
  return `You are the friendly assistant for SELA Cabinets in Detroit, Michigan.

YOUR IDENTITY:
- You work for SELA Cabinets
- You're helpful, knowledgeable, and always ready to assist

COMPANY INFO:
- Owner/Founder: Way
- Location: Detroit, MI
- Phone: (313) 468-3225
- Email: info@selatrade.com
- Website: selacabinets.com

SERVICES:
1. Cabinet Supply - Premium semi-custom cabinets
2. Professional Installation - timing confirmed after inspection, supplier ordering, delivery, and site readiness review
3. In-Home Measurement with order
4. Design Consultation

ESTIMATES:
- SELA does not publish generic project prices in chat
- Estimates are based on measurements, cabinet style, finish, storage needs, supplier ordering lead time, delivery timing, and installation scope
- Encourage customers to book a consultation or in-home measurement for a tailored estimate

SERVICE AREAS:
Detroit, Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, Southfield, West Bloomfield, and more

RULES:
- Answer questions DIRECTLY on the first response
- Be concise and helpful
- If asked about the owner, say "Way founded SELA Cabinets"
- If asked your name, say "I'm the SELA Cabinets assistant."
- Always offer to help book a consultation
- For urgent matters, suggest calling (313) 468-3225`
}

// Save chat message to database
async function saveChatMessage(sessionId: string, message: string, sender: string) {
  try {
    const client = await pool.connect()
    try {
      // Save message
      await client.query(
        'INSERT INTO chat_messages (session_id, message, sender) VALUES ($1, $2, $3)',
        [sessionId, message, sender]
      )
      
      // Update or create session
      await client.query(
        `INSERT INTO chat_sessions (session_id, first_message_at, last_message_at, message_count)
         VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
         ON CONFLICT (session_id)
         DO UPDATE SET 
           last_message_at = CURRENT_TIMESTAMP,
           message_count = chat_sessions.message_count + 1`,
        [sessionId]
      )
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error saving chat message:', error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Handle both single message and messages array
    let userMessage: string
    let sessionId: string = body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    if (body.message) {
      userMessage = body.message
    } else if (body.messages && Array.isArray(body.messages)) {
      // Get the last user message
      const lastMessage = body.messages.filter((m: any) => m.role === 'user').pop()
      userMessage = lastMessage?.content || ''
    } else {
      return NextResponse.json({ message: "I didn't catch that. Could you repeat?" })
    }

    // Save user message
    await saveChatMessage(sessionId, userMessage, 'user')

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to simple responses if no API key
      const fallbackResponse = getSimpleResponse(userMessage)
      await saveChatMessage(sessionId, fallbackResponse, 'bot')
      return NextResponse.json({ message: fallbackResponse })
    }

    // Get system prompt from database
    const systemPrompt = await getSystemPrompt()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const message = completion.choices[0]?.message?.content || "I'm here to help! What would you like to know about SELA Cabinets?"
    
    // Save bot response
    await saveChatMessage(sessionId, message, 'bot')

    // Detect if user is a lead (wants quote, booking, or provides contact info)
    const leadInfo = extractLeadInfo(userMessage)
    if (leadInfo.isLead) {
      try {
        const leadResult = await addLead({
          name: leadInfo.name || 'Chat Lead',
          phone: leadInfo.phone || '',
          email: leadInfo.email || '',
          source: 'contact',
          notes: `From chatbot conversation: "${userMessage}"`,
        })
        
        if (leadResult.success) {
          // Send email notification
          await sendLeadNotification({
            name: leadInfo.name || 'Chat Lead',
            phone: leadInfo.phone,
            email: leadInfo.email,
            source: 'Chatbot',
            notes: userMessage,
          })
        }
      } catch (leadError) {
        console.error('Error creating lead from chat:', leadError)
      }
    }

    return NextResponse.json({ message, sessionId })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response on error
    const errorMessage = "I'm having a little trouble right now. For immediate assistance, please call us at (313) 468-3225 or visit our contact page!"
    return NextResponse.json({ message: errorMessage })
  }
}

// Simple fallback responses if OpenAI is unavailable
function getSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to SELA Cabinets. I'm here to help with cabinet styles, estimates, service areas, timelines, and consultation questions. What would you like to know?"
  }

  if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('city')) {
    return "We serve Detroit and 15+ surrounding cities including Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, and more. If you're in the Detroit metro area, we've got you covered."
  }

  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('much')) {
    return "Every kitchen is different, so SELA prepares estimates after understanding the layout, cabinet style, finish, storage needs, and installation scope. I can help you book a consultation or start an estimate so the team can review your project properly."
  }

  if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('install')) {
    return "Project timing is confirmed after inspection. The SELA team reviews your layout, site conditions, cabinet selections, supplier ordering lead time, delivery timing, and installation scope before giving you a realistic schedule."
  }

  if (lowerMessage.includes('quote') || lowerMessage.includes('estimate')) {
    return "I'd be happy to help you start an estimate. You can share project details online or book a consultation so the SELA team can review your layout, style preferences, and installation needs. Which would you prefer?"
  }

  return "Thanks for your message! I'm here to help with estimates, service areas, installation timelines, cabinet styles, and general questions. What would you like to know? Or call us at (313) 468-3225 for immediate assistance."
}
// Extract lead info from message (phone, email, intent to purchase)
function extractLeadInfo(message: string): {
  isLead: boolean
  name?: string
  phone?: string
  email?: string
} {
  const result: { isLead: boolean; name?: string; phone?: string; email?: string } = { isLead: false }
  
  // Phone number regex (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/
  const phoneMatch = message.match(phoneRegex)
  if (phoneMatch) {
    result.phone = phoneMatch[0]
    result.isLead = true
  }
  
  // Email regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  const emailMatch = message.match(emailRegex)
  if (emailMatch) {
    result.email = emailMatch[0]
    result.isLead = true
  }
  
  // Intent keywords that suggest they want to buy
  const intentKeywords = [
    'i want to book',
    'i want a quote',
    'i need a quote',
    'get a quote',
    'book a consultation',
    'schedule an appointment',
    'i want to schedule',
    'can you call me',
    'please call me',
    'interested in buying',
    'ready to buy',
    'i want to purchase',
  ]
  
  const lowerMessage = message.toLowerCase()
  if (intentKeywords.some(keyword => lowerMessage.includes(keyword))) {
    result.isLead = true
  }
  
  return result
}

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Pool } from 'pg'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://coolify:dFVc16CJwW02ogeO9pQt5rBPSE0%2FKPp6Tyjar2w6eS4%3D@coolify-db:5432/coolify?sslmode=disable',
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
  return `You are Mango, the friendly AI assistant for SELA Cabinets in Detroit, Michigan.

YOUR IDENTITY:
- Your name is Mango (mention this if asked)
- You work for SELA Cabinets
- You're helpful, knowledgeable, and always ready to assist

COMPANY INFO:
- Owner/Founder: Way
- Location: Detroit, MI
- Phone: (313) 246-7903
- Email: info@selatrade.com
- Website: selacabinets.com

SERVICES:
1. Cabinet Supply - Premium semi-custom cabinets
2. Professional Installation - 1-3 days typical
3. Free In-Home Measurement with order
4. Design Consultation

PRICING:
- 10x10 kitchens start at $3,999 installed
- Save up to 66% vs Home Depot/Lowes
- All-inclusive pricing

SERVICE AREAS:
Detroit, Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, Southfield, West Bloomfield, and more

RULES:
- Answer questions DIRECTLY on the first response
- Be concise and helpful
- If asked about the owner, say "Way founded SELA Cabinets"
- If asked your name, say "I'm Mango, your SELA Cabinets assistant!"
- Always offer to help book a free consultation
- For urgent matters, suggest calling (313) 246-7903`
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

    return NextResponse.json({ message, sessionId })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response on error
    const errorMessage = "I'm having a little trouble right now. For immediate assistance, please call us at (313) 246-7903 or visit our contact page!"
    return NextResponse.json({ message: errorMessage })
  }
}

// Simple fallback responses if OpenAI is unavailable
function getSimpleResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
    return "Hello! 👋 Welcome to SELA Cabinets! I'm here to help with your kitchen cabinet questions. What would you like to know?"
  }
  
  if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('city')) {
    return "We serve Detroit and 15+ surrounding cities including Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, and more! If you're in the Detroit metro area, we've got you covered."
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('much')) {
    return "Our 10×10 kitchens start at $3,999 installed! This includes semi-custom cabinets, professional installation, and all hardware. You save up to 66% vs Home Depot or Lowes. For a precise quote, I can help you book a free in-home measurement."
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('install')) {
    return "Most installations take just 1-3 days! We also offer same-week appointments for measurements. Want to see available times?"
  }
  
  if (lowerMessage.includes('quote') || lowerMessage.includes('estimate')) {
    return "I'd be happy to help you get a quote! You can:\n\n1️⃣ Get a quick estimate online: selacabinets.lucidsro.com/estimate\n2️⃣ Book a free in-home measurement: selacabinets.lucidsro.com/book\n\nWhich would you prefer?"
  }
  
  return "Thanks for your message! I'm here to help with pricing, service areas, installation timeline, and general questions. What would you like to know? Or call us at (313) 246-7903 for immediate assistance."
}

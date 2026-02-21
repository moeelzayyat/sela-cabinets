import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const SYSTEM_PROMPT = `You are a friendly, helpful customer service assistant for SELA Cabinets, a premium kitchen cabinet company serving Detroit and 15+ surrounding metro cities.

## Your Identity:
- Your name is **Mango** 🥭
- You're the AI assistant for SELA Cabinets
- You're knowledgeable, friendly, and always ready to help
- You work for SELA Cabinets, representing the company

## Company Information:
- **Company Name:** SELA Cabinets
- **Owner/Founder:** Way (sometimes customers ask - Way is the founder and owner)
- **Location:** Detroit, Michigan
- **Service Area:** Detroit + Dearborn, Troy, Sterling Heights, Ann Arbor, Royal Oak, Farmington Hills, Livonia, Canton, Southfield, West Bloomfield, Rochester Hills, Plymouth, Westland, Redford Township, and more
- **Phone:** (313) 246-7903
- **Website:** selacabinets.com
- **Email:** info@selatrade.com

## Services:
1. **Cabinet Supply** - Premium semi-custom cabinets direct to customers (no big-box markup)
2. **Professional Installation** - Installed by pros, 1-3 days typical
3. **In-Home Measurement** - FREE with order, exact measurements at customer's home
4. **Design Help** - Expert recommendations on layout, style, and options

## Pricing:
- **10x10 kitchens start at $3,999 installed**
- Save up to 66% vs Home Depot or Lowes
- All-inclusive pricing (cabinets + installation + hardware)
- Free in-home measurement with order
- No hidden fees

## Process:
1. **Tell Us About Your Kitchen** - Share photos, dimensions, or schedule a call
2. **Free In-Home Measurement** - We come to you, no obligation
3. **See Your Price** - Clear pricing, no surprises
4. **Your New Kitchen** - Professional install, most done in 1-3 days

## Business Hours:
- Monday-Friday: 8:00 AM - 6:00 PM
- Saturday: 9:00 AM - 3:00 PM
- Sunday: Closed

## Key Selling Points:
- Semi-custom cabinets at wholesale prices
- Fast installation (1-3 days typical)
- Free in-home measurements
- Save up to 66% vs big box stores
- Professional installation included
- Serving Detroit metro area for years
- Local, family-focused business

## Your Role:
- Answer questions about services, pricing, timeline, service areas
- Help potential customers understand the value proposition
- Guide them toward booking a free consultation or getting an estimate
- Be warm, professional, and knowledgeable
- If asked about the owner, mention Way founded the company
- If asked your name, say "I'm Mango, the SELA Cabinets assistant!"

## Conversation Style:
- Friendly and approachable (not overly formal)
- **IMPORTANT: Answer questions directly on the first response**
- Be concise but helpful
- Use bullet points for lists
- Include relevant details naturally
- Always offer next steps when appropriate
- If they seem interested, guide them to /book or /estimate
- For urgent matters, suggest calling (313) 246-7903

## Important:
- Never make up information
- If unsure about specific pricing beyond the $3,999 starting point, direct them to get a free quote
- Always maintain professional boundaries
- Be helpful but don't be pushy
- If they ask for specific design advice, suggest booking a consultation
- **When asked a question, answer it directly first, then offer additional help**

Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to simple responses if no API key
      return NextResponse.json({
        message: getSimpleResponse(messages[messages.length - 1]?.content || '')
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
          .filter((msg: any) => msg.content && msg.content.trim())
          .map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content.trim()
          }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const message = completion.choices[0]?.message?.content || "I'm here to help! What would you like to know about SELA Cabinets?"

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response on error
    return NextResponse.json({
      message: "I'm having a little trouble right now. For immediate assistance, please call us at (313) 246-7903 or visit our contact page!"
    })
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

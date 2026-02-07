'use server'

import { NextRequest, NextResponse } from 'next/server'

// Agent webhook handler - receives messages from integrations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const agentId = searchParams.get('agent')
    const integration = searchParams.get('integration')

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    // Get message based on integration type
    let message = ''
    let sender = ''
    let responseCallback: ((response: string) => Promise<void>) | null = null

    switch (integration) {
      case 'telegram':
        // Telegram webhook format
        if (body.message) {
          message = body.message.text || ''
          sender = body.message.from?.username || body.message.from?.id || 'unknown'
        }
        break

      case 'whatsapp':
        // Twilio WhatsApp format
        message = body.Body || ''
        sender = body.From || 'unknown'
        break

      case 'slack':
        // Slack events API format
        if (body.type === 'url_verification') {
          return NextResponse.json({ challenge: body.challenge })
        }
        if (body.event?.type === 'message') {
          message = body.event.text || ''
          sender = body.event.user || 'unknown'
        }
        break

      case 'email':
        // Email webhook format (e.g., SendGrid inbound parse)
        message = body.text || body.html || ''
        sender = body.from || body.sender || 'unknown'
        break

      default:
        // Generic format
        message = body.message || body.text || body.content || ''
        sender = body.sender || body.from || body.user || 'unknown'
    }

    if (!message) {
      return NextResponse.json({ error: 'No message content' }, { status: 400 })
    }

    // Process with AI (using Groq by default)
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json({ error: 'AI API not configured' }, { status: 500 })
    }

    // Get agent config from request or use default
    const systemPrompt = body.systemPrompt || 'أنت مساعد ذكي ومفيد. تجيب على الأسئلة بدقة ووضوح.'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    })

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.'

    // Return response based on integration
    switch (integration) {
      case 'telegram':
        // For Telegram, you would send back via bot API
        // This is just returning the response to be handled by the bot
        return NextResponse.json({
          method: 'sendMessage',
          chat_id: body.message?.chat?.id,
          text: aiResponse
        })

      case 'whatsapp':
        // For Twilio, return TwiML or handle via API
        return NextResponse.json({
          response: aiResponse,
          to: sender
        })

      case 'slack':
        return NextResponse.json({
          text: aiResponse,
          response_type: 'in_channel'
        })

      default:
        return NextResponse.json({
          response: aiResponse,
          sender,
          agentId,
          integration
        })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Verify webhook (for Telegram, Slack, etc.)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Slack URL verification
  if (searchParams.get('challenge')) {
    return NextResponse.json({ challenge: searchParams.get('challenge') })
  }

  // Generic health check
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Agent webhook endpoint ready',
    timestamp: new Date().toISOString()
  })
}

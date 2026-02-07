import { NextRequest, NextResponse } from 'next/server'

/**
 * 🔮 AI CHAT ROUTE - Matrix Powered
 * ═══════════════════════════════════════════════════════════════
 * 
 * This route handles the /api/ai/chat endpoint
 * Uses the same Matrix logic as /api/chat for consistency
 */

// Re-export from main chat route logic
// This ensures both endpoints use the same Matrix system

interface Attachment {
  type: string
  name: string
  data?: string
  content?: string
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ═══════════════════════════════════════════════════════════════
// Intent Detection
// ═══════════════════════════════════════════════════════════════

function detectBestAPI(message: string, attachments?: Attachment[]) {
  const lower = message.toLowerCase()
  
  const hasImages = attachments?.some(a => a.type.startsWith('image/'))
  const hasPDFs = attachments?.some(a => a.type.includes('pdf'))
  const hasDocuments = attachments?.some(a => 
    a.type.includes('word') || a.type.includes('excel') || a.type.includes('spreadsheet')
  )
  
  if (hasImages || hasPDFs || hasDocuments) {
    return { primary: 'GEMINI', reason: 'Files detected' }
  }
  
  const searchPatterns = [
    /search|find|look up|google|what('s| is) the (latest|current)/i,
    /news|today|recent|2024|2025|2026/i,
    /ابحث|دور|جوجل|ما هو|من هو|أخبار|اليوم/,
  ]
  
  if (searchPatterns.some(p => p.test(lower))) {
    return { primary: 'TAVILY', reason: 'Search query' }
  }
  
  if (/```(python|javascript|js)/.test(message)) {
    return { primary: 'E2B', reason: 'Code execution' }
  }
  
  if (message.length > 500 || /analyze|explain in detail|حلل|اشرح بالتفصيل/.test(lower)) {
    return { primary: 'GEMINI', reason: 'Complex task' }
  }
  
  return { primary: 'GROQ', reason: 'Fast chat' }
}

// ═══════════════════════════════════════════════════════════════
// API Callers
// ═══════════════════════════════════════════════════════════════

async function searchWithTavily(query: string) {
  const key = process.env.TAVILY_API_KEY
  if (!key) return null
  
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 5,
      }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function callGemini(message: string, systemPrompt: string, history: Message[], attachments?: Attachment[]) {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY not set')
  
  const parts: any[] = [{ text: systemPrompt + '\n\n' }]
  
  // History
  if (history.length > 0) {
    parts.push({ text: '--- المحادثة السابقة ---\n' })
    for (const m of history.slice(-6)) {
      parts.push({ text: `${m.role === 'user' ? 'المستخدم' : 'المساعد'}: ${m.content}\n` })
    }
    parts.push({ text: '---\n\n' })
  }
  
  // Attachments
  if (attachments) {
    for (const att of attachments) {
      const b64 = att.data?.split(',')[1] || att.data
      if (att.type.startsWith('image/') && b64) {
        parts.push({ inline_data: { mime_type: att.type, data: b64 } })
        parts.push({ text: `\n[صورة: ${att.name}]\n` })
      } else if (att.type.includes('pdf') && b64) {
        parts.push({ inline_data: { mime_type: 'application/pdf', data: b64 } })
        parts.push({ text: `\n[PDF: ${att.name}]\n` })
      } else if (att.content) {
        parts.push({ text: `\n📄 "${att.name}":\n\`\`\`\n${att.content}\n\`\`\`\n` })
      }
    }
  }
  
  parts.push({ text: message })
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      })
    }
  )
  
  if (!res.ok) throw new Error(`Gemini: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(message: string, systemPrompt: string, history: Message[]) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY not set')
  
  const messages = [{ role: 'system', content: systemPrompt }]
  for (const m of history.slice(-10)) {
    messages.push({ role: m.role, content: m.content })
  }
  messages.push({ role: 'user', content: message })
  
  let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, temperature: 0.7, max_tokens: 8000 }),
  })
  
  if (!res.ok) {
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages, temperature: 0.7, max_tokens: 4000 }),
    })
  }
  
  if (!res.ok) throw new Error(`Groq: ${res.status}`)
  const data = await res.json()
  return data.choices[0].message.content
}

// ═══════════════════════════════════════════════════════════════
// Main Handler
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, attachments = [], conversationHistory = [], systemPrompt, persona, userProfile } = body
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
    
    let fullPrompt = systemPrompt || `أنت مساعد ذكي يعمل بنظام Matrix AI مع 6 قدرات:
📸 Gemini | ⚡ Groq | 🔍 Tavily | 💻 E2B | 📦 GitHub | 🗄️ Supabase
أجب بنفس لغة المستخدم.`
    
    if (persona) fullPrompt = persona + '\n\n' + fullPrompt
    if (userProfile?.name) fullPrompt += `\n\n👤 ${userProfile.name}`
    
    const intent = detectBestAPI(message, attachments)
    const usedAPIs: string[] = []
    let context = ''
    let response = ''
    
    // Search if needed
    if (intent.primary === 'TAVILY') {
      const search = await searchWithTavily(message)
      if (search?.results?.length) {
        usedAPIs.push('TAVILY 🔍')
        context = '\n\n📊 نتائج البحث:\n' + search.results.slice(0, 3).map((r: any) => 
          `**${r.title}**\n${r.content?.slice(0, 200)}...\n${r.url}`
        ).join('\n\n')
        if (search.answer) context = `\n💡 ${search.answer}` + context
      }
    }
    
    const enhanced = message + context
    
    // Main AI call
    try {
      const hasVision = attachments.some((a: Attachment) => a.type.startsWith('image/') || a.type.includes('pdf'))
      
      if (intent.primary === 'GEMINI' || hasVision) {
        response = await callGemini(enhanced, fullPrompt, conversationHistory, attachments)
        usedAPIs.push('GEMINI 📸')
      } else {
        response = await callGroq(enhanced, fullPrompt, conversationHistory)
        usedAPIs.push('GROQ ⚡')
      }
    } catch (e1) {
      // Fallback
      try {
        response = await callGroq(enhanced, fullPrompt, conversationHistory)
        usedAPIs.push('GROQ ⚡ (fallback)')
      } catch {
        response = await callGemini(enhanced, fullPrompt, conversationHistory, attachments)
        usedAPIs.push('GEMINI 📸 (fallback)')
      }
    }
    
    return NextResponse.json({
      response: response + `\n\n---\n🔮 **Matrix:** ${usedAPIs.join(' → ')}`,
      apis_used: usedAPIs,
      intent: intent.reason
    })
    
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json({ error: 'خطأ في المعالجة' }, { status: 500 })
  }
}

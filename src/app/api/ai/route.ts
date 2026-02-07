// Basel Hub - AI MATRIX API Route
// ALL 6 API KEYS CONNECTED IN PROPER MATRIX

import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════════
// API KEYS MATRIX - ALL 6 KEYS
// ═══════════════════════════════════════════════════════════════════
const API_MATRIX = {
  GEMINI: process.env.GEMINI_API_KEY || '',
  GROQ: process.env.GROQ_API_KEY || '',
  TAVILY: process.env.TAVILY_API_KEY || '',
  E2B: process.env.E2B_API_KEY || '',
  GITHUB: process.env.GITHUB_TOKEN || '',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

// ═══════════════════════════════════════════════════════════════════
// AI ROUTING MATRIX - Which AI uses which provider
// ═══════════════════════════════════════════════════════════════════
const AI_ROUTING = {
  funmaker: { primary: 'GROQ', fallback: 'GEMINI', model: 'llama-3.3-70b-versatile' },
  therapist: { primary: 'GEMINI', fallback: 'GROQ', model: 'gemini-2.0-flash' },
  developer: { primary: 'GEMINI', fallback: 'GROQ', model: 'gemini-2.0-flash' },
  wise: { primary: 'GEMINI', fallback: 'GROQ', model: 'gemini-2.0-flash' },
  qs: { primary: 'GROQ', fallback: 'GEMINI', model: 'llama-3.3-70b-versatile' },
}

// ═══════════════════════════════════════════════════════════════════
// GEMINI API CALL
// ═══════════════════════════════════════════════════════════════════
async function callGemini(messages: any[], systemPrompt: string, memory: any) {
  const apiKey = API_MATRIX.GEMINI
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  // Build context with memory
  const memoryContext = memory ? `
MEMORY CONTEXT:
- Facts about user: ${memory.facts?.join(', ') || 'None yet'}
- User preferences: ${memory.preferences?.join(', ') || 'None yet'}
- Recent context: ${memory.context?.join(', ') || 'None yet'}
` : ''

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt + '\n' + memoryContext }] },
    { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] },
    ...messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  ]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Gemini error:', error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
}

// ═══════════════════════════════════════════════════════════════════
// GROQ API CALL (FAST!)
// ═══════════════════════════════════════════════════════════════════
async function callGroq(messages: any[], systemPrompt: string, memory: any) {
  const apiKey = API_MATRIX.GROQ
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  // Build context with memory
  const memoryContext = memory ? `

MEMORY CONTEXT:
- Facts about user: ${memory.facts?.join(', ') || 'None yet'}
- User preferences: ${memory.preferences?.join(', ') || 'None yet'}
- Recent context: ${memory.context?.join(', ') || 'None yet'}
` : ''

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt + memoryContext },
        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.8,
      max_tokens: 4096,
      top_p: 0.95,
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Groq error:', error)
    throw new Error(`Groq API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'No response generated'
}

// ═══════════════════════════════════════════════════════════════════
// TAVILY SEARCH API
// ═══════════════════════════════════════════════════════════════════
async function searchTavily(query: string) {
  const apiKey = API_MATRIX.TAVILY
  if (!apiKey) throw new Error('TAVILY_API_KEY not configured')

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_raw_content: false,
      max_results: 5
    })
  })

  if (!response.ok) {
    throw new Error(`Tavily API error: ${response.status}`)
  }

  const data = await response.json()
  
  let result = data.answer ? `**Answer:** ${data.answer}\n\n` : ''
  result += '**Sources:**\n'
  data.results?.forEach((r: any, i: number) => {
    result += `${i + 1}. [${r.title}](${r.url})\n   ${r.content?.slice(0, 200)}...\n\n`
  })

  return result
}

// ═══════════════════════════════════════════════════════════════════
// E2B CODE EXECUTION
// ═══════════════════════════════════════════════════════════════════
async function executeE2B(code: string, language: string = 'python') {
  const apiKey = API_MATRIX.E2B
  if (!apiKey) throw new Error('E2B_API_KEY not configured')

  // Create sandbox
  const createResponse = await fetch('https://api.e2b.dev/sandboxes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template: language === 'python' ? 'Python3' : 'Nodejs'
    })
  })

  if (!createResponse.ok) {
    throw new Error(`E2B create error: ${createResponse.status}`)
  }

  const sandbox = await createResponse.json()
  
  // Execute code
  const execResponse = await fetch(`https://api.e2b.dev/sandboxes/${sandbox.sandboxId}/code/execution`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  })

  const result = await execResponse.json()
  
  // Cleanup sandbox
  await fetch(`https://api.e2b.dev/sandboxes/${sandbox.sandboxId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  }).catch(() => {})

  return result.stdout || result.stderr || 'Code executed successfully'
}

// ═══════════════════════════════════════════════════════════════════
// GITHUB API
// ═══════════════════════════════════════════════════════════════════
async function callGitHub(action: string, params: any) {
  const token = API_MATRIX.GITHUB
  if (!token) throw new Error('GITHUB_TOKEN not configured')

  const baseUrl = 'https://api.github.com'
  let url = baseUrl
  let method = 'GET'
  let body = undefined

  switch (action) {
    case 'repos':
      url = `${baseUrl}/user/repos`
      break
    case 'create-repo':
      url = `${baseUrl}/user/repos`
      method = 'POST'
      body = JSON.stringify({ name: params.name, private: params.private || false })
      break
    case 'search':
      url = `${baseUrl}/search/repositories?q=${encodeURIComponent(params.query)}`
      break
    default:
      url = `${baseUrl}${params.endpoint || '/user'}`
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return await response.json()
}

// ═══════════════════════════════════════════════════════════════════
// MEMORY EXTRACTION
// ═══════════════════════════════════════════════════════════════════
async function extractMemory(messages: any[], currentMemory: any) {
  const prompt = `Analyze this conversation and extract:
1. New facts about the user (name, preferences, job, etc.)
2. User preferences (likes, dislikes, style)
3. Important context for future conversations

Current memory:
${JSON.stringify(currentMemory, null, 2)}

Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Return ONLY valid JSON in this format:
{
  "facts": ["fact1", "fact2"],
  "preferences": ["pref1", "pref2"],
  "context": ["context1", "context2"]
}`

  try {
    const response = await callGroq(
      [{ role: 'user', content: prompt }],
      'You are a memory extraction AI. Return ONLY valid JSON, nothing else.',
      null
    )

    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        facts: [...new Set([...(currentMemory?.facts || []), ...(parsed.facts || [])])].slice(-20),
        preferences: [...new Set([...(currentMemory?.preferences || []), ...(parsed.preferences || [])])].slice(-20),
        context: [...(parsed.context || [])].slice(-10),
        lastUpdated: Date.now()
      }
    }
  } catch (e) {
    console.error('Memory extraction error:', e)
  }

  return currentMemory
}

// ═══════════════════════════════════════════════════════════════════
// AUDIO TRANSCRIPTION (via Groq Whisper)
// ═══════════════════════════════════════════════════════════════════
async function transcribeAudio(audioData: Buffer) {
  const apiKey = API_MATRIX.GROQ
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  const formData = new FormData()
  formData.append('file', new Blob([new Uint8Array(audioData)]), 'audio.webm')
  formData.append('model', 'whisper-large-v3')

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData
  })

  if (!response.ok) {
    throw new Error(`Transcription error: ${response.status}`)
  }

  const data = await response.json()
  return data.text || ''
}

// ═══════════════════════════════════════════════════════════════════
// MAIN API HANDLER
// ═══════════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    // Handle audio transcription (multipart form)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const audioFile = formData.get('audio') as File
      if (!audioFile) {
        return NextResponse.json({ error: 'No audio file' }, { status: 400 })
      }
      const buffer = Buffer.from(await audioFile.arrayBuffer())
      const text = await transcribeAudio(buffer)
      return NextResponse.json({ text })
    }

    // Handle JSON requests
    const body = await request.json()
    const { action, messages, systemPrompt, memory, query, code, language, aiType, githubAction, githubParams } = body

    switch (action) {
      // ─────────────────────────────────────────────────────────
      // GEMINI
      // ─────────────────────────────────────────────────────────
      case 'gemini': {
        const text = await callGemini(messages, systemPrompt, memory)
        return NextResponse.json({ text, provider: 'GEMINI' })
      }

      // ─────────────────────────────────────────────────────────
      // GROQ
      // ─────────────────────────────────────────────────────────
      case 'groq': {
        const text = await callGroq(messages, systemPrompt, memory)
        return NextResponse.json({ text, provider: 'GROQ' })
      }

      // ─────────────────────────────────────────────────────────
      // SMART CHAT - Auto routes to best provider based on AI type
      // ─────────────────────────────────────────────────────────
      case 'chat': {
        const routing = AI_ROUTING[aiType as keyof typeof AI_ROUTING] || AI_ROUTING.funmaker
        let text: string
        let provider: string

        try {
          // Try primary provider first
          if (routing.primary === 'GEMINI') {
            text = await callGemini(messages, systemPrompt, memory)
            provider = 'GEMINI'
          } else {
            text = await callGroq(messages, systemPrompt, memory)
            provider = 'GROQ'
          }
        } catch (primaryError) {
          console.error(`Primary provider ${routing.primary} failed, trying fallback...`)
          // Fallback to secondary
          if (routing.fallback === 'GEMINI') {
            text = await callGemini(messages, systemPrompt, memory)
            provider = 'GEMINI (fallback)'
          } else {
            text = await callGroq(messages, systemPrompt, memory)
            provider = 'GROQ (fallback)'
          }
        }

        return NextResponse.json({ text, provider })
      }

      // ─────────────────────────────────────────────────────────
      // TAVILY SEARCH
      // ─────────────────────────────────────────────────────────
      case 'search': {
        const text = await searchTavily(query)
        return NextResponse.json({ text, provider: 'TAVILY' })
      }

      // ─────────────────────────────────────────────────────────
      // E2B CODE EXECUTION
      // ─────────────────────────────────────────────────────────
      case 'execute': {
        const text = await executeE2B(code, language)
        return NextResponse.json({ text, provider: 'E2B' })
      }

      // ─────────────────────────────────────────────────────────
      // GITHUB
      // ─────────────────────────────────────────────────────────
      case 'github': {
        const result = await callGitHub(githubAction, githubParams)
        return NextResponse.json({ result, provider: 'GITHUB' })
      }

      // ─────────────────────────────────────────────────────────
      // MEMORY EXTRACTION
      // ─────────────────────────────────────────────────────────
      case 'extract-memory': {
        const newMemory = await extractMemory(messages, memory)
        return NextResponse.json({ memory: newMemory })
      }

      // ─────────────────────────────────────────────────────────
      // STATUS CHECK - Verify all keys are configured
      // ─────────────────────────────────────────────────────────
      case 'status': {
        return NextResponse.json({
          matrix: {
            GEMINI: !!API_MATRIX.GEMINI,
            GROQ: !!API_MATRIX.GROQ,
            TAVILY: !!API_MATRIX.TAVILY,
            E2B: !!API_MATRIX.E2B,
            GITHUB: !!API_MATRIX.GITHUB,
            SUPABASE: !!API_MATRIX.SUPABASE_URL && !!API_MATRIX.SUPABASE_KEY,
          },
          routing: AI_ROUTING
        })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'Basel Hub API Matrix Online',
    keys: {
      GEMINI: !!API_MATRIX.GEMINI ? '✅' : '❌',
      GROQ: !!API_MATRIX.GROQ ? '✅' : '❌',
      TAVILY: !!API_MATRIX.TAVILY ? '✅' : '❌',
      E2B: !!API_MATRIX.E2B ? '✅' : '❌',
      GITHUB: !!API_MATRIX.GITHUB ? '✅' : '❌',
      SUPABASE: (!!API_MATRIX.SUPABASE_URL && !!API_MATRIX.SUPABASE_KEY) ? '✅' : '❌',
    },
    routing: AI_ROUTING,
    timestamp: new Date().toISOString()
  })
}

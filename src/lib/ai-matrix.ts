'use server'

/**
 * 🔮 AI MATRIX - 6 API Keys Working Together
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1. GEMINI  - Vision, PDFs, complex reasoning, images
 * 2. GROQ    - Fast text responses, chat
 * 3. TAVILY  - Web search, real-time info
 * 4. E2B     - Code execution (Python, JS, Shell)
 * 5. GITHUB  - Repository management
 * 6. SUPABASE - Database operations
 */

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface MatrixRequest {
  message: string
  attachments?: Attachment[]
  conversationHistory?: Message[]
  systemPrompt?: string
  persona?: string
  userProfile?: any
}

export interface Attachment {
  type: string
  name: string
  data: string
  content?: string
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface MatrixResponse {
  response: string
  sources: string[]  // Which APIs were used
  searchResults?: any[]
  codeOutput?: string
  error?: string
}

// ═══════════════════════════════════════════════════════════════
// Intent Detection - What does the user want?
// ═══════════════════════════════════════════════════════════════

interface Intent {
  needsVision: boolean      // Images, PDFs → GEMINI
  needsSearch: boolean      // Web search → TAVILY
  needsCode: boolean        // Code execution → E2B
  needsGithub: boolean      // Repo operations → GITHUB
  needsDatabase: boolean    // Data storage → SUPABASE
  needsFastChat: boolean    // Quick response → GROQ
}

function detectIntent(message: string, attachments?: Attachment[]): Intent {
  const lowerMessage = message.toLowerCase()
  
  // Check for image/PDF attachments
  const hasImages = attachments?.some(a => 
    a.type.startsWith('image/') || 
    a.type.includes('pdf')
  ) || false
  
  // Search keywords (Arabic + English)
  const searchKeywords = [
    'search', 'find', 'look up', 'google', 'what is', 'who is', 'latest', 'news',
    'current', 'today', 'recent', '2024', '2025', '2026',
    'ابحث', 'دور', 'جوجل', 'ما هو', 'من هو', 'آخر', 'أخبار', 'الأخيرة', 'اليوم', 'حالي'
  ]
  const needsSearch = searchKeywords.some(k => lowerMessage.includes(k))
  
  // Code execution keywords
  const codeKeywords = [
    'run', 'execute', 'calculate', 'compute', 'شغل', 'نفذ', 'احسب',
    'python', 'javascript', 'code', 'script', 'كود'
  ]
  const needsCode = codeKeywords.some(k => lowerMessage.includes(k)) ||
    /```(python|javascript|js|py|shell|bash)/.test(message)
  
  // GitHub keywords
  const githubKeywords = [
    'github', 'repo', 'repository', 'commit', 'push', 'pull', 'clone',
    'جيتهب', 'ريبو', 'مستودع'
  ]
  const needsGithub = githubKeywords.some(k => lowerMessage.includes(k))
  
  // Database keywords
  const dbKeywords = [
    'save', 'store', 'database', 'remember', 'data',
    'احفظ', 'خزن', 'قاعدة بيانات', 'تذكر'
  ]
  const needsDatabase = dbKeywords.some(k => lowerMessage.includes(k))
  
  return {
    needsVision: hasImages,
    needsSearch,
    needsCode,
    needsGithub,
    needsDatabase,
    needsFastChat: !hasImages && !needsSearch && !needsCode  // Default to fast chat
  }
}

// ═══════════════════════════════════════════════════════════════
// GEMINI - Vision & Complex Reasoning
// ═══════════════════════════════════════════════════════════════

async function callGemini(
  message: string,
  attachments?: Attachment[],
  systemPrompt?: string
): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured')
  
  // Build parts array
  const parts: any[] = []
  
  // Add system prompt
  if (systemPrompt) {
    parts.push({ text: systemPrompt + '\n\n' })
  }
  
  // Process attachments
  if (attachments && attachments.length > 0) {
    for (const att of attachments) {
      if (att.type.startsWith('image/')) {
        // Image - send as inline data
        const base64Data = att.data.split(',')[1] || att.data
        parts.push({
          inline_data: {
            mime_type: att.type,
            data: base64Data
          }
        })
        parts.push({ text: `\n[Image: ${att.name}]\n` })
      } else if (att.type.includes('pdf')) {
        // PDF - Gemini 1.5 can read PDFs
        const base64Data = att.data.split(',')[1] || att.data
        parts.push({
          inline_data: {
            mime_type: 'application/pdf',
            data: base64Data
          }
        })
        parts.push({ text: `\n[PDF Document: ${att.name}]\n` })
      } else if (att.content) {
        // Text-based file with extracted content
        parts.push({ text: `\n📄 File "${att.name}":\n\`\`\`\n${att.content}\n\`\`\`\n` })
      }
    }
  }
  
  // Add user message
  parts.push({ text: message })
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }
  
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini'
}

// ═══════════════════════════════════════════════════════════════
// GROQ - Fast Text Responses
// ═══════════════════════════════════════════════════════════════

async function callGroq(
  message: string,
  systemPrompt?: string,
  conversationHistory?: Message[]
): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured')
  
  const messages: any[] = [
    { role: 'system', content: systemPrompt || 'أنت مساعد ذكي. أجب بنفس لغة المستخدم.' }
  ]
  
  // Add conversation history
  if (conversationHistory) {
    const recent = conversationHistory.slice(-10)
    for (const msg of recent) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content })
      }
    }
  }
  
  messages.push({ role: 'user', content: message })
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 8000,
    }),
  })
  
  if (!response.ok) {
    // Try fallback model
    const fallback = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })
    
    if (!fallback.ok) throw new Error('Groq API unavailable')
    const fallbackData = await fallback.json()
    return fallbackData.choices[0].message.content
  }
  
  const data = await response.json()
  return data.choices[0].message.content
}

// ═══════════════════════════════════════════════════════════════
// TAVILY - Web Search
// ═══════════════════════════════════════════════════════════════

export interface SearchResult {
  title: string
  url: string
  content: string
  score: number
}

async function searchWithTavily(query: string): Promise<SearchResult[]> {
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY
  if (!TAVILY_API_KEY) throw new Error('TAVILY_API_KEY not configured')
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: 'advanced',
      include_answer: true,
      include_raw_content: false,
      max_results: 5,
    }),
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Tavily API error: ${error}`)
  }
  
  const data = await response.json()
  return data.results || []
}

// ═══════════════════════════════════════════════════════════════
// E2B - Code Execution
// ═══════════════════════════════════════════════════════════════

interface CodeResult {
  output: string
  error?: string
}

async function executeCode(code: string, language: 'python' | 'javascript' | 'shell'): Promise<CodeResult> {
  const E2B_API_KEY = process.env.E2B_API_KEY
  if (!E2B_API_KEY) throw new Error('E2B_API_KEY not configured')
  
  try {
    // Create sandbox session
    const createResponse = await fetch('https://api.e2b.dev/sandboxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': E2B_API_KEY,
      },
      body: JSON.stringify({
        template: language === 'python' ? 'python' : 'base',
      }),
    })
    
    if (!createResponse.ok) {
      return { output: '', error: 'Failed to create sandbox' }
    }
    
    const sandbox = await createResponse.json()
    const sandboxId = sandbox.sandboxId
    
    // Execute code
    const execResponse = await fetch(`https://api.e2b.dev/sandboxes/${sandboxId}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': E2B_API_KEY,
      },
      body: JSON.stringify({
        code,
        language,
      }),
    })
    
    if (!execResponse.ok) {
      return { output: '', error: 'Failed to execute code' }
    }
    
    const result = await execResponse.json()
    
    // Cleanup sandbox
    await fetch(`https://api.e2b.dev/sandboxes/${sandboxId}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': E2B_API_KEY },
    })
    
    return {
      output: result.stdout || '',
      error: result.stderr || undefined,
    }
  } catch (error) {
    return { output: '', error: String(error) }
  }
}

// ═══════════════════════════════════════════════════════════════
// 🔮 MATRIX ORCHESTRATOR - The Brain
// ═══════════════════════════════════════════════════════════════

export async function processWithMatrix(request: MatrixRequest): Promise<MatrixResponse> {
  const { message, attachments, conversationHistory, systemPrompt, userProfile } = request
  const sources: string[] = []
  let searchResults: SearchResult[] | undefined
  let codeOutput: string | undefined
  
  // Detect what the user needs
  const intent = detectIntent(message, attachments)
  
  // Build enhanced context
  let enhancedMessage = message
  let contextInfo = ''
  
  try {
    // ═══════════════════════════════════════════════════════════
    // Step 1: Web Search (if needed)
    // ═══════════════════════════════════════════════════════════
    if (intent.needsSearch) {
      try {
        searchResults = await searchWithTavily(message)
        sources.push('TAVILY')
        
        if (searchResults.length > 0) {
          contextInfo += '\n\n🔍 **نتائج البحث من الإنترنت:**\n'
          for (const result of searchResults.slice(0, 3)) {
            contextInfo += `\n**${result.title}**\n${result.content}\nSource: ${result.url}\n`
          }
        }
      } catch (e) {
        console.error('Tavily search failed:', e)
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    // Step 2: Code Execution (if needed)
    // ═══════════════════════════════════════════════════════════
    if (intent.needsCode) {
      // Extract code blocks
      const pythonMatch = message.match(/```python\n([\s\S]*?)```/)
      const jsMatch = message.match(/```(?:javascript|js)\n([\s\S]*?)```/)
      
      if (pythonMatch) {
        try {
          const result = await executeCode(pythonMatch[1], 'python')
          sources.push('E2B')
          codeOutput = result.output
          if (result.error) codeOutput += `\nError: ${result.error}`
          contextInfo += `\n\n💻 **نتيجة تنفيذ الكود:**\n\`\`\`\n${codeOutput}\n\`\`\``
        } catch (e) {
          console.error('E2B execution failed:', e)
        }
      } else if (jsMatch) {
        try {
          const result = await executeCode(jsMatch[1], 'javascript')
          sources.push('E2B')
          codeOutput = result.output
          contextInfo += `\n\n💻 **نتيجة تنفيذ الكود:**\n\`\`\`\n${codeOutput}\n\`\`\``
        } catch (e) {
          console.error('E2B execution failed:', e)
        }
      }
    }
    
    // Add context to message for AI
    if (contextInfo) {
      enhancedMessage = message + contextInfo
    }
    
    // ═══════════════════════════════════════════════════════════
    // Step 3: AI Response (GEMINI or GROQ)
    // ═══════════════════════════════════════════════════════════
    let response: string
    
    // Build user profile context
    let userContext = ''
    if (userProfile?.name) {
      userContext = `\n\n👤 المستخدم: ${userProfile.name}`
      if (userProfile.profession) userContext += ` | المهنة: ${userProfile.profession}`
    }
    
    const fullSystemPrompt = (systemPrompt || 'أنت مساعد ذكي متعدد القدرات. لديك 6 أدوات: Gemini للصور، Groq للسرعة، Tavily للبحث، E2B للكود، GitHub للمستودعات، Supabase للبيانات.') + userContext
    
    if (intent.needsVision) {
      // Use Gemini for images/PDFs
      response = await callGemini(enhancedMessage, attachments, fullSystemPrompt)
      sources.push('GEMINI')
    } else {
      // Use Groq for fast text
      response = await callGroq(enhancedMessage, fullSystemPrompt, conversationHistory)
      sources.push('GROQ')
    }
    
    // Add sources info to response
    const sourcesInfo = sources.length > 0 
      ? `\n\n---\n🔮 **Matrix APIs:** ${sources.join(' + ')}`
      : ''
    
    return {
      response: response + sourcesInfo,
      sources,
      searchResults,
      codeOutput,
    }
    
  } catch (error) {
    console.error('Matrix error:', error)
    
    // Fallback to Groq if everything fails
    try {
      const fallbackResponse = await callGroq(message, systemPrompt, conversationHistory)
      return {
        response: fallbackResponse + '\n\n---\n🔮 **Matrix APIs:** GROQ (fallback)',
        sources: ['GROQ'],
        error: String(error),
      }
    } catch {
      return {
        response: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        sources: [],
        error: String(error),
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Direct API Exports (for specific use cases)
// ═══════════════════════════════════════════════════════════════

export { callGemini, callGroq, searchWithTavily, executeCode }

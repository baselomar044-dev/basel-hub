import { NextRequest, NextResponse } from 'next/server'

// Gemini API
async function callGemini(messages: any[], systemPrompt: string, temperature: number) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('Gemini API key not configured')

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
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

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error.message || 'Gemini API error')
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
}

// Groq API
async function callGroq(messages: any[], systemPrompt: string, temperature: number, model: string) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('Groq API key not configured')

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature,
      max_tokens: 4096
    })
  })

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error.message || 'Groq API error')
  }

  return data.choices?.[0]?.message?.content || 'No response generated'
}

// Tavily web search
async function searchWeb(query: string) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 5
      })
    })

    return await response.json()
  } catch (error) {
    console.error('Tavily error:', error)
    return null
  }
}

// E2B code execution
async function executeCode(code: string, language: string = 'javascript') {
  const apiKey = process.env.E2B_API_KEY
  if (!apiKey) return { error: 'E2B API key not configured' }

  try {
    const response = await fetch('https://api.e2b.dev/v1/sandboxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        template: language === 'python' ? 'python' : 'nodejs'
      })
    })

    const sandbox = await response.json()
    
    const execResponse = await fetch(`https://api.e2b.dev/v1/sandboxes/${sandbox.id}/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ code })
    })

    const result = await execResponse.json()
    
    // Cleanup
    await fetch(`https://api.e2b.dev/v1/sandboxes/${sandbox.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })

    return result
  } catch (error) {
    console.error('E2B error:', error)
    return { error: 'Code execution failed' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, systemPrompt, model, tools, temperature } = body

    let enhancedPrompt = systemPrompt
    const lastMessage = messages[messages.length - 1]?.content || ''
    const lowerMessage = lastMessage.toLowerCase()

    // Web search if tool is enabled
    if (tools?.includes('web_search') && (
      lowerMessage.includes('search') || 
      lowerMessage.includes('find') ||
      lowerMessage.includes('latest') ||
      lowerMessage.includes('what is')
    )) {
      const searchQuery = lastMessage.replace(/search|find|for|me|please/gi, '').trim()
      const searchResults = await searchWeb(searchQuery)
      if (searchResults?.answer) {
        enhancedPrompt += `\n\nWeb search results:\n${searchResults.answer}\n\nSources:\n${
          searchResults.results?.slice(0, 3).map((r: any) => `- ${r.title}: ${r.url}`).join('\n')
        }`
      }
    }

    // Code execution if tool is enabled
    if (tools?.includes('code_execution')) {
      const codeMatch = lastMessage.match(/```(\w+)?\n([\s\S]+?)```/)
      if (codeMatch && (lowerMessage.includes('run') || lowerMessage.includes('execute'))) {
        const lang = codeMatch[1] || 'javascript'
        const code = codeMatch[2]
        const result = await executeCode(code, lang)
        if (result && !result.error) {
          enhancedPrompt += `\n\nCode execution result:\n${JSON.stringify(result, null, 2)}`
        }
      }
    }

    // Call appropriate model
    let content: string
    
    if (model?.startsWith('llama') || model?.includes('groq')) {
      content = await callGroq(messages, enhancedPrompt, temperature || 0.7, model)
    } else {
      // Default to Gemini
      content = await callGemini(messages, enhancedPrompt, temperature || 0.7)
    }

    return NextResponse.json({ content })

  } catch (error) {
    console.error('Agent run error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}

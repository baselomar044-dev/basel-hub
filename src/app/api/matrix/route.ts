// Basel Hub - API MATRIX Route (Server-Side SECURE)
// All 6 API keys connected: Gemini, Groq, Tavily, E2B, GitHub, Supabase
import { NextRequest, NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════
// 6 API KEYS MATRIX - ALL SERVER-SIDE SECURE
// ═══════════════════════════════════════════════════════════════
const MATRIX = {
  gemini: {
    key: process.env.GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  },
  groq: {
    key: process.env.GROQ_API_KEY || '',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  tavily: {
    key: process.env.TAVILY_API_KEY || '',
    endpoint: 'https://api.tavily.com/search'
  },
  e2b: {
    key: process.env.E2B_API_KEY || '',
    endpoint: 'https://api.e2b.dev/v1'
  },
  github: {
    key: process.env.GITHUB_TOKEN || '',
    endpoint: 'https://api.github.com'
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
}

// GET - Status check
export async function GET() {
  const status: Record<string, boolean> = {}
  
  status.gemini = !!MATRIX.gemini.key
  status.groq = !!MATRIX.groq.key
  status.tavily = !!MATRIX.tavily.key
  status.e2b = !!MATRIX.e2b.key
  status.github = !!MATRIX.github.key
  status.supabase = !!MATRIX.supabase.key
  
  const connected = Object.values(status).filter(Boolean).length
  
  return NextResponse.json({
    status,
    connected,
    total: 6,
    message: `${connected}/6 API keys connected`
  })
}

// POST - Handle all actions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    switch (action) {
      case 'status':
        return handleStatus()
      case 'chat':
        return handleChat(body)
      case 'search':
        return handleSearch(body)
      case 'execute':
        return handleCodeExecution(body)
      case 'preview':
        return handlePreview(body)
      case 'project':
        return handleProject(body)
      case 'github':
        return handleGitHub(body)
      default:
        return handleChat(body) // Default to chat
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Status check
async function handleStatus() {
  const status: Record<string, boolean> = {}
  
  // Check each API
  status.gemini = !!MATRIX.gemini.key
  status.groq = !!MATRIX.groq.key
  status.tavily = !!MATRIX.tavily.key
  status.e2b = !!MATRIX.e2b.key
  status.github = !!MATRIX.github.key
  status.supabase = !!MATRIX.supabase.key
  
  return NextResponse.json({
    status,
    connected: Object.values(status).filter(Boolean).length,
    total: 6,
    message: `${Object.values(status).filter(Boolean).length}/6 API keys connected`
  })
}

// Chat with AI (Groq primary, Gemini fallback)
async function handleChat(body: any) {
  const { message, systemPrompt, history = [], provider = 'auto', agent } = body
  
  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
    ...history.slice(-10),
    { role: 'user', content: message }
  ]
  
  // Developer agent special handling
  if (agent === 'developer' || message.toLowerCase().includes('preview') || message.toLowerCase().includes('project')) {
    const devPrompt = `You are an expert developer. When the user says:
- "preview" - You MUST output code that can be executed and previewed live. Include complete HTML/CSS/JS.
- "project" or "full project" - You MUST output a complete project structure with all files, ready to be downloaded as ZIP.

Format code output as:
\`\`\`filename.ext
code here
\`\`\`

For projects, list ALL files needed:
\`\`\`package.json
{...}
\`\`\`
\`\`\`src/index.js
...
\`\`\`
etc.

Current request: ${message}`
    
    messages[0] = { role: 'system', content: devPrompt }
  }

  // Try GROQ first (fast)
  try {
    const groqRes = await fetch(MATRIX.groq.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MATRIX.groq.key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 8192,
        temperature: 0.7
      })
    })

    if (groqRes.ok) {
      const data = await groqRes.json()
      const response = data.choices?.[0]?.message?.content || ''
      
      // Check if response contains code for preview/project
      const codeBlocks = extractCodeBlocks(response)
      
      return NextResponse.json({
        response,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
        canPreview: codeBlocks.some(b => b.language === 'html' || b.language === 'javascript'),
        canDownload: codeBlocks.length > 2
      })
    }
  } catch (e) {
    console.error('GROQ error:', e)
  }

  // Fallback to Gemini
  try {
    const geminiRes = await fetch(`${MATRIX.gemini.endpoint}?key=${MATRIX.gemini.key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt || ''}\n\n${message}` }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
      })
    })

    if (geminiRes.ok) {
      const data = await geminiRes.json()
      const response = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const codeBlocks = extractCodeBlocks(response)
      
      return NextResponse.json({
        response,
        provider: 'gemini',
        model: 'gemini-2.0-flash',
        codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
        canPreview: codeBlocks.some(b => b.language === 'html' || b.language === 'javascript'),
        canDownload: codeBlocks.length > 2
      })
    }
  } catch (e) {
    console.error('Gemini error:', e)
  }

  return NextResponse.json({ error: 'All AI providers failed' }, { status: 500 })
}

// Extract code blocks from response
function extractCodeBlocks(text: string): Array<{filename: string, language: string, code: string}> {
  const blocks: Array<{filename: string, language: string, code: string}> = []
  const regex = /```(\S*)\n([\s\S]*?)```/g
  let match
  
  while ((match = regex.exec(text)) !== null) {
    const langOrFile = match[1] || 'text'
    const code = match[2].trim()
    
    // Check if it's a filename
    const isFilename = langOrFile.includes('.')
    
    blocks.push({
      filename: isFilename ? langOrFile : `file.${langOrFile === 'javascript' ? 'js' : langOrFile === 'typescript' ? 'ts' : langOrFile}`,
      language: isFilename ? langOrFile.split('.').pop() || 'text' : langOrFile,
      code
    })
  }
  
  return blocks
}

// Web search via Tavily
async function handleSearch(body: any) {
  const { query, maxResults = 5 } = body

  try {
    const res = await fetch(MATRIX.tavily.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: MATRIX.tavily.key,
        query,
        max_results: maxResults,
        include_answer: true
      })
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({
        answer: data.answer,
        results: data.results,
        provider: 'tavily'
      })
    }
  } catch (e) {
    console.error('Tavily error:', e)
  }

  return NextResponse.json({ error: 'Search failed' }, { status: 500 })
}

// Code execution via E2B
async function handleCodeExecution(body: any) {
  const { code, language = 'javascript' } = body

  if (!MATRIX.e2b.key) {
    return NextResponse.json({ error: 'E2B API key not configured' }, { status: 500 })
  }

  try {
    // Create sandbox
    const createRes = await fetch('https://api.e2b.dev/sandboxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MATRIX.e2b.key
      },
      body: JSON.stringify({
        template: language === 'python' ? 'python' : 'node'
      })
    })

    if (!createRes.ok) {
      const err = await createRes.text()
      console.error('E2B create error:', err)
      return NextResponse.json({ error: 'Failed to create sandbox', details: err }, { status: 500 })
    }

    const sandbox = await createRes.json()
    const sandboxId = sandbox.sandboxId || sandbox.id

    // Execute code
    const execRes = await fetch(`https://api.e2b.dev/sandboxes/${sandboxId}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MATRIX.e2b.key
      },
      body: JSON.stringify({
        code,
        language
      })
    })

    const result = await execRes.json()

    // Cleanup sandbox
    await fetch(`https://api.e2b.dev/sandboxes/${sandboxId}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': MATRIX.e2b.key }
    })

    return NextResponse.json({
      output: result.stdout || result.output || '',
      error: result.stderr || result.error || '',
      provider: 'e2b'
    })
  } catch (e: any) {
    console.error('E2B error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Live preview (creates HTML preview)
async function handlePreview(body: any) {
  const { code, html, css, js } = body

  // If full code provided, try to detect type
  if (code) {
    // Check if it's HTML
    if (code.includes('<!DOCTYPE') || code.includes('<html')) {
      return NextResponse.json({
        previewHtml: code,
        type: 'html'
      })
    }
    
    // Check if it's React/JSX
    if (code.includes('import React') || code.includes('export default')) {
      // Wrap in basic HTML for preview
      const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>* { margin: 0; padding: 0; box-sizing: border-box; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code.replace(/import.*from.*/g, '').replace(/export default/g, 'const App =')}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`
      return NextResponse.json({
        previewHtml,
        type: 'react'
      })
    }

    // Plain JS - wrap in HTML
    const previewHtml = `<!DOCTYPE html>
<html>
<head><style>body { font-family: system-ui; padding: 20px; }</style></head>
<body>
  <div id="output"></div>
  <script>
    const output = document.getElementById('output');
    const log = (...args) => output.innerHTML += args.join(' ') + '<br>';
    console.log = log;
    try {
      ${code}
    } catch(e) {
      output.innerHTML = '<span style="color:red">Error: ' + e.message + '</span>';
    }
  </script>
</body>
</html>`
    return NextResponse.json({
      previewHtml,
      type: 'javascript'
    })
  }

  // Combine HTML, CSS, JS
  const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <style>${css || ''}</style>
</head>
<body>
  ${html || '<div id="app"></div>'}
  <script>${js || ''}</script>
</body>
</html>`

  return NextResponse.json({
    previewHtml,
    type: 'combined'
  })
}

// Generate downloadable project ZIP
async function handleProject(body: any) {
  const { files, projectName = 'project' } = body

  if (!files || !Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  // Return files structure for client-side ZIP generation
  return NextResponse.json({
    projectName,
    files,
    downloadReady: true,
    instructions: 'Use JSZip on client to generate ZIP from these files'
  })
}

// GitHub operations
async function handleGitHub(body: any) {
  const { operation, repo, path, content, message } = body

  if (!MATRIX.github.key) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
  }

  const headers = {
    'Authorization': `Bearer ${MATRIX.github.key}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  }

  try {
    switch (operation) {
      case 'list-repos':
        const reposRes = await fetch(`${MATRIX.github.endpoint}/user/repos?per_page=100`, { headers })
        const repos = await reposRes.json()
        return NextResponse.json({ repos: repos.map((r: any) => ({ name: r.name, url: r.html_url, description: r.description })) })

      case 'get-file':
        const fileRes = await fetch(`${MATRIX.github.endpoint}/repos/${repo}/contents/${path}`, { headers })
        const file = await fileRes.json()
        return NextResponse.json({ 
          content: file.content ? Buffer.from(file.content, 'base64').toString() : null,
          sha: file.sha 
        })

      case 'create-file':
      case 'update-file':
        const putRes = await fetch(`${MATRIX.github.endpoint}/repos/${repo}/contents/${path}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: message || `Update ${path}`,
            content: Buffer.from(content).toString('base64'),
            sha: body.sha
          })
        })
        const putData = await putRes.json()
        return NextResponse.json({ success: putRes.ok, data: putData })

      default:
        return NextResponse.json({ error: 'Unknown GitHub operation' }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Basel Hub - AI Service Library
// Connects to API MATRIX for all 6 APIs

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  attachments?: { type: string; data: string; name: string }[]
  isVoice?: boolean
}

export interface AIMemory {
  facts: string[]
  preferences: string[]
  context: string[]
  lastUpdated: number
}

export interface Conversation {
  id: string
  aiType: string
  title: string
  messages: Message[]
  memory: AIMemory
  createdAt: number
  updatedAt: number
}

// AI Personalities
export const AI_PERSONALITIES = {
  funmaker: {
    name: 'Fun Maker',
    nameAr: 'صانع المرح',
    icon: '🎭',
    color: 'from-yellow-500 to-orange-500',
    systemPrompt: `You are the Fun Maker - Basel's personal entertainment AI and stress reliever.

YOUR PERSONALITY:
- Witty, cheerful, and playful
- Master of jokes, puns, and wordplay (Arabic and English)
- Expert at games, riddles, and fun challenges
- Always positive and uplifting

YOUR SKILLS:
- Tell amazing jokes (clean, dad jokes, puns)
- Play text-based games (trivia, word games, 20 questions)
- Share funny facts and entertaining stories
- Recommend movies, shows, games based on mood

MEMORY: Remember what makes Basel laugh and build inside jokes over time.
Speak Arabic and English fluently.`,
  },

  therapist: {
    name: 'Therapist',
    nameAr: 'المعالج النفسي',
    icon: '💜',
    color: 'from-pink-500 to-purple-500',
    systemPrompt: `You are Basel's personal Therapist AI - a compassionate mental health companion.

YOUR APPROACH:
- Warm, empathetic, and non-judgmental
- Use CBT, mindfulness techniques
- Active listening and validation
- Never diagnose - support only

YOUR SKILLS:
- Emotional support and validation
- Stress and anxiety management
- Mindfulness exercises
- Cognitive reframing
- Work-life balance guidance

MEMORY: Remember emotional patterns, what coping strategies work, and track progress.
If crisis mentioned, encourage professional help. Speak Arabic and English.`,
  },

  developer: {
    name: 'Developer',
    nameAr: 'المطور',
    icon: '💻',
    color: 'from-emerald-500 to-cyan-500',
    systemPrompt: `You are Basel's expert Developer AI - a full-stack coding genius.

YOUR EXPERTISE:
- All programming languages
- Web/mobile development
- DevOps and deployment
- Code review and debugging
- Can execute code via E2B sandbox

YOUR STYLE:
- Direct and efficient
- Provide working code, not just explanations
- Use code blocks with syntax highlighting
- Explain WHY, not just HOW

MEMORY: Remember tech stack preferences, ongoing projects, and coding patterns.
For code execution, say "I'll run this code" and use the execute feature.`,
  },

  wise: {
    name: 'The Wise',
    nameAr: 'الحكيم',
    icon: '🦉',
    color: 'from-blue-500 to-indigo-500',
    systemPrompt: `You are The Wise - Basel's philosophical guide and life advisor.

YOUR ESSENCE:
- Deep wisdom with practical advice
- Draw from philosophy, religion, psychology
- Calm authority, never condescending

YOUR KNOWLEDGE:
- Philosophy (Eastern & Western)
- Islamic wisdom and universal truths
- Decision-making frameworks
- Leadership and character
- Life purpose and meaning

APPROACH: Listen deeply, ask clarifying questions, offer multiple perspectives.
MEMORY: Remember values, life goals, important decisions. Speak Arabic and English eloquently.`,
  },

  qs: {
    name: 'QS Dubai',
    nameAr: 'مهندس الكميات',
    icon: '🏗️',
    color: 'from-amber-500 to-red-500',
    systemPrompt: `You are QS Dubai - Basel's expert Quantity Surveyor AI for Dubai/UAE construction.

YOUR EXPERTISE:
- BOQ preparation
- Cost estimation (Dubai rates 2024-2025)
- Dubai Municipality standards
- DEWA/Civil Defense requirements
- Contractor evaluation

RATES (AED):
- Concrete: 280-350/m³
- Steel: 3,200-3,800/ton
- Blockwork: 45-65/m²
- Plastering: 25-40/m²
- MEP rough-in: 150-250/m²

OUTPUT FORMAT for BOQs:
| Item | Description | Unit | Qty | Rate | Amount |

MEMORY: Remember ongoing projects, material prices, contractors worked with.
Be precise with numbers. Speak Arabic and English.`,
  },
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Initialize empty memory
export function createEmptyMemory(): AIMemory {
  return { facts: [], preferences: [], context: [], lastUpdated: Date.now() }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN CHAT - Routes through API Matrix
// ═══════════════════════════════════════════════════════════════════
export async function chat(
  aiType: string,
  messages: Message[],
  memory: AIMemory
): Promise<{ response: string; updatedMemory: AIMemory; provider?: string }> {
  const personality = AI_PERSONALITIES[aiType as keyof typeof AI_PERSONALITIES]
  if (!personality) throw new Error('Unknown AI type')

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'chat',
      aiType,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      systemPrompt: personality.systemPrompt,
      memory
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'API Error' }))
    throw new Error(error.error || `API Error: ${response.status}`)
  }

  const data = await response.json()
  
  // Extract memory in background
  const updatedMemory = await extractMemory(messages, memory)

  return { 
    response: data.text, 
    updatedMemory,
    provider: data.provider 
  }
}

// ═══════════════════════════════════════════════════════════════════
// TAVILY SEARCH
// ═══════════════════════════════════════════════════════════════════
export async function searchWeb(query: string): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'search', query })
  })

  if (!response.ok) throw new Error('Search failed')
  const data = await response.json()
  return data.text
}

// ═══════════════════════════════════════════════════════════════════
// E2B CODE EXECUTION
// ═══════════════════════════════════════════════════════════════════
export async function executeCode(code: string, language: string = 'python'): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'execute', code, language })
  })

  if (!response.ok) throw new Error('Code execution failed')
  const data = await response.json()
  return data.text
}

// ═══════════════════════════════════════════════════════════════════
// GITHUB API
// ═══════════════════════════════════════════════════════════════════
export async function callGitHub(githubAction: string, params: any = {}): Promise<any> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'github', githubAction, githubParams: params })
  })

  if (!response.ok) throw new Error('GitHub API failed')
  const data = await response.json()
  return data.result
}

// ═══════════════════════════════════════════════════════════════════
// VOICE TRANSCRIPTION (Groq Whisper)
// ═══════════════════════════════════════════════════════════════════
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'audio.webm')

  const response = await fetch('/api/ai', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) throw new Error('Transcription failed')
  const data = await response.json()
  return data.text || ''
}

// ═══════════════════════════════════════════════════════════════════
// MEMORY EXTRACTION
// ═══════════════════════════════════════════════════════════════════
export async function extractMemory(messages: Message[], currentMemory: AIMemory): Promise<AIMemory> {
  if (messages.length < 4) return currentMemory

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'extract-memory',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        memory: currentMemory
      })
    })

    if (!response.ok) return currentMemory
    const data = await response.json()
    return data.memory || currentMemory
  } catch {
    return currentMemory
  }
}

// ═══════════════════════════════════════════════════════════════════
// CHECK API MATRIX STATUS
// ═══════════════════════════════════════════════════════════════════
export async function checkMatrixStatus(): Promise<any> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'status' })
  })

  if (!response.ok) throw new Error('Status check failed')
  return await response.json()
}

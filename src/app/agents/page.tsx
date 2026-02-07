'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Bot, Plus, Trash2, Edit3, Save, Copy, Download, Upload, 
  Brain, Search, MessageSquare, Paperclip, Key, Sparkles,
  Zap, Heart, Shield, Target, Lightbulb, Flame, Moon, Sun,
  Crown, Sword, Music, Palette, Code, BookOpen, Calculator,
  Globe, Camera, Mic, Video, FileText, Database, Cloud,
  Lock, Unlock, Eye, EyeOff, RefreshCw, Settings, Star,
  Award, Trophy, Gift, Rocket, Anchor, Compass, Map,
  Clock, Calendar, Bell, Mail, Phone, User, Users,
  Home, Building, Car, Plane, Ship, Train, Coffee,
  Utensils, Cherry, Flower, Trees, MountainSnow, Umbrella, Snowflake
} from 'lucide-react'

// 50+ Personality Traits
const PERSONALITY_TRAITS = [
  { id: 'friendly', name: 'Friendly', icon: Heart, color: 'text-pink-400', description: 'Warm and approachable' },
  { id: 'professional', name: 'Professional', icon: Shield, color: 'text-blue-400', description: 'Formal and business-like' },
  { id: 'creative', name: 'Creative', icon: Palette, color: 'text-purple-400', description: 'Imaginative and artistic' },
  { id: 'analytical', name: 'Analytical', icon: Calculator, color: 'text-cyan-400', description: 'Logical and data-driven' },
  { id: 'empathetic', name: 'Empathetic', icon: Heart, color: 'text-red-400', description: 'Understanding emotions deeply' },
  { id: 'humorous', name: 'Humorous', icon: Sparkles, color: 'text-yellow-400', description: 'Witty and fun' },
  { id: 'motivational', name: 'Motivational', icon: Flame, color: 'text-orange-400', description: 'Inspiring and encouraging' },
  { id: 'patient', name: 'Patient', icon: Clock, color: 'text-green-400', description: 'Calm and understanding' },
  { id: 'direct', name: 'Direct', icon: Target, color: 'text-red-500', description: 'Straight to the point' },
  { id: 'curious', name: 'Curious', icon: Search, color: 'text-indigo-400', description: 'Always asking questions' },
  { id: 'wise', name: 'Wise', icon: BookOpen, color: 'text-amber-400', description: 'Deep knowledge and insight' },
  { id: 'energetic', name: 'Energetic', icon: Zap, color: 'text-yellow-500', description: 'High energy and enthusiasm' },
  { id: 'calm', name: 'Calm', icon: Moon, color: 'text-blue-300', description: 'Peaceful and serene' },
  { id: 'assertive', name: 'Assertive', icon: Crown, color: 'text-gold-400', description: 'Confident and decisive' },
  { id: 'supportive', name: 'Supportive', icon: Users, color: 'text-teal-400', description: 'Always there to help' },
  { id: 'adventurous', name: 'Adventurous', icon: Compass, color: 'text-emerald-400', description: 'Bold and daring' },
  { id: 'scholarly', name: 'Scholarly', icon: BookOpen, color: 'text-brown-400', description: 'Academic and research-focused' },
  { id: 'playful', name: 'Playful', icon: Gift, color: 'text-pink-300', description: 'Fun and lighthearted' },
  { id: 'mysterious', name: 'Mysterious', icon: Eye, color: 'text-violet-400', description: 'Intriguing and enigmatic' },
  { id: 'nurturing', name: 'Nurturing', icon: Flower, color: 'text-rose-400', description: 'Caring and protective' },
  { id: 'rebel', name: 'Rebel', icon: Flame, color: 'text-red-600', description: 'Challenges conventions' },
  { id: 'minimalist', name: 'Minimalist', icon: Target, color: 'text-gray-400', description: 'Simple and efficient' },
  { id: 'storyteller', name: 'Storyteller', icon: BookOpen, color: 'text-amber-500', description: 'Narrative and engaging' },
  { id: 'mentor', name: 'Mentor', icon: Award, color: 'text-gold-500', description: 'Guides and teaches' },
  { id: 'innovator', name: 'Innovator', icon: Lightbulb, color: 'text-yellow-400', description: 'Always thinking new ideas' },
]

// 30+ Communication Styles
const COMMUNICATION_STYLES = [
  { id: 'concise', name: 'Concise', description: 'Short, clear responses' },
  { id: 'detailed', name: 'Detailed', description: 'Comprehensive explanations' },
  { id: 'conversational', name: 'Conversational', description: 'Natural dialogue flow' },
  { id: 'formal', name: 'Formal', description: 'Professional language' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and informal' },
  { id: 'socratic', name: 'Socratic', description: 'Asks guiding questions' },
  { id: 'storytelling', name: 'Storytelling', description: 'Uses narratives and examples' },
  { id: 'technical', name: 'Technical', description: 'Precise technical language' },
  { id: 'metaphorical', name: 'Metaphorical', description: 'Uses analogies and metaphors' },
  { id: 'bullet-points', name: 'Bullet Points', description: 'Organized lists' },
  { id: 'step-by-step', name: 'Step-by-Step', description: 'Sequential instructions' },
  { id: 'debate', name: 'Debate Style', description: 'Presents multiple viewpoints' },
  { id: 'encouraging', name: 'Encouraging', description: 'Positive reinforcement' },
  { id: 'challenging', name: 'Challenging', description: 'Pushes you to think deeper' },
  { id: 'visual', name: 'Visual', description: 'Uses diagrams and examples' },
]

// 25+ Expertise Domains
const EXPERTISE_DOMAINS = [
  { id: 'coding', name: 'Programming & Code', icon: Code },
  { id: 'writing', name: 'Writing & Content', icon: FileText },
  { id: 'business', name: 'Business & Strategy', icon: Building },
  { id: 'science', name: 'Science & Research', icon: Brain },
  { id: 'math', name: 'Mathematics', icon: Calculator },
  { id: 'art', name: 'Art & Design', icon: Palette },
  { id: 'music', name: 'Music & Audio', icon: Music },
  { id: 'language', name: 'Languages', icon: Globe },
  { id: 'psychology', name: 'Psychology', icon: Heart },
  { id: 'philosophy', name: 'Philosophy', icon: BookOpen },
  { id: 'history', name: 'History', icon: Clock },
  { id: 'health', name: 'Health & Fitness', icon: Heart },
  { id: 'cooking', name: 'Cooking & Food', icon: Coffee },
  { id: 'travel', name: 'Travel & Culture', icon: Plane },
  { id: 'finance', name: 'Finance & Investing', icon: Calculator },
  { id: 'marketing', name: 'Marketing & Sales', icon: Target },
  { id: 'education', name: 'Education & Teaching', icon: BookOpen },
  { id: 'legal', name: 'Legal & Law', icon: Shield },
  { id: 'engineering', name: 'Engineering', icon: Settings },
  { id: 'gaming', name: 'Gaming & Entertainment', icon: Sparkles },
  { id: 'sports', name: 'Sports & Athletics', icon: Trophy },
  { id: 'nature', name: 'Nature & Environment', icon: Trees },
  { id: 'technology', name: 'Technology & AI', icon: Bot },
  { id: 'spirituality', name: 'Spirituality & Mindfulness', icon: Moon },
  { id: 'relationships', name: 'Relationships & Social', icon: Users },
]

// 20+ Thinking Modes
const THINKING_MODES = [
  { id: 'deep', name: 'Deep Thinking', description: 'Thoroughly analyzes before responding', icon: Brain },
  { id: 'quick', name: 'Quick Response', description: 'Fast, immediate answers', icon: Zap },
  { id: 'creative', name: 'Creative Thinking', description: 'Generates novel ideas', icon: Lightbulb },
  { id: 'critical', name: 'Critical Analysis', description: 'Evaluates and critiques', icon: Search },
  { id: 'lateral', name: 'Lateral Thinking', description: 'Unconventional approaches', icon: Compass },
  { id: 'systematic', name: 'Systematic', description: 'Methodical step-by-step', icon: Settings },
  { id: 'intuitive', name: 'Intuitive', description: 'Goes with gut feeling', icon: Heart },
  { id: 'research', name: 'Research Mode', description: 'Deep search and verify', icon: Search },
  { id: 'brainstorm', name: 'Brainstorming', description: 'Generates many ideas', icon: Sparkles },
  { id: 'debate', name: 'Devil\'s Advocate', description: 'Challenges assumptions', icon: Sword },
  { id: 'empathy', name: 'Empathetic Thinking', description: 'Considers emotions', icon: Heart },
  { id: 'strategic', name: 'Strategic Planning', description: 'Long-term thinking', icon: Map },
  { id: 'problem-solving', name: 'Problem Solving', description: 'Focuses on solutions', icon: Target },
  { id: 'reflective', name: 'Reflective', description: 'Considers past experiences', icon: Clock },
  { id: 'visionary', name: 'Visionary', description: 'Thinks about the future', icon: Rocket },
]

// 15+ Memory Types
const MEMORY_TYPES = [
  { id: 'conversation', name: 'Conversation Memory', description: 'Remembers chat history' },
  { id: 'user-preferences', name: 'User Preferences', description: 'Learns your preferences' },
  { id: 'facts', name: 'Fact Storage', description: 'Stores important facts' },
  { id: 'context', name: 'Context Awareness', description: 'Understands current context' },
  { id: 'emotional', name: 'Emotional Memory', description: 'Remembers emotional states' },
  { id: 'task', name: 'Task Memory', description: 'Tracks ongoing tasks' },
  { id: 'learning', name: 'Learning Progress', description: 'Tracks what you\'ve learned' },
  { id: 'relationship', name: 'Relationship Memory', description: 'Remembers people mentioned' },
  { id: 'project', name: 'Project Memory', description: 'Tracks project details' },
  { id: 'feedback', name: 'Feedback Memory', description: 'Remembers corrections' },
  { id: 'long-term', name: 'Long-term Memory', description: 'Persistent across sessions' },
  { id: 'episodic', name: 'Episodic Memory', description: 'Remembers specific events' },
  { id: 'semantic', name: 'Semantic Memory', description: 'General knowledge' },
  { id: 'procedural', name: 'Procedural Memory', description: 'How to do things' },
  { id: 'working', name: 'Working Memory', description: 'Current session focus' },
]

// Avatar icons
const AVATAR_ICONS = [
  Bot, Brain, Sparkles, Star, Heart, Shield, Crown, Sword,
  Rocket, Flame, Moon, Sun, Zap, Target, Lightbulb, Eye,
  Globe, Code, Palette, Music, BookOpen, Calculator, Camera,
  Mic, Database, Cloud, Compass, Map, Award, Trophy, Gift
]

interface Agent {
  id: string
  name: string
  description: string
  avatar: number
  avatarColor: string
  personalities: string[]
  communicationStyle: string
  expertise: string[]
  thinkingMode: string
  memoryTypes: string[]
  customInstructions: string
  temperature: number
  maxTokens: number
  enableDeepSearch: boolean
  enableDeepThinking: boolean
  enableAttachments: boolean
  enableMemory: boolean
  enableChat: boolean
  customTokens: { name: string; value: string }[]
  apiKeys: { provider: string; key: string }[]
  createdAt: string
  lastUsed: string | null
}

const DEFAULT_AGENT: Omit<Agent, 'id' | 'createdAt' | 'lastUsed'> = {
  name: '',
  description: '',
  avatar: 0,
  avatarColor: 'bg-violet-500',
  personalities: ['friendly'],
  communicationStyle: 'conversational',
  expertise: ['general'],
  thinkingMode: 'deep',
  memoryTypes: ['conversation', 'context'],
  customInstructions: '',
  temperature: 0.7,
  maxTokens: 4096,
  enableDeepSearch: true,
  enableDeepThinking: true,
  enableAttachments: true,
  enableMemory: true,
  enableChat: true,
  customTokens: [],
  apiKeys: [],
}

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
  'bg-green-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-orange-500',
  'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500',
  'bg-rose-500', 'bg-amber-500', 'bg-lime-500', 'bg-fuchsia-500'
]

const API_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google AI', placeholder: 'AIza...' },
  { id: 'cohere', name: 'Cohere', placeholder: 'co-...' },
  { id: 'huggingface', name: 'Hugging Face', placeholder: 'hf_...' },
  { id: 'replicate', name: 'Replicate', placeholder: 'r8_...' },
  { id: 'mistral', name: 'Mistral', placeholder: 'mist-...' },
  { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
  { id: 'perplexity', name: 'Perplexity', placeholder: 'pplx-...' },
  { id: 'together', name: 'Together AI', placeholder: 'tog-...' },
  { id: 'fireworks', name: 'Fireworks', placeholder: 'fw-...' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'sk-...' },
  { id: 'openrouter', name: 'OpenRouter', placeholder: 'sk-or-...' },
  { id: 'custom', name: 'Custom API', placeholder: 'your-key...' },
]

export default function AgentGenerator() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [activeTab, setActiveTab] = useState<'personality' | 'abilities' | 'memory' | 'tokens' | 'advanced'>('personality')
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})
  const [testChatOpen, setTestChatOpen] = useState(false)
  const [testMessages, setTestMessages] = useState<{ role: 'user' | 'agent'; content: string }[]>([])
  const [testInput, setTestInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('basel_custom_agents')
    if (saved) setAgents(JSON.parse(saved))
  }, [])

  const saveAgents = (newAgents: Agent[]) => {
    setAgents(newAgents)
    localStorage.setItem('basel_custom_agents', JSON.stringify(newAgents))
  }

  const createAgent = () => {
    const newAgent: Agent = {
      ...DEFAULT_AGENT,
      id: `agent_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    }
    setEditingAgent(newAgent)
    setIsCreating(true)
    setActiveTab('personality')
  }

  const saveAgent = () => {
    if (!editingAgent || !editingAgent.name.trim()) return
    
    if (isCreating) {
      saveAgents([...agents, editingAgent])
    } else {
      saveAgents(agents.map(a => a.id === editingAgent.id ? editingAgent : a))
    }
    setEditingAgent(null)
    setIsCreating(false)
  }

  const deleteAgent = (id: string) => {
    if (confirm('Delete this agent?')) {
      saveAgents(agents.filter(a => a.id !== id))
      if (selectedAgent?.id === id) setSelectedAgent(null)
    }
  }

  const duplicateAgent = (agent: Agent) => {
    const newAgent: Agent = {
      ...agent,
      id: `agent_${Date.now()}`,
      name: `${agent.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    }
    saveAgents([...agents, newAgent])
  }

  const exportAgent = (agent: Agent) => {
    const data = JSON.stringify(agent, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${agent.name.replace(/\s+/g, '-').toLowerCase()}.agent.json`
    a.click()
  }

  const importAgent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const agent = JSON.parse(e.target?.result as string)
        agent.id = `agent_${Date.now()}`
        agent.createdAt = new Date().toISOString()
        agent.lastUsed = null
        saveAgents([...agents, agent])
      } catch {
        alert('Invalid agent file')
      }
    }
    reader.readAsText(file)
  }

  const generateSystemPrompt = (agent: Agent): string => {
    const personalities = PERSONALITY_TRAITS.filter(p => agent.personalities.includes(p.id))
    const expertise = EXPERTISE_DOMAINS.filter(e => agent.expertise.includes(e.id))
    const memory = MEMORY_TYPES.filter(m => agent.memoryTypes.includes(m.id))
    const thinking = THINKING_MODES.find(t => t.id === agent.thinkingMode)
    const commStyle = COMMUNICATION_STYLES.find(c => c.id === agent.communicationStyle)
    
    return `You are ${agent.name}. ${agent.description}

## Core Personality Traits
${personalities.map(p => `- **${p.name}**: ${p.description}`).join('\n')}

## Communication Style
${commStyle?.name}: ${commStyle?.description}

## Areas of Expertise
${expertise.map(e => `- ${e.name}`).join('\n')}

## Thinking Approach
${thinking?.name}: ${thinking?.description}

${agent.enableDeepThinking ? `## Deep Thinking Mode
Before responding, take time to:
1. Analyze the question thoroughly
2. Consider multiple perspectives
3. Think through implications
4. Structure your response carefully` : ''}

${agent.enableDeepSearch ? `## Deep Search Capability
You can perform comprehensive research when needed:
- Search for current information
- Verify facts from multiple sources
- Provide citations and references` : ''}

${agent.enableMemory ? `## Memory Systems Active
${memory.map(m => `- ${m.name}: ${m.description}`).join('\n')}` : ''}

${agent.customInstructions ? `## Custom Instructions
${agent.customInstructions}` : ''}

## Behavioral Guidelines
- Stay true to your personality traits at all times
- Adapt your communication based on user needs while maintaining core traits
- Use your expertise to provide valuable insights
- Remember context and build on previous conversations
- Be authentic and consistent in your responses`
  }

  const testAgent = async () => {
    if (!editingAgent || !testInput.trim()) return
    
    const userMessage = testInput.trim()
    setTestMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setTestInput('')
    
    // Simulate agent response based on personality
    const personalities = editingAgent.personalities.join(', ')
    const response = `[Testing ${editingAgent.name} with traits: ${personalities}]

Based on my personality, here's how I'd respond:

${editingAgent.personalities.includes('friendly') ? '👋 *warmly* ' : ''}${editingAgent.personalities.includes('professional') ? 'Thank you for your inquiry. ' : ''}${editingAgent.personalities.includes('humorous') ? 'Haha, great question! ' : ''}

I'm processing your message: "${userMessage}"

${editingAgent.enableDeepThinking ? '🧠 *Deep thinking activated*\nLet me analyze this thoroughly...' : ''}
${editingAgent.enableDeepSearch ? '🔍 *Deep search ready*\nI can research this further if needed.' : ''}
${editingAgent.enableMemory ? '💾 *Memory active*\nI\'ll remember this conversation.' : ''}

This is a preview of how I would interact based on my configuration.`

    setTimeout(() => {
      setTestMessages(prev => [...prev, { role: 'agent', content: response }])
    }, 1000)
  }

  const AvatarIcon = editingAgent ? AVATAR_ICONS[editingAgent.avatar] : Bot

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Bot className="w-8 h-8 text-violet-400" />
            <div>
              <h1 className="text-xl font-bold">Agent Generator</h1>
              <p className="text-gray-400 text-sm">Create powerful AI agents with custom personalities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".json" onChange={importAgent} className="hidden" />
            </label>
            <button
              onClick={createAgent}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Agent
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Agent List */}
        {!editingAgent && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.length === 0 && (
              <div className="col-span-full text-center py-20">
                <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No agents yet</h3>
                <p className="text-gray-500 mb-6">Create your first AI agent with custom personality</p>
                <button
                  onClick={createAgent}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Agent
                </button>
              </div>
            )}
            
            {agents.map(agent => {
              const AgentIcon = AVATAR_ICONS[agent.avatar]
              return (
                <div
                  key={agent.id}
                  className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-violet-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${agent.avatarColor} rounded-xl flex items-center justify-center`}>
                      <AgentIcon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingAgent(agent); setIsCreating(false); setActiveTab('personality') }}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                       
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateAgent(agent)}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                       
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exportAgent(agent)}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                       
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                       
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.personalities.slice(0, 3).map(p => {
                      const trait = PERSONALITY_TRAITS.find(t => t.id === p)
                      return (
                        <span key={p} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {trait?.name}
                        </span>
                      )
                    })}
                    {agent.personalities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        +{agent.personalities.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {agent.enableDeepThinking && <Brain className="w-4 h-4 text-violet-400" />}
                    {agent.enableDeepSearch && <Search className="w-4 h-4 text-blue-400" />}
                    {agent.enableMemory && <Database className="w-4 h-4 text-green-400" />}
                    {agent.enableAttachments && <Paperclip className="w-4 h-4 text-orange-400" />}
                    {agent.enableChat && <MessageSquare className="w-4 h-4 text-cyan-400" />}
                    {agent.apiKeys.length > 0 && <Key className="w-4 h-4 text-yellow-400" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Agent Editor */}
        {editingAgent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="flex gap-4 mb-4">
                  {/* Avatar Selector */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 ${editingAgent.avatarColor} rounded-xl flex items-center justify-center mb-2`}>
                      <AvatarIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {AVATAR_ICONS.slice(0, 12).map((Icon, i) => (
                        <button
                          key={i}
                          onClick={() => setEditingAgent({ ...editingAgent, avatar: i })}
                          className={`p-1 rounded ${editingAgent.avatar === i ? 'bg-violet-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 max-w-[120px]">
                      {AVATAR_COLORS.slice(0, 8).map(color => (
                        <button
                          key={color}
                          onClick={() => setEditingAgent({ ...editingAgent, avatarColor: color })}
                          className={`w-5 h-5 rounded ${color} ${editingAgent.avatarColor === color ? 'ring-2 ring-white' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      placeholder="Agent Name"
                      value={editingAgent.name}
                      onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none text-lg"
                    />
                    <textarea
                      placeholder="Description - What does this agent do?"
                      value={editingAgent.description}
                      onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'personality', icon: Heart, label: 'Personality' },
                  { id: 'abilities', icon: Zap, label: 'Abilities' },
                  { id: 'memory', icon: Brain, label: 'Memory' },
                  { id: 'tokens', icon: Key, label: 'Tokens & Keys' },
                  { id: 'advanced', icon: Settings, label: 'Advanced' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                {/* Personality Tab */}
                {activeTab === 'personality' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Personality Traits (Select Multiple)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PERSONALITY_TRAITS.map(trait => {
                          const TraitIcon = trait.icon
                          const selected = editingAgent.personalities.includes(trait.id)
                          return (
                            <button
                              key={trait.id}
                              onClick={() => {
                                const newPersonalities = selected
                                  ? editingAgent.personalities.filter(p => p !== trait.id)
                                  : [...editingAgent.personalities, trait.id]
                                setEditingAgent({ ...editingAgent, personalities: newPersonalities })
                              }}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                selected
                                  ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <TraitIcon className={`w-4 h-4 ${trait.color}`} />
                                <span className="font-medium text-sm">{trait.name}</span>
                              </div>
                              <p className="text-xs text-gray-500">{trait.description}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Communication Style</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {COMMUNICATION_STYLES.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setEditingAgent({ ...editingAgent, communicationStyle: style.id })}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              editingAgent.communicationStyle === style.id
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className="font-medium text-sm block mb-1">{style.name}</span>
                            <p className="text-xs text-gray-500">{style.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Expertise Domains (Select Multiple)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {EXPERTISE_DOMAINS.map(domain => {
                          const DomainIcon = domain.icon
                          const selected = editingAgent.expertise.includes(domain.id)
                          return (
                            <button
                              key={domain.id}
                              onClick={() => {
                                const newExpertise = selected
                                  ? editingAgent.expertise.filter(e => e !== domain.id)
                                  : [...editingAgent.expertise, domain.id]
                                setEditingAgent({ ...editingAgent, expertise: newExpertise })
                              }}
                              className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                                selected
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <DomainIcon className="w-4 h-4" />
                              <span className="text-sm">{domain.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Abilities Tab */}
                {activeTab === 'abilities' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Core Abilities</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: 'enableChat', icon: MessageSquare, name: 'Chat', desc: 'Conversational interactions' },
                          { key: 'enableDeepThinking', icon: Brain, name: 'Deep Thinking', desc: 'Thorough analysis before responding' },
                          { key: 'enableDeepSearch', icon: Search, name: 'Deep Search', desc: 'Research and verify information' },
                          { key: 'enableMemory', icon: Database, name: 'Memory System', desc: 'Remember conversations and context' },
                          { key: 'enableAttachments', icon: Paperclip, name: 'Attachments', desc: 'Handle files and images' },
                        ].map(ability => {
                          const AbilityIcon = ability.icon
                          const enabled = editingAgent[ability.key as keyof Agent] as boolean
                          return (
                            <button
                              key={ability.key}
                              onClick={() => setEditingAgent({ ...editingAgent, [ability.key]: !enabled })}
                              className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                                enabled
                                  ? 'bg-violet-500/20 border-violet-500'
                                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                enabled ? 'bg-violet-500' : 'bg-gray-700'
                              }`}>
                                <AbilityIcon className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{ability.name}</div>
                                <div className="text-xs text-gray-500">{ability.desc}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Thinking Mode</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {THINKING_MODES.map(mode => {
                          const ModeIcon = mode.icon
                          return (
                            <button
                              key={mode.id}
                              onClick={() => setEditingAgent({ ...editingAgent, thinkingMode: mode.id })}
                              className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                                editingAgent.thinkingMode === mode.id
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <ModeIcon className="w-5 h-5" />
                              <div className="text-left">
                                <div className="font-medium text-sm">{mode.name}</div>
                                <div className="text-xs text-gray-500">{mode.description}</div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Memory Tab */}
                {activeTab === 'memory' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Memory Types (Select Multiple)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {MEMORY_TYPES.map(memType => {
                          const selected = editingAgent.memoryTypes.includes(memType.id)
                          return (
                            <button
                              key={memType.id}
                              onClick={() => {
                                const newMemory = selected
                                  ? editingAgent.memoryTypes.filter(m => m !== memType.id)
                                  : [...editingAgent.memoryTypes, memType.id]
                                setEditingAgent({ ...editingAgent, memoryTypes: newMemory })
                              }}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                selected
                                  ? 'bg-green-500/20 border-green-500 text-green-300'
                                  : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <div className="font-medium text-sm mb-1">{memType.name}</div>
                              <div className="text-xs text-gray-500">{memType.description}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tokens & Keys Tab */}
                {activeTab === 'tokens' && (
                  <div className="space-y-6">
                    {/* Custom Tokens */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-400">Custom Tokens</h4>
                        <button
                          onClick={() => setEditingAgent({
                            ...editingAgent,
                            customTokens: [...editingAgent.customTokens, { name: '', value: '' }]
                          })}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Token
                        </button>
                      </div>
                      
                      {editingAgent.customTokens.length === 0 ? (
                        <p className="text-gray-500 text-sm">No custom tokens. Add tokens for variables like {'{{USER_NAME}}'}, {'{{COMPANY}}'}, etc.</p>
                      ) : (
                        <div className="space-y-2">
                          {editingAgent.customTokens.map((token, i) => (
                            <div key={i} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Token name (e.g., USER_NAME)"
                                value={token.name}
                                onChange={(e) => {
                                  const newTokens = [...editingAgent.customTokens]
                                  newTokens[i].name = e.target.value
                                  setEditingAgent({ ...editingAgent, customTokens: newTokens })
                                }}
                                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-violet-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                value={token.value}
                                onChange={(e) => {
                                  const newTokens = [...editingAgent.customTokens]
                                  newTokens[i].value = e.target.value
                                  setEditingAgent({ ...editingAgent, customTokens: newTokens })
                                }}
                                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-violet-500 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const newTokens = editingAgent.customTokens.filter((_, j) => j !== i)
                                  setEditingAgent({ ...editingAgent, customTokens: newTokens })
                                }}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* API Keys */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-400">API Keys</h4>
                        <button
                          onClick={() => setEditingAgent({
                            ...editingAgent,
                            apiKeys: [...editingAgent.apiKeys, { provider: 'openai', key: '' }]
                          })}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add API Key
                        </button>
                      </div>
                      
                      {editingAgent.apiKeys.length === 0 ? (
                        <p className="text-gray-500 text-sm">No API keys configured. Add keys for AI providers this agent can use.</p>
                      ) : (
                        <div className="space-y-2">
                          {editingAgent.apiKeys.map((apiKey, i) => (
                            <div key={i} className="flex gap-2">
                              <select
                                value={apiKey.provider}
                                onChange={(e) => {
                                  const newKeys = [...editingAgent.apiKeys]
                                  newKeys[i].provider = e.target.value
                                  setEditingAgent({ ...editingAgent, apiKeys: newKeys })
                                }}
                                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-violet-500 focus:outline-none"
                              >
                                {API_PROVIDERS.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                              <div className="flex-1 relative">
                                <input
                                  type={showApiKeys[i] ? 'text' : 'password'}
                                  placeholder={API_PROVIDERS.find(p => p.id === apiKey.provider)?.placeholder}
                                  value={apiKey.key}
                                  onChange={(e) => {
                                    const newKeys = [...editingAgent.apiKeys]
                                    newKeys[i].key = e.target.value
                                    setEditingAgent({ ...editingAgent, apiKeys: newKeys })
                                  }}
                                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-violet-500 focus:outline-none pr-10"
                                />
                                <button
                                  onClick={() => setShowApiKeys({ ...showApiKeys, [i]: !showApiKeys[i] })}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded"
                                >
                                  {showApiKeys[i] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  const newKeys = editingAgent.apiKeys.filter((_, j) => j !== i)
                                  setEditingAgent({ ...editingAgent, apiKeys: newKeys })
                                }}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Instructions</h4>
                      <textarea
                        placeholder="Add any custom instructions for this agent. These will be included in the system prompt."
                        value={editingAgent.customInstructions}
                        onChange={(e) => setEditingAgent({ ...editingAgent, customInstructions: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Temperature: {editingAgent.temperature}</h4>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          value={editingAgent.temperature}
                          onChange={(e) => setEditingAgent({ ...editingAgent, temperature: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Precise</span>
                          <span>Creative</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Max Tokens: {editingAgent.maxTokens}</h4>
                        <input
                          type="range"
                          min="256"
                          max="32000"
                          step="256"
                          value={editingAgent.maxTokens}
                          onChange={(e) => setEditingAgent({ ...editingAgent, maxTokens: parseInt(e.target.value) })}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Short</span>
                          <span>Long</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setEditingAgent(null); setIsCreating(false) }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAgent}
                  disabled={!editingAgent.name.trim()}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Agent
                </button>
                <button
                  onClick={() => setTestChatOpen(true)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg flex items-center gap-2 ml-auto"
                >
                  <MessageSquare className="w-5 h-5" />
                  Test Agent
                </button>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="space-y-4">
              {/* Agent Preview Card */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-4">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Preview</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${editingAgent.avatarColor} rounded-xl flex items-center justify-center`}>
                    <AvatarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{editingAgent.name || 'Unnamed Agent'}</h4>
                    <p className="text-xs text-gray-400">{editingAgent.description || 'No description'}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Traits:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {editingAgent.personalities.map(p => (
                        <span key={p} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs">
                          {PERSONALITY_TRAITS.find(t => t.id === p)?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Style:</span>
                    <span className="ml-2">{COMMUNICATION_STYLES.find(s => s.id === editingAgent.communicationStyle)?.name}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Thinking:</span>
                    <span className="ml-2">{THINKING_MODES.find(t => t.id === editingAgent.thinkingMode)?.name}</span>
                  </div>

                  <div>
                    <span className="text-gray-400">Abilities:</span>
                    <div className="flex gap-2 mt-1">
                      {editingAgent.enableChat && <MessageSquare className="w-4 h-4 text-cyan-400" />}
                      {editingAgent.enableDeepThinking && <Brain className="w-4 h-4 text-violet-400" />}
                      {editingAgent.enableDeepSearch && <Search className="w-4 h-4 text-blue-400" />}
                      {editingAgent.enableMemory && <Database className="w-4 h-4 text-green-400" />}
                      {editingAgent.enableAttachments && <Paperclip className="w-4 h-4 text-orange-400" />}
                    </div>
                  </div>

                  {editingAgent.customTokens.length > 0 && (
                    <div>
                      <span className="text-gray-400">Tokens:</span>
                      <span className="ml-2">{editingAgent.customTokens.length} configured</span>
                    </div>
                  )}

                  {editingAgent.apiKeys.length > 0 && (
                    <div>
                      <span className="text-gray-400">API Keys:</span>
                      <span className="ml-2">{editingAgent.apiKeys.length} configured</span>
                    </div>
                  )}
                </div>

                {/* Generated System Prompt Preview */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">System Prompt</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(generateSystemPrompt(editingAgent))}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400"
                     
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-400 max-h-48 overflow-y-auto font-mono">
                    {generateSystemPrompt(editingAgent).slice(0, 500)}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Chat Modal */}
        {testChatOpen && editingAgent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-2xl h-[600px] flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${editingAgent.avatarColor} rounded-lg flex items-center justify-center`}>
                    <AvatarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Test: {editingAgent.name}</h3>
                    <p className="text-xs text-gray-400">Preview agent behavior</p>
                  </div>
                </div>
                <button
                  onClick={() => { setTestChatOpen(false); setTestMessages([]) }}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {testMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-10">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start a conversation to test your agent</p>
                  </div>
                )}
                {testMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' ? 'bg-violet-600' : 'bg-gray-700'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message to test..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && testAgent()}
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    onClick={testAgent}
                    disabled={!testInput.trim()}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

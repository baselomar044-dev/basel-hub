'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX, 
  FiKey, FiEye, FiEyeOff, FiCopy, FiCheck, FiDownload, 
  FiUpload, FiSearch, FiShield, FiSend, FiZap, FiCode,
  FiClock, FiCheckCircle, FiXCircle, FiLink, FiExternalLink
} from 'react-icons/fi'

interface ApiKey {
  id: string
  name: string
  service: string
  key: string
  created_at: string
  updated_at: string
}

interface TestResult {
  success: boolean
  status: number
  statusText: string
  time?: number
  data: any
  headers?: Record<string, string>
}

const SERVICE_ICONS: Record<string, string> = {
  'openai': '🤖',
  'google': '🔍',
  'gemini': '✨',
  'anthropic': '🧠',
  'groq': '⚡',
  'github': '🐙',
  'vercel': '▲',
  'supabase': '💚',
  'stripe': '💳',
  'aws': '☁️',
  'azure': '🔷',
  'firebase': '🔥',
  'twilio': '📱',
  'sendgrid': '📧',
  'cohere': '🌀',
  'huggingface': '🤗',
  'replicate': '🔄',
  'stability': '🎨',
  'elevenlabs': '🔊',
  'deepgram': '🎙️',
  'pinecone': '🌲',
  'weaviate': '🔶',
  'redis': '🔴',
  'mongodb': '🍃',
  'notion': '📝',
  'slack': '💬',
  'discord': '🎮',
  'telegram': '✈️',
  'twitter': '🐦',
  'linkedin': '💼',
  'youtube': '📺',
  'spotify': '🎵',
  'shopify': '🛒',
  'paypal': '💰',
  'cloudflare': '☁️',
  'digitalocean': '🌊',
  'heroku': '💜',
  'default': '🔑'
}

// 50+ API Suggestions
const API_SUGGESTIONS = [
  { name: 'OpenAI', category: 'AI/ML', url: 'https://platform.openai.com/api-keys', desc: 'GPT-4, DALL-E, Whisper - Text, Image, Audio AI' },
  { name: 'Anthropic', category: 'AI/ML', url: 'https://console.anthropic.com/', desc: 'Claude AI - Advanced reasoning & analysis' },
  { name: 'Google Gemini', category: 'AI/ML', url: 'https://makersuite.google.com/app/apikey', desc: 'Gemini Pro - Multimodal AI' },
  { name: 'Groq', category: 'AI/ML', url: 'https://console.groq.com/keys', desc: 'Ultra-fast LLM inference' },
  { name: 'Cohere', category: 'AI/ML', url: 'https://dashboard.cohere.ai/api-keys', desc: 'Enterprise NLP & embeddings' },
  { name: 'Hugging Face', category: 'AI/ML', url: 'https://huggingface.co/settings/tokens', desc: '100k+ ML models hub' },
  { name: 'Replicate', category: 'AI/ML', url: 'https://replicate.com/account/api-tokens', desc: 'Run ML models via API' },
  { name: 'Stability AI', category: 'AI/ML', url: 'https://platform.stability.ai/account/keys', desc: 'Stable Diffusion image generation' },
  { name: 'Mistral AI', category: 'AI/ML', url: 'https://console.mistral.ai/api-keys/', desc: 'Open-weight LLMs' },
  { name: 'Perplexity', category: 'AI/ML', url: 'https://www.perplexity.ai/settings/api', desc: 'AI-powered search API' },
  { name: 'Together AI', category: 'AI/ML', url: 'https://api.together.xyz/settings/api-keys', desc: 'Open source model hosting' },
  { name: 'DeepSeek', category: 'AI/ML', url: 'https://platform.deepseek.com/api_keys', desc: 'Advanced coding AI' },
  { name: 'ElevenLabs', category: 'Audio', url: 'https://elevenlabs.io/app/settings/api-keys', desc: 'AI voice synthesis' },
  { name: 'Deepgram', category: 'Audio', url: 'https://console.deepgram.com/', desc: 'Speech-to-text API' },
  { name: 'AssemblyAI', category: 'Audio', url: 'https://www.assemblyai.com/dashboard/', desc: 'Audio transcription' },
  { name: 'Murf AI', category: 'Audio', url: 'https://murf.ai/studio/api', desc: 'Text-to-speech' },
  { name: 'GitHub', category: 'Dev Tools', url: 'https://github.com/settings/tokens', desc: 'Code repos, Actions, Copilot' },
  { name: 'Vercel', category: 'Dev Tools', url: 'https://vercel.com/account/tokens', desc: 'Deploy & host apps' },
  { name: 'Netlify', category: 'Dev Tools', url: 'https://app.netlify.com/user/applications', desc: 'Web hosting & serverless' },
  { name: 'Supabase', category: 'Database', url: 'https://supabase.com/dashboard/project/_/settings/api', desc: 'Postgres + Auth + Storage' },
  { name: 'Firebase', category: 'Database', url: 'https://console.firebase.google.com/', desc: 'Google backend platform' },
  { name: 'MongoDB Atlas', category: 'Database', url: 'https://cloud.mongodb.com/', desc: 'NoSQL document database' },
  { name: 'PlanetScale', category: 'Database', url: 'https://app.planetscale.com/', desc: 'Serverless MySQL' },
  { name: 'Upstash', category: 'Database', url: 'https://console.upstash.com/', desc: 'Serverless Redis & Kafka' },
  { name: 'Pinecone', category: 'Vector DB', url: 'https://app.pinecone.io/', desc: 'Vector database for AI' },
  { name: 'Weaviate', category: 'Vector DB', url: 'https://console.weaviate.cloud/', desc: 'Open source vector search' },
  { name: 'Qdrant', category: 'Vector DB', url: 'https://cloud.qdrant.io/', desc: 'Vector similarity search' },
  { name: 'Stripe', category: 'Payments', url: 'https://dashboard.stripe.com/apikeys', desc: 'Payment processing' },
  { name: 'PayPal', category: 'Payments', url: 'https://developer.paypal.com/', desc: 'Online payments' },
  { name: 'Lemonsqueezy', category: 'Payments', url: 'https://app.lemonsqueezy.com/settings/api', desc: 'Digital product payments' },
  { name: 'AWS', category: 'Cloud', url: 'https://console.aws.amazon.com/iam/', desc: 'Amazon cloud services' },
  { name: 'Google Cloud', category: 'Cloud', url: 'https://console.cloud.google.com/apis/credentials', desc: 'Google cloud platform' },
  { name: 'Azure', category: 'Cloud', url: 'https://portal.azure.com/', desc: 'Microsoft cloud' },
  { name: 'Cloudflare', category: 'Cloud', url: 'https://dash.cloudflare.com/profile/api-tokens', desc: 'CDN, DNS, Workers' },
  { name: 'DigitalOcean', category: 'Cloud', url: 'https://cloud.digitalocean.com/account/api/tokens', desc: 'Simple cloud hosting' },
  { name: 'Twilio', category: 'Communication', url: 'https://console.twilio.com/', desc: 'SMS, Voice, Video APIs' },
  { name: 'SendGrid', category: 'Communication', url: 'https://app.sendgrid.com/settings/api_keys', desc: 'Email delivery' },
  { name: 'Mailgun', category: 'Communication', url: 'https://app.mailgun.com/app/account/security/api_keys', desc: 'Transactional email' },
  { name: 'Resend', category: 'Communication', url: 'https://resend.com/api-keys', desc: 'Developer-first email' },
  { name: 'Slack', category: 'Productivity', url: 'https://api.slack.com/apps', desc: 'Team communication' },
  { name: 'Discord', category: 'Productivity', url: 'https://discord.com/developers/applications', desc: 'Community platform' },
  { name: 'Telegram', category: 'Productivity', url: 'https://core.telegram.org/bots#botfather', desc: 'Messaging platform' },
  { name: 'Notion', category: 'Productivity', url: 'https://www.notion.so/my-integrations', desc: 'Workspace & docs' },
  { name: 'Airtable', category: 'Productivity', url: 'https://airtable.com/create/tokens', desc: 'Database spreadsheet' },
  { name: 'Linear', category: 'Productivity', url: 'https://linear.app/settings/api', desc: 'Issue tracking' },
  { name: 'RapidAPI', category: 'API Hub', url: 'https://rapidapi.com/developer/dashboard', desc: '40k+ APIs marketplace' },
  { name: 'Apify', category: 'Scraping', url: 'https://console.apify.com/account/integrations', desc: 'Web scraping platform' },
  { name: 'ScrapingBee', category: 'Scraping', url: 'https://app.scrapingbee.com/account/api', desc: 'Web scraping API' },
  { name: 'Serper', category: 'Search', url: 'https://serper.dev/api-key', desc: 'Google search API' },
  { name: 'SerpAPI', category: 'Search', url: 'https://serpapi.com/manage-api-key', desc: 'Search engine results' },
  { name: 'Unsplash', category: 'Media', url: 'https://unsplash.com/oauth/applications', desc: 'Free stock photos' },
  { name: 'Pexels', category: 'Media', url: 'https://www.pexels.com/api/', desc: 'Free photos & videos' },
  { name: 'Giphy', category: 'Media', url: 'https://developers.giphy.com/dashboard/', desc: 'GIF search & share' },
  { name: 'Imgix', category: 'Media', url: 'https://dashboard.imgix.com/api-keys', desc: 'Image processing CDN' },
  { name: 'Mapbox', category: 'Location', url: 'https://account.mapbox.com/access-tokens/', desc: 'Maps & location' },
  { name: 'OpenWeather', category: 'Data', url: 'https://home.openweathermap.org/api_keys', desc: 'Weather data API' },
  { name: 'NewsAPI', category: 'Data', url: 'https://newsapi.org/account', desc: 'News articles API' },
  { name: 'Alpha Vantage', category: 'Finance', url: 'https://www.alphavantage.co/support/#api-key', desc: 'Stock market data' },
  { name: 'CoinGecko', category: 'Finance', url: 'https://www.coingecko.com/en/api', desc: 'Crypto market data' }
]

export default function WalletPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [activeTab, setActiveTab] = useState<'wallet' | 'tester' | 'suggestions'>('wallet')
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Form state
  const [formName, setFormName] = useState('')
  const [formService, setFormService] = useState('')
  const [formKey, setFormKey] = useState('')

  // API Tester state
  const [testUrl, setTestUrl] = useState('')
  const [testMethod, setTestMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET')
  const [testHeaders, setTestHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
  const [testBody, setTestBody] = useState('')
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [selectedKeyForTest, setSelectedKeyForTest] = useState<string>('')

  // Suggestions filter
  const [suggestionCategory, setSuggestionCategory] = useState('All')

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadKeys()
  }, [])

  const loadKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', 'basel')
        .order('service', { ascending: true })
      
      if (data) setKeys(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading keys:', error)
      const saved = localStorage.getItem('basel_api_keys')
      if (saved) setKeys(JSON.parse(saved))
    }
  }

  const saveKey = async (apiKey: ApiKey) => {
    try {
      await supabase.from('api_keys').upsert({
        ...apiKey,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving key:', error)
    }
    const updated = keys.filter(k => k.id !== apiKey.id)
    const newKeys = [...updated, apiKey].sort((a, b) => a.service.localeCompare(b.service))
    setKeys(newKeys)
    localStorage.setItem('basel_api_keys', JSON.stringify(newKeys))
  }

  const handleSubmit = () => {
    if (!formName.trim() || !formService.trim() || !formKey.trim()) {
      alert('Please fill all fields')
      return
    }

    const apiKey: ApiKey = {
      id: editingKey?.id || `key_${Date.now()}`,
      name: formName.trim(),
      service: formService.trim().toLowerCase(),
      key: formKey.trim(),
      created_at: editingKey?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    saveKey(apiKey)
    resetForm()
  }

  const resetForm = () => {
    setFormName('')
    setFormService('')
    setFormKey('')
    setEditingKey(null)
    setShowForm(false)
  }

  const editKey = (key: ApiKey) => {
    setEditingKey(key)
    setFormName(key.name)
    setFormService(key.service)
    setFormKey(key.key)
    setShowForm(true)
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Delete this API key?')) return
    
    try {
      await supabase.from('api_keys').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting key:', error)
    }
    
    const updated = keys.filter(k => k.id !== id)
    setKeys(updated)
    localStorage.setItem('basel_api_keys', JSON.stringify(updated))
  }

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getIcon = (service: string) => {
    const lower = service.toLowerCase()
    for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
      if (lower.includes(key)) return icon
    }
    return SERVICE_ICONS.default
  }

  const maskKey = (key: string) => {
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4)
  }

  const exportKeys = () => {
    const data = JSON.stringify(keys, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-keys-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importKeys = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        const merged = [...imported, ...keys]
        const unique = merged.filter((key, index, self) => 
          index === self.findIndex(k => k.id === key.id)
        )
        setKeys(unique)
        localStorage.setItem('basel_api_keys', JSON.stringify(unique))
        unique.forEach((key: ApiKey) => saveKey(key))
        alert('Keys imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
  }

  // API Tester
  const runTest = async () => {
    if (!testUrl) {
      alert('Please enter a URL')
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      let headers: Record<string, string> = {}
      try {
        headers = JSON.parse(testHeaders)
      } catch {
        // Invalid JSON, use empty headers
      }

      // Add selected API key if chosen
      if (selectedKeyForTest) {
        const selectedKey = keys.find(k => k.id === selectedKeyForTest)
        if (selectedKey) {
          headers['Authorization'] = `Bearer ${selectedKey.key}`
        }
      }

      let body = undefined
      if (testMethod !== 'GET' && testBody) {
        try {
          body = JSON.parse(testBody)
        } catch {
          body = testBody
        }
      }

      const response = await fetch('/api/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: testUrl,
          method: testMethod,
          headers,
          body
        })
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error: any) {
      setTestResult({
        success: false,
        status: 0,
        statusText: 'Error',
        data: { error: error.message }
      })
    } finally {
      setIsTesting(false)
    }
  }

  // Filter keys
  const filteredKeys = keys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group by service
  const groupedKeys = filteredKeys.reduce((acc, key) => {
    const service = key.service
    if (!acc[service]) acc[service] = []
    acc[service].push(key)
    return acc
  }, {} as Record<string, ApiKey[]>)

  // Filter suggestions
  const categories = ['All', ...new Set(API_SUGGESTIONS.map(s => s.category))]
  const filteredSuggestions = suggestionCategory === 'All' 
    ? API_SUGGESTIONS 
    : API_SUGGESTIONS.filter(s => s.category === suggestionCategory)

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              🔑 API Wallet
            </h1>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'wallet' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiKey className="inline mr-2" />
              My Keys
            </button>
            <button
              onClick={() => setActiveTab('tester')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tester' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiZap className="inline mr-2" />
              API Tester
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'suggestions' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiLink className="inline mr-2" />
              50+ APIs
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        
        {/* ==================== WALLET TAB ==================== */}
        {activeTab === 'wallet' && (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search keys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportKeys}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                >
                  <FiDownload /> Export
                </button>
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
                  <FiUpload /> Import
                  <input type="file" accept=".json" onChange={importKeys} className="hidden" />
                </label>
                <button
                  onClick={() => { resetForm(); setShowForm(true) }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg"
                >
                  <FiPlus /> Add Key
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
              <FiShield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-200 font-medium">Secure API Key Storage</p>
                <p className="text-sm text-blue-300/70 mt-1">
                  Store API keys securely. Use the API Tester tab to test endpoints. Check Suggestions for 50+ popular APIs.
                </p>
              </div>
            </div>

            {/* Keys List */}
            {Object.keys(groupedKeys).length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FiKey className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No API keys saved</p>
                <p className="text-sm mt-2">Add your first API key to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedKeys).map(([service, serviceKeys]) => (
                  <div key={service}>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span>{getIcon(service)}</span> {service}
                    </h3>
                    <div className="space-y-2">
                      {serviceKeys.map(key => (
                        <div
                          key={key.id}
                          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                                {getIcon(key.service)}
                              </div>
                              <div>
                                <p className="font-medium">{key.name}</p>
                                <p className="text-sm text-gray-400 font-mono">
                                  {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedKeyForTest(key.id)
                                  setActiveTab('tester')
                                }}
                                className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                                title="Test this key"
                              >
                                <FiZap />
                              </button>
                              <button
                                onClick={() => toggleVisibility(key.id)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title={visibleKeys.has(key.id) ? 'Hide' : 'Show'}
                              >
                                {visibleKeys.has(key.id) ? <FiEyeOff /> : <FiEye />}
                              </button>
                              <button
                                onClick={() => copyKey(key.id, key.key)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="Copy"
                              >
                                {copiedId === key.id ? <FiCheck className="text-green-400" /> : <FiCopy />}
                              </button>
                              <button
                                onClick={() => editKey(key)}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => deleteKey(key.id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ==================== API TESTER TAB ==================== */}
        {activeTab === 'tester' && (
          <div className="space-y-6">
            {/* Tester Header */}
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
              <FiZap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-200 font-medium">API Tester</p>
                <p className="text-sm text-green-300/70 mt-1">
                  Test any API endpoint. Select a saved key to auto-add Authorization header.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Panel */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FiSend /> Request
                </h3>

                {/* URL & Method */}
                <div className="flex gap-2">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value as any)}
                    className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Use Saved Key */}
                {keys.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Use Saved API Key (auto Bearer token)</label>
                    <select
                      value={selectedKeyForTest}
                      onChange={(e) => setSelectedKeyForTest(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                    >
                      <option value="">None - Manual headers only</option>
                      {keys.map(key => (
                        <option key={key.id} value={key.id}>
                          {getIcon(key.service)} {key.name} ({key.service})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Headers */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Headers (JSON)</label>
                  <textarea
                    value={testHeaders}
                    onChange={(e) => setTestHeaders(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:outline-none focus:border-green-500"
                    placeholder='{"Content-Type": "application/json"}'
                  />
                </div>

                {/* Body */}
                {testMethod !== 'GET' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Body (JSON)</label>
                    <textarea
                      value={testBody}
                      onChange={(e) => setTestBody(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:outline-none focus:border-green-500"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                )}

                {/* Send Button */}
                <button
                  onClick={runTest}
                  disabled={isTesting}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend /> Send Request
                    </>
                  )}
                </button>
              </div>

              {/* Response Panel */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FiCode /> Response
                </h3>

                {testResult ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    {/* Status Bar */}
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      testResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        {testResult.success ? (
                          <FiCheckCircle className="text-green-400" />
                        ) : (
                          <FiXCircle className="text-red-400" />
                        )}
                        <span className={`font-mono font-bold ${
                          testResult.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {testResult.status} {testResult.statusText}
                        </span>
                      </div>
                      {testResult.time && (
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <FiClock /> {testResult.time}ms
                        </span>
                      )}
                    </div>

                    {/* Response Body */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Response Body</span>
                        <button
                          onClick={() => copyText(JSON.stringify(testResult.data, null, 2))}
                          className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <FiCopy /> Copy
                        </button>
                      </div>
                      <pre className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96 text-sm font-mono text-gray-300">
                        {typeof testResult.data === 'string' 
                          ? testResult.data 
                          : JSON.stringify(testResult.data, null, 2)
                        }
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center text-gray-500">
                    <FiCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Send a request to see the response</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUGGESTIONS TAB ==================== */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            {/* Suggestions Header */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-start gap-3">
              <FiLink className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-purple-200 font-medium">50+ Popular APIs</p>
                <p className="text-sm text-purple-300/70 mt-1">
                  Discover APIs for AI, payments, databases, communication, and more. Click to get your key!
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSuggestionCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    suggestionCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* API Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuggestions.map((api, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {getIcon(api.name.toLowerCase())} {api.name}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-400">
                        {api.category}
                      </span>
                    </div>
                    <a
                      href={api.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{api.desc}</p>
                  <button
                    onClick={() => {
                      setFormService(api.name.toLowerCase())
                      setFormName(`My ${api.name} Key`)
                      setShowForm(true)
                      setActiveTab('wallet')
                    }}
                    className="mt-3 w-full py-2 bg-gray-700 hover:bg-purple-600 rounded-lg text-sm transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiPlus className="inline mr-1" /> Add to Wallet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiKey /> {editingKey ? 'Edit API Key' : 'Add API Key'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-lg">
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., My OpenAI Key"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service</label>
                  <input
                    type="text"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    placeholder="e.g., OpenAI, GitHub, Vercel"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">API Key</label>
                  <input
                    type="password"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingKey ? 'Update Key' : 'Save Key'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

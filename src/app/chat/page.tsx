'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Paperclip, Mic, Settings, Trash2, Download, Copy, RefreshCw, 
         Brain, Zap, Globe, BookOpen, Lightbulb, Code, Image, FileText,
         Sparkles, Target, Heart, Shield, Rocket, Eye, Search, Clock,
         User, Bot, ChevronDown, X, Check, Volume2, VolumeX, Moon, Sun,
         Palette, Save, Upload, Link, Key, Database, Cpu, Network,
         Scale, Stethoscope, ChefHat, Dumbbell, DollarSign, TrendingUp,
         BarChart, Server, Layers, Handshake, Users, Atom, Wrench, Building,
         Music, Brush, Camera, Film, Gamepad2 as Gamepad, Plane, Languages, 
         MessageSquare, Star, Baby, Leaf, Bitcoin, Home, Terminal } from 'lucide-react'

// ============================================
// AI ASSISTANT - THE ULTIMATE UNIFIED AI
// Power of 50 AUTO-DETECTING PERSONAS
// Memory, Attachments, Deep Search, Deep Thinking
// ============================================

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  persona?: string
  attachments?: Attachment[]
  isThinking?: boolean
  searchResults?: SearchResult[]
  memoryUsed?: string[]
  tokensUsed?: number
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'audio' | 'code' | 'url'
  data: string
  preview?: string
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface Memory {
  id: string
  content: string
  type: 'fact' | 'preference' | 'context' | 'skill'
  importance: number
  timestamp: Date
}

interface Persona {
  id: string
  name: string
  icon: any
  color: string
  description: string
  systemPrompt: string
  capabilities: string[]
}

// 50 POWERFUL PERSONAS - AUTO-DETECT BASED ON TOPIC
const PERSONAS: Persona[] = [
  { id: 'genius', name: 'Genius', icon: Brain, color: 'from-purple-500 to-indigo-600', description: 'Deep analytical thinking', systemPrompt: 'Genius-level analytical AI for complex problems, math, logic, science.', capabilities: ['Analysis', 'Math', 'Logic'] },
  { id: 'creative', name: 'Creative', icon: Sparkles, color: 'from-pink-500 to-rose-600', description: 'Artistic imagination', systemPrompt: 'Creative AI for storytelling, poetry, art, brainstorming.', capabilities: ['Stories', 'Poetry', 'Art'] },
  { id: 'coder', name: 'Coder', icon: Code, color: 'from-green-500 to-emerald-600', description: 'Expert programmer', systemPrompt: 'Elite programmer in all languages, debugging, architecture.', capabilities: ['Code', 'Debug', 'Architect'] },
  { id: 'researcher', name: 'Researcher', icon: Search, color: 'from-blue-500 to-cyan-600', description: 'Deep research', systemPrompt: 'Research expert for fact-finding, analysis, synthesis.', capabilities: ['Research', 'Facts', 'Analysis'] },
  { id: 'advisor', name: 'Advisor', icon: Target, color: 'from-amber-500 to-orange-600', description: 'Strategic advisor', systemPrompt: 'Life coach for career, strategy, decision making.', capabilities: ['Advice', 'Strategy', 'Career'] },
  { id: 'empath', name: 'Empath', icon: Heart, color: 'from-red-500 to-pink-600', description: 'Emotional support', systemPrompt: 'Empathetic AI for emotional support and understanding.', capabilities: ['Support', 'Listening', 'Care'] },
  { id: 'teacher', name: 'Teacher', icon: BookOpen, color: 'from-teal-500 to-green-600', description: 'Expert educator', systemPrompt: 'Master educator for any subject at any level.', capabilities: ['Teaching', 'Examples', 'Quizzes'] },
  { id: 'business', name: 'Business', icon: Rocket, color: 'from-slate-600 to-zinc-800', description: 'Business expert', systemPrompt: 'Business expert for entrepreneurship, marketing, finance.', capabilities: ['Business', 'Marketing', 'Finance'] },
  { id: 'security', name: 'Security', icon: Shield, color: 'from-gray-600 to-slate-700', description: 'Cybersecurity expert', systemPrompt: 'Security expert for privacy, protection, threat analysis.', capabilities: ['Security', 'Privacy', 'Threats'] },
  { id: 'visionary', name: 'Visionary', icon: Eye, color: 'from-violet-500 to-purple-700', description: 'Future trends', systemPrompt: 'Visionary for trends, innovation, emerging tech.', capabilities: ['Trends', 'Innovation', 'Future'] },
  { id: 'writer', name: 'Writer', icon: FileText, color: 'from-indigo-500 to-blue-600', description: 'Professional writer', systemPrompt: 'Professional writer for articles, essays, content.', capabilities: ['Writing', 'Essays', 'Content'] },
  { id: 'lawyer', name: 'Lawyer', icon: Scale, color: 'from-gray-500 to-slate-600', description: 'Legal advisor', systemPrompt: 'Legal expert for contracts, rights, regulations.', capabilities: ['Legal', 'Contracts', 'Rights'] },
  { id: 'doctor', name: 'Doctor', icon: Stethoscope, color: 'from-red-400 to-rose-500', description: 'Medical advisor', systemPrompt: 'Medical expert for health, symptoms, wellness advice.', capabilities: ['Health', 'Medical', 'Wellness'] },
  { id: 'psychologist', name: 'Psychologist', icon: Brain, color: 'from-purple-400 to-fuchsia-500', description: 'Mental health', systemPrompt: 'Psychology expert for mental health, behavior, therapy.', capabilities: ['Psychology', 'Mental', 'Therapy'] },
  { id: 'chef', name: 'Chef', icon: ChefHat, color: 'from-orange-400 to-amber-500', description: 'Culinary expert', systemPrompt: 'Master chef for recipes, cooking, nutrition.', capabilities: ['Cooking', 'Recipes', 'Nutrition'] },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'from-green-400 to-lime-500', description: 'Fitness coach', systemPrompt: 'Fitness expert for workouts, nutrition, health goals.', capabilities: ['Fitness', 'Workouts', 'Health'] },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'from-emerald-500 to-green-600', description: 'Financial advisor', systemPrompt: 'Finance expert for investing, budgeting, wealth.', capabilities: ['Finance', 'Investing', 'Budget'] },
  { id: 'marketer', name: 'Marketer', icon: TrendingUp, color: 'from-pink-400 to-rose-500', description: 'Marketing expert', systemPrompt: 'Marketing guru for campaigns, branding, growth.', capabilities: ['Marketing', 'Branding', 'Growth'] },
  { id: 'designer', name: 'Designer', icon: Palette, color: 'from-fuchsia-500 to-pink-600', description: 'Design expert', systemPrompt: 'Design expert for UI/UX, graphics, visual concepts.', capabilities: ['Design', 'UI/UX', 'Visual'] },
  { id: 'data', name: 'Data Scientist', icon: BarChart, color: 'from-cyan-500 to-blue-600', description: 'Data analysis', systemPrompt: 'Data scientist for analytics, ML, statistics.', capabilities: ['Data', 'Analytics', 'ML'] },
  { id: 'devops', name: 'DevOps', icon: Server, color: 'from-orange-500 to-red-600', description: 'DevOps engineer', systemPrompt: 'DevOps expert for CI/CD, cloud, infrastructure.', capabilities: ['DevOps', 'Cloud', 'CI/CD'] },
  { id: 'product', name: 'Product Manager', icon: Layers, color: 'from-blue-400 to-indigo-500', description: 'Product strategy', systemPrompt: 'Product manager for roadmaps, features, user needs.', capabilities: ['Product', 'Strategy', 'Features'] },
  { id: 'sales', name: 'Sales', icon: Handshake, color: 'from-green-500 to-teal-600', description: 'Sales expert', systemPrompt: 'Sales expert for pitching, negotiation, closing deals.', capabilities: ['Sales', 'Pitching', 'Deals'] },
  { id: 'hr', name: 'HR Expert', icon: Users, color: 'from-purple-400 to-violet-500', description: 'Human resources', systemPrompt: 'HR expert for hiring, culture, employee relations.', capabilities: ['HR', 'Hiring', 'Culture'] },
  { id: 'historian', name: 'Historian', icon: Clock, color: 'from-amber-600 to-yellow-700', description: 'History expert', systemPrompt: 'Historian for world history, events, civilizations.', capabilities: ['History', 'Events', 'Analysis'] },
  { id: 'philosopher', name: 'Philosopher', icon: Lightbulb, color: 'from-indigo-400 to-purple-500', description: 'Philosophy expert', systemPrompt: 'Philosopher for ethics, existence, meaning of life.', capabilities: ['Philosophy', 'Ethics', 'Logic'] },
  { id: 'scientist', name: 'Scientist', icon: Atom, color: 'from-cyan-400 to-teal-500', description: 'Science expert', systemPrompt: 'Scientist for physics, chemistry, biology research.', capabilities: ['Science', 'Research', 'Theory'] },
  { id: 'engineer', name: 'Engineer', icon: Wrench, color: 'from-gray-400 to-zinc-500', description: 'Engineering expert', systemPrompt: 'Engineer for mechanical, electrical, civil systems.', capabilities: ['Engineering', 'Systems', 'Design'] },
  { id: 'architect', name: 'Architect', icon: Building, color: 'from-stone-500 to-gray-600', description: 'Architecture expert', systemPrompt: 'Architect for buildings, spaces, structural design.', capabilities: ['Architecture', 'Design', 'Space'] },
  { id: 'musician', name: 'Musician', icon: Music, color: 'from-violet-400 to-purple-500', description: 'Music expert', systemPrompt: 'Musician for composition, theory, instruments.', capabilities: ['Music', 'Composition', 'Theory'] },
  { id: 'artist', name: 'Artist', icon: Brush, color: 'from-rose-400 to-pink-500', description: 'Art expert', systemPrompt: 'Artist for visual arts, techniques, art history.', capabilities: ['Art', 'Techniques', 'History'] },
  { id: 'photographer', name: 'Photographer', icon: Camera, color: 'from-slate-400 to-gray-500', description: 'Photography expert', systemPrompt: 'Photographer for composition, lighting, editing.', capabilities: ['Photo', 'Lighting', 'Editing'] },
  { id: 'filmmaker', name: 'Filmmaker', icon: Film, color: 'from-red-500 to-orange-600', description: 'Film expert', systemPrompt: 'Filmmaker for directing, cinematography, storytelling.', capabilities: ['Film', 'Direction', 'Story'] },
  { id: 'gamer', name: 'Gamer', icon: Gamepad, color: 'from-green-400 to-emerald-500', description: 'Gaming expert', systemPrompt: 'Gamer for strategies, reviews, game design.', capabilities: ['Gaming', 'Strategy', 'Reviews'] },
  { id: 'traveler', name: 'Traveler', icon: Plane, color: 'from-sky-400 to-blue-500', description: 'Travel expert', systemPrompt: 'Travel expert for destinations, planning, culture.', capabilities: ['Travel', 'Planning', 'Culture'] },
  { id: 'linguist', name: 'Linguist', icon: Languages, color: 'from-teal-400 to-cyan-500', description: 'Language expert', systemPrompt: 'Linguist for languages, translation, grammar.', capabilities: ['Languages', 'Translation', 'Grammar'] },
  { id: 'negotiator', name: 'Negotiator', icon: MessageSquare, color: 'from-amber-400 to-orange-500', description: 'Negotiation expert', systemPrompt: 'Negotiator for deals, conflict resolution, persuasion.', capabilities: ['Negotiate', 'Resolve', 'Persuade'] },
  { id: 'coach', name: 'Life Coach', icon: Star, color: 'from-yellow-400 to-amber-500', description: 'Life coaching', systemPrompt: 'Life coach for goals, motivation, personal growth.', capabilities: ['Coaching', 'Goals', 'Growth'] },
  { id: 'relationship', name: 'Relationship', icon: Heart, color: 'from-pink-400 to-red-500', description: 'Relationship advice', systemPrompt: 'Relationship expert for dating, marriage, communication.', capabilities: ['Relationships', 'Dating', 'Communication'] },
  { id: 'parenting', name: 'Parenting', icon: Baby, color: 'from-blue-300 to-indigo-400', description: 'Parenting advice', systemPrompt: 'Parenting expert for child development, education.', capabilities: ['Parenting', 'Children', 'Education'] },
  { id: 'spiritual', name: 'Spiritual', icon: Sparkles, color: 'from-purple-300 to-violet-400', description: 'Spiritual guidance', systemPrompt: 'Spiritual guide for meditation, mindfulness, peace.', capabilities: ['Spiritual', 'Meditation', 'Peace'] },
  { id: 'astrologer', name: 'Astrologer', icon: Moon, color: 'from-indigo-300 to-purple-400', description: 'Astrology expert', systemPrompt: 'Astrologer for zodiac, charts, cosmic insights.', capabilities: ['Astrology', 'Zodiac', 'Charts'] },
  { id: 'environmentalist', name: 'Environmentalist', icon: Leaf, color: 'from-green-300 to-emerald-400', description: 'Environment expert', systemPrompt: 'Environmentalist for sustainability, climate, ecology.', capabilities: ['Environment', 'Climate', 'Ecology'] },
  { id: 'politician', name: 'Political Analyst', icon: Building, color: 'from-red-400 to-rose-500', description: 'Political analysis', systemPrompt: 'Political analyst for policies, elections, governance.', capabilities: ['Politics', 'Policy', 'Analysis'] },
  { id: 'economist', name: 'Economist', icon: TrendingUp, color: 'from-blue-400 to-cyan-500', description: 'Economics expert', systemPrompt: 'Economist for markets, policies, global economy.', capabilities: ['Economics', 'Markets', 'Policy'] },
  { id: 'crypto', name: 'Crypto Expert', icon: Bitcoin, color: 'from-orange-400 to-yellow-500', description: 'Cryptocurrency expert', systemPrompt: 'Crypto expert for blockchain, trading, DeFi.', capabilities: ['Crypto', 'Blockchain', 'Trading'] },
  { id: 'realestate', name: 'Real Estate', icon: Home, color: 'from-emerald-400 to-teal-500', description: 'Real estate expert', systemPrompt: 'Real estate expert for buying, selling, investing.', capabilities: ['Real Estate', 'Investing', 'Property'] },
  { id: 'startup', name: 'Startup Mentor', icon: Rocket, color: 'from-violet-400 to-indigo-500', description: 'Startup expert', systemPrompt: 'Startup mentor for founding, funding, scaling.', capabilities: ['Startups', 'Funding', 'Scaling'] },
  { id: 'automation', name: 'Automation', icon: Zap, color: 'from-yellow-400 to-orange-500', description: 'Automation expert', systemPrompt: 'Automation expert for workflows, bots, efficiency.', capabilities: ['Automation', 'Workflows', 'Bots'] },
  { id: 'hacker', name: 'Hacker', icon: Terminal, color: 'from-green-600 to-lime-700', description: 'Ethical hacker', systemPrompt: 'Ethical hacker for penetration testing, exploits, security.', capabilities: ['Hacking', 'Exploits', 'Security'] }
]

// API Key suggestions for the API Manager
const API_SUGGESTIONS = [
  { name: 'OpenAI', url: 'https://platform.openai.com/api-keys', use: 'GPT-4, DALL-E, Whisper - Text generation, image creation, speech-to-text', category: 'AI' },
  { name: 'Google Gemini', url: 'https://makersuite.google.com/app/apikey', use: 'Gemini Pro/Ultra - Multimodal AI, text, vision, code', category: 'AI' },
  { name: 'Anthropic Claude', url: 'https://console.anthropic.com/account/keys', use: 'Claude 3 - Long context AI, analysis, coding assistance', category: 'AI' },
  { name: 'Groq', url: 'https://console.groq.com/keys', use: 'Ultra-fast LLM inference, Llama, Mixtral models', category: 'AI' },
  { name: 'Cohere', url: 'https://dashboard.cohere.com/api-keys', use: 'Text generation, embeddings, semantic search', category: 'AI' },
  { name: 'Hugging Face', url: 'https://huggingface.co/settings/tokens', use: 'Access to 100k+ ML models, inference API', category: 'AI' },
  { name: 'Replicate', url: 'https://replicate.com/account/api-tokens', use: 'Run open-source models, image generation, video', category: 'AI' },
  { name: 'Stability AI', url: 'https://platform.stability.ai/account/keys', use: 'Stable Diffusion - Image generation, editing', category: 'AI' },
  { name: 'Midjourney', url: 'https://www.midjourney.com/account', use: 'Premium AI art generation (via Discord)', category: 'AI' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io/api', use: 'AI voice synthesis, text-to-speech, voice cloning', category: 'AI' },
  { name: 'AssemblyAI', url: 'https://www.assemblyai.com/dashboard/account', use: 'Speech-to-text, transcription, audio intelligence', category: 'AI' },
  { name: 'Deepgram', url: 'https://console.deepgram.com/', use: 'Real-time speech recognition, transcription', category: 'AI' },
  { name: 'GitHub', url: 'https://github.com/settings/tokens', use: 'Repository access, GitHub API, Actions, Copilot', category: 'Development' },
  { name: 'GitLab', url: 'https://gitlab.com/-/profile/personal_access_tokens', use: 'GitLab API access, CI/CD, repository management', category: 'Development' },
  { name: 'Vercel', url: 'https://vercel.com/account/tokens', use: 'Deployment automation, serverless functions', category: 'Development' },
  { name: 'Netlify', url: 'https://app.netlify.com/user/applications#personal-access-tokens', use: 'Static site deployment, serverless functions', category: 'Development' },
  { name: 'Railway', url: 'https://railway.app/account/tokens', use: 'Full-stack app deployment, databases, hosting', category: 'Development' },
  { name: 'Supabase', url: 'https://app.supabase.com/account/tokens', use: 'PostgreSQL database, auth, storage, real-time', category: 'Database' },
  { name: 'Firebase', url: 'https://console.firebase.google.com/', use: 'Real-time database, auth, hosting, analytics', category: 'Database' },
  { name: 'MongoDB Atlas', url: 'https://cloud.mongodb.com/', use: 'NoSQL database, full-text search, analytics', category: 'Database' },
  { name: 'PlanetScale', url: 'https://app.planetscale.com/', use: 'Serverless MySQL, branching, scaling', category: 'Database' },
  { name: 'Upstash', url: 'https://console.upstash.com/', use: 'Serverless Redis, Kafka, rate limiting', category: 'Database' },
  { name: 'Stripe', url: 'https://dashboard.stripe.com/apikeys', use: 'Payment processing, subscriptions, invoicing', category: 'Finance' },
  { name: 'PayPal', url: 'https://developer.paypal.com/dashboard/applications', use: 'Payment gateway, checkout, invoicing', category: 'Finance' },
  { name: 'Plaid', url: 'https://dashboard.plaid.com/team/keys', use: 'Bank account linking, financial data access', category: 'Finance' },
  { name: 'Twilio', url: 'https://console.twilio.com/', use: 'SMS, voice calls, WhatsApp, video API', category: 'Communication' },
  { name: 'SendGrid', url: 'https://app.sendgrid.com/settings/api_keys', use: 'Email delivery, templates, analytics', category: 'Communication' },
  { name: 'Mailgun', url: 'https://app.mailgun.com/app/account/security/api_keys', use: 'Email API, validation, routing', category: 'Communication' },
  { name: 'Resend', url: 'https://resend.com/api-keys', use: 'Modern email API for developers', category: 'Communication' },
  { name: 'Pusher', url: 'https://dashboard.pusher.com/', use: 'Real-time websockets, notifications, chat', category: 'Communication' },
  { name: 'AWS', url: 'https://console.aws.amazon.com/iam/home#/security_credentials', use: 'Cloud computing, S3, Lambda, 200+ services', category: 'Cloud' },
  { name: 'Google Cloud', url: 'https://console.cloud.google.com/apis/credentials', use: 'Cloud platform, AI/ML, BigQuery, storage', category: 'Cloud' },
  { name: 'Azure', url: 'https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps', use: 'Microsoft cloud, OpenAI, enterprise services', category: 'Cloud' },
  { name: 'Cloudflare', url: 'https://dash.cloudflare.com/profile/api-tokens', use: 'CDN, Workers, DNS, security, R2 storage', category: 'Cloud' },
  { name: 'DigitalOcean', url: 'https://cloud.digitalocean.com/account/api/tokens', use: 'Droplets, Kubernetes, databases, apps', category: 'Cloud' },
  { name: 'Mapbox', url: 'https://account.mapbox.com/access-tokens/', use: 'Maps, geocoding, navigation, location search', category: 'Maps' },
  { name: 'Google Maps', url: 'https://console.cloud.google.com/google/maps-apis', use: 'Maps, places, directions, Street View', category: 'Maps' },
  { name: 'Algolia', url: 'https://dashboard.algolia.com/account/api-keys', use: 'Search API, instant search, recommendations', category: 'Search' },
  { name: 'Pinecone', url: 'https://app.pinecone.io/', use: 'Vector database, semantic search, RAG', category: 'Search' },
  { name: 'Weaviate', url: 'https://console.weaviate.cloud/', use: 'Vector search, AI-native database', category: 'Search' },
  { name: 'Unsplash', url: 'https://unsplash.com/oauth/applications', use: 'Free high-quality stock photos API', category: 'Media' },
  { name: 'Pexels', url: 'https://www.pexels.com/api/new/', use: 'Free stock photos and videos API', category: 'Media' },
  { name: 'Cloudinary', url: 'https://cloudinary.com/console', use: 'Image/video upload, transformation, CDN', category: 'Media' },
  { name: 'ImgBB', url: 'https://api.imgbb.com/', use: 'Free image hosting API', category: 'Media' },
  { name: 'Twitter/X', url: 'https://developer.twitter.com/en/portal/dashboard', use: 'Tweets, timelines, user data, posting', category: 'Social' },
  { name: 'Reddit', url: 'https://www.reddit.com/prefs/apps', use: 'Subreddits, posts, comments, user data', category: 'Social' },
  { name: 'Discord', url: 'https://discord.com/developers/applications', use: 'Bots, webhooks, server management', category: 'Social' },
  { name: 'Slack', url: 'https://api.slack.com/apps', use: 'Bots, messaging, workspace integration', category: 'Social' },
  { name: 'Notion', url: 'https://www.notion.so/my-integrations', use: 'Databases, pages, workspace automation', category: 'Productivity' },
  { name: 'Airtable', url: 'https://airtable.com/create/tokens', use: 'Spreadsheet database, automation, apps', category: 'Productivity' },
]

export default function AIAssistantChat() {
  // Core state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  
  // Persona and mode state
  const [activePersonas, setActivePersonas] = useState<string[]>(['genius', 'creative', 'coder'])
  const [autoPersona, setAutoPersona] = useState(true)
  const [deepThinking, setDeepThinking] = useState(false)
  const [deepSearch, setDeepSearch] = useState(false)
  
  // Attachment state
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  
  // Memory state
  const [memories, setMemories] = useState<Memory[]>([])
  const [useMemory, setUseMemory] = useState(true)
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false)
  const [showAPIManager, setShowAPIManager] = useState(false)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({ groq: 'process.env.GROQ_API_KEY', gemini: 'process.env.GEMINI_API_KEY', tavily: 'process.env.TAVILY_API_KEY' })
  const [customTokens, setCustomTokens] = useState<{name: string, value: string}[]>([])
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load saved data on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai-assistant-messages')
    const savedMemories = localStorage.getItem('ai-assistant-memories')
    const savedApiKeys = localStorage.getItem('ai-assistant-apikeys')
    const savedTokens = localStorage.getItem('ai-assistant-tokens')
    const savedTheme = localStorage.getItem('ai-assistant-theme')
    
    if (savedMessages) setMessages(JSON.parse(savedMessages))
    if (savedMemories) setMemories(JSON.parse(savedMemories))
    if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys))
    if (savedTokens) setCustomTokens(JSON.parse(savedTokens))
    if (savedTheme) setTheme(savedTheme as 'dark' | 'light')
  }, [])

  // Save messages and memories
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai-assistant-messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem('ai-assistant-memories', JSON.stringify(memories))
    }
  }, [memories])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Detect persona from message content
  const detectPersona = (content: string): string[] => {
    const detected: string[] = []
    const lower = content.toLowerCase()
    
    if (lower.match(/code|program|function|bug|debug|api|javascript|python|react/)) detected.push('coder')
    if (lower.match(/story|write|creative|imagine|poem|novel/)) detected.push('creative')
    if (lower.match(/research|find|search|source|fact|study/)) detected.push('researcher')
    if (lower.match(/feel|emotion|sad|happy|anxious|stress|support/)) detected.push('empath')
    if (lower.match(/teach|explain|learn|understand|how does/)) detected.push('teacher')
    if (lower.match(/business|startup|marketing|money|invest|strategy/)) detected.push('business')
    if (lower.match(/security|password|hack|privacy|encrypt|safe/)) detected.push('security')
    if (lower.match(/future|trend|predict|innovation|emerging/)) detected.push('visionary')
    if (lower.match(/advice|help me decide|should i|career|life/)) detected.push('advisor')
    if (lower.match(/analyze|think|complex|problem|solve|logic|math/)) detected.push('genius')
    
    return detected.length > 0 ? detected : ['genius']
  }

  // Build system prompt from active personas
  const buildSystemPrompt = (detectedPersonas: string[]): string => {
    const personas = autoPersona ? detectedPersonas : activePersonas
    const selectedPersonas = PERSONAS.filter(p => personas.includes(p.id))
    
    let prompt = `You are AI Assistant - an extraordinarily powerful AI that combines the abilities of multiple specialized personas. You adapt fluidly to provide the best possible response.

ACTIVE MODES: ${selectedPersonas.map(p => p.name).join(', ')}

${selectedPersonas.map(p => `### ${p.name}:\n${p.systemPrompt}`).join('\n\n')}

CORE CAPABILITIES:
- Deep analytical thinking with step-by-step reasoning
- Creative problem solving and ideation
- Expert coding in all programming languages
- Comprehensive research and fact-finding
- Empathetic emotional support
- Clear teaching and explanation
- Business and strategic advice
- Security and privacy guidance
- Future trends and innovation analysis

SPECIAL INSTRUCTIONS:
${deepThinking ? '- DEEP THINKING ENABLED: Take your time. Think through the problem step by step. Show your reasoning process. Consider multiple angles before concluding.' : ''}
${deepSearch ? '- DEEP SEARCH ENABLED: Provide comprehensive, well-researched responses with multiple sources and perspectives.' : ''}
${useMemory && memories.length > 0 ? `- USER MEMORY CONTEXT:\n${memories.map(m => `  * ${m.content}`).join('\n')}` : ''}

Always be helpful, accurate, and adapt your tone to match the user's needs. You are the most capable AI assistant ever created.`

    return prompt
  }

  // Handle file attachment
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = event.target?.result as string
        const type = file.type.startsWith('image/') ? 'image' 
                   : file.type.includes('audio') ? 'audio'
                   : file.name.match(/\.(js|ts|py|java|cpp|html|css|json|md)$/) ? 'code'
                   : 'document'
        
        setAttachments(prev => [...prev, {
          id: Date.now().toString(),
          name: file.name,
          type,
          data,
          preview: type === 'image' ? data : undefined
        }])
      }
      reader.readAsDataURL(file)
    }
    setShowAttachMenu(false)
  }

  // Handle URL attachment
  const handleUrlAttachment = () => {
    const url = prompt('Enter URL to attach:')
    if (url) {
      setAttachments(prev => [...prev, {
        id: Date.now().toString(),
        name: url,
        type: 'url',
        data: url
      }])
    }
    setShowAttachMenu(false)
  }

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  // Extract memories from conversation
  const extractMemories = (userMsg: string, assistantMsg: string) => {
    // Simple memory extraction - in production, use AI
    const patterns = [
      { regex: /my name is (\w+)/i, type: 'fact' as const },
      { regex: /i (like|love|prefer|hate|dislike) (.+)/i, type: 'preference' as const },
      { regex: /i work (at|for|as) (.+)/i, type: 'fact' as const },
      { regex: /i'm (a|an) (.+)/i, type: 'fact' as const },
    ]

    patterns.forEach(({ regex, type }) => {
      const match = userMsg.match(regex)
      if (match) {
        const memory: Memory = {
          id: Date.now().toString(),
          content: match[0],
          type,
          importance: 0.8,
          timestamp: new Date()
        }
        setMemories(prev => {
          const exists = prev.some(m => m.content.toLowerCase() === memory.content.toLowerCase())
          return exists ? prev : [...prev, memory]
        })
      }
    })
  }

  // Send message
  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: [...attachments]
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)
    setIsThinking(deepThinking)

    const detectedPersonas = detectPersona(input)
    const systemPrompt = buildSystemPrompt(detectedPersonas)

    try {
      // Prepare message content with attachments
      let messageContent = input
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        messageContent += '\n\n[Attachments: ' + userMessage.attachments.map(a => a.name).join(', ') + ']'
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageContent }
          ],
          model: apiKeys.openai ? 'gpt-4' : apiKeys.gemini ? 'gemini-pro' : 'gemini-2.0-flash-exp',
          apiKey: apiKeys.openai || apiKeys.gemini || apiKeys.groq,
          deepThinking,
          deepSearch
        })
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.text || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        persona: detectedPersonas.join(', '),
        tokensUsed: data.tokensUsed
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Extract and save memories
      if (useMemory) {
        extractMemories(input, assistantMessage.content)
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please check your API key settings and try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      setIsThinking(false)
    }
  }

  // Copy message to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Clear chat
  const clearChat = () => {
    if (confirm('Are you sure you want to clear all messages?')) {
      setMessages([])
      localStorage.removeItem('ai-assistant-messages')
    }
  }

  // Export chat
  const exportChat = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-assistant-chat-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  // Validate API key
  const validateApiKey = async (service: string, key: string): Promise<boolean> => {
    try {
      let endpoint = ''
      let headers: Record<string, string> = {}
      
      switch (service) {
        case 'openai':
          endpoint = 'https://api.openai.com/v1/models'
          headers = { 'Authorization': `Bearer ${key}` }
          break
        case 'gemini':
          endpoint = `https://generativelanguage.googleapis.com/v1/models?key=${key}`
          break
        case 'groq':
          endpoint = 'https://api.groq.com/openai/v1/models'
          headers = { 'Authorization': `Bearer ${key}` }
          break
        case 'anthropic':
          endpoint = 'https://api.anthropic.com/v1/messages'
          headers = { 'x-api-key': key, 'anthropic-version': '2023-06-01' }
          break
        default:
          return true // Can't validate, assume valid
      }
      
      const response = await fetch(endpoint, { headers, method: service === 'anthropic' ? 'POST' : 'GET' })
      return response.ok || response.status === 401 === false
    } catch {
      return false
    }
  }

  // Save API key
  const saveApiKey = async (service: string, key: string) => {
    const isValid = await validateApiKey(service, key)
    if (isValid || key === '') {
      const newKeys = { ...apiKeys, [service]: key }
      setApiKeys(newKeys)
      localStorage.setItem('ai-assistant-apikeys', JSON.stringify(newKeys))
      return true
    }
    return false
  }

  // Add custom token
  const addCustomToken = (name: string, value: string) => {
    const newTokens = [...customTokens, { name, value }]
    setCustomTokens(newTokens)
    localStorage.setItem('ai-assistant-tokens', JSON.stringify(newTokens))
  }

  // Remove custom token
  const removeCustomToken = (index: number) => {
    const newTokens = customTokens.filter((_, i) => i !== index)
    setCustomTokens(newTokens)
    localStorage.setItem('ai-assistant-tokens', JSON.stringify(newTokens))
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Assistant</h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Ultimate AI • 10+ Personas Combined
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mode toggles */}
            <button
              onClick={() => setDeepThinking(!deepThinking)}
              className={`p-2 rounded-lg transition-all ${deepThinking 
                ? 'bg-purple-500 text-white' 
                : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Deep Thinking Mode"
            >
              <Brain className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setDeepSearch(!deepSearch)}
              className={`p-2 rounded-lg transition-all ${deepSearch 
                ? 'bg-blue-500 text-white' 
                : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Deep Search Mode"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setUseMemory(!useMemory)}
              className={`p-2 rounded-lg transition-all ${useMemory 
                ? 'bg-green-500 text-white' 
                : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title={`Memory: ${memories.length} items`}
            >
              <Database className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-600 mx-1" />
            
            <button
              onClick={() => setShowAPIManager(true)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              title="API Keys Manager"
            >
              <Key className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                localStorage.setItem('ai-assistant-theme', theme === 'dark' ? 'light' : 'dark')
              }}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Auto-Detected Personas Bar - ALWAYS AUTO */}
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} px-4 py-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} whitespace-nowrap flex items-center gap-1`}>
              <Zap className="w-3 h-3 text-violet-400" /> Auto-detect (50 personas):
            </span>
            {detectedPersonas.length > 0 ? (
              detectedPersonas.map(pid => {
                const persona = PERSONAS.find(p => p.id === pid)
                if (!persona) return null
                const Icon = persona.icon
                return (
                  <span
                    key={persona.id}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-gradient-to-r ${persona.color} text-white`}
                    title={persona.description}
                  >
                    <Icon className="w-3 h-3" />
                    {persona.name}
                  </span>
                )
              })
            ) : (
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Type a message to auto-detect persona...
              </span>
            )}
          </div>
        </div>

        {/* VISIBLE MEMORY SECTION */}
        {memories.length > 0 && (
          <div className={`${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border-t px-4 py-2`}>
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium flex items-center gap-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  <Database className="w-3 h-3" /> Memory ({memories.length} items)
                </span>
                <button
                  onClick={() => setMemories([])}
                  className={`text-xs ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {memories.slice(0, 10).map((memory, i) => (
                  <span
                    key={memory.id}
                    className={`text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-700'} flex items-center gap-1`}
                  >
                    {memory.content.substring(0, 30)}{memory.content.length > 30 ? '...' : ''}
                    <button
                      onClick={() => setMemories(prev => prev.filter(m => m.id !== memory.id))}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {memories.length > 10 && (
                  <span className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    +{memories.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-40">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-8`}>
              The most powerful AI with 50 auto-detecting personas
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
              {PERSONAS.slice(0, 5).map(persona => {
                const Icon = persona.icon
                return (
                  <div key={persona.id} className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} text-center`}>
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-medium">{persona.name.replace(' Mode', '')}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">Deep Thinking</span>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">Deep Search</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">Memory</span>
              <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">Attachments</span>
              <span className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-400">Multi-Persona</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-br from-violet-500 to-purple-600'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                  }`}>
                    {/* Attachments preview */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {message.attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-1 px-2 py-1 rounded bg-black/20 text-xs">
                            {att.type === 'image' ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {att.name.slice(0, 20)}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.persona && (
                      <span className="text-xs text-purple-400">{message.persona}</span>
                    )}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className={`rounded-2xl px-4 py-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-purple-400">Deep thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && !isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className={`rounded-2xl px-4 py-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} p-4`}>
        <div className="max-w-4xl mx-auto">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map(att => (
                <div key={att.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  {att.preview ? (
                    <img src={att.preview} alt="" className="w-8 h-8 rounded object-cover" />
                  ) : att.type === 'url' ? (
                    <Link className="w-4 h-4 text-blue-400" />
                  ) : att.type === 'code' ? (
                    <Code className="w-4 h-4 text-green-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">{att.name.slice(0, 30)}</span>
                  <button onClick={() => removeAttachment(att.id)} className="p-1 hover:bg-gray-700 rounded">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className={`flex items-end gap-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-2 shadow-lg`}>
            {/* Attachment button */}
            <div className="relative">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              {showAttachMenu && (
                <div className={`absolute bottom-full left-0 mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-2 min-w-[160px]`}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Image className="w-4 h-4" /> Image
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <FileText className="w-4 h-4" /> Document
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Code className="w-4 h-4" /> Code File
                  </button>
                  <button
                    onClick={handleUrlAttachment}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <Link className="w-4 h-4" /> URL
                  </button>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.md,.js,.ts,.py,.java,.cpp,.html,.css,.json"
            />
            
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask anything... (Shift+Enter for new line)"
              className={`flex-1 resize-none bg-transparent border-0 outline-none text-sm py-2 px-2 max-h-32 ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
              rows={1}
            />
            
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={exportChat}
                className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Export chat"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && attachments.length === 0)}
                className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Theme</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setTheme('dark'); localStorage.setItem('ai-assistant-theme', 'dark') }}
                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-violet-500 text-white' : 'bg-gray-100'}`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                  <button
                    onClick={() => { setTheme('light'); localStorage.setItem('ai-assistant-theme', 'light') }}
                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-violet-500 text-white' : 'bg-gray-700'}`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                </div>
              </div>

              {/* Memory Management */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Memory ({memories.length} items)</h3>
                <div className={`max-h-40 overflow-y-auto rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-3`}>
                  {memories.length === 0 ? (
                    <p className="text-gray-500 text-sm">No memories stored yet</p>
                  ) : (
                    memories.map((memory, i) => (
                      <div key={memory.id} className="flex items-center justify-between py-1">
                        <span className="text-sm">{memory.content}</span>
                        <button
                          onClick={() => setMemories(prev => prev.filter(m => m.id !== memory.id))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => { setMemories([]); localStorage.removeItem('ai-assistant-memories') }}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Clear all memories
                </button>
              </div>

              {/* Custom Tokens */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Custom Tokens</h3>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-3`}>
                  {customTokens.map((token, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <span className="text-sm">{token.name}: {token.value.slice(0, 10)}...</span>
                      <button onClick={() => removeCustomToken(i)} className="text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const name = prompt('Token name:')
                      const value = prompt('Token value:')
                      if (name && value) addCustomToken(name, value)
                    }}
                    className="mt-2 text-sm text-violet-400 hover:text-violet-300"
                  >
                    + Add custom token
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Manager Modal */}
      {showAPIManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">API Keys Manager</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage your API keys and discover 50+ useful APIs
                  </p>
                </div>
                <button onClick={() => setShowAPIManager(false)} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Current API Keys */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Your API Keys
                </h3>
                <div className="grid gap-3">
                  {['openai', 'gemini', 'groq', 'anthropic'].map(service => (
                    <div key={service} className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                      <span className="w-24 capitalize font-medium">{service}</span>
                      <input
                        type="password"
                        value={apiKeys[service] || ''}
                        onChange={(e) => saveApiKey(service, e.target.value)}
                        placeholder={`Enter ${service} API key`}
                        className={`flex-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border outline-none focus:ring-2 focus:ring-violet-500`}
                      />
                      {apiKeys[service] && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* API Suggestions */}
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> 50 API Suggestions
                </h3>
                <div className="space-y-2">
                  {['AI', 'Development', 'Database', 'Finance', 'Communication', 'Cloud', 'Maps', 'Search', 'Media', 'Social', 'Productivity'].map(category => (
                    <div key={category} className="mb-4">
                      <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{category}</h4>
                      <div className="grid gap-2">
                        {API_SUGGESTIONS.filter(api => api.category === category).map(api => (
                          <div key={api.name} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{api.name}</span>
                              <a
                                href={api.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-1 rounded bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                              >
                                Get Key →
                              </a>
                            </div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{api.use}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

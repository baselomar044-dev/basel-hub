'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { 
  Sparkles, Copy, Download, RefreshCw, Wand2, Zap,
  Code, Palette, BookOpen, Briefcase, GraduationCap, Heart,
  Brain, Target, Users, TrendingUp, Camera, Music, Film,
  Mic, PenTool, MessageSquare, Mail, FileText, Lightbulb,
  Shield, Scale, Microscope, Rocket, Globe, Building,
  DollarSign, ShoppingCart, Megaphone, LineChart, Wrench,
  Gamepad2, Utensils, Dumbbell, Leaf, Baby, Dog, Plane,
  Home, Car, Coffee, Gift, Calendar, Clock
} from 'lucide-react'

// 50+ Categories
const CATEGORIES = [
  // Creative
  { id: 'creative-writing', name: 'Creative Writing', icon: PenTool, color: 'bg-purple-500', group: 'Creative' },
  { id: 'storytelling', name: 'Storytelling', icon: BookOpen, color: 'bg-amber-500', group: 'Creative' },
  { id: 'poetry', name: 'Poetry', icon: Sparkles, color: 'bg-pink-500', group: 'Creative' },
  { id: 'screenwriting', name: 'Screenwriting', icon: Film, color: 'bg-red-500', group: 'Creative' },
  { id: 'songwriting', name: 'Songwriting', icon: Music, color: 'bg-rose-500', group: 'Creative' },
  { id: 'art-prompts', name: 'Art & Image', icon: Palette, color: 'bg-fuchsia-500', group: 'Creative' },
  { id: 'game-design', name: 'Game Design', icon: Gamepad2, color: 'bg-violet-500', group: 'Creative' },
  
  // Business
  { id: 'marketing', name: 'Marketing', icon: Megaphone, color: 'bg-orange-500', group: 'Business' },
  { id: 'sales', name: 'Sales & Pitches', icon: TrendingUp, color: 'bg-green-500', group: 'Business' },
  { id: 'business-strategy', name: 'Business Strategy', icon: Target, color: 'bg-blue-600', group: 'Business' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: Rocket, color: 'bg-cyan-500', group: 'Business' },
  { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingCart, color: 'bg-emerald-500', group: 'Business' },
  { id: 'finance', name: 'Finance & Investing', icon: DollarSign, color: 'bg-yellow-500', group: 'Business' },
  { id: 'hr', name: 'HR & Recruiting', icon: Users, color: 'bg-teal-500', group: 'Business' },
  { id: 'operations', name: 'Operations', icon: Wrench, color: 'bg-slate-500', group: 'Business' },
  
  // Technology
  { id: 'coding', name: 'Coding & Dev', icon: Code, color: 'bg-green-600', group: 'Technology' },
  { id: 'data-science', name: 'Data Science', icon: LineChart, color: 'bg-blue-500', group: 'Technology' },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, color: 'bg-violet-600', group: 'Technology' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'bg-red-600', group: 'Technology' },
  { id: 'devops', name: 'DevOps & Cloud', icon: Globe, color: 'bg-sky-500', group: 'Technology' },
  { id: 'product', name: 'Product Management', icon: Briefcase, color: 'bg-indigo-500', group: 'Technology' },
  
  // Communication
  { id: 'email', name: 'Email Writing', icon: Mail, color: 'bg-blue-400', group: 'Communication' },
  { id: 'social-media', name: 'Social Media', icon: MessageSquare, color: 'bg-pink-400', group: 'Communication' },
  { id: 'presentations', name: 'Presentations', icon: FileText, color: 'bg-orange-400', group: 'Communication' },
  { id: 'public-speaking', name: 'Public Speaking', icon: Mic, color: 'bg-red-400', group: 'Communication' },
  { id: 'copywriting', name: 'Copywriting', icon: PenTool, color: 'bg-amber-400', group: 'Communication' },
  { id: 'journalism', name: 'Journalism', icon: FileText, color: 'bg-gray-500', group: 'Communication' },
  
  // Education
  { id: 'teaching', name: 'Teaching', icon: GraduationCap, color: 'bg-blue-700', group: 'Education' },
  { id: 'learning', name: 'Learning & Study', icon: BookOpen, color: 'bg-emerald-600', group: 'Education' },
  { id: 'research', name: 'Research', icon: Microscope, color: 'bg-purple-600', group: 'Education' },
  { id: 'tutoring', name: 'Tutoring', icon: Users, color: 'bg-cyan-600', group: 'Education' },
  { id: 'course-creation', name: 'Course Creation', icon: Film, color: 'bg-rose-600', group: 'Education' },
  
  // Personal
  { id: 'self-improvement', name: 'Self-Improvement', icon: Target, color: 'bg-green-500', group: 'Personal' },
  { id: 'relationships', name: 'Relationships', icon: Heart, color: 'bg-red-500', group: 'Personal' },
  { id: 'career', name: 'Career & Jobs', icon: Briefcase, color: 'bg-blue-500', group: 'Personal' },
  { id: 'health', name: 'Health & Wellness', icon: Dumbbell, color: 'bg-emerald-500', group: 'Personal' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'bg-purple-400', group: 'Personal' },
  { id: 'productivity', name: 'Productivity', icon: Zap, color: 'bg-yellow-500', group: 'Personal' },
  
  // Lifestyle
  { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-sky-500', group: 'Lifestyle' },
  { id: 'food', name: 'Food & Cooking', icon: Utensils, color: 'bg-orange-500', group: 'Lifestyle' },
  { id: 'home', name: 'Home & Living', icon: Home, color: 'bg-amber-600', group: 'Lifestyle' },
  { id: 'fashion', name: 'Fashion & Style', icon: Gift, color: 'bg-pink-500', group: 'Lifestyle' },
  { id: 'parenting', name: 'Parenting', icon: Baby, color: 'bg-rose-400', group: 'Lifestyle' },
  { id: 'pets', name: 'Pets', icon: Dog, color: 'bg-amber-400', group: 'Lifestyle' },
  { id: 'sustainability', name: 'Sustainability', icon: Leaf, color: 'bg-green-500', group: 'Lifestyle' },
  
  // Professional
  { id: 'legal', name: 'Legal', icon: Scale, color: 'bg-slate-600', group: 'Professional' },
  { id: 'medical', name: 'Medical', icon: Microscope, color: 'bg-teal-600', group: 'Professional' },
  { id: 'real-estate', name: 'Real Estate', icon: Building, color: 'bg-amber-700', group: 'Professional' },
  { id: 'consulting', name: 'Consulting', icon: Briefcase, color: 'bg-indigo-600', group: 'Professional' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-gray-600', group: 'Professional' },
  { id: 'hospitality', name: 'Hospitality', icon: Coffee, color: 'bg-brown-500', group: 'Professional' },
]

// Prompt styles
const STYLES = [
  { id: 'detailed', name: 'Detailed & Comprehensive', desc: 'In-depth, thorough prompts' },
  { id: 'concise', name: 'Concise & Direct', desc: 'Short, to-the-point prompts' },
  { id: 'creative', name: 'Creative & Unusual', desc: 'Unique, out-of-the-box prompts' },
  { id: 'structured', name: 'Structured & Organized', desc: 'Step-by-step, formatted prompts' },
  { id: 'conversational', name: 'Conversational', desc: 'Natural, dialogue-style prompts' },
  { id: 'technical', name: 'Technical & Precise', desc: 'Exact, professional prompts' },
  { id: 'persuasive', name: 'Persuasive', desc: 'Convincing, compelling prompts' },
  { id: 'educational', name: 'Educational', desc: 'Teaching-focused prompts' },
]

// Output formats
const OUTPUT_FORMATS = [
  { id: 'single', name: 'Single Best Prompt', count: 1 },
  { id: 'five', name: '5 Variations', count: 5 },
  { id: 'ten', name: '10 Variations', count: 10 },
  { id: 'twenty', name: '20 Variations', count: 20 },
  { id: 'mega', name: 'Mega Pack (50)', count: 50 },
]

// Complexity levels
const COMPLEXITY = [
  { id: 'beginner', name: 'Beginner', desc: 'Simple, easy to use' },
  { id: 'intermediate', name: 'Intermediate', desc: 'Moderate complexity' },
  { id: 'advanced', name: 'Advanced', desc: 'Complex, expert-level' },
  { id: 'mixed', name: 'Mixed', desc: 'Variety of levels' },
]

export default function PromptGenerator() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('detailed')
  const [outputFormat, setOutputFormat] = useState('five')
  const [complexity, setComplexity] = useState('intermediate')
  const [includeExamples, setIncludeExamples] = useState(true)
  const [includeTips, setIncludeTips] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [apiKey, setApiKey] = useState('')

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const groupedCategories = CATEGORIES.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = []
    acc[cat.group].push(cat)
    return acc
  }, {} as Record<string, typeof CATEGORIES>)

  const generate = async () => {
    if (!keyword.trim() || selectedCategories.length === 0) return
    
    setLoading(true)
    setResult('')

    const categoryNames = selectedCategories.map(id => CATEGORIES.find(c => c.id === id)?.name).join(', ')
    const styleInfo = STYLES.find(s => s.id === selectedStyle)
    const formatInfo = OUTPUT_FORMATS.find(f => f.id === outputFormat)
    const complexityInfo = COMPLEXITY.find(c => c.id === complexity)

    const prompt = `You are an expert prompt engineer. Generate powerful, effective prompts based on:

SEED WORD(S): "${keyword}"
CATEGORIES: ${categoryNames}
STYLE: ${styleInfo?.name} - ${styleInfo?.desc}
COMPLEXITY: ${complexityInfo?.name}
NUMBER OF PROMPTS: ${formatInfo?.count}

For each prompt, provide:
1. **PROMPT TITLE** - A descriptive name
2. **THE PROMPT** - The actual prompt text (detailed and ready to use)
3. **USE CASE** - When/why to use this prompt
4. **TARGET AI** - Best AI model to use (GPT-4, Claude, Gemini, Midjourney, etc.)
${includeExamples ? '5. **EXAMPLE OUTPUT** - Brief example of what the AI would generate' : ''}
${includeTips ? '6. **PRO TIP** - How to get better results' : ''}

---

IMPORTANT GUIDELINES:
- Each prompt should be UNIQUE and serve a different purpose
- Prompts should be immediately usable without modification
- Include specific details, constraints, and formatting instructions
- Consider edge cases and potential improvements
- Make prompts that will generate high-quality, useful outputs
- Vary the prompts from simple to complex
- Include role-playing elements where appropriate (e.g., "Act as a...")
- Add output format specifications (lists, tables, JSON, etc.)
- Include chain-of-thought instructions for complex prompts

Generate ${formatInfo?.count} diverse, professional-grade prompts:

---`

    try {
      const key = apiKey || localStorage.getItem('gemini_api_key') || ''
      if (!key) {
        setResult('⚠️ Please add your Gemini API key in Settings or enter it above.')
        setLoading(false)
        return
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 12000 }
        })
      })

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResult(data.candidates[0].content.parts[0].text)
      } else {
        setResult('Error generating prompts. Please try again.')
      }
    } catch (error) {
      setResult('Error: ' + (error as Error).message)
    }

    setLoading(false)
  }

  const copyResult = () => navigator.clipboard.writeText(result)

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompts-${keyword.replace(/\s+/g, '-').toLowerCase()}.md`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-violet-400" />
          <div>
            <h1 className="text-xl font-bold">Prompt Generator</h1>
            <p className="text-gray-400 text-sm">Turn any word into powerful AI prompts - 50+ categories</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Controls */}
          <div className="space-y-6">
            {/* Keyword Input */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Seed Word(s) - The foundation of your prompts
              </label>
              <input
                type="text"
                placeholder="Enter a word, topic, or concept..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none text-lg"
              />
              <p className="text-gray-500 text-xs mt-2">
                Examples: "email", "startup", "python", "meditation", "cooking"
              </p>
            </div>

            {/* Category Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Categories (Select multiple for cross-domain prompts)
              </label>
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {Object.entries(groupedCategories).map(([group, cats]) => (
                  <div key={group}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {cats.map(cat => {
                        const Icon = cat.icon
                        const selected = selectedCategories.includes(cat.id)
                        return (
                          <button
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`p-2 rounded-lg border text-left transition-all flex items-center gap-2 ${
                              selected
                                ? `${cat.color} border-white/30`
                                : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{cat.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-violet-400 text-xs mt-3">
                  Selected: {selectedCategories.length} categories
                </p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Style */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Prompt Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none text-sm"
                >
                  {STYLES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Output Format */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Prompts</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none text-sm"
                >
                  {OUTPUT_FORMATS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Complexity */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Complexity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {COMPLEXITY.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setComplexity(c.id)}
                      className={`p-2 rounded-lg border text-center text-sm transition-all ${
                        complexity === c.id
                          ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Include Options */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-3">Include with Each Prompt</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIncludeExamples(!includeExamples)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    includeExamples
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  {includeExamples ? '✓ ' : ''}Example Outputs
                </button>
                <button
                  onClick={() => setIncludeTips(!includeTips)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    includeTips
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                      : 'bg-gray-900 border-gray-700 text-gray-400'
                  }`}
                >
                  {includeTips ? '✓ ' : ''}Pro Tips
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">Gemini API Key (optional)</label>
              <input
                type="password"
                placeholder="Uses saved key if empty..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !keyword.trim() || selectedCategories.length === 0}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating Prompts...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Prompts
                </>
              )}
            </button>
          </div>

          {/* Right - Result */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[calc(100vh-200px)] sticky top-4">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-violet-400" />
                Generated Prompts
              </h3>
              {result && (
                <div className="flex gap-2">
                  <button onClick={copyResult} className="p-2 hover:bg-gray-700 rounded-lg" title="Copy">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={downloadResult} className="p-2 hover:bg-gray-700 rounded-lg" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!result && !loading && (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Enter a word and select categories to generate prompts</p>
                  </div>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Crafting your prompts...</p>
                  </div>
                </div>
              )}
              {result && (
                <div className="prose prose-invert prose-violet max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

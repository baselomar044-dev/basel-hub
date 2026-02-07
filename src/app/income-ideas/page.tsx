'use client'

import { useState } from 'react'
import { DollarSign, Lightbulb, TrendingUp, RefreshCw, Download, Filter,
         Clock, Zap, Target, Users, Briefcase, Globe, Laptop, Smartphone,
         ShoppingBag, PenTool, Camera, Mic, BookOpen, Code, Palette,
         Heart, Star, ChevronDown, ExternalLink, Check, Sparkles } from 'lucide-react'

// ============================================
// INCOME IDEAS GENERATOR
// Generate personalized money-making ideas
// ============================================

interface IncomeIdea {
  id: string
  title: string
  description: string
  category: string
  incomeType: 'active' | 'passive' | 'semi-passive'
  startupCost: 'free' | 'low' | 'medium' | 'high'
  potentialEarnings: string
  timeToFirstIncome: string
  skillsRequired: string[]
  steps: string[]
  resources: { name: string; url: string }[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  trending: boolean
}

const CATEGORIES = [
  { id: 'all', name: 'All Ideas', icon: Sparkles },
  { id: 'online', name: 'Online Business', icon: Globe },
  { id: 'freelance', name: 'Freelancing', icon: Laptop },
  { id: 'content', name: 'Content Creation', icon: Camera },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
  { id: 'tech', name: 'Tech & Coding', icon: Code },
  { id: 'creative', name: 'Creative Services', icon: Palette },
  { id: 'education', name: 'Teaching & Courses', icon: BookOpen },
  { id: 'local', name: 'Local Services', icon: Users },
]

const SKILL_LEVELS = [
  { id: 'beginner', name: 'Beginner Friendly', description: 'No experience needed' },
  { id: 'intermediate', name: 'Some Experience', description: '1-2 years of skills' },
  { id: 'advanced', name: 'Expert Level', description: 'Professional expertise' },
]

const INCOME_TYPES = [
  { id: 'active', name: 'Active Income', description: 'Trade time for money' },
  { id: 'passive', name: 'Passive Income', description: 'Earn while you sleep' },
  { id: 'semi-passive', name: 'Semi-Passive', description: 'Initial work, ongoing returns' },
]

const STARTUP_COSTS = [
  { id: 'free', name: 'Free', range: '$0' },
  { id: 'low', name: 'Low', range: '$1 - $100' },
  { id: 'medium', name: 'Medium', range: '$100 - $1000' },
  { id: 'high', name: 'High', range: '$1000+' },
]

export default function IncomeIdeasGenerator() {
  // Filters
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [availableTime, setAvailableTime] = useState('parttime')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedIncomeType, setSelectedIncomeType] = useState<string[]>([])
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string[]>(['beginner', 'intermediate'])
  const [maxStartupCost, setMaxStartupCost] = useState('medium')
  
  // Results
  const [ideas, setIdeas] = useState<IncomeIdea[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null)
  const [savedIdeas, setSavedIdeas] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  const generateIdeas = async () => {
    setIsGenerating(true)
    setIdeas([])
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: `You are an expert business advisor and entrepreneurship consultant. You generate practical, actionable income ideas tailored to the user's skills, interests, and constraints. Your ideas should be realistic, well-researched, and include concrete steps to get started.`
          }, {
            role: 'user',
            content: `Generate 10 unique income ideas based on these parameters:

USER PROFILE:
- Skills: ${skills || 'General skills'}
- Interests: ${interests || 'Open to anything'}
- Available Time: ${availableTime === 'fulltime' ? 'Full-time (40+ hrs/week)' : availableTime === 'parttime' ? 'Part-time (10-20 hrs/week)' : 'Side hustle (5-10 hrs/week)'}
- Preferred Category: ${selectedCategory === 'all' ? 'Any category' : CATEGORIES.find(c => c.id === selectedCategory)?.name}
- Income Type Preference: ${selectedIncomeType.length > 0 ? selectedIncomeType.join(', ') : 'Any type'}
- Skill Level: ${selectedSkillLevel.join(', ')}
- Maximum Startup Cost: ${STARTUP_COSTS.find(c => c.id === maxStartupCost)?.range}

Generate ideas as a JSON array with this structure:
[
  {
    "title": "Idea Name",
    "description": "Brief 2-3 sentence description of the idea",
    "category": "online|freelance|content|ecommerce|tech|creative|education|local",
    "incomeType": "active|passive|semi-passive",
    "startupCost": "free|low|medium|high",
    "potentialEarnings": "Realistic range like '$500-$2000/month' or '$50-$100/hour'",
    "timeToFirstIncome": "e.g., '1-2 weeks', '1-3 months'",
    "skillsRequired": ["skill1", "skill2"],
    "steps": ["Step 1: Do this", "Step 2: Then this", "Step 3: Finally this"],
    "resources": [{"name": "Resource Name", "url": "https://example.com"}],
    "difficulty": "beginner|intermediate|advanced",
    "trending": true/false (if this is currently trending in 2024-2025)
  }
]

Make sure ideas are:
1. Realistic and achievable
2. Specific with actionable steps
3. Include real resources and platforms
4. Varied across different approaches
5. Tailored to the user's constraints`
          }],
          model: 'gemini-2.0-flash-exp'
        })
      })
      
      const data = await response.json()
      let ideasData: any[] = []
      
      try {
        const jsonMatch = (data.response || data.text || '').match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          ideasData = JSON.parse(jsonMatch[0])
        }
      } catch {
        console.error('Parse error')
      }
      
      const formattedIdeas: IncomeIdea[] = ideasData.map((idea: any, i: number) => ({
        id: `idea-${Date.now()}-${i}`,
        title: idea.title || `Income Idea ${i + 1}`,
        description: idea.description || '',
        category: idea.category || 'online',
        incomeType: idea.incomeType || 'active',
        startupCost: idea.startupCost || 'low',
        potentialEarnings: idea.potentialEarnings || 'Varies',
        timeToFirstIncome: idea.timeToFirstIncome || '1-4 weeks',
        skillsRequired: idea.skillsRequired || [],
        steps: idea.steps || [],
        resources: idea.resources || [],
        difficulty: idea.difficulty || 'beginner',
        trending: idea.trending || false
      }))
      
      setIdeas(formattedIdeas)
      
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSaveIdea = (id: string) => {
    setSavedIdeas(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const exportIdeas = () => {
    const data = ideas.filter(i => savedIdeas.includes(i.id) || savedIdeas.length === 0)
    const markdown = data.map(idea => `
## ${idea.title}
${idea.trending ? '🔥 TRENDING' : ''}

${idea.description}

**Category:** ${idea.category}
**Income Type:** ${idea.incomeType}
**Startup Cost:** ${idea.startupCost}
**Potential Earnings:** ${idea.potentialEarnings}
**Time to First Income:** ${idea.timeToFirstIncome}
**Difficulty:** ${idea.difficulty}

### Skills Required
${idea.skillsRequired.map(s => `- ${s}`).join('\n')}

### Steps to Get Started
${idea.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### Resources
${idea.resources.map(r => `- [${r.name}](${r.url})`).join('\n')}

---
`).join('\n')
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `income-ideas-${Date.now()}.md`
    a.click()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getIncomeTypeColor = (type: string) => {
    switch (type) {
      case 'passive': return 'bg-purple-500/20 text-purple-400'
      case 'semi-passive': return 'bg-blue-500/20 text-blue-400'
      case 'active': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Income Ideas Generator</h1>
              <p className="text-xs text-gray-400">Personalized money-making opportunities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${showFilters ? 'bg-green-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            {ideas.length > 0 && (
              <button
                onClick={exportIdeas}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-4">
              {/* Skills & Interests */}
              <div className="bg-gray-800 rounded-2xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  About You
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Your Skills</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g., writing, design, coding..."
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Interests</label>
                    <input
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="e.g., fitness, tech, art..."
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Available Time</label>
                    <select
                      value={availableTime}
                      onChange={(e) => setAvailableTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm"
                    >
                      <option value="sidehustle">Side Hustle (5-10 hrs/week)</option>
                      <option value="parttime">Part-time (10-20 hrs/week)</option>
                      <option value="fulltime">Full-time (40+ hrs/week)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-gray-800 rounded-2xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Category
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-900 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Income Type */}
              <div className="bg-gray-800 rounded-2xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Income Type
                </h3>
                <div className="space-y-2">
                  {INCOME_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedIncomeType(prev =>
                        prev.includes(type.id) ? prev.filter(t => t !== type.id) : [...prev, type.id]
                      )}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                        selectedIncomeType.includes(type.id)
                          ? 'bg-purple-500/30 border border-purple-500'
                          : 'bg-gray-900 hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-400">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Startup Cost */}
              <div className="bg-gray-800 rounded-2xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Max Startup Cost
                </h3>
                <div className="flex flex-wrap gap-2">
                  {STARTUP_COSTS.map(cost => (
                    <button
                      key={cost.id}
                      onClick={() => setMaxStartupCost(cost.id)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        maxStartupCost === cost.id
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-900 hover:bg-gray-700'
                      }`}
                    >
                      {cost.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateIdeas}
                disabled={isGenerating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5" />
                    Generate Ideas
                  </>
                )}
              </button>
            </div>
          )}

          {/* Ideas Display */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {ideas.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">
                    {ideas.length} Income Ideas Generated
                    {savedIdeas.length > 0 && (
                      <span className="ml-2 text-sm text-green-400">({savedIdeas.length} saved)</span>
                    )}
                  </h2>
                </div>

                <div className="grid gap-4">
                  {ideas.map((idea, index) => (
                    <div key={idea.id} className="bg-gray-800 rounded-2xl overflow-hidden">
                      {/* Idea Header */}
                      <div 
                        className="p-5 cursor-pointer hover:bg-gray-750"
                        onClick={() => setExpandedIdea(expandedIdea === idea.id ? null : idea.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {idea.trending && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center gap-1">
                                  <Zap className="w-3 h-3" /> Trending
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(idea.difficulty)}`}>
                                {idea.difficulty}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getIncomeTypeColor(idea.incomeType)}`}>
                                {idea.incomeType}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg">{idea.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{idea.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSaveIdea(idea.id) }}
                              className={`p-2 rounded-lg ${savedIdeas.includes(idea.id) ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                              {savedIdeas.includes(idea.id) ? <Check className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </button>
                            <ChevronDown className={`w-5 h-5 transition-transform ${expandedIdea === idea.id ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1 text-green-400">
                            <DollarSign className="w-4 h-4" />
                            {idea.potentialEarnings}
                          </div>
                          <div className="flex items-center gap-1 text-blue-400">
                            <Clock className="w-4 h-4" />
                            {idea.timeToFirstIncome}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            <DollarSign className="w-4 h-4" />
                            Startup: {idea.startupCost}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedIdea === idea.id && (
                        <div className="px-5 pb-5 border-t border-gray-700 pt-5">
                          {/* Skills Required */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Skills Required</h4>
                            <div className="flex flex-wrap gap-2">
                              {idea.skillsRequired.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-gray-700 text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Steps */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Steps to Get Started</h4>
                            <ol className="space-y-2">
                              {idea.steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm">
                                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 text-xs">
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Resources */}
                          {idea.resources.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Helpful Resources</h4>
                              <div className="flex flex-wrap gap-2">
                                {idea.resources.map((resource, i) => (
                                  <a
                                    key={i}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
                                  >
                                    {resource.name}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-gray-800 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2">Generate Income Ideas</h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Tell us about your skills and interests, and we'll generate personalized money-making opportunities tailored just for you.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-gray-700 text-sm">💻 Online Business</span>
                  <span className="px-4 py-2 rounded-full bg-gray-700 text-sm">🎨 Creative Services</span>
                  <span className="px-4 py-2 rounded-full bg-gray-700 text-sm">📱 Content Creation</span>
                  <span className="px-4 py-2 rounded-full bg-gray-700 text-sm">📦 E-commerce</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

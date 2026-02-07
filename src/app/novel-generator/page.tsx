'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, BookOpen, Wand2, Download, Copy, RefreshCw, Sparkles,
  Skull, Heart, Rocket, Sword, Ghost, Crown, Map, Clock,
  Users, Brain, Zap, Moon, Sun, Flame, Shield, Eye,
  Mountain, Ship, Plane, Building, Music, Palette, Code,
  Scale, Microscope, Laugh, Baby, Dog, TreeDeciduous
} from 'lucide-react'

// 30+ Genres
const GENRES = [
  { id: 'fantasy', name: 'Fantasy', icon: Wand2, color: 'bg-purple-500', description: 'Magic, dragons, epic quests' },
  { id: 'sci-fi', name: 'Science Fiction', icon: Rocket, color: 'bg-cyan-500', description: 'Future tech, space, AI' },
  { id: 'romance', name: 'Romance', icon: Heart, color: 'bg-pink-500', description: 'Love stories, relationships' },
  { id: 'horror', name: 'Horror', icon: Skull, color: 'bg-red-800', description: 'Terror, suspense, fear' },
  { id: 'mystery', name: 'Mystery', icon: Eye, color: 'bg-amber-600', description: 'Detective, crime, puzzles' },
  { id: 'thriller', name: 'Thriller', icon: Zap, color: 'bg-red-500', description: 'Action, suspense, danger' },
  { id: 'adventure', name: 'Adventure', icon: Map, color: 'bg-emerald-500', description: 'Exploration, journey, discovery' },
  { id: 'historical', name: 'Historical Fiction', icon: Clock, color: 'bg-amber-700', description: 'Past eras, real events' },
  { id: 'dystopian', name: 'Dystopian', icon: Building, color: 'bg-gray-600', description: 'Dark futures, society collapse' },
  { id: 'post-apocalyptic', name: 'Post-Apocalyptic', icon: Flame, color: 'bg-orange-700', description: 'After the end, survival' },
  { id: 'urban-fantasy', name: 'Urban Fantasy', icon: Moon, color: 'bg-violet-600', description: 'Magic in modern cities' },
  { id: 'dark-fantasy', name: 'Dark Fantasy', icon: Ghost, color: 'bg-slate-700', description: 'Grim, morally gray worlds' },
  { id: 'epic-fantasy', name: 'Epic Fantasy', icon: Crown, color: 'bg-yellow-600', description: 'Grand scale, world-changing' },
  { id: 'space-opera', name: 'Space Opera', icon: Sparkles, color: 'bg-blue-600', description: 'Grand space adventures' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: Code, color: 'bg-pink-600', description: 'High tech, low life' },
  { id: 'steampunk', name: 'Steampunk', icon: Shield, color: 'bg-amber-500', description: 'Victorian era + steam tech' },
  { id: 'military', name: 'Military Fiction', icon: Shield, color: 'bg-green-700', description: 'War, soldiers, strategy' },
  { id: 'political', name: 'Political Thriller', icon: Building, color: 'bg-blue-800', description: 'Power, intrigue, government' },
  { id: 'psychological', name: 'Psychological', icon: Brain, color: 'bg-indigo-600', description: 'Mind games, mental struggles' },
  { id: 'supernatural', name: 'Supernatural', icon: Ghost, color: 'bg-purple-700', description: 'Ghosts, demons, paranormal' },
  { id: 'paranormal-romance', name: 'Paranormal Romance', icon: Heart, color: 'bg-rose-600', description: 'Love + supernatural beings' },
  { id: 'young-adult', name: 'Young Adult', icon: Users, color: 'bg-teal-500', description: 'Coming of age, teen heroes' },
  { id: 'middle-grade', name: 'Middle Grade', icon: Baby, color: 'bg-sky-400', description: 'Adventures for tweens' },
  { id: 'literary', name: 'Literary Fiction', icon: BookOpen, color: 'bg-stone-600', description: 'Character-driven, artistic' },
  { id: 'comedy', name: 'Comedy', icon: Laugh, color: 'bg-yellow-400', description: 'Humor, satire, fun' },
  { id: 'western', name: 'Western', icon: Sun, color: 'bg-orange-500', description: 'Cowboys, frontier, outlaws' },
  { id: 'maritime', name: 'Maritime', icon: Ship, color: 'bg-blue-500', description: 'Sea adventures, pirates' },
  { id: 'aviation', name: 'Aviation', icon: Plane, color: 'bg-sky-600', description: 'Pilots, air adventures' },
  { id: 'sports', name: 'Sports Fiction', icon: Mountain, color: 'bg-green-500', description: 'Athletes, competition' },
  { id: 'musical', name: 'Musical Fiction', icon: Music, color: 'bg-fuchsia-500', description: 'Musicians, bands, concerts' },
  { id: 'art', name: 'Art Fiction', icon: Palette, color: 'bg-rose-500', description: 'Artists, creativity, beauty' },
  { id: 'legal', name: 'Legal Thriller', icon: Scale, color: 'bg-slate-600', description: 'Courtroom drama, lawyers' },
  { id: 'medical', name: 'Medical Thriller', icon: Microscope, color: 'bg-teal-600', description: 'Doctors, diseases, hospitals' },
  { id: 'nature', name: 'Nature/Survival', icon: TreeDeciduous, color: 'bg-green-600', description: 'Wilderness, survival' },
  { id: 'animal', name: 'Animal Fiction', icon: Dog, color: 'bg-amber-400', description: 'Animals as protagonists' },
]

// Story lengths
const LENGTHS = [
  { id: 'flash', name: 'Flash Fiction', words: '500-1000', chapters: 1 },
  { id: 'short', name: 'Short Story', words: '2000-5000', chapters: 1 },
  { id: 'novelette', name: 'Novelette', words: '7500-15000', chapters: '3-5' },
  { id: 'novella', name: 'Novella', words: '20000-40000', chapters: '8-15' },
  { id: 'novel', name: 'Full Novel', words: '60000-100000', chapters: '20-30' },
  { id: 'epic', name: 'Epic Novel', words: '100000+', chapters: '30+' },
]

// Tones
const TONES = [
  'Dark & Gritty', 'Light & Humorous', 'Epic & Grand', 'Intimate & Personal',
  'Fast-paced & Action-packed', 'Slow-burn & Atmospheric', 'Hopeful & Uplifting',
  'Tragic & Melancholic', 'Mysterious & Suspenseful', 'Whimsical & Playful',
  'Realistic & Grounded', 'Surreal & Dreamlike', 'Satirical & Ironic',
  'Romantic & Passionate', 'Philosophical & Thought-provoking'
]

// POV options
const POV_OPTIONS = [
  { id: 'first', name: 'First Person', desc: '"I walked into the room..."' },
  { id: 'third-limited', name: 'Third Person Limited', desc: 'He walked into the room, wondering...' },
  { id: 'third-omniscient', name: 'Third Person Omniscient', desc: 'The narrator knows all thoughts' },
  { id: 'second', name: 'Second Person', desc: '"You walk into the room..."' },
  { id: 'multiple', name: 'Multiple POV', desc: 'Different characters\' perspectives' },
]

// Time periods
const TIME_PERIODS = [
  'Ancient Times', 'Medieval Era', 'Renaissance', 'Victorian Era',
  'Roaring 20s', 'World War II', 'Cold War Era', 'Modern Day',
  'Near Future (2030-2050)', 'Far Future (2100+)', 'Distant Future (1000+ years)',
  'Timeless/Undefined', 'Multiple Time Periods', 'Alternate History'
]

export default function NovelGenerator() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLength, setSelectedLength] = useState('novella')
  const [selectedTone, setSelectedTone] = useState('')
  const [selectedPOV, setSelectedPOV] = useState('third-limited')
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Modern Day')
  const [includeCharacters, setIncludeCharacters] = useState(true)
  const [includeWorldbuilding, setIncludeWorldbuilding] = useState(true)
  const [includeOutline, setIncludeOutline] = useState(true)
  const [includeSampleChapter, setIncludeSampleChapter] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [apiKey, setApiKey] = useState('')

  const toggleGenre = (id: string) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const generate = async () => {
    if (!keyword.trim() || selectedGenres.length === 0) return
    
    setLoading(true)
    setResult('')

    const genreNames = selectedGenres.map(id => GENRES.find(g => g.id === id)?.name).join(', ')
    const lengthInfo = LENGTHS.find(l => l.id === selectedLength)
    const povInfo = POV_OPTIONS.find(p => p.id === selectedPOV)

    const prompt = `Generate a complete novel concept based on:

SEED WORD(S): "${keyword}"
GENRE(S): ${genreNames}
LENGTH: ${lengthInfo?.name} (${lengthInfo?.words} words, ${lengthInfo?.chapters} chapters)
TONE: ${selectedTone || 'Author\'s choice'}
POV: ${povInfo?.name}
TIME PERIOD: ${selectedTimePeriod}

Please create:

## 📖 TITLE
A compelling, memorable title

## 📝 LOGLINE
One sentence that captures the essence (25 words max)

## 📋 SYNOPSIS
A detailed 3-paragraph synopsis covering the entire story arc

## 🎭 THEMES
- Main theme with explanation
- 3-4 secondary themes

${includeCharacters ? `## 👥 CHARACTERS

### Protagonist
- Name, age, background
- Personality traits
- Internal conflict
- Character arc
- Strengths & flaws

### Antagonist
- Name and role
- Motivation
- Methods
- Relationship to protagonist

### Supporting Cast (3-5 characters)
For each: Name, role, personality, relationship to protagonist
` : ''}

${includeWorldbuilding ? `## 🌍 WORLDBUILDING

### Setting
- Primary location(s)
- Time period details
- Social/political structure

### Unique Elements
- Magic system / technology / special rules
- History and lore
- Cultural details

### Atmosphere
- Visual style
- Mood and feel
- Sensory details
` : ''}

${includeOutline ? `## 📚 CHAPTER OUTLINE

For each chapter provide:
- Chapter number and title
- Key events (3-4 bullet points)
- POV character (if multiple)
- Emotional beat/tension level

Create an outline for ${lengthInfo?.chapters} chapters that builds tension, has midpoint twist, and satisfying climax.
` : ''}

${includeSampleChapter ? `## ✍️ SAMPLE: FIRST CHAPTER

Write the complete first chapter (1500-2500 words) in ${povInfo?.name} POV with:
- Strong opening hook
- Character introduction
- Setting establishment
- Inciting incident or hint of conflict
- End with a hook for chapter 2

Use vivid prose, dialogue, and sensory details. Match the ${selectedTone || 'appropriate'} tone.
` : ''}

## 💡 WRITING TIPS
- 3-5 specific tips for writing this story
- Potential pitfalls to avoid
- Research suggestions

Make this unique, compelling, and ready for an author to start writing immediately.`

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
          generationConfig: { temperature: 0.9, maxOutputTokens: 16000 }
        })
      })

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResult(data.candidates[0].content.parts[0].text)
      } else {
        setResult('Error generating story. Please try again.')
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
    a.download = `novel-${keyword.replace(/\s+/g, '-').toLowerCase()}.md`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold">Novel Story Generator</h1>
            <p className="text-gray-400 text-sm">Turn any word into an epic story - 30+ genres</p>
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
                Seed Word(s) - The spark of your story
              </label>
              <input
                type="text"
                placeholder="Enter a word, phrase, or concept..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
              />
              <p className="text-gray-500 text-xs mt-2">
                Examples: "forgotten memories", "quantum", "last survivor", "betrayal"
              </p>
            </div>

            {/* Genre Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Genres (Select multiple for genre-blending)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                {GENRES.map(genre => {
                  const Icon = genre.icon
                  const selected = selectedGenres.includes(genre.id)
                  return (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selected
                          ? `${genre.color} border-white/30`
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{genre.name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              {selectedGenres.length > 0 && (
                <p className="text-amber-400 text-xs mt-2">
                  Selected: {selectedGenres.map(id => GENRES.find(g => g.id === id)?.name).join(' + ')}
                </p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Length */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Story Length</label>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {LENGTHS.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.words} words)</option>
                  ))}
                </select>
              </div>

              {/* POV */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Point of View</label>
                <select
                  value={selectedPOV}
                  onChange={(e) => setSelectedPOV(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {POV_OPTIONS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Tone */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Tone</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Let AI decide</option>
                  {TONES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Time Period */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <label className="block text-sm font-medium text-gray-400 mb-2">Time Period</label>
                <select
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  {TIME_PERIODS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Include Options */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-3">Include in Generation</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'characters', label: 'Character Profiles', state: includeCharacters, set: setIncludeCharacters },
                  { key: 'world', label: 'Worldbuilding', state: includeWorldbuilding, set: setIncludeWorldbuilding },
                  { key: 'outline', label: 'Chapter Outline', state: includeOutline, set: setIncludeOutline },
                  { key: 'sample', label: 'Sample Chapter', state: includeSampleChapter, set: setIncludeSampleChapter },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => opt.set(!opt.state)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      opt.state
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-gray-900 border-gray-700 text-gray-400'
                    }`}
                  >
                    {opt.state ? '✓ ' : ''}{opt.label}
                  </button>
                ))}
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
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !keyword.trim() || selectedGenres.length === 0}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Crafting Your Story...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Novel
                </>
              )}
            </button>
          </div>

          {/* Right - Result */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[calc(100vh-200px)] sticky top-4">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Generated Story
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
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Enter a word and select genres to generate your novel</p>
                  </div>
                </div>
              )}
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Creating your masterpiece...</p>
                    <p className="text-gray-500 text-sm mt-2">This may take 30-60 seconds</p>
                  </div>
                </div>
              )}
              {result && (
                <div className="prose prose-invert prose-amber max-w-none">
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

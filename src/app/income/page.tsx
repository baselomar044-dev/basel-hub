'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX, 
  FiDollarSign, FiTrendingUp, FiTarget, FiDownload, 
  FiUpload, FiSearch, FiFilter, FiZap, FiClock
} from 'react-icons/fi'

interface IncomeIdea {
  id: string
  title: string
  description: string
  category: string
  potential_income: string
  effort_level: 'low' | 'medium' | 'high'
  status: 'idea' | 'researching' | 'planning' | 'active' | 'paused' | 'completed'
  notes: string
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { id: 'freelance', label: 'Freelancing', emoji: '💼' },
  { id: 'saas', label: 'SaaS / App', emoji: '📱' },
  { id: 'content', label: 'Content Creation', emoji: '📝' },
  { id: 'ecommerce', label: 'E-Commerce', emoji: '🛒' },
  { id: 'investment', label: 'Investment', emoji: '📈' },
  { id: 'service', label: 'Service', emoji: '🔧' },
  { id: 'other', label: 'Other', emoji: '💡' }
]

const STATUSES = [
  { id: 'idea', label: 'Idea', color: 'bg-gray-500' },
  { id: 'researching', label: 'Researching', color: 'bg-blue-500' },
  { id: 'planning', label: 'Planning', color: 'bg-yellow-500' },
  { id: 'active', label: 'Active', color: 'bg-green-500' },
  { id: 'paused', label: 'Paused', color: 'bg-orange-500' },
  { id: 'completed', label: 'Completed', color: 'bg-purple-500' }
]

const EFFORT_LEVELS = [
  { id: 'low', label: 'Low Effort', color: 'text-green-400' },
  { id: 'medium', label: 'Medium Effort', color: 'text-yellow-400' },
  { id: 'high', label: 'High Effort', color: 'text-red-400' }
]

export default function IncomePage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [ideas, setIdeas] = useState<IncomeIdea[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingIdea, setEditingIdea] = useState<IncomeIdea | null>(null)
  
  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState('freelance')
  const [formIncome, setFormIncome] = useState('')
  const [formEffort, setFormEffort] = useState<'low' | 'medium' | 'high'>('medium')
  const [formStatus, setFormStatus] = useState<IncomeIdea['status']>('idea')
  const [formNotes, setFormNotes] = useState('')

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadIdeas()
  }, [])

  const loadIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('income_ideas')
        .select('*')
        .eq('user_id', 'basel')
        .order('created_at', { ascending: false })
      
      if (data) setIdeas(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading ideas:', error)
      const saved = localStorage.getItem('basel_income_ideas')
      if (saved) setIdeas(JSON.parse(saved))
    }
  }

  const saveIdea = async (idea: IncomeIdea) => {
    try {
      await supabase.from('income_ideas').upsert({
        ...idea,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving idea:', error)
    }
    const updated = ideas.filter(i => i.id !== idea.id)
    const newIdeas = [idea, ...updated]
    setIdeas(newIdeas)
    localStorage.setItem('basel_income_ideas', JSON.stringify(newIdeas))
  }

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      alert('Please enter a title')
      return
    }

    const idea: IncomeIdea = {
      id: editingIdea?.id || `idea_${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      potential_income: formIncome.trim(),
      effort_level: formEffort,
      status: formStatus,
      notes: formNotes.trim(),
      created_at: editingIdea?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    saveIdea(idea)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormCategory('freelance')
    setFormIncome('')
    setFormEffort('medium')
    setFormStatus('idea')
    setFormNotes('')
    setEditingIdea(null)
    setShowForm(false)
  }

  const editIdea = (idea: IncomeIdea) => {
    setEditingIdea(idea)
    setFormTitle(idea.title)
    setFormDescription(idea.description)
    setFormCategory(idea.category)
    setFormIncome(idea.potential_income)
    setFormEffort(idea.effort_level)
    setFormStatus(idea.status)
    setFormNotes(idea.notes)
    setShowForm(true)
  }

  const deleteIdea = async (id: string) => {
    if (!confirm('Delete this idea?')) return
    
    try {
      await supabase.from('income_ideas').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting idea:', error)
    }
    
    const updated = ideas.filter(i => i.id !== id)
    setIdeas(updated)
    localStorage.setItem('basel_income_ideas', JSON.stringify(updated))
  }

  const exportIdeas = () => {
    const data = JSON.stringify(ideas, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-income-ideas-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importIdeas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        imported.forEach((idea: IncomeIdea) => saveIdea(idea))
        alert('Ideas imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
  }

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchTerm || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || idea.category === filterCategory
    const matchesStatus = !filterStatus || idea.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategory = (id: string) => CATEGORIES.find(c => c.id === id)
  const getStatus = (id: string) => STATUSES.find(s => s.id === id)

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
              💰 Income Ideas
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportIdeas}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              <FiDownload /> Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              <FiUpload /> Import
              <input type="file" accept=".json" onChange={importIdeas} className="hidden" />
            </label>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg"
            >
              <FiPlus /> Add Idea
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(status => (
              <option key={status.id} value={status.id}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Ideas</p>
            <p className="text-2xl font-bold">{ideas.length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-400">{ideas.filter(i => i.status === 'active').length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400">In Research</p>
            <p className="text-2xl font-bold text-blue-400">{ideas.filter(i => i.status === 'researching').length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-purple-400">{ideas.filter(i => i.status === 'completed').length}</p>
          </div>
        </div>

        {/* Ideas List */}
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FiDollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No income ideas yet</p>
            <p className="text-sm mt-2">Start brainstorming your next income stream!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map(idea => {
              const category = getCategory(idea.category)
              const status = getStatus(idea.status)
              const effort = EFFORT_LEVELS.find(e => e.id === idea.effort_level)
              
              return (
                <div
                  key={idea.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{category?.emoji || '💡'}</div>
                      <div>
                        <h3 className="font-semibold">{idea.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{idea.description || 'No description'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editIdea(idea)}
                        className="p-1.5 hover:bg-gray-700 rounded"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className={`px-2 py-1 rounded text-xs ${status?.color}`}>
                      {status?.label}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {category?.label}
                    </span>
                    <span className={`px-2 py-1 bg-gray-700 rounded text-xs ${effort?.color}`}>
                      {effort?.label}
                    </span>
                    {idea.potential_income && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" /> {idea.potential_income}
                      </span>
                    )}
                  </div>

                  {idea.notes && (
                    <p className="text-xs text-gray-500 mt-3 line-clamp-2">{idea.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  💡 {editingIdea ? 'Edit Idea' : 'New Income Idea'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-lg">
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g., Freelance Web Development"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the idea..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as IncomeIdea['status'])}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {STATUSES.map(status => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Potential Income</label>
                    <input
                      type="text"
                      value={formIncome}
                      onChange={(e) => setFormIncome(e.target.value)}
                      placeholder="e.g., $1,000/month"
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Effort Level</label>
                    <select
                      value={formEffort}
                      onChange={(e) => setFormEffort(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      {EFFORT_LEVELS.map(level => (
                        <option key={level.id} value={level.id}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Additional notes, research links, action items..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingIdea ? 'Update Idea' : 'Save Idea'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

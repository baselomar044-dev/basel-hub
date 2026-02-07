'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, 
  FiCalendar, FiClock, FiFlag, FiList, FiBell,
  FiDownload, FiUpload, FiFilter
} from 'react-icons/fi'

interface OrganizerItem {
  id: string
  category: 'task' | 'event' | 'reminder'
  title: string
  description?: string
  date?: string
  time?: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { id: 'task', label: 'Tasks', icon: FiList, color: 'blue' },
  { id: 'event', label: 'Events', icon: FiCalendar, color: 'green' },
  { id: 'reminder', label: 'Reminders', icon: FiBell, color: 'yellow' }
]

const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'text-gray-400' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { id: 'high', label: 'High', color: 'text-red-400' }
]

export default function OrganizerPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [items, setItems] = useState<OrganizerItem[]>([])
  const [activeCategory, setActiveCategory] = useState<'all' | 'task' | 'event' | 'reminder'>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<OrganizerItem | null>(null)
  
  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState<'task' | 'event' | 'reminder'>('task')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formPriority, setFormPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('organizer_items')
        .select('*')
        .eq('user_id', 'basel')
        .order('date', { ascending: true })
      
      if (data) setItems(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading items:', error)
      const saved = localStorage.getItem('basel_organizer')
      if (saved) setItems(JSON.parse(saved))
    }
  }

  const saveItem = async (item: OrganizerItem) => {
    try {
      await supabase.from('organizer_items').upsert({
        ...item,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving item:', error)
    }
    const updated = items.filter(i => i.id !== item.id)
    const newItems = [...updated, item].sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    setItems(newItems)
    localStorage.setItem('basel_organizer', JSON.stringify(newItems))
  }

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      alert('Please enter a title')
      return
    }

    const item: OrganizerItem = {
      id: editingItem?.id || `item_${Date.now()}`,
      category: formCategory,
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      date: formDate || undefined,
      time: formTime || undefined,
      is_completed: editingItem?.is_completed || false,
      priority: formPriority,
      created_at: editingItem?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    saveItem(item)
    resetForm()
  }

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormCategory('task')
    setFormDate('')
    setFormTime('')
    setFormPriority('medium')
    setEditingItem(null)
    setShowForm(false)
  }

  const editItem = (item: OrganizerItem) => {
    setEditingItem(item)
    setFormTitle(item.title)
    setFormDescription(item.description || '')
    setFormCategory(item.category)
    setFormDate(item.date || '')
    setFormTime(item.time || '')
    setFormPriority(item.priority)
    setShowForm(true)
  }

  const toggleComplete = (item: OrganizerItem) => {
    saveItem({ ...item, is_completed: !item.is_completed })
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    
    try {
      await supabase.from('organizer_items').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
    
    const updated = items.filter(i => i.id !== id)
    setItems(updated)
    localStorage.setItem('basel_organizer', JSON.stringify(updated))
  }

  const exportItems = () => {
    const data = JSON.stringify(items, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-organizer-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        const merged = [...imported, ...items]
        setItems(merged)
        localStorage.setItem('basel_organizer', JSON.stringify(merged))
        imported.forEach((item: OrganizerItem) => saveItem(item))
        alert('Items imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
  }

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesCompleted = showCompleted || !item.is_completed
    return matchesCategory && matchesCompleted
  })

  // Group by date
  const today = new Date().toISOString().split('T')[0]
  const groupedItems = {
    overdue: filteredItems.filter(i => i.date && i.date < today && !i.is_completed),
    today: filteredItems.filter(i => i.date === today),
    upcoming: filteredItems.filter(i => i.date && i.date > today),
    noDate: filteredItems.filter(i => !i.date)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500'
      case 'medium': return 'border-yellow-500'
      default: return 'border-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat ? <cat.icon className="w-4 h-4" /> : null
  }

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              📋 Organizer
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportItems}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              <FiDownload /> Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              <FiUpload /> Import
              <input type="file" accept=".json" onChange={importItems} className="hidden" />
            </label>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg"
            >
              <FiPlus /> Add Item
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === 'all' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeCategory === cat.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <cat.icon className="w-4 h-4" /> {cat.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              showCompleted ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <FiFilter /> {showCompleted ? 'Showing Completed' : 'Show Completed'}
          </button>
        </div>

        {/* Overdue */}
        {groupedItems.overdue.length > 0 && (
          <div className="mb-6">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <FiClock /> Overdue ({groupedItems.overdue.length})
            </h3>
            <div className="space-y-2">
              {groupedItems.overdue.map(item => (
                <ItemCard key={item.id} item={item} onToggle={toggleComplete} onEdit={editItem} onDelete={deleteItem} getPriorityColor={getPriorityColor} getCategoryIcon={getCategoryIcon} />
              ))}
            </div>
          </div>
        )}

        {/* Today */}
        {groupedItems.today.length > 0 && (
          <div className="mb-6">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <FiCalendar /> Today ({groupedItems.today.length})
            </h3>
            <div className="space-y-2">
              {groupedItems.today.map(item => (
                <ItemCard key={item.id} item={item} onToggle={toggleComplete} onEdit={editItem} onDelete={deleteItem} getPriorityColor={getPriorityColor} getCategoryIcon={getCategoryIcon} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {groupedItems.upcoming.length > 0 && (
          <div className="mb-6">
            <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <FiCalendar /> Upcoming ({groupedItems.upcoming.length})
            </h3>
            <div className="space-y-2">
              {groupedItems.upcoming.map(item => (
                <ItemCard key={item.id} item={item} onToggle={toggleComplete} onEdit={editItem} onDelete={deleteItem} getPriorityColor={getPriorityColor} getCategoryIcon={getCategoryIcon} />
              ))}
            </div>
          </div>
        )}

        {/* No Date */}
        {groupedItems.noDate.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <FiList /> No Date ({groupedItems.noDate.length})
            </h3>
            <div className="space-y-2">
              {groupedItems.noDate.map(item => (
                <ItemCard key={item.id} item={item} onToggle={toggleComplete} onEdit={editItem} onDelete={deleteItem} getPriorityColor={getPriorityColor} getCategoryIcon={getCategoryIcon} />
              ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <FiList className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No items yet</p>
            <p className="text-sm mt-2">Add your first task, event, or reminder</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingItem ? 'Edit Item' : 'Add Item'}
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
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <div className="flex gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFormCategory(cat.id as any)}
                        className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                          formCategory === cat.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" /> {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Additional details..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setFormPriority(p.id as any)}
                        className={`flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                          formPriority === p.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                        } ${p.color}`}
                      >
                        <FiFlag className="w-4 h-4" /> {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Item Card Component
function ItemCard({ 
  item, 
  onToggle, 
  onEdit, 
  onDelete, 
  getPriorityColor,
  getCategoryIcon 
}: { 
  item: OrganizerItem
  onToggle: (item: OrganizerItem) => void
  onEdit: (item: OrganizerItem) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
  getCategoryIcon: (category: string) => React.ReactNode
}) {
  return (
    <div
      className={`bg-gray-800/50 border-l-4 ${getPriorityColor(item.priority)} border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all group ${
        item.is_completed ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(item)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            item.is_completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-500 hover:border-blue-500'
          }`}
        >
          {item.is_completed && <FiCheck className="w-3 h-3" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{getCategoryIcon(item.category)}</span>
            <h4 className={`font-medium ${item.is_completed ? 'line-through text-gray-500' : ''}`}>
              {item.title}
            </h4>
          </div>
          {item.description && (
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          )}
          {(item.date || item.time) && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
              {item.date && <span className="flex items-center gap-1"><FiCalendar /> {item.date}</span>}
              {item.time && <span className="flex items-center gap-1"><FiClock /> {item.time}</span>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-gray-700 rounded"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX, 
  FiStar, FiSearch, FiTag, FiDownload, FiUpload, FiCopy, FiCheck
} from 'react-icons/fi'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export default function NotesPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editTags, setEditTags] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', 'basel')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false })
      
      if (data) setNotes(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading notes:', error)
      // Load from localStorage as fallback
      const saved = localStorage.getItem('basel_notes')
      if (saved) setNotes(JSON.parse(saved))
    }
  }

  const saveNote = async (note: Note) => {
    try {
      await supabase.from('notes').upsert({
        ...note,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving note:', error)
    }
    // Also save locally
    const updated = notes.filter(n => n.id !== note.id)
    const newNotes = [note, ...updated].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
    setNotes(newNotes)
    localStorage.setItem('basel_notes', JSON.stringify(newNotes))
  }

  const createNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'New Note',
      content: '',
      tags: [],
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setSelectedNote(newNote)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
    setEditTags('')
    setIsEditing(true)
  }

  const editNote = (note: Note) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditTags(note.tags.join(', '))
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!selectedNote) return
    
    const updatedNote: Note = {
      ...selectedNote,
      title: editTitle.trim() || 'Untitled',
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      updated_at: new Date().toISOString()
    }
    
    saveNote(updatedNote)
    setSelectedNote(updatedNote)
    setIsEditing(false)
  }

  const deleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return
    
    try {
      await supabase.from('notes').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
    
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    localStorage.setItem('basel_notes', JSON.stringify(updated))
    
    if (selectedNote?.id === id) {
      setSelectedNote(null)
      setIsEditing(false)
    }
  }

  const togglePin = (note: Note) => {
    saveNote({ ...note, is_pinned: !note.is_pinned })
  }

  const copyNote = (note: Note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportNotes = () => {
    const data = JSON.stringify(notes, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-notes-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        const merged = [...imported, ...notes]
        setNotes(merged)
        localStorage.setItem('basel_notes', JSON.stringify(merged))
        imported.forEach((note: Note) => saveNote(note))
        alert('Notes imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
  }

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(n => n.tags))].filter(Boolean)

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || note.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              📝 Notes
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportNotes}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              <FiDownload /> Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              <FiUpload /> Import
              <input type="file" accept=".json" onChange={importNotes} className="hidden" />
            </label>
            <button
              onClick={createNote}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg"
            >
              <FiPlus /> New Note
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-4 h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-1 rounded text-xs ${
                  !selectedTag ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                    selectedTag === tag ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <FiTag className="w-3 h-3" /> {tag}
                </button>
              ))}
            </div>
          )}

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No notes yet</p>
                <p className="text-sm mt-2">Create your first note!</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => { setSelectedNote(note); setIsEditing(false) }}
                  className={`p-3 rounded-lg cursor-pointer transition-all group ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {note.is_pinned && <FiStar className="w-3 h-3 text-yellow-400" />}
                        <h3 className="font-medium truncate">{note.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {note.content.slice(0, 50) || 'No content'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                      className="p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-bold focus:outline-none"
                    placeholder="Note title..."
                  />
                ) : (
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {selectedNote.is_pinned && <FiStar className="w-4 h-4 text-yellow-400" />}
                    {selectedNote.title}
                  </h2>
                )}
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => togglePin(selectedNote)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedNote.is_pinned ? 'text-yellow-400 bg-yellow-400/20' : 'hover:bg-gray-700'
                        }`}
                      >
                        <FiStar />
                      </button>
                      <button
                        onClick={() => copyNote(selectedNote)}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                      >
                        {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                      </button>
                      <button
                        onClick={() => editNote(selectedNote)}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                      >
                        <FiEdit2 />
                      </button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
                      >
                        <FiSave /> Save
                      </button>
                      <button
                        onClick={() => { setIsEditing(false); setSelectedNote(notes.find(n => n.id === selectedNote.id) || null) }}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                      >
                        <FiX />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              {isEditing ? (
                <div className="px-4 py-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <FiTag className="text-gray-400" />
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Tags (comma separated)..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>
              ) : selectedNote.tags.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-700 flex flex-wrap gap-2">
                  {selectedNote.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 rounded text-xs flex items-center gap-1">
                      <FiTag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full bg-transparent resize-none focus:outline-none text-gray-200 leading-relaxed"
                    placeholder="Write your note..."
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {selectedNote.content || <span className="text-gray-500">No content</span>}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
                Created: {new Date(selectedNote.created_at).toLocaleString()} | 
                Updated: {new Date(selectedNote.updated_at).toLocaleString()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-4xl mb-4">📝</p>
                <p>Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

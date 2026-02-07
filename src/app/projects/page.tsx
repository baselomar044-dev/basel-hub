'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX, 
  FiLink, FiExternalLink, FiFolder, FiDownload, FiUpload
} from 'react-icons/fi'

interface Project {
  id: string
  name: string
  url: string
  description: string
  created_at: string
  updated_at: string
}

const MAX_PROJECTS = 10

export default function ProjectsPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // Form state
  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formDescription, setFormDescription] = useState('')

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', 'basel')
        .order('created_at', { ascending: true })
        .limit(MAX_PROJECTS)
      
      if (data) setProjects(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading projects:', error)
      // Load from localStorage as fallback
      const saved = localStorage.getItem('basel_projects')
      if (saved) setProjects(JSON.parse(saved))
    }
  }

  const saveProject = async (project: Project) => {
    try {
      await supabase.from('projects').upsert({
        ...project,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving project:', error)
    }
    // Also save locally
    const updated = projects.filter(p => p.id !== project.id)
    const newProjects = [...updated, project].slice(0, MAX_PROJECTS)
    setProjects(newProjects)
    localStorage.setItem('basel_projects', JSON.stringify(newProjects))
  }

  const handleSubmit = () => {
    if (!formName.trim() || !formUrl.trim()) {
      alert('Please fill name and URL')
      return
    }

    // Validate URL
    let url = formUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const project: Project = {
      id: editingProject?.id || `proj_${Date.now()}`,
      name: formName.trim(),
      url: url,
      description: formDescription.trim(),
      created_at: editingProject?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    saveProject(project)
    resetForm()
  }

  const resetForm = () => {
    setFormName('')
    setFormUrl('')
    setFormDescription('')
    setEditingProject(null)
    setShowForm(false)
  }

  const editProject = (project: Project) => {
    setEditingProject(project)
    setFormName(project.name)
    setFormUrl(project.url)
    setFormDescription(project.description)
    setShowForm(true)
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    
    try {
      await supabase.from('projects').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
    
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    localStorage.setItem('basel_projects', JSON.stringify(updated))
  }

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return null
    }
  }

  const exportProjects = () => {
    const data = JSON.stringify(projects, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-projects-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importProjects = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        const merged = [...imported, ...projects].slice(0, MAX_PROJECTS)
        setProjects(merged)
        localStorage.setItem('basel_projects', JSON.stringify(merged))
        merged.forEach((project: Project) => saveProject(project))
        alert('Projects imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
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
              📁 My Projects
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {projects.length}/{MAX_PROJECTS} slots
            </span>
            <button
              onClick={exportProjects}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              <FiDownload /> Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              <FiUpload /> Import
              <input type="file" accept=".json" onChange={importProjects} className="hidden" />
            </label>
            {projects.length < MAX_PROJECTS && (
              <button
                onClick={() => { resetForm(); setShowForm(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg"
              >
                <FiPlus /> Add Project
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Existing Projects */}
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {getFavicon(project.url) ? (
                    <img 
                      src={getFavicon(project.url)!} 
                      alt="" 
                      className="w-8 h-8"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <FiFolder className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                      <h3 className="font-semibold truncate">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-gray-700 rounded text-blue-400"
                        title="Open"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => editProject(project)}
                        className="p-1.5 hover:bg-gray-700 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded text-red-400"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 truncate block mt-1"
                  >
                    {project.url}
                  </a>
                  {project.description && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: MAX_PROJECTS - projects.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => { resetForm(); setShowForm(true) }}
              className="bg-gray-800/20 border border-gray-700/50 border-dashed rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800/30 transition-all h-28 flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <FiPlus className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Add Project #{projects.length + i + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiFolder /> {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-lg">
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., My Portfolio"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL *</label>
                  <div className="relative">
                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description (optional)</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief description of the project..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingProject ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

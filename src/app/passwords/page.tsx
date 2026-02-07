'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiPlus, FiTrash2, FiEdit2, FiSave, FiX, 
  FiLock, FiEye, FiEyeOff, FiCopy, FiCheck, FiDownload, 
  FiUpload, FiSearch, FiShield, FiExternalLink, FiUser, FiRefreshCw
} from 'react-icons/fi'

interface Password {
  id: string
  service: string
  username: string
  password: string
  url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export default function PasswordsPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [passwords, setPasswords] = useState<Password[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  // Form state
  const [formService, setFormService] = useState('')
  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [showFormPassword, setShowFormPassword] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadPasswords()
  }, [])

  const loadPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', 'basel')
        .order('service', { ascending: true })
      
      if (data) setPasswords(data)
      if (error) throw error
    } catch (error) {
      console.error('Error loading passwords:', error)
      const saved = localStorage.getItem('basel_passwords')
      if (saved) setPasswords(JSON.parse(saved))
    }
  }

  const savePassword = async (pwd: Password) => {
    try {
      await supabase.from('passwords').upsert({
        ...pwd,
        user_id: 'basel',
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving password:', error)
    }
    const updated = passwords.filter(p => p.id !== pwd.id)
    const newPasswords = [...updated, pwd].sort((a, b) => a.service.localeCompare(b.service))
    setPasswords(newPasswords)
    localStorage.setItem('basel_passwords', JSON.stringify(newPasswords))
  }

  const handleSubmit = () => {
    if (!formService.trim() || !formUsername.trim() || !formPassword.trim()) {
      alert('Please fill service, username, and password')
      return
    }

    const pwd: Password = {
      id: editingPassword?.id || `pwd_${Date.now()}`,
      service: formService.trim(),
      username: formUsername.trim(),
      password: formPassword,
      url: formUrl.trim() || undefined,
      notes: formNotes.trim() || undefined,
      created_at: editingPassword?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    savePassword(pwd)
    resetForm()
  }

  const resetForm = () => {
    setFormService('')
    setFormUsername('')
    setFormPassword('')
    setFormUrl('')
    setFormNotes('')
    setShowFormPassword(false)
    setEditingPassword(null)
    setShowForm(false)
  }

  const editPassword = (pwd: Password) => {
    setEditingPassword(pwd)
    setFormService(pwd.service)
    setFormUsername(pwd.username)
    setFormPassword(pwd.password)
    setFormUrl(pwd.url || '')
    setFormNotes(pwd.notes || '')
    setShowForm(true)
  }

  const deletePassword = async (id: string) => {
    if (!confirm('Delete this password?')) return
    
    try {
      await supabase.from('passwords').delete().eq('id', id)
    } catch (error) {
      console.error('Error deleting password:', error)
    }
    
    const updated = passwords.filter(p => p.id !== id)
    setPasswords(updated)
    localStorage.setItem('basel_passwords', JSON.stringify(updated))
  }

  const toggleVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyToClipboard = (id: string, text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setCopiedField(field)
    setTimeout(() => { setCopiedId(null); setCopiedField(null) }, 2000)
  }

  const generatePassword = (length: number = 16) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormPassword(password)
  }

  const maskPassword = (pwd: string) => '•'.repeat(Math.min(pwd.length, 12))

  const getFavicon = (url?: string) => {
    if (!url) return null
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return null
    }
  }

  const exportPasswords = () => {
    const data = JSON.stringify(passwords, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-passwords-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importPasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        const merged = [...imported, ...passwords]
        const unique = merged.filter((pwd, index, self) => 
          index === self.findIndex(p => p.id === pwd.id)
        )
        setPasswords(unique)
        localStorage.setItem('basel_passwords', JSON.stringify(unique))
        unique.forEach((pwd: Password) => savePassword(pwd))
        alert('Passwords imported successfully!')
      } catch {
        alert('Error importing file')
      }
    }
    reader.readAsText(file)
  }

  const filteredPasswords = passwords.filter(pwd =>
    pwd.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              🔐 Password Manager
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportPasswords}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
            >
              <FiDownload /> Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm cursor-pointer">
              <FiUpload /> Import
              <input type="file" accept=".json" onChange={importPasswords} className="hidden" />
            </label>
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg"
            >
              <FiPlus /> Add Password
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Security Notice */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
          <FiShield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-200 font-medium">Secure Password Storage</p>
            <p className="text-sm text-green-300/70 mt-1">
              Your passwords are stored locally and synced to your private Supabase database.
              Use the export feature to backup your passwords regularly.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Passwords List */}
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FiLock className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No passwords saved</p>
            <p className="text-sm mt-2">Add your first password to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPasswords.map(pwd => (
              <div
                key={pwd.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {pwd.url && getFavicon(pwd.url) ? (
                      <img 
                        src={getFavicon(pwd.url)!} 
                        alt="" 
                        className="w-8 h-8"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <FiLock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{pwd.service}</h3>
                      {pwd.url && (
                        <a
                          href={pwd.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    
                    {/* Username */}
                    <div className="flex items-center gap-2 mt-2">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{pwd.username}</span>
                      <button
                        onClick={() => copyToClipboard(pwd.id, pwd.username, 'username')}
                        className="p-1 hover:bg-gray-700 rounded"
                        title="Copy username"
                      >
                        {copiedId === pwd.id && copiedField === 'username' 
                          ? <FiCheck className="w-3 h-3 text-green-400" /> 
                          : <FiCopy className="w-3 h-3 text-gray-500" />
                        }
                      </button>
                    </div>
                    
                    {/* Password */}
                    <div className="flex items-center gap-2 mt-1">
                      <FiLock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-mono text-gray-300">
                        {visiblePasswords.has(pwd.id) ? pwd.password : maskPassword(pwd.password)}
                      </span>
                      <button
                        onClick={() => toggleVisibility(pwd.id)}
                        className="p-1 hover:bg-gray-700 rounded"
                        title={visiblePasswords.has(pwd.id) ? 'Hide' : 'Show'}
                      >
                        {visiblePasswords.has(pwd.id) 
                          ? <FiEyeOff className="w-3 h-3 text-gray-500" /> 
                          : <FiEye className="w-3 h-3 text-gray-500" />
                        }
                      </button>
                      <button
                        onClick={() => copyToClipboard(pwd.id, pwd.password, 'password')}
                        className="p-1 hover:bg-gray-700 rounded"
                        title="Copy password"
                      >
                        {copiedId === pwd.id && copiedField === 'password' 
                          ? <FiCheck className="w-3 h-3 text-green-400" /> 
                          : <FiCopy className="w-3 h-3 text-gray-500" />
                        }
                      </button>
                    </div>

                    {pwd.notes && (
                      <p className="text-xs text-gray-500 mt-2">{pwd.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => editPassword(pwd)}
                      className="p-2 hover:bg-gray-700 rounded-lg"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePassword(pwd.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FiLock /> {editingPassword ? 'Edit Password' : 'Add Password'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-800 rounded-lg">
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    placeholder="e.g., Google, GitHub, Netflix"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username / Email *</label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="username@example.com"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-24 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="p-1.5 hover:bg-gray-700 rounded"
                      >
                        {showFormPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => generatePassword()}
                        className="p-1.5 hover:bg-gray-700 rounded text-blue-400"
                        title="Generate password"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">URL (optional)</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Additional notes..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingPassword ? 'Update Password' : 'Save Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { safeStorage } from '@/lib/storage'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

interface PasswordHistoryItem {
  id: string
  password: string
  length: number
  createdAt: string
  label?: string
}

export default function PasswordGenerator() {
  const router = useRouter()
  const { isLoggedIn, t, language } = useApp()
  const isRTL = language === 'ar'

  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<PasswordHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [labelInput, setLabelInput] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    const saved = safeStorage.getItem('basel-hub-password-history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const saveHistory = (newHistory: PasswordHistoryItem[]) => {
    setHistory(newHistory)
    safeStorage.setItem('basel-hub-password-history', JSON.stringify(newHistory))
  }

  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!charset) {
      charset = 'abcdefghijklmnopqrstuvwxyz'
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)

    // Add to history
    const historyItem: PasswordHistoryItem = {
      id: Date.now().toString(),
      password: newPassword,
      length: length,
      createdAt: new Date().toISOString(),
    }
    saveHistory([historyItem, ...history].slice(0, 50)) // Keep last 50
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteFromHistory = (id: string) => {
    saveHistory(history.filter(h => h.id !== id))
  }

  const updateLabel = (id: string) => {
    saveHistory(history.map(h => 
      h.id === id ? { ...h, label: labelInput } : h
    ))
    setEditingLabel(null)
    setLabelInput('')
  }

  const clearHistory = () => {
    if (confirm(isRTL ? 'هل أنت متأكد من حذف كل السجل؟' : 'Are you sure you want to clear all history?')) {
      saveHistory([])
    }
  }

  const getStrength = () => {
    let strength = 0
    if (length >= 12) strength++
    if (length >= 16) strength++
    if (includeUppercase && includeLowercase) strength++
    if (includeNumbers) strength++
    if (includeSymbols) strength++
    return strength
  }

  const strengthLabels = isRTL
    ? ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً', 'ممتازة']
    : ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong', 'Excellent']

  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#8b5cf6']

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isLoggedIn) return null

  const strength = getStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <header className="bg-[var(--bg-secondary)]/80 backdrop-blur-lg border-b border-[var(--border)] p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {isRTL ? '→' : '←'}
          </button>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            🔐 {isRTL ? 'مولد كلمات السر' : 'Password Generator'}
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              showHistory 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'
            }`}
          >
            📜 {isRTL ? 'السجل' : 'History'} ({history.length})
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {!showHistory ? (
          <>
            {/* Generated Password Display */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
              <div className="bg-[var(--bg-primary)] rounded-xl p-4 mb-4 font-mono text-lg text-center break-all text-[var(--text-primary)]">
                {password || (isRTL ? 'اضغط توليد...' : 'Click generate...')}
              </div>

              {/* Strength Indicator */}
              {password && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {isRTL ? 'القوة:' : 'Strength:'}
                    </span>
                    <span className="text-sm font-medium" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${((strength + 1) / 6) * 100}%`,
                        backgroundColor: strengthColors[strength],
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={generatePassword}
                  className="flex-1 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  🎲 {isRTL ? 'توليد' : 'Generate'}
                </button>
                {password && (
                  <button
                    onClick={() => copyToClipboard(password)}
                    className="px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--border)] transition-colors"
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                ⚙️ {isRTL ? 'الإعدادات' : 'Options'}
              </h2>

              {/* Length Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[var(--text-secondary)]">
                    {isRTL ? 'الطول' : 'Length'}
                  </label>
                  <span className="font-mono text-[var(--accent)]">{length}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>

              {/* Character Options */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isRTL ? 'أحرف كبيرة (A-Z)' : 'Uppercase (A-Z)', state: includeUppercase, setter: setIncludeUppercase },
                  { label: isRTL ? 'أحرف صغيرة (a-z)' : 'Lowercase (a-z)', state: includeLowercase, setter: setIncludeLowercase },
                  { label: isRTL ? 'أرقام (0-9)' : 'Numbers (0-9)', state: includeNumbers, setter: setIncludeNumbers },
                  { label: isRTL ? 'رموز (!@#$)' : 'Symbols (!@#$)', state: includeSymbols, setter: setIncludeSymbols },
                ].map((option, i) => (
                  <button
                    key={i}
                    onClick={() => option.setter(!option.state)}
                    className={`p-3 rounded-xl border transition-all ${
                      option.state
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {option.state ? '✅' : '⬜'} {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* History View */
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                📜 {isRTL ? 'سجل كلمات السر' : 'Password History'}
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  🗑️ {isRTL ? 'مسح الكل' : 'Clear All'}
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-center text-[var(--text-secondary)] py-8">
                {isRTL ? 'لا يوجد سجل بعد' : 'No history yet'}
              </p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border)]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      {editingLabel === item.id ? (
                        <div className="flex gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={labelInput}
                            onChange={(e) => setLabelInput(e.target.value)}
                            placeholder={isRTL ? 'أضف وصف...' : 'Add label...'}
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm text-[var(--text-primary)]"
                            autoFocus
                          />
                          <button
                            onClick={() => updateLabel(item.id)}
                            className="text-green-500 hover:text-green-600"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => { setEditingLabel(null); setLabelInput('') }}
                            className="text-red-500 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          {item.label ? (
                            <span className="text-sm font-medium text-[var(--accent)]">{item.label}</span>
                          ) : (
                            <button
                              onClick={() => { setEditingLabel(item.id); setLabelInput(item.label || '') }}
                              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
                            >
                              + {isRTL ? 'أضف وصف' : 'Add label'}
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteFromHistory(item.id)}
                          className="text-[var(--text-secondary)] hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-[var(--text-primary)] break-all bg-[var(--bg-secondary)] rounded-lg p-2 mb-2">
                      {item.password}
                    </div>
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span>{item.length} {isRTL ? 'حرف' : 'chars'}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { safeStorage } from '@/lib/storage'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

interface QRHistoryItem {
  id: string
  text: string
  label?: string
  createdAt: string
}

export default function QRGenerator() {
  const router = useRouter()
  const { isLoggedIn, language } = useApp()
  const isRTL = language === 'ar'
  const qrRef = useRef<HTMLDivElement>(null)

  const [text, setText] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [history, setHistory] = useState<QRHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [labelInput, setLabelInput] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    const saved = safeStorage.getItem('basel-hub-qr-history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const saveHistory = (newHistory: QRHistoryItem[]) => {
    setHistory(newHistory)
    safeStorage.setItem('basel-hub-qr-history', JSON.stringify(newHistory))
  }

  const generateQR = () => {
    if (!text.trim()) return
    setQrGenerated(true)

    // Add to history if not already there
    if (!history.find(h => h.text === text.trim())) {
      const historyItem: QRHistoryItem = {
        id: Date.now().toString(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
      }
      saveHistory([historyItem, ...history].slice(0, 30)) // Keep last 30
    }
  }

  const loadFromHistory = (item: QRHistoryItem) => {
    setText(item.text)
    setQrGenerated(true)
    setShowHistory(false)
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

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('img')
    if (svg) {
      const link = document.createElement('a')
      link.download = `qr-${Date.now()}.png`
      link.href = svg.src
      link.click()
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`

  if (!isLoggedIn) return null

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
            📱 {isRTL ? 'مولد QR' : 'QR Generator'}
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
            {/* QR Display */}
            {qrGenerated && text && (
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] flex flex-col items-center">
                <div ref={qrRef} className="bg-white p-4 rounded-xl mb-4">
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <button
                  onClick={downloadQR}
                  className="px-6 py-2 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  📥 {isRTL ? 'تحميل' : 'Download'}
                </button>
              </div>
            )}

            {/* Input */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)] space-y-4">
              <label className="block text-[var(--text-secondary)] mb-2">
                {isRTL ? 'أدخل الرابط أو النص:' : 'Enter URL or text:'}
              </label>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setQrGenerated(false) }}
                placeholder={isRTL ? 'https://example.com أو أي نص...' : 'https://example.com or any text...'}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                rows={3}
                dir="auto"
              />
              <button
                onClick={generateQR}
                disabled={!text.trim()}
                className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✨ {isRTL ? 'إنشاء QR' : 'Generate QR'}
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-[var(--text-secondary)] mb-4">
                {isRTL ? 'روابط سريعة:' : 'Quick templates:'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'WhatsApp', template: 'https://wa.me/+' },
                  { label: 'Email', template: 'mailto:' },
                  { label: isRTL ? 'موقع' : 'Website', template: 'https://' },
                  { label: 'WiFi', template: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setText(item.template)}
                    className="p-3 bg-[var(--bg-primary)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] border border-[var(--border)] transition-colors"
                  >
                    {item.label}
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
                📜 {isRTL ? 'سجل الـ QR' : 'QR History'}
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
                          onClick={() => loadFromHistory(item)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => deleteFromHistory(item.id)}
                          className="text-[var(--text-secondary)] hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--text-primary)] break-all bg-[var(--bg-secondary)] rounded-lg p-2 mb-2" dir="auto">
                      {item.text}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {formatDate(item.createdAt)}
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

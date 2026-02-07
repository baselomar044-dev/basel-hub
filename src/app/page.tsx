'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t, login, isLoggedIn, language, setLanguage } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const success = await login(password)
    
    if (success) {
      router.push('/dashboard')
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setPassword('')
    }
    setLoading(false)
  }

  if (isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className={`card max-w-md w-full relative z-10 ${shake ? 'animate-shake' : ''}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Basel Hub</h1>
          <p className="text-[var(--text-secondary)] text-sm">Professional Command Center</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setLanguage('ar')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              language === 'ar' 
                ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              language === 'en' 
                ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            English
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder={t('enterPassword')}
              className={`text-center text-xl tracking-[0.3em] font-mono ${
                error ? 'border-red-500 focus:border-red-500' : ''
              }`}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-red-400 text-sm text-center mt-3 animate-fadeIn flex items-center justify-center gap-2">
                <span>⚠️</span>
                {t('wrongPassword')}
              </p>
            )}
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'ar' ? 'جاري الدخول...' : 'Logging in...'}
              </span>
            ) : (
              t('login')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[var(--text-muted)] text-xs">
            © 2024 Basel Hub • All Rights Reserved
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { safeStorage } from '@/lib/storage'
import { translations, TranslationKey } from '@/lib/translations'
import { supabase } from '@/lib/supabase'

type Language = 'ar' | 'en'

interface UserProfile {
  id: string
  name: string
  email: string
  created_at: string
}

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isLoggedIn: boolean
  isAuthenticated: boolean // Alias for isLoggedIn
  setIsLoggedIn: (value: boolean) => void
  setIsAuthenticated: (value: boolean) => void // Alias for setIsLoggedIn
  login: (password: string) => Promise<boolean>
  logout: () => void
  user: UserProfile | null
  ownerName: string
  userName: string
  t: (key: TranslationKey) => string
  syncData: () => Promise<void>
}

const OWNER_PASSWORD = '160692'
const OWNER_NAME = 'Basel'
const OWNER_ID = 'basel-main-user'

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoggedIn, setIsLoggedInState] = useState(false)
  const [user, setUserState] = useState<UserProfile | null>(null)

  // Initialize user on successful login
  const initializeUser = async () => {
    const userProfile: UserProfile = {
      id: OWNER_ID,
      name: OWNER_NAME,
      email: 'basel@baselhub.app',
      created_at: new Date().toISOString()
    }
    setUserState(userProfile)
    safeStorage.setItem('basel-hub-user', JSON.stringify(userProfile))
    
    // Sync with Supabase
    try {
      await syncData()
    } catch (e) {
      console.log('Offline mode - data will sync when online')
    }
  }

  // Load from storage ONLY after mount (client-side)
  useEffect(() => {
    const savedLang = safeStorage.getItem('basel-hub-language') as Language
    const savedLogin = safeStorage.getItem('basel-hub-logged-in')
    const savedUser = safeStorage.getItem('basel-hub-user')
    
    if (savedLang) setLanguageState(savedLang)
    if (savedLogin === 'true') {
      setIsLoggedInState(true)
      if (savedUser) {
        try {
          setUserState(JSON.parse(savedUser))
        } catch {}
      }
    }
    
    setMounted(true)
  }, [])

  // Apply language direction
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    safeStorage.setItem('basel-hub-language', lang)
  }

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)
  }

  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value)
    safeStorage.setItem('basel-hub-logged-in', value ? 'true' : 'false')
  }

  const login = async (password: string): Promise<boolean> => {
    if (password === OWNER_PASSWORD) {
      setIsLoggedIn(true)
      await initializeUser()
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserState(null)
    safeStorage.removeItem('basel-hub-logged-in')
    safeStorage.removeItem('basel-hub-user')
  }

  // Sync data with Supabase
  const syncData = async () => {
    if (!supabase) return
    
    try {
      // Ensure user exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', OWNER_ID)
        .single()
      
      if (!existingUser) {
        await supabase.from('users').insert({
          id: OWNER_ID,
          name: OWNER_NAME,
          email: 'basel@baselhub.app',
          settings: { language, theme: 'dark' }
        })
      }
    } catch (e) {
      console.log('Sync error:', e)
    }
  }

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🚀</span>
          </div>
          <div className="text-white/60 text-sm">Loading Basel Hub...</div>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      isLoggedIn,
      isAuthenticated: isLoggedIn, // Alias
      setIsLoggedIn,
      setIsAuthenticated: setIsLoggedIn, // Alias
      login,
      logout,
      user,
      ownerName: OWNER_NAME,
      userName: OWNER_NAME,
      t,
      syncData,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

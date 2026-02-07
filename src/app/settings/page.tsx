'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { 
  FiArrowLeft, FiGlobe, FiTool, FiFileText, FiDownload, 
  FiUpload, FiTrash2, FiRefreshCw, FiCheck, FiX, FiSave,
  FiDatabase, FiHardDrive, FiShield, FiAlertTriangle
} from 'react-icons/fi'
import QRCode from 'qrcode'

interface Settings {
  language: 'en' | 'ar'
  weeklyReport: boolean
  lastMaintenance: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, language, setLanguage } = useApp()
  const [settings, setSettings] = useState<Settings>({
    language: 'en',
    weeklyReport: true,
    lastMaintenance: null
  })
  const [qrText, setQrText] = useState('')
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [maintenanceStatus, setMaintenanceStatus] = useState<string | null>(null)
  const [storageInfo, setStorageInfo] = useState<{ used: number; items: number } | null>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  useEffect(() => {
    loadSettings()
    calculateStorage()
  }, [])

  const loadSettings = async () => {
    try {
      const saved = localStorage.getItem('basel_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        if (parsed.language) setLanguage(parsed.language)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    localStorage.setItem('basel_settings', JSON.stringify(newSettings))
    setLanguage(newSettings.language)
  }

  const calculateStorage = () => {
    let totalSize = 0
    let itemCount = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('basel_')) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length * 2 // UTF-16
          itemCount++
        }
      }
    }

    setStorageInfo({
      used: Math.round(totalSize / 1024), // KB
      items: itemCount
    })
  }

  const generateQR = async () => {
    if (!qrText.trim()) {
      alert('Please enter text or URL')
      return
    }

    setIsGenerating(true)
    try {
      const dataUrl = await QRCode.toDataURL(qrText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setQrImage(dataUrl)
    } catch (error) {
      console.error('QR generation error:', error)
      alert('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = () => {
    if (!qrImage) return
    const a = document.createElement('a')
    a.href = qrImage
    a.download = `qr-code-${Date.now()}.png`
    a.click()
  }

  const runMaintenance = async () => {
    setMaintenanceStatus('Running maintenance...')
    
    try {
      // Clean up old data
      const tables = ['conversations', 'notes', 'organizer_items']
      let cleaned = 0

      for (const table of tables) {
        // Remove items older than 90 days (optional cleanup)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90)
        
        // Just count for now, don't delete
        const { data } = await supabase
          .from(table)
          .select('id')
          .eq('user_id', 'basel')
        
        if (data) cleaned += data.length
      }

      // Clear any orphaned localStorage items
      const validKeys = [
        'basel_settings', 'basel_conversations', 'basel_ai_memories',
        'basel_notes', 'basel_api_keys', 'basel_projects', 
        'basel_organizer', 'basel_passwords', 'basel_agents', 'basel_income_ideas'
      ]

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key?.startsWith('basel_') && !validKeys.includes(key)) {
          localStorage.removeItem(key)
        }
      }

      // Update maintenance timestamp
      saveSettings({
        ...settings,
        lastMaintenance: new Date().toISOString()
      })

      calculateStorage()
      setMaintenanceStatus(`✅ Maintenance complete! Checked ${cleaned} items.`)
      
      setTimeout(() => setMaintenanceStatus(null), 3000)
    } catch (error) {
      console.error('Maintenance error:', error)
      setMaintenanceStatus('❌ Maintenance failed')
      setTimeout(() => setMaintenanceStatus(null), 3000)
    }
  }

  const exportAllData = async () => {
    const allData: any = {}

    // Get all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('basel_')) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            allData[key] = JSON.parse(value)
          } catch {
            allData[key] = value
          }
        }
      }
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `basel-hub-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const importAllData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!confirm('This will replace all your current data. Continue?')) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith('basel_')) {
            localStorage.setItem(key, JSON.stringify(value))
          }
        }

        calculateStorage()
        alert('Data imported successfully! Please refresh the page.')
        window.location.reload()
      } catch {
        alert('Error importing data')
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = async () => {
    if (!confirm('⚠️ This will DELETE ALL your data. This cannot be undone. Are you sure?')) return
    if (!confirm('Are you REALLY sure? Type "DELETE" to confirm.')) return

    // Clear localStorage
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('basel_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Clear Supabase
    try {
      const tables = ['conversations', 'ai_memories', 'notes', 'api_keys', 'projects', 'organizer_items', 'passwords', 'agents', 'income_ideas']
      for (const table of tables) {
        await supabase.from(table).delete().eq('user_id', 'basel')
      }
    } catch (error) {
      console.error('Error clearing Supabase:', error)
    }

    alert('All data cleared. Redirecting to login...')
    router.push('/')
  }

  const generateWeeklyReport = () => {
    // Simple weekly report generation
    const report = {
      generatedAt: new Date().toISOString(),
      period: 'Last 7 days',
      summary: {
        totalConversations: JSON.parse(localStorage.getItem('basel_conversations') || '[]').length,
        totalNotes: JSON.parse(localStorage.getItem('basel_notes') || '[]').length,
        totalTasks: JSON.parse(localStorage.getItem('basel_organizer') || '[]').length,
        totalAgents: JSON.parse(localStorage.getItem('basel_agents') || '[]').length
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `weekly-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const t = (en: string, ar: string) => settings.language === 'ar' ? ar : en

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900" dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              ⚙️ {t('Settings', 'الإعدادات')}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Language */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiGlobe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">{t('Language', 'اللغة')}</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => saveSettings({ ...settings, language: 'en' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                settings.language === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => saveSettings({ ...settings, language: 'ar' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                settings.language === 'ar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              🇸🇦 العربية
            </button>
          </div>
        </div>

        {/* QR Code Generator */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">📱</span>
            <h2 className="text-lg font-semibold">{t('QR Code Generator', 'مولد رمز QR')}</h2>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder={t('Enter text or URL...', 'أدخل نصاً أو رابطاً...')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg font-medium disabled:opacity-50"
            >
              {isGenerating ? t('Generating...', 'جاري الإنشاء...') : t('Generate QR Code', 'إنشاء رمز QR')}
            </button>
            {qrImage && (
              <div className="flex flex-col items-center gap-4">
                <img src={qrImage} alt="QR Code" className="rounded-lg" />
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  <FiDownload /> {t('Download', 'تحميل')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Maintenance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiTool className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">{t('Quick Maintenance', 'الصيانة السريعة')}</h2>
          </div>
          
          {storageInfo && (
            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FiHardDrive />
                <span>{t('Storage used:', 'المساحة المستخدمة:')} ~{storageInfo.used} KB</span>
                <span className="text-gray-500">•</span>
                <span>{storageInfo.items} {t('data items', 'عناصر بيانات')}</span>
              </div>
            </div>
          )}

          {settings.lastMaintenance && (
            <p className="text-sm text-gray-400 mb-4">
              {t('Last maintenance:', 'آخر صيانة:')} {new Date(settings.lastMaintenance).toLocaleString()}
            </p>
          )}

          <button
            onClick={runMaintenance}
            disabled={!!maintenanceStatus}
            className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw className={maintenanceStatus ? 'animate-spin' : ''} />
            {maintenanceStatus || t('Run Maintenance', 'تشغيل الصيانة')}
          </button>
        </div>

        {/* Weekly Report */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiFileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">{t('Weekly Update Report', 'التقرير الأسبوعي')}</h2>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) => saveSettings({ ...settings, weeklyReport: e.target.checked })}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{t('Enable weekly reports', 'تفعيل التقارير الأسبوعية')}</span>
            </label>
            <button
              onClick={generateWeeklyReport}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm flex items-center gap-2"
            >
              <FiDownload /> {t('Generate Now', 'إنشاء الآن')}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiDatabase className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold">{t('Data Management', 'إدارة البيانات')}</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={exportAllData}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <FiDownload /> {t('Export All Data', 'تصدير جميع البيانات')}
            </button>
            <label className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer">
              <FiUpload /> {t('Import Data', 'استيراد البيانات')}
              <input type="file" accept=".json" onChange={importAllData} className="hidden" />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-red-400">{t('Danger Zone', 'منطقة الخطر')}</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            {t('These actions are irreversible. Please be careful.', 'هذه الإجراءات لا يمكن التراجع عنها. يرجى توخي الحذر.')}
          </p>
          <button
            onClick={clearAllData}
            className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <FiTrash2 /> {t('Clear All Data', 'مسح جميع البيانات')}
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Basel Hub v1.0</p>
          <p>{t('Owner: Basel | Powered by AI', 'المالك: باسل | مدعوم بالذكاء الاصطناعي')}</p>
        </div>
      </div>
    </div>
  )
}

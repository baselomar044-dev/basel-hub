'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Link from 'next/link'
import { 
  FiMessageSquare, FiEdit3, FiCalendar, FiKey, FiLock, 
  FiSettings, FiLogOut, FiCpu, FiDollarSign, FiFolder, FiZap
} from 'react-icons/fi'

const TOOLS = [
  {
    id: 'chat',
    name: 'AI Chat',
    description: '5 Specialized AI assistants',
    icon: FiMessageSquare,
    color: 'from-blue-500 to-cyan-500',
    href: '/chat',
    emoji: '🤖'
  },
  {
    id: 'agents',
    name: 'Agent Generator',
    description: 'Create custom AI agents',
    icon: FiCpu,
    color: 'from-purple-500 to-pink-500',
    href: '/agents',
    emoji: '🧠'
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Quick notes & thoughts',
    icon: FiEdit3,
    color: 'from-yellow-500 to-orange-500',
    href: '/notes',
    emoji: '📝'
  },
  {
    id: 'organizer',
    name: 'Organizer',
    description: 'Tasks, events & reminders',
    icon: FiCalendar,
    color: 'from-green-500 to-emerald-500',
    href: '/organizer',
    emoji: '📋'
  },
  {
    id: 'income',
    name: 'Income Ideas',
    description: 'Track income opportunities',
    icon: FiDollarSign,
    color: 'from-emerald-500 to-teal-500',
    href: '/income',
    emoji: '💰'
  },
  {
    id: 'projects',
    name: 'My Projects',
    description: '10 project slots',
    icon: FiFolder,
    color: 'from-indigo-500 to-purple-500',
    href: '/projects',
    emoji: '📁'
  },
  {
    id: 'wallet',
    name: 'API Wallet',
    description: 'Store your API keys',
    icon: FiKey,
    color: 'from-amber-500 to-yellow-500',
    href: '/wallet',
    emoji: '🔑'
  },
  {
    id: 'passwords',
    name: 'Passwords',
    description: 'Secure password manager',
    icon: FiLock,
    color: 'from-red-500 to-rose-500',
    href: '/passwords',
    emoji: '🔐'
  },
  {
    id: 'qr',
    name: 'QR Generator',
    description: 'Create QR codes instantly',
    icon: FiZap,
    color: 'from-pink-500 to-rose-500',
    href: '/qr',
    emoji: '📱'
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Language & maintenance',
    icon: FiSettings,
    color: 'from-gray-500 to-slate-500',
    href: '/settings',
    emoji: '⚙️'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated, userName } = useApp()
  const [greeting, setGreeting] = useState('Hello')
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    // Set greeting based on time
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Update time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, router])

  const handleLogout = () => {
    setIsAuthenticated(false)
    router.push('/')
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 text-transparent bg-clip-text">
              Basel Hub
            </h1>
            <p className="text-sm text-gray-400">{currentTime}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">{greeting},</p>
              <p className="font-semibold">{userName || 'Basel'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-green-600/20 border border-blue-500/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="text-5xl">👋</div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {greeting}, {userName || 'Basel'}!
              </h2>
              <p className="text-gray-300 mt-1">
                Your personal AI-powered workspace is ready. What would you like to work on today?
              </p>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <FiZap className="text-yellow-400" /> AI Assistants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.filter(t => ['chat', 'agents'].includes(t.id)).map(tool => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {tool.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <FiFolder className="text-blue-400" /> Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOOLS.filter(t => !['chat', 'agents'].includes(t.id)).map(tool => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl shadow-lg mb-3`}>
                    {tool.emoji}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStat label="AI Chats" value="5" icon="🤖" color="blue" />
          <QuickStat label="Tools" value="10" icon="🛠️" color="green" />
          <QuickStat label="AI Models" value="3" icon="⚡" color="purple" />
          <QuickStat label="Storage" value="Sync" icon="☁️" color="cyan" />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Basel Hub v1.0 • Powered by AI</p>
          <p className="mt-1">Owner: Basel • Password Protected</p>
        </div>
      </main>
    </div>
  )
}

function QuickStat({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'

interface ComputerUseProps {
  isOpen: boolean
  onClose: () => void
  initialUrl?: string
  aiControlled?: boolean
  onAction?: (action: {type: string, url?: string, screenshot?: string, content?: string}) => void
}

interface TerminalLine {
  type: 'input' | 'output' | 'error'
  content: string
  timestamp: number
}

export default function ComputerUse({ isOpen, onClose, initialUrl, aiControlled, onAction }: ComputerUseProps) {
  const [activeTab, setActiveTab] = useState<'browser' | 'terminal'>('browser')
  const [urlInput, setUrlInput] = useState(initialUrl || 'https://www.google.com')
  const [currentUrl, setCurrentUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [terminal, setTerminal] = useState<TerminalLine[]>([])
  const [terminalInput, setTerminalInput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [bookmarks, setBookmarks] = useState<{name: string, url: string}[]>([
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'GitHub', url: 'https://www.github.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'Dubai Municipality', url: 'https://www.dm.gov.ae' },
    { name: 'DEWA', url: 'https://www.dewa.gov.ae' },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (initialUrl && isOpen) {
      setUrlInput(initialUrl)
      navigateTo(initialUrl)
    }
  }, [initialUrl, isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminal])

  const navigateTo = (url: string) => {
    if (!url) return
    
    let fullUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url
    }

    setIsLoading(true)
    setCurrentUrl(fullUrl)
    setUrlInput(fullUrl)
    setIframeKey(prev => prev + 1)
    
    // Add to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), fullUrl])
    setHistoryIndex(prev => prev + 1)

    if (onAction) {
      onAction({ type: 'navigate', url: fullUrl })
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrlInput(history[newIndex])
      setIframeKey(prev => prev + 1)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrlInput(history[newIndex])
      setIframeKey(prev => prev + 1)
    }
  }

  const refresh = () => {
    setIframeKey(prev => prev + 1)
    setIsLoading(true)
  }

  const addBookmark = () => {
    const name = prompt('اسم الـ Bookmark:')
    if (name && currentUrl) {
      setBookmarks(prev => [...prev, { name, url: currentUrl }])
    }
  }

  const executeCommand = async () => {
    if (!terminalInput.trim() || isExecuting) return

    const command = terminalInput.trim()
    setTerminal(prev => [...prev, { type: 'input', content: `$ ${command}`, timestamp: Date.now() }])
    setTerminalInput('')
    setIsExecuting(true)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: command, language: 'bash' })
      })
      const data = await res.json()
      
      if (data.error) {
        setTerminal(prev => [...prev, { type: 'error', content: data.error, timestamp: Date.now() }])
      } else {
        setTerminal(prev => [...prev, { type: 'output', content: data.output || 'Command executed', timestamp: Date.now() }])
      }

      if (onAction) {
        onAction({ type: 'terminal', content: data.output || data.error })
      }
    } catch (error) {
      setTerminal(prev => [...prev, { type: 'error', content: `Error: ${error}`, timestamp: Date.now() }])
    }

    setIsExecuting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('browser')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'browser' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌐 Browser
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'terminal' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              💻 Terminal
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Browser Tab */}
        {activeTab === 'browser' && (
          <div className="flex-1 flex flex-col">
            {/* URL Bar */}
            <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
              <button
                onClick={goBack}
                disabled={historyIndex <= 0}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
              >
                ◀
              </button>
              <button
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
              >
                ▶
              </button>
              <button
                onClick={refresh}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white"
              >
                🔄
              </button>
              <div className="flex-1 flex items-center bg-gray-700 rounded-lg overflow-hidden">
                <span className="px-2 text-green-400">🔒</span>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && navigateTo(urlInput)}
                  placeholder="ادخل العنوان..."
                  className="flex-1 bg-transparent border-none outline-none px-2 py-2 text-white"
                />
                <button
                  onClick={() => navigateTo(urlInput)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go
                </button>
              </div>
              <button
                onClick={addBookmark}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-yellow-400"
                title="Add Bookmark"
              >
                ⭐
              </button>
            </div>

            {/* Bookmarks Bar */}
            <div className="flex items-center gap-1 p-2 bg-gray-800/50 border-b border-gray-700 overflow-x-auto">
              {bookmarks.map((bm, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo(bm.url)}
                  className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-300 whitespace-nowrap"
                >
                  {bm.name}
                </button>
              ))}
            </div>

            {/* Browser Content - Actual iframe */}
            <div className="flex-1 relative bg-white">
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">🌐</div>
                    <p className="text-white">Loading...</p>
                  </div>
                </div>
              )}
              
              {currentUrl ? (
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={currentUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                  title="Browser"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white">
                  <div className="text-6xl mb-4">🖥️</div>
                  <h2 className="text-2xl font-bold mb-2">Computer Use</h2>
                  <p className="text-gray-400 mb-6">تصفح الإنترنت أو استخدم Terminal</p>
                  
                  {/* Quick Links */}
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    {bookmarks.slice(0, 6).map((bm, i) => (
                      <button
                        key={i}
                        onClick={() => navigateTo(bm.url)}
                        className="p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all"
                      >
                        <div className="text-2xl mb-1">🌐</div>
                        <div className="text-sm">{bm.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 py-1 bg-gray-800 text-xs text-gray-400 border-t border-gray-700">
              <span>{currentUrl || 'Ready'}</span>
              <span>{isLoading ? 'Loading...' : 'Done'}</span>
            </div>
          </div>
        )}

        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div className="flex-1 flex flex-col bg-black">
            {/* Terminal Output */}
            <div 
              ref={terminalRef}
              className="flex-1 p-4 overflow-y-auto font-mono text-sm"
            >
              <div className="text-green-400 mb-2">
                🖥️ Basel Hub Terminal v1.0
              </div>
              <div className="text-gray-500 mb-4">
                Type commands and press Enter to execute
              </div>
              
              {terminal.map((line, i) => (
                <div 
                  key={i} 
                  className={`mb-1 ${
                    line.type === 'input' ? 'text-cyan-400' :
                    line.type === 'error' ? 'text-red-400' :
                    'text-gray-300'
                  }`}
                >
                  <pre className="whitespace-pre-wrap">{line.content}</pre>
                </div>
              ))}
              
              {isExecuting && (
                <div className="text-yellow-400 animate-pulse">Executing...</div>
              )}
            </div>

            {/* Terminal Input */}
            <div className="flex items-center gap-2 p-3 bg-gray-900 border-t border-gray-800">
              <span className="text-green-400 font-mono">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                disabled={isExecuting}
              />
              <button
                onClick={executeCommand}
                disabled={isExecuting || !terminalInput.trim()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-white"
              >
                Run
              </button>
            </div>

            {/* Quick Commands */}
            <div className="flex items-center gap-2 p-2 bg-gray-900 border-t border-gray-800 overflow-x-auto">
              {['ls -la', 'pwd', 'date', 'whoami', 'python --version', 'node --version'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => { setTerminalInput(cmd); executeCommand() }}
                  className="px-2 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700 text-gray-400 whitespace-nowrap"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import EmailManager from './components/EmailManager'
import SavedPrompts from './components/SavedPrompts'
import Settings from './components/Settings'
import Logo from './components/Logo'
import { Message } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showEmailManager, setShowEmailManager] = useState(false)
  const [showSavedPrompts, setShowSavedPrompts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply initial dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm TOAI, your AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', newMode.toString())
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Mobile Top Bar - hidden on Settings dashboard */}
      {!showSettings && (
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 text-slate-800 dark:text-slate-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center">
            <Logo size="small" />
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </header>
      )}

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Desktop Sidebar - Hidden when Settings is shown */}
        {!showSettings && (
          <div className="hidden md:block h-full">
            <Sidebar
            onNewChat={() => {
              setMessages([])
              setShowEmailManager(false)
              setShowSavedPrompts(false)
              setShowSettings(false)
            }}
            onToggleDarkMode={toggleDarkMode}
            isDarkMode={isDarkMode}
            onOpenEmail={() => {
              setShowEmailManager(true)
              setShowSavedPrompts(false)
              setShowSettings(false)
            }}
            onOpenSavedPrompts={() => {
              setShowSavedPrompts(true)
              setShowEmailManager(false)
              setShowSettings(false)
            }}
            onOpenSettings={() => {
              setShowSettings(true)
              setShowEmailManager(false)
              setShowSavedPrompts(false)
            }}
          />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpenMobile && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Sidebar panel on the left */}
            <div className="w-72 max-w-[80%] h-full shadow-2xl animate-slide-up bg-white/90 dark:bg-slate-900/90">
              <Sidebar
                onNewChat={() => {
                  setMessages([])
                  setShowEmailManager(false)
                  setShowSavedPrompts(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onToggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
                onOpenEmail={() => {
                  setShowEmailManager(true)
                  setShowSavedPrompts(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onOpenSavedPrompts={() => {
                  setShowSavedPrompts(true)
                  setShowEmailManager(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onOpenSettings={() => {
                  setShowSettings(true)
                  setShowEmailManager(false)
                  setShowSavedPrompts(false)
                  setIsSidebarOpenMobile(false)
                }}
              />
            </div>
            {/* Backdrop on the remaining right area */}
            <button
              className="flex-1 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsSidebarOpenMobile(false)}
              aria-label="Close menu"
            />
          </div>
        )}

        {/* Main Content Scroll Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className={`flex-1 flex flex-col px-0 sm:px-0 ${showSettings ? 'settings-enter' : 'home-enter'}`}>
            {showSettings ? (
              <Settings onClose={() => setShowSettings(false)} />
            ) : showEmailManager ? (
              <EmailManager onClose={() => setShowEmailManager(false)} />
            ) : showSavedPrompts ? (
              <SavedPrompts onClose={() => setShowSavedPrompts(false)} />
            ) : (
              <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App


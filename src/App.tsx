import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import EmailManager from './components/EmailManager'
import SavedPrompts from './components/SavedPrompts'
import Settings from './components/Settings'
import Logo from './components/Logo'
import { Message, Project } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showEmailManager, setShowEmailManager] = useState(false)
  const [showSavedPrompts, setShowSavedPrompts] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
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

  const createProject = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = Date.now().toString()
    const project: Project = { id, name: trimmed }
    setProjects((prev) => [...prev, project])
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

  const activeProjectName = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)?.name
    : undefined

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
                setSelectedProjectId(null)
                setShowEmailManager(false)
                setShowSavedPrompts(false)
                setShowProjects(false)
                setShowSettings(false)
              }}
              onToggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
              onOpenEmail={() => {
                setShowEmailManager(true)
                setShowSavedPrompts(false)
                setShowProjects(false)
                setShowSettings(false)
              }}
              onOpenSavedPrompts={() => {
                setShowSavedPrompts(true)
                setShowEmailManager(false)
                setShowProjects(false)
                setShowSettings(false)
              }}
              projects={projects}
              onOpenProjectsHome={() => {
                setNewProjectName('')
                setShowProjects(true)
                setShowEmailManager(false)
                setShowSavedPrompts(false)
                setShowSettings(false)
              }}
              onNewProject={() => {
                setNewProjectName('')
                setShowProjects(true)
              }}
              onOpenProject={(id) => {
                setSelectedProjectId(id)
                setMessages([])
                setShowEmailManager(false)
                setShowSavedPrompts(false)
                setShowProjects(false)
                setShowSettings(false)
              }}
              onOpenSettings={() => {
                setShowSettings(true)
                setShowEmailManager(false)
                setShowSavedPrompts(false)
                setShowProjects(false)
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
                  setShowProjects(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onToggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
                onOpenEmail={() => {
                  setShowEmailManager(true)
                  setShowSavedPrompts(false)
                  setShowProjects(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onOpenSavedPrompts={() => {
                  setShowSavedPrompts(true)
                  setShowEmailManager(false)
                  setShowProjects(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                projects={projects}
                onOpenProjectsHome={() => {
                  setNewProjectName('')
                  setShowProjects(true)
                  setShowEmailManager(false)
                  setShowSavedPrompts(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onNewProject={() => {
                  setNewProjectName('')
                  setShowProjects(true)
                  setIsSidebarOpenMobile(false)
                }}
                onOpenProject={(id) => {
                  setSelectedProjectId(id)
                  setMessages([])
                  setShowEmailManager(false)
                  setShowSavedPrompts(false)
                  setShowProjects(false)
                  setShowSettings(false)
                  setIsSidebarOpenMobile(false)
                }}
                onOpenSettings={() => {
                  setShowSettings(true)
                  setShowEmailManager(false)
                  setShowSavedPrompts(false)
                  setShowProjects(false)
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
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                activeProjectName={activeProjectName}
              />
            )}
          </div>
        </main>
      </div>

      {/* Create project popup - matches existing app light/dark theme */}
      {showProjects && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-xs dark:bg-slate-800 dark:text-slate-100">
                  ⟳
                </span>
                <span className="text-sm font-semibold">Create project</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-300"
                  aria-label="Project settings"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowProjects(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-800 dark:text-slate-300"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 pt-4 pb-3 space-y-4">
              {/* Input */}
              <div className="relative">
                <input
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter the project name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Suggested chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['Investing', 'Homework', 'Writing', 'Health', 'Travel'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNewProjectName(label)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Info card */}
              <div className="flex gap-3 rounded-xl bg-slate-100 px-3 py-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <div className="mt-0.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    ⓘ
                  </span>
                </div>
                <p className="leading-snug">
                  Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just
                  to keep things tidy.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 pb-4">
              <button
                type="button"
                disabled={!newProjectName.trim()}
                onClick={() => {
                  const name = newProjectName.trim()
                  if (!name) return
                  createProject(name)
                  setNewProjectName('')
                  setShowProjects(false)
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  newProjectName.trim()
                    ? 'bg-teal-500 text-white hover:bg-teal-400'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App


import { useEffect, useState } from 'react'
import Logo from './Logo'
import { ChatHistory, Project } from '../types'
import { fetchMyMessages } from '../api'

interface SidebarProps {
  onNewChat: () => void
  onToggleDarkMode: () => void
  isDarkMode: boolean
  onOpenEmail: () => void
  onOpenSavedPrompts: () => void
  projects: Project[]
  onOpenProjectsHome: () => void
  onNewProject: () => void
  onOpenProject: (id: string) => void
  onOpenSettings: () => void
  onOpenSession: (sessionId: string) => void
}

const Sidebar = ({
  onNewChat,
  onToggleDarkMode,
  isDarkMode,
  onOpenEmail,
  onOpenSavedPrompts,
  projects,
  onOpenProjectsHome,
  onNewProject,
  onOpenProject,
  onOpenSettings,
  onOpenSession,
}: SidebarProps) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [isExploreOpen, setIsExploreOpen] = useState(true)

  // Load recent chat history from backend (toai_message)
  useEffect(() => {
    const loadHistory = async () => {
      const messages = await fetchMyMessages(50)

      // Group messages by session_id and build simple titles from first user message
      // Skip project-based conversations from the generic Recent list
      const sessions: Record<string, ChatHistory> = {}
      for (const msg of messages) {
        if ((msg as any).project) continue

        const key = msg.session_id
        const isUser = msg.sender_type === 'user'

        if (!sessions[key]) {
          sessions[key] = {
            id: key,
            title: isUser ? msg.message.slice(0, 60) || 'New conversation' : 'New conversation',
            timestamp: new Date(msg.created_at),
          }
        } else if (new Date(msg.created_at) > sessions[key].timestamp) {
          sessions[key].timestamp = new Date(msg.created_at)
          if (isUser && msg.message) {
            sessions[key].title = msg.message.slice(0, 60)
          }
        }
      }

      const list = Object.values(sessions).sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      )
      setChatHistory(list.slice(0, 10))
    }

    loadHistory()
  }, [])

  return (
    <div className="w-full md:w-72 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Logo Section (aligned with main header border) */}
      <div className="px-5 pt-[25px] pb-[25px] border-b border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <Logo size="default" />
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white text-sm font-medium shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* TOAIs Section */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setIsExploreOpen(!isExploreOpen)}
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span>TOAIs</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExploreOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Submenu */}
        {isExploreOpen && (
          // Left margin further reduced so items align tightly under the "O" of "TOAIs"
          <div className="mt-1 ml-2 space-y-1 animate-slide-up">
            <button 
              onClick={onOpenSavedPrompts}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Prompts
            </button>
            <button 
              onClick={onOpenEmail}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="px-4 pb-2">
        {projects.length === 0 ? (
          // When no projects, show single "Projects" row that opens popup
          <button
            onClick={onOpenProjectsHome}
            className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  />
                </svg>
              </span>
              <span>Projects</span>
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Projects
              </span>
            </div>
            <div className="space-y-1">
              <button
                onClick={onNewProject}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors flex items-center gap-2"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 text-[11px]">
                  +
                </span>
                New project
              </button>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onOpenProject(project.id)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Chat History */}
      <div className="px-4 pb-2">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
          Recent
        </div>
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onOpenSession(chat.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150 truncate"
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <button
          onClick={onToggleDarkMode}
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150 flex items-center gap-3"
        >
          {isDarkMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark Mode
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar


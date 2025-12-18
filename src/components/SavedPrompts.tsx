import { useEffect, useState } from 'react'
import { listUserSaves, UserSave } from '../api'

interface SavedPromptsProps {
  onClose: () => void
}

interface Prompt {
  id: string
  title: string
  description: string
  owner: string
  lastRun: string
  tags: string[]
  scope?: string | null
  promptTemplate?: string | null
}

const SavedPrompts = ({ onClose }: SavedPromptsProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    myPrompts: false,
    teamPrompts: false,
    favorites: false
  })
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [scheduleName, setScheduleName] = useState('')
  const [scheduleDescription, setScheduleDescription] = useState('')
  const [scheduleTags, setScheduleTags] = useState('')
  const [scheduleScope, setScheduleScope] = useState('')
  const [scheduleTemplate, setScheduleTemplate] = useState('')

  useEffect(() => {
    const loadSaves = async () => {
      const items = await listUserSaves({ limit: 100, offset: 0 })
      const ownerEmail = localStorage.getItem('authEmail') || 'You'
      const mapped: Prompt[] = items.map((s: UserSave) => ({
        id: String(s.id),
        title: s.name || 'Untitled prompt',
        description: s.description || '',
        owner: ownerEmail,
        lastRun: s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
        tags: (s.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        scope: s.scope,
        promptTemplate: s.prompt_template,
      }))
      setPrompts(mapped)
    }
    void loadSaves()
  }, [])

  const openScheduleModal = (prompt: Prompt) => {
    setActivePrompt(prompt)
    setScheduleName(prompt.title)
    setScheduleDescription(prompt.description)
    setScheduleTags(prompt.tags.join(', '))
    setScheduleScope(prompt.scope || '')
    setScheduleTemplate(prompt.promptTemplate || prompt.description)
    setShowScheduleModal(true)
  }

  return (
  <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-[240px]">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                TOAI — Prompt Library
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Save prompts, run them, schedule & share with your team.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium w-full sm:w-auto">
              Save Prompt (from chat)
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white font-medium shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm">
              + New Prompt
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-full md:w-72 border-b md:border-b-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
              />
            </div>

            {/* Filters */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Filters</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.myPrompts}
                    onChange={(e) => setFilters({ ...filters, myPrompts: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">My prompts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.teamPrompts}
                    onChange={(e) => setFilters({ ...filters, teamPrompts: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Team prompts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.favorites}
                    onChange={(e) => setFilters({ ...filters, favorites: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Favorites</span>
                </label>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Quick templates</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Onboarding checklist
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Proposal draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Library</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Browse saved prompts — search, run or schedule them.
                </p>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Total: {prompts.length}
              </span>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {prompt.description}
                      </p>
                    </div>

                    {/* Compact avatar + copy/edit icons for each saved prompt */}
                    <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 ml-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white shadow-soft">
                        {prompt.owner.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Copy */}
                        <button
                          type="button"
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Copy prompt"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M10 18h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          type="button"
                          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Edit prompt"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536M4 20h4.5L19 9.5l-4.5-4.5L4 15.5V20z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Owner: <span className="font-medium text-slate-700 dark:text-slate-300">{prompt.owner}</span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Last run: <span className="font-medium text-slate-700 dark:text-slate-300">{prompt.lastRun}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors">
                      Run
                    </button>
                    <button
                      type="button"
                      onClick={() => openScheduleModal(prompt)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      Schedule
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Schedule Prompt Modal */}
      {showScheduleModal && activePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl shadow-[0_22px_60px_rgba(15,23,42,0.45)] flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-700/80">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Schedule prompt
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Configure how this saved prompt should run and review the final text before automating it.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              {/* Left: form */}
              <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800 px-5 py-4 space-y-4 bg-white/90 dark:bg-slate-900 min-h-0 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={scheduleDescription}
                    onChange={(e) => setScheduleDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={scheduleTags}
                    onChange={(e) => setScheduleTags(e.target.value)}
                    placeholder="e.g. finance, weekly, sales"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={scheduleScope}
                    onChange={(e) => setScheduleScope(e.target.value)}
                    placeholder="e.g. Weekly, Monthly, Specific project"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Prompt Template
                  </label>
                  <textarea
                    value={scheduleTemplate}
                    onChange={(e) => setScheduleTemplate(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="Write your prompt template. Use placeholders like {{date}} or {{client_name}} where needed."
                  />
                </div>
              </div>

              {/* Right: preview */}
              <div className="w-full md:w-1/2 p-5 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex flex-col min-h-0 overflow-y-auto">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  Preview
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Read-only
                  </span>
                </h3>
                <div className="mt-3 flex-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 px-4 py-3 overflow-auto shadow-sm dark:shadow-[0_18px_40px_rgba(15,23,42,0.6)]">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-2">
                    {scheduleName || activePrompt.title}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line">
                    {scheduleTemplate || activePrompt.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500 hover:brightness-110 shadow-soft dark:shadow-soft-dark transition-colors"
              >
                Save schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedPrompts

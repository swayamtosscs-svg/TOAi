import { useState } from 'react'
import ScheduleModal from './ScheduleModal'

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
}

const SavedPrompts = ({ onClose }: SavedPromptsProps) => {
  const [prompts] = useState<Prompt[]>([
    {
      id: '1',
      title: 'Weekly Sales Summary + Email',
      description: 'Fetch sales for region and draft email to regional heads.',
      owner: 'Anita',
      lastRun: '2025-12-10',
      tags: ['sales', 'weekly']
    },
    {
      id: '2',
      title: 'Invoice Validate & Recommend',
      description: 'Validate invoice against PO and recommend action.',
      owner: 'Rahul',
      lastRun: '2025-12-09',
      tags: ['finance', 'invoice']
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    myPrompts: false,
    teamPrompts: false,
    favorites: false
  })
  const [selectedPromptForSchedule, setSelectedPromptForSchedule] = useState<Prompt | null>(null)

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
                      onClick={() => setSelectedPromptForSchedule(prompt)}
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

      {/* Schedule Modal */}
      {selectedPromptForSchedule && (
        <ScheduleModal
          prompt={selectedPromptForSchedule}
          onClose={() => setSelectedPromptForSchedule(null)}
        />
      )}
    </div>
  )
}

export default SavedPrompts


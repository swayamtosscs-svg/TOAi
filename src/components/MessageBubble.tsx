import { useState } from 'react'
import { createUserSave } from '../api'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSavedPrompt, setIsSavedPrompt] = useState(false)
  const [showSavePromptModal, setShowSavePromptModal] = useState(false)
  const [promptName, setPromptName] = useState('')
  const [promptDescription, setPromptDescription] = useState('')
  const [promptTags, setPromptTags] = useState('')
  const [promptScope, setPromptScope] = useState('')
  const [promptTemplate, setPromptTemplate] = useState('')

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    // Edit functionality - can be implemented later
    console.log('Edit message:', message.id)
  }

  const handleToggleSavePrompt = () => {
    setIsSavedPrompt((prev) => !prev)
    setPromptName('')
    setPromptDescription('')
    setPromptTags('')
    setPromptScope('')
    setPromptTemplate(message.content)
    setShowSavePromptModal(true)
  }

  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-soft dark:shadow-soft-dark overflow-hidden">
          <img 
            src="/ChatGPT Image Dec 15, 2025, 12_37_03 PM.png" 
            alt="TOAI" 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative group rounded-2xl px-5 py-3 shadow-soft dark:shadow-soft-dark ${
            isUser
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
              : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Hover Actions - Below the text */}
        {showActions && (
          <div className={`flex gap-2 items-center px-2 mt-1 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Edit (user messages only) */}
            {isUser && (
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {/* Save prompt bookmark (user messages only) */}
            {isUser && (
              <button
                onClick={handleToggleSavePrompt}
                className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${
                  isSavedPrompt ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'
                }`}
                title={isSavedPrompt ? 'Saved to prompts' : 'Save as prompt'}
              >
                <svg className="w-4 h-4" fill={isSavedPrompt ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            )}

            {/* Regenerate (assistant messages only) */}
            {!isUser && (
              <button
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300"
                title="Regenerate"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
        )}

        <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Save Prompt Modal (same style as chat input popup) */}
      {showSavePromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowSavePromptModal(false)}
            aria-label="Close save prompt"
          />

          {/* Modal */}
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl shadow-[0_22px_60px_rgba(15,23,42,0.45)] flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-700/80">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Save prompt
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Turn this message into a reusable prompt and preview how it will look.
                </p>
              </div>
              <button
                onClick={() => setShowSavePromptModal(false)}
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
                    value={promptName}
                    onChange={(e) => setPromptName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="Prompt title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={promptDescription}
                    onChange={(e) => setPromptDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="Short description for this prompt."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={promptTags}
                    onChange={(e) => setPromptTags(e.target.value)}
                    placeholder="e.g. follow-up, customer, email"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={promptScope}
                    onChange={(e) => setPromptScope(e.target.value)}
                    placeholder="e.g. Weekly, Onboarding, Escalations"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Prompt Template
                  </label>
                  <textarea
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    placeholder="Edit the message text before saving as a template."
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
                    {promptName || 'Untitled prompt'}
                  </p>
                  <textarea
                    value={promptTemplate || message.content}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    rows={8}
                    className="w-full border-0 bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line resize-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95">
              <button
                type="button"
                onClick={() => setShowSavePromptModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500 hover:brightness-110 shadow-soft dark:shadow-soft-dark transition-colors"
                onClick={async () => {
                  const template = (promptTemplate || message.content).trim()
                  if (!template) {
                    setShowSavePromptModal(false)
                    return
                  }
                  await createUserSave({
                    session_id: null,
                    name: promptName || null,
                    description: promptDescription || null,
                    tags: promptTags || null,
                    scope: promptScope || null,
                    prompt_template: template,
                    preview: template,
                    viewer: 'owner',
                  })
                  setShowSavePromptModal(false)
                }}
              >
                Save prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageBubble


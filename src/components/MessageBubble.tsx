import { useState } from 'react'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
  onSavePromptFromMessage?: (content: string) => void
}

const MessageBubble = ({ message, onSavePromptFromMessage }: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSavedPrompt, setIsSavedPrompt] = useState(false)

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
    if (onSavePromptFromMessage) {
      onSavePromptFromMessage(message.content)
    }
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
    </div>
  )
}

export default MessageBubble


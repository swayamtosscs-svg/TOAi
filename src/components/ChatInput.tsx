import { useState, useRef, KeyboardEvent } from 'react'
import { createUserSave } from '../api'
import { uploadKnowledgeFiles } from '../backendClient'

interface ChatInputProps {
  onSend: (content: string) => void
  activeProjectName?: string
  onSavePrompt?: (content: string) => void
}

const ChatInput = ({ onSend, activeProjectName, onSavePrompt }: ChatInputProps) => {
  const [input, setInput] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showSavePromptModal, setShowSavePromptModal] = useState(false)
  const [promptName, setPromptName] = useState('')
  const [promptDescription, setPromptDescription] = useState('')
  const [promptTags, setPromptTags] = useState('')
  const [promptScope, setPromptScope] = useState('')
  const [promptTemplate, setPromptTemplate] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return

    onSend(input.trim())
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  // Upload files for AI to reference
  const handleUploadFiles = async () => {
    if (attachedFiles.length === 0) return

    setIsUploading(true)
    try {
      await uploadKnowledgeFiles(attachedFiles)
      console.log(`[ChatInput] Uploaded ${attachedFiles.length} files`)

      // Simple success message
      let uploadMessage = `✓ Successfully uploaded ${attachedFiles.length} file(s)`
      uploadMessage += `\n\nYou can now ask questions about your files.`

      setAttachedFiles([]) // Clear files after successful upload

      // Notify user about successful upload
      alert(uploadMessage)
    } catch (err) {
      console.error('[ChatInput] File upload failed:', err)
      alert('File upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setAttachedFiles((prev) => [...prev, ...fileArray])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSavePromptClick = () => {
    if (!onSavePrompt) return
    const trimmed = input.trim()
    if (!trimmed) return
    onSavePrompt(trimmed)
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const openSavePromptModal = () => {
    setPromptName(activeProjectName || '')
    setPromptDescription('')
    setPromptTags('')
    setPromptScope('')
    setPromptTemplate(input || '')
    setShowSavePromptModal(true)
  }

  const placeholder = activeProjectName
    ? `Ask TOAI in "${activeProjectName}"…`
    : 'Ask TOAI…'

  return (
    <div className="relative flex flex-col gap-2">
      {/* Attached Files Display with Upload Button */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-col gap-2 mb-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {attachedFiles.length} file(s) ready to upload
            </span>
            <button
              onClick={handleUploadFiles}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isUploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Files</span>
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              >
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  disabled={isUploading}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            💡 Supported: PDF, Excel, Word, Images, and Text files
          </p>
        </div>
      )}

      <div className="relative">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Input Area with all buttons inside */}
        <div className="relative flex items-center gap-1 sm:gap-0 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-soft dark:shadow-soft-dark focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 dark:focus-within:ring-cyan-500/50 dark:focus-within:border-cyan-500 transition-all min-h-[40px]">
          {/* Save Prompt Button */}
          <button
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
            title="Save Prompt"
            type="button"
            onClick={openSavePromptModal}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Attachment Button */}
          <button
            onClick={handleAttachClick}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
            title="Attach file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 min-w-0 px-2 py-1.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none text-[15px] leading-relaxed"
            style={{ minHeight: '32px', maxHeight: '120px' }}
          />

          {/* Voice Button */}
          <button
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
            title="Voice input"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Send Button - Text queries only */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 m-0.5"
            title="Send message"
          >
            <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Save Prompt / Schedule-style popup */}
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
                  Give this prompt a name and description, then review how TOAI will see it.
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
                    placeholder="Short description for your team."
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
                    placeholder="e.g. sales, weekly"
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
                    placeholder="e.g. Weekly, Monthly, Specific project"
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
                    placeholder="Write the reusable prompt here..."
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
                    value={promptTemplate || input}
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
                  const template = (promptTemplate || input).trim()
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

export default ChatInput

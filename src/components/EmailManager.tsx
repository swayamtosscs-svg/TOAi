import { useState, useRef, useEffect } from 'react'
import { Email } from '../types'

interface EmailManagerProps {
  onClose: () => void
}

const API_BASE = 'http://localhost:5000'

const EmailManager = ({ onClose }: EmailManagerProps) => {
  // Helper to safely get Date object
  const getDate = (date: Date | string) => {
    return typeof date === 'string' ? new Date(date) : date
  }
  const [emails, setEmails] = useState<Email[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '15days' | '30days'>('all')
  const [chatInput, setChatInput] = useState<string>('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [previewAttachedFiles, setPreviewAttachedFiles] = useState<File[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const [previewContent, setPreviewContent] = useState<string>('')
  const sentTemplates: any[] = []

  const followUpTemplates: any[] = []

  const chatTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewFileInputRef = useRef<HTMLInputElement>(null)
  const emailBodyRef = useRef<HTMLTextAreaElement>(null)
  const previewContentRef = useRef<HTMLTextAreaElement>(null)

  // Fetch emails on mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/emails?max_results=5`)
        const data = await response.json()

        if (data.success && data.emails && data.emails.length > 0) {
          // Add fetched emails to the beginning of the list
          setEmails((prev) => {
            // Avoid duplicates based on ID
            const newEmails = data.emails.filter((e: Email) => !prev.some((p) => p.id === e.id))
            return [...newEmails, ...prev]
          })
        }
      } catch (error) {
        console.error('Failed to fetch emails:', error)
      }
    }

    fetchEmails()
  }, [])

  const categoryFilteredEmails =
    filter === 'all'
      ? emails
      : emails.filter((email) => email.category?.toLowerCase() === filter.toLowerCase())

  const now = new Date()
  const dayInMs = 24 * 60 * 60 * 1000

  const filteredEmails = categoryFilteredEmails.filter((email) => {
    if (dateFilter === 'all') return true
    // Convert to standard Date object for comparison
    const emailDate = getDate(email.timestamp)
    const diff = now.getTime() - emailDate.getTime()
    if (dateFilter === '7days') return diff <= 7 * dayInMs
    if (dateFilter === '15days') return diff <= 15 * dayInMs
    if (dateFilter === '30days') return diff <= 30 * dayInMs
    return true
  })

  const formatDate = (date: Date | string) => {
    const now = new Date()
    const emailDate = getDate(date)
    const diff = now.getTime() - emailDate.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return getDate(date).toLocaleDateString()
  }

  const categories = ['all', 'Internal', 'Client', 'OTP', 'Read', 'Sent', 'Follow up', 'Others']

  const handleRefresh = () => {
    setSelectedEmail(null)
    setFilter('all')
    setDateFilter('all')
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleGenerateReply = async (
    originalBody: string,
    prompt: string | null,
    fileContext?: string,
  ) => {
    setIsGenerating(true)
    try {
      if (!selectedEmail) return

      const response = await fetch(`${API_BASE}/api/email/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_body: originalBody,
          original_sender: selectedEmail.from,
          original_subject: selectedEmail.subject,
          user_prompt: prompt,
          file_context: fileContext || null,
        }),
      })
      const data = await response.json()
      if (data.success && data.reply) {
        setPreviewContent(data.reply)
      }
    } catch (error) {
      console.error('Error generating reply:', error)
      setPreviewContent('Error generating reply. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedEmail) return

    // Determine recipient - assuming direct reply to sender
    const to = selectedEmail.fromEmail

    // Determine Subject - basic Re:
    const subject = selectedEmail.subject.startsWith('Re:')
      ? selectedEmail.subject
      : `Re: ${selectedEmail.subject}`

    try {
      // Debug logging
      console.log('[EmailManager] Sending reply with:', {
        to: to,
        subject: subject,
        thread_id: selectedEmail.threadId,
        message_id: selectedEmail.messageId,
        email_id: selectedEmail.id,
      })

      const response = await fetch(`${API_BASE}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: to,
          subject: subject,
          body: previewContent,
          cc: null,
          thread_id: selectedEmail.threadId, // Use the actual threadId from Gmail
          message_id: selectedEmail.messageId, // For In-Reply-To header
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert('Email sent successfully!')
        // Ideally close modal or clear selection
      } else {
        alert('Failed to send email: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email')
    }
  }

  const handleChatSend = async () => {
    if (!selectedEmail) return
    if (!chatInput.trim() && attachedFiles.length === 0) return

    // Read file contents if any
    let fileContext = ''
    if (attachedFiles.length > 0) {
      const fileContents = await Promise.all(
        attachedFiles.map(async (file) => {
          try {
            const text = await file.text()
            return `--- Content from ${file.name} ---\n${text}\n`
          } catch {
            return `--- Could not read ${file.name} ---\n`
          }
        }),
      )
      fileContext = fileContents.join('\n')
    }

    // Use chat input as prompt to refine reply with file context
    handleGenerateReply(
      selectedEmail.body || selectedEmail.preview,
      chatInput.trim() || 'Generate a professional reply using the attached document context.',
      fileContext || undefined,
    )

    // Clear inputs
    setChatInput('')
    setAttachedFiles([])
    if (chatTextareaRef.current) {
      chatTextareaRef.current.style.height = 'auto'
    }
  }

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChatSend()
    }
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

  const handlePreviewAttachClick = () => {
    previewFileInputRef.current?.click()
  }

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setPreviewAttachedFiles((prev) => [...prev, ...fileArray])
    }
    if (previewFileInputRef.current) {
      previewFileInputRef.current.value = ''
    }
  }

  const handlePreviewFileRemove = (index: number) => {
    setPreviewAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Initialize email body when email is selected
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email)
    // Use actual email body if available, otherwise fallback to Lorem ipsum
    const initialBody = email.body || `${email.preview}\n\nLorem ipsum dolor sit amet...`
    setEmailBody(initialBody)
    // Initial generated reply
    // Pass empty prompt to get default Reply
    // Needs to be async but we can just fire and forget or wrap
    setPreviewContent('Generating reply...')

    // We need to call handleGenerateReply here, but it relies on 'selectedEmail' state which might not be updated yet.
    // Better to pass email params directly.
    const generateInitial = async () => {
      setIsGenerating(true)
      try {
        const response = await fetch(`${API_BASE}/api/email/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            original_body: email.body || email.preview,
            original_sender: email.from,
            original_subject: email.subject,
            user_prompt: null,
          }),
        })
        const data = await response.json()
        if (data.success && data.reply) {
          setPreviewContent(data.reply)
        }
      } catch (error) {
        setPreviewContent('Error generating reply.')
      } finally {
        setIsGenerating(false)
      }
    }
    generateInitial()
  }

  const handleDeleteEmail = (emailId: string) => {
    setEmails((prev) => prev.filter((email) => email.id !== emailId))
    setSelectedEmail((current) => (current?.id === emailId ? null : current))
  }

  const handlePreviewContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreviewContent(e.target.value)
  }

  return (
    <>
      {/* Main Email Manager View */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gradient-toai">Email Manager</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {filter === 'Sent'
                  ? `${sentTemplates.length} ${sentTemplates.length === 1 ? 'template' : 'templates'}`
                  : filter === 'Follow up'
                    ? `${followUpTemplates.length} ${followUpTemplates.length === 1 ? 'template' : 'templates'}`
                    : `${filteredEmails.length} ${filteredEmails.length === 1 ? 'email' : 'emails'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Filters / Tabs Content - always show Emails view */}
        {/* Filters */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === category
                      ? 'bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white shadow-soft dark:shadow-soft-dark'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Date range dropdown */}
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(e.target.value as 'all' | '7days' | '15days' | '30days')
                  }
                  className="appearance-none pl-3 pr-9 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 shadow-soft dark:shadow-soft-dark focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:ring-cyan-500/50 dark:focus:border-cyan-500"
                >
                  <option value="all">All</option>
                  <option value="7days">Last 7 days</option>
                  <option value="15days">Last 15 days</option>
                  <option value="30days">Last 1 month</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500 dark:text-slate-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Refresh"
                title="Refresh"
              >
                <img src="/download.png" alt="Refresh" className="w-6 h-6 object-contain" />
              </button>
            </div>
          </div>
        </div>

        {/* Email Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            {filter === 'Sent' ? (
              <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full px-2">
                {sentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-4 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {template.tag} {template.title}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {template.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Edit template"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-white border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Use template"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : filter === 'Follow up' ? (
              <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full px-2">
                {followUpTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-4 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {template.tag} {template.title}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {template.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200">
                        {template.deadline}
                      </span>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Edit follow-up template"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-white border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Use follow-up template"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailSelect(email)}
                    className={`relative group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${email.read
                        ? 'border-transparent'
                        : 'border-teal-500/50 dark:border-cyan-500/50'
                      } hover:scale-[1.02]`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {email.from.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {email.from}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {email.fromEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!email.read && (
                          <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1"></div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEmail(email.id)
                          }}
                          className="p-1 rounded-lg text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
                          title="Delete email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {email.preview}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(email.timestamp)}
                      </span>
                      {email.category && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          {email.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filter !== 'Sent' && filter !== 'Follow up' && filteredEmails.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-600 dark:text-slate-400">No emails found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Detail Popup/Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setSelectedEmail(null)}
          />

          {/* Modal - Split View */}
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-y-auto animate-slide-up max-w-[95vw]">
            {/* Headers Row - Fixed */}
            <div className="flex flex-col sm:flex-row flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
              {/* Left Header */}
              <div className="w-full sm:w-1/2 px-4 sm:px-6 py-4 border-r border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compose</h3>
                <div className="flex items-center justify-center h-9">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Right Header */}
              <div className="w-full sm:w-1/2 px-4 sm:px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 border-t sm:border-t-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reply Preview</h3>
                <div className="flex items-center justify-center h-9">
                  {selectedEmail.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 flex items-center">
                      {selectedEmail.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content - Single Scrollable Area */}
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Left Panel - Input Fields */}
              <div className="w-full lg:w-1/2 border-b lg:border-b-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col">
                {/* Input Fields + Email Body */}
                <div className="px-4 sm:px-6 py-6 flex-1 flex flex-col overflow-hidden">
                  <div className="space-y-6">
                    {/* To Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        To
                      </label>
                      <input
                        type="email"
                        defaultValue={selectedEmail.fromEmail}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        placeholder="Enter recipient email"
                      />
                    </div>

                    {/* CC Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        CC
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                        placeholder="Enter CC email addresses"
                      />
                    </div>

                    {/* Summary Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Summary
                      </label>
                      <textarea
                        rows={3}
                        readOnly
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 cursor-not-allowed resize-none scrollbar-hide"
                        placeholder="Enter email summary"
                        defaultValue="This email discusses the latest updates and important information regarding the project. Please review the details below and provide your feedback."
                      />
                    </div>
                  </div>

                  {/* Email Body - aligned with right side chat input area */}
                  <div className="flex flex-col mt-6 flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Body
                    </label>
                    <div className="flex-1 min-h-[260px]">
                      <textarea
                        ref={emailBodyRef}
                        value={emailBody}
                        readOnly
                        className="w-full h-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 cursor-not-allowed resize-none font-sans text-base leading-relaxed scrollbar-hide"
                        placeholder="Enter email body content"
                      />
                    </div>
                  </div>
                </div>

                {/* Spacer to fine-tune alignment of Email Body bottom with chat input on the right */}
                <div className="h-10 flex-shrink-0" />
              </div>

              {/* Right Panel - Preview */}
              <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-800 overflow-hidden">
                {/* Email Preview Content */}
                <div className="flex-1 px-4 sm:px-6 py-6 flex flex-col">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Reply Preview Content
                    </label>
                  </div>
                  <div className="relative flex-1">
                    <textarea
                      ref={previewContentRef}
                      value={previewContent}
                      onChange={handlePreviewContentChange}
                      rows={20}
                      className="w-full flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-cyan-500 transition-all resize-none font-sans text-base leading-relaxed cursor-text scrollbar-hide"
                      placeholder="Edit your reply preview content here..."
                      style={{ minHeight: '300px', paddingBottom: '56px' }}
                    />

                    {true && (
                      <div className="absolute left-4 bottom-4 flex items-center gap-2 max-w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-soft">
                        <input
                          ref={previewFileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handlePreviewFileChange}
                        />
                        <button
                          type="button"
                          onClick={handlePreviewAttachClick}
                          className="flex items-center justify-center w-6 h-6 rounded-md text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                          title="Attach file to reply preview"
                        >
                          <svg className="w-3.5 h-3.5 translate-y-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        {previewAttachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {previewAttachedFiles.map((file, index) => (
                              <span
                                key={`${file.name}-${index}`}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200"
                              >
                                <svg className="w-4 h-4 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-7 4h8a2 2 0 002-2v-5.586a2 2 0 00-.586-1.414l-4.414-4.414A2 2 0 0010.586 5H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate max-w-[140px]">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handlePreviewFileRemove(index)}
                                  className="text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                  title="Remove attachment"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Input Section - Fixed at Bottom */}
                <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0 sticky bottom-0 z-10">
                  <div className="px-6 py-4 space-y-3">
                    {/* Attached Files Display */}
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm"
                          >
                            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              title="Remove file"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Chat Input with all buttons inside */}
                    <div className="relative">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {/* Input Area with all buttons inside */}
                      <div className="relative flex items-center rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-soft dark:shadow-soft-dark focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 dark:focus-within:ring-cyan-500/50 dark:focus-within:border-cyan-500 transition-all">
                        {/* Save Prompt Button */}
                        <button
                          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                          title="Save Prompt"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>

                        {/* Attachment Button */}
                        <button
                          onClick={handleAttachClick}
                          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                          title="Attach file"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </button>

                        {/* Textarea */}
                        <textarea
                          ref={chatTextareaRef}
                          value={chatInput}
                          onChange={handleChatInputChange}
                          onKeyDown={handleChatKeyDown}
                          rows={1}
                          className="flex-1 px-3 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none text-[15px] leading-relaxed scrollbar-hide"
                          placeholder="Ask TOAI…"
                          style={{ minHeight: '52px', maxHeight: '200px' }}
                        />

                        {/* Voice Button */}
                        <button
                          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
                          title="Voice input"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>

                        {/* Send Button */}
                        <button
                          onClick={handleChatSend}
                          disabled={!chatInput.trim()}
                          className="p-3 rounded-xl bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 m-1"
                          title="Send message"
                        >
                          <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Save Draft / Send Email Buttons */}
                    <div className="flex items-center justify-end gap-3">
                      <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                        Save Draft
                      </button>
                      <button
                        onClick={handleSendEmail}
                        disabled={!selectedEmail || isGenerating}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EmailManager


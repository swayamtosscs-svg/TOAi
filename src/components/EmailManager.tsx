import { useState, useRef } from 'react'
import { Email } from '../types'

interface EmailManagerProps {
  onClose: () => void
}

const EmailManager = ({ onClose }: EmailManagerProps) => {
  const [emails] = useState<Email[]>([
    {
      id: '1',
      from: 'Sarah Johnson',
      fromEmail: 'sarah.johnson@example.com',
      subject: 'Project Update - Q4 Planning',
      preview: 'Hi, I wanted to share the latest updates on our Q4 planning session. We have some exciting developments...',
      timestamp: new Date(),
      read: false,
      category: 'Work'
    },
    {
      id: '2',
      from: 'Michael Chen',
      fromEmail: 'mchen@techcorp.com',
      subject: 'Meeting Request - Product Review',
      preview: 'Would you be available for a product review meeting this week? I have some important updates to discuss...',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      category: 'Work'
    },
    {
      id: '3',
      from: 'Newsletter Team',
      fromEmail: 'newsletter@designweekly.com',
      subject: 'Weekly Design Inspiration - Issue #42',
      preview: 'This week we explore modern UI trends, color palettes, and typography choices that are shaping 2024...',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      category: 'Newsletter'
    },
    {
      id: '4',
      from: 'Alex Rivera',
      fromEmail: 'alex.rivera@startup.io',
      subject: 'Partnership Opportunity',
      preview: 'I hope this message finds you well. I wanted to reach out regarding a potential partnership opportunity...',
      timestamp: new Date(Date.now() - 86400000),
      read: false,
      category: 'Business'
    },
    {
      id: '5',
      from: 'Support Team',
      fromEmail: 'support@toai.com',
      subject: 'Welcome to TOAI - Getting Started',
      preview: 'Thank you for joining TOAI! We\'re excited to have you on board. Here are some tips to get you started...',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      category: 'System'
    },
    {
      id: '6',
      from: 'Emma Wilson',
      fromEmail: 'emma.wilson@creative.com',
      subject: 'Design Feedback Request',
      preview: 'Hi! I\'ve been working on a new design concept and would love to get your feedback. Could you take a look...',
      timestamp: new Date(Date.now() - 259200000),
      read: false,
      category: 'Personal'
    },
    {
      id: '7',
      from: 'David Park',
      fromEmail: 'david.park@devteam.com',
      subject: 'Code Review - Feature Branch',
      preview: 'I\'ve pushed a new feature branch for review. The changes include authentication improvements and...',
      timestamp: new Date(Date.now() - 345600000),
      read: true,
      category: 'Work'
    },
    {
      id: '8',
      from: 'Marketing Team',
      fromEmail: 'marketing@company.com',
      subject: 'Monthly Newsletter - December Highlights',
      preview: 'Check out our December highlights including new product launches, customer success stories, and upcoming events...',
      timestamp: new Date(Date.now() - 432000000),
      read: true,
      category: 'Newsletter'
    },
  ])

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [chatInput, setChatInput] = useState<string>('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const [previewContent, setPreviewContent] = useState<string>('')
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emailBodyRef = useRef<HTMLTextAreaElement>(null)
  const previewContentRef = useRef<HTMLTextAreaElement>(null)

  const filteredEmails = filter === 'all' 
    ? emails 
    : emails.filter(email => email.category?.toLowerCase() === filter.toLowerCase())

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const categories = ['all', 'Work', 'Personal', 'Newsletter', 'Business', 'System']

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  const handleChatSend = () => {
    if (chatInput.trim()) {
      // Handle chat message send
      console.log('Chat message:', chatInput)
      setChatInput('')
      if (chatTextareaRef.current) {
        chatTextareaRef.current.style.height = 'auto'
      }
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
      setAttachedFiles(prev => [...prev, ...fileArray])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Initialize email body when email is selected
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email)
    // Initialize email body with preview and Lorem ipsum content
    const initialBody = `${email.preview}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`
    setEmailBody(initialBody)
    // Initialize preview content with preview and Lorem ipsum content
    const initialPreview = `${email.preview}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`
    setPreviewContent(initialPreview)
  }

  const handleEmailBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailBody(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`
  }

  const handlePreviewContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreviewContent(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 600)}px`
  }

  return (
    <>
      {/* Main Email Manager View */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
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
              {filteredEmails.length} {filteredEmails.length === 1 ? 'email' : 'emails'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === category
                  ? 'bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white shadow-soft dark:shadow-soft-dark'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Email Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailSelect(email)}
                className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border-2 ${
                  email.read
                    ? 'border-transparent'
                    : 'border-teal-500/50 dark:border-cyan-500/50'
                }`}
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
                  {!email.read && (
                    <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1"></div>
                  )}
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

          {filteredEmails.length === 0 && (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setSelectedEmail(null)}
          />
          
          {/* Modal - Split View */}
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex overflow-hidden animate-slide-up">
            {/* Left Panel - Input Fields */}
            <div className="w-1/2 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-slate-50 dark:bg-slate-900/50">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
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

              {/* Input Fields */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
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
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none"
                    placeholder="Enter email summary"
                    defaultValue="This email discusses the latest updates and important information regarding the project. Please review the details below and provide your feedback."
                  />
                </div>

                {/* Email Body */}
                <div className="flex-1 flex flex-col mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Body
                  </label>
                  <textarea
                    ref={emailBodyRef}
                    value={emailBody}
                    onChange={handleEmailBodyChange}
                    rows={12}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none font-sans text-base leading-relaxed"
                    placeholder="Enter email body content"
                    style={{ minHeight: '300px', maxHeight: '400px' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 flex flex-col bg-white dark:bg-slate-800">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reply Preview</h3>
                <div className="flex items-center justify-center h-9">
                  {selectedEmail.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 flex items-center">
                      {selectedEmail.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Preview Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reply Preview Content
                  </label>
                </div>
                <textarea
                  ref={previewContentRef}
                  value={previewContent}
                  onChange={handlePreviewContentChange}
                  rows={20}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-cyan-500 transition-all resize-y font-sans text-base leading-relaxed cursor-text"
                  placeholder="Edit your reply preview content here..."
                  style={{ minHeight: '400px', maxHeight: '600px' }}
                />
              </div>

              {/* Chat Input Section */}
              <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800 space-y-3">
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
                      className="flex-1 px-3 py-3.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none text-[15px] leading-relaxed"
                      placeholder="Ask TOAI anything…"
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

                {/* Save Draft Button */}
                <div className="flex items-center justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    Save Draft
                  </button>
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


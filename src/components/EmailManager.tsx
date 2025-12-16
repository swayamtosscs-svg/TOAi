import { useState, useRef } from 'react'
import { Email } from '../types'

interface EmailManagerProps {
  onClose: () => void
}

const EmailManager = ({ onClose }: EmailManagerProps) => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      from: 'Sarah Johnson',
      fromEmail: 'sarah.johnson@example.com',
      subject: 'Project Update - Q4 Planning',
      preview: 'Hi, I wanted to share the latest updates on our Q4 planning session. We have some exciting developments...',
      timestamp: new Date(),
      read: false,
      category: 'Internal'
    },
    {
      id: '2',
      from: 'Michael Chen',
      fromEmail: 'mchen@techcorp.com',
      subject: 'Meeting Request - Product Review',
      preview: 'Would you be available for a product review meeting this week? I have some important updates to discuss...',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      category: 'Client'
    },
    {
      id: '3',
      from: 'Newsletter Team',
      fromEmail: 'newsletter@designweekly.com',
      subject: 'Weekly Design Inspiration - Issue #42',
      preview: 'This week we explore modern UI trends, color palettes, and typography choices that are shaping 2024...',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      category: 'Others'
    },
    {
      id: '4',
      from: 'Alex Rivera',
      fromEmail: 'alex.rivera@startup.io',
      subject: 'Partnership Opportunity',
      preview: 'I hope this message finds you well. I wanted to reach out regarding a potential partnership opportunity...',
      timestamp: new Date(Date.now() - 86400000),
      read: false,
      category: 'Client'
    },
    {
      id: '4-otp',
      from: 'Bank Alerts',
      fromEmail: 'no-reply@securebank.com',
      subject: 'Your one-time password (OTP) for login',
      preview: 'Use 482193 as your one-time password to complete your secure login. Do not share this code with anyone.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'OTP'
    },
    {
      id: '5-otp',
      from: 'Payment Gateway',
      fromEmail: 'otp@payments.com',
      subject: 'OTP to authorize your payment',
      preview: 'Enter 907654 on the merchant page to authorize your payment of ₹2,499. Code is valid for 10 minutes.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: false,
      category: 'OTP'
    },
    {
      id: '5',
      from: 'Support Team',
      fromEmail: 'support@toai.com',
      subject: 'Welcome to TOAI - Getting Started',
      preview: 'Thank you for joining TOAI! We\'re excited to have you on board. Here are some tips to get you started...',
      timestamp: new Date(Date.now() - 172800000),
      read: true,
      category: 'Internal'
    },
    {
      id: '6',
      from: 'Emma Wilson',
      fromEmail: 'emma.wilson@creative.com',
      subject: 'Design Feedback Request',
      preview: 'Hi! I\'ve been working on a new design concept and would love to get your feedback. Could you take a look...',
      timestamp: new Date(Date.now() - 259200000),
      read: false,
      category: 'Client'
    },
    {
      id: '7',
      from: 'David Park',
      fromEmail: 'david.park@devteam.com',
      subject: 'Code Review - Feature Branch',
      preview: 'I\'ve pushed a new feature branch for review. The changes include authentication improvements and...',
      timestamp: new Date(Date.now() - 345600000),
      read: true,
      category: 'Read'
    },
    {
      id: '8',
      from: 'Marketing Team',
      fromEmail: 'marketing@company.com',
      subject: 'Monthly Newsletter - December Highlights',
      preview: 'Check out our December highlights including new product launches, customer success stories, and upcoming events...',
      timestamp: new Date(Date.now() - 432000000),
      read: true,
      category: 'Others'
    },
    {
      id: '9',
      from: 'You',
      fromEmail: 'you@toai.com',
      subject: 'Sent Recap - Sprint Deliverables',
      preview: 'Sharing the latest sprint deliverables and action items with the team for confirmation.',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      category: 'Sent'
    },
  ])

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '15days' | '30days'>('all')
  const [chatInput, setChatInput] = useState<string>('')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [previewAttachedFiles, setPreviewAttachedFiles] = useState<File[]>([])
  const [emailBody, setEmailBody] = useState<string>('')
  const [previewContent, setPreviewContent] = useState<string>('')
  const [activeView, setActiveView] = useState<'emails' | 'knowledge'>('emails')
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([])
  const sentTemplates = [
    {
      id: 'finance-template',
      tag: '[Finance]',
      title: 'Monthly Vendor Performance',
      description: '“Analyse this month’s purchases and rank vendors by margin, reliability, and delay...”'
    },
    {
      id: 'sales-template',
      tag: '[Sales]',
      title: 'Deal Review Template',
      description: '“Given this opportunity, suggest win strategy, risk, and missing stakeholders...”'
    },
    {
      id: 'support-template',
      tag: '[Support]',
      title: 'Escalation Summary',
      description: '“Summarise this conversation for L2 with root cause, attempted fix, and next steps...”'
    }
  ]
  const followUpTemplates = [
    {
      id: 'product-demo',
      tag: '[Product]',
      title: 'Demo Follow-up',
      description: '“Thanks for attending the demo. Here’s the recap and next steps we discussed...”',
      deadline: 'Due in 2 days'
    },
    {
      id: 'support-ticket',
      tag: '[Support]',
      title: 'Ticket Follow-up',
      description: '“Checking in on your open ticket. Please confirm the fix or share new details...”',
      deadline: 'Due tomorrow'
    },
    {
      id: 'sales-touch',
      tag: '[Sales]',
      title: 'Touch-base Reminder',
      description: '“Following up on our last conversation. Are you ready to proceed or need more info?”',
      deadline: 'Due in 3 days'
    }
  ]
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewFileInputRef = useRef<HTMLInputElement>(null)
  const emailBodyRef = useRef<HTMLTextAreaElement>(null)
  const previewContentRef = useRef<HTMLTextAreaElement>(null)
  const knowledgeUploadRef = useRef<HTMLInputElement>(null)

  const categoryFilteredEmails = filter === 'all'
    ? emails
    : emails.filter(email => email.category?.toLowerCase() === filter.toLowerCase())

  const now = new Date()
  const dayInMs = 24 * 60 * 60 * 1000

  const filteredEmails = categoryFilteredEmails.filter(email => {
    if (dateFilter === 'all') return true
    const diff = now.getTime() - email.timestamp.getTime()
    if (dateFilter === '7days') return diff <= 7 * dayInMs
    if (dateFilter === '15days') return diff <= 15 * dayInMs
    if (dateFilter === '30days') return diff <= 30 * dayInMs
    return true
  })

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

  const handlePreviewAttachClick = () => {
    previewFileInputRef.current?.click()
  }

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setPreviewAttachedFiles(prev => [...prev, ...fileArray])
    }
    if (previewFileInputRef.current) {
      previewFileInputRef.current.value = ''
    }
  }

  const handlePreviewFileRemove = (index: number) => {
    setPreviewAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleKnowledgeUploadClick = () => {
    knowledgeUploadRef.current?.click()
  }

  const handleKnowledgeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const pdfFiles = Array.from(files).filter((file) =>
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      )
      if (pdfFiles.length > 0) {
        setKnowledgeFiles((prev) => [...prev, ...pdfFiles])
      }
    }
    if (knowledgeUploadRef.current) {
      knowledgeUploadRef.current.value = ''
    }
  }

  const handleKnowledgeFileRemove = (index: number) => {
    setKnowledgeFiles((prev) => prev.filter((_, i) => i !== index))
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
              {activeView === 'knowledge'
                ? 'Knowledge Base'
                : filter === 'Sent'
                ? `${sentTemplates.length} ${sentTemplates.length === 1 ? 'template' : 'templates'}`
                : filter === 'Follow up'
                ? `${followUpTemplates.length} ${followUpTemplates.length === 1 ? 'template' : 'templates'}`
                : `${filteredEmails.length} ${filteredEmails.length === 1 ? 'email' : 'emails'}`}
            </p>
          </div>
        </div>

        {/* Right side toggle: Emails / Knowledge Base */}
        <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-700/60 rounded-full p-1">
          <button
            type="button"
            onClick={() => setActiveView('emails')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeView === 'emails'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Emails
          </button>
          <button
            type="button"
            onClick={() => setActiveView('knowledge')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeView === 'knowledge'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Knowledge Base
          </button>
        </div>
      </div>

      {/* Filters / Tabs Content */}
      {activeView === 'emails' ? (
        <>
          {/* Filters */}
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
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
                  className={`relative group bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
                    email.read
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
        </>
      ) : (
        /* Knowledge Base View */
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search + Info + Upload */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  Knowledge Base
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Frequently used replies, internal notes aur FAQs ek hi jagah se access karein.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <div className="w-full sm:w-72 md:w-80">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search knowledge…"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:ring-cyan-500/50 dark:focus:border-cyan-500"
                    />
                    <svg
                      className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="flex items-center">
                  <input
                    ref={knowledgeUploadRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    className="hidden"
                    onChange={handleKnowledgeFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleKnowledgeUploadClick}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
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
                        d="M12 4v12m0 0l-4-4m4 4l4-4M6 20h12"
                      />
                    </svg>
                    Upload PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Uploaded PDFs */}
            {knowledgeFiles.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Uploaded PDFs ({knowledgeFiles.length})
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {knowledgeFiles.map((file, index) => (
                    <span
                      key={`${file.name}-${index}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-50 border border-slate-200 dark:border-slate-600"
                    >
                      <svg
                        className="w-4 h-4 text-rose-500 dark:text-rose-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V8l-6-6z"
                        />
                      </svg>
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleKnowledgeFileRemove(index)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-soft dark:shadow-soft-dark">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Saved Replies
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                    For Support / Sales
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Delay apology + new ETA</li>
                  <li>• Onboarding welcome email</li>
                  <li>• Pricing follow‑up with next steps</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-soft dark:shadow-soft-dark">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Internal Playbooks
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                    Team only
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• How to handle escalation emails</li>
                  <li>• Quarterly business review structure</li>
                  <li>• Churn‑risk customer save template</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 shadow-soft dark:shadow-soft-dark">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    FAQ Snippets
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                    Customers
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Refund and cancellation policy</li>
                  <li>• Data security & privacy summary</li>
                  <li>• Integration requirements checklist</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
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
          </div>
        </div>
      )}
    </>
  )
}

export default EmailManager


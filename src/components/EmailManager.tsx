import { useState } from 'react'
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
                onClick={() => setSelectedEmail(email)}
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
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    defaultValue={`Re: ${selectedEmail.subject}`}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    placeholder="Enter email subject"
                  />
                </div>

                {/* Message Body */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message
                  </label>
                  <div className="relative flex-1">
                    <button className="absolute left-3 top-3 z-10 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Saved Prompts
                    </button>
                    <textarea
                      rows={12}
                      className="flex-1 w-full pl-28 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none"
                      placeholder="Type your message here..."
                      defaultValue=""
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 text-white font-medium shadow-soft dark:shadow-soft-dark hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    Send
                  </button>
                  <button className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Save Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 flex flex-col bg-white dark:bg-slate-800">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h3>
                {selectedEmail.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300">
                    {selectedEmail.category}
                  </span>
                )}
              </div>

              {/* Email Preview Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {selectedEmail.from.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {selectedEmail.from}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedEmail.fromEmail}
                      </p>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span>To: you@example.com</span>
                    <span>•</span>
                    <span>{formatDate(selectedEmail.timestamp)}</span>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap space-y-4">
                    <p>{selectedEmail.preview}</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Forward
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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


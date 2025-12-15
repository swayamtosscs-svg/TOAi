import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { Message } from '../types'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
}

const ChatInterface = ({ messages, onSendMessage }: ChatInterfaceProps) => {
  const [isTyping, setIsTyping] = useState(false)
  const [activeIcons, setActiveIcons] = useState<Record<string, boolean>>({})
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [whatsAppStage, setWhatsAppStage] = useState<'scan' | 'groups'>('scan')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [groupSearch, setGroupSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const integrationIcons = [
    { id: 'whatsapp', label: 'WhatsApp', offSrc: '/whatsapp.png', onSrc: '/whatsapp-on.png' },
    { id: 'email', label: 'Email', offSrc: '/email.png', onSrc: '/email-on.png' },
    { id: 'drive', label: 'Drive', offSrc: '/drive.png', onSrc: '/drive-on.png' },
    { id: 'mysql', label: 'MySQL', offSrc: '/mysql.png', onSrc: '/mysql-on.png' },
    { id: 'oracle', label: 'Oracle', offSrc: '/oracle.png', onSrc: '/oracle-on.png' },
  ] as const

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (content: string) => {
    if (content.trim()) {
      onSendMessage(content)
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 1000)
    }
  }

  const handleIconClick = (id: string) => {
    if (id === 'whatsapp') {
      setShowWhatsAppModal(true)
      setWhatsAppStage('scan')
      setActiveIcons((prev) => ({
        ...prev,
        [id]: true,
      }))
      return
    }

    setActiveIcons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleCloseWhatsApp = () => {
    setShowWhatsAppModal(false)
    setWhatsAppStage('scan')
    setSelectedGroups([])
    setActiveIcons((prev) => ({
      ...prev,
      whatsapp: false,
    }))
  }

  const whatsAppGroups = [
    'Sales Updates',
    'Support Escalations',
    'Management Daily',
    'Project Alpha Squad',
    'Vendors & Partners',
  ]

  const toggleGroupSelection = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    )
  }

  const filteredWhatsAppGroups = whatsAppGroups.filter((group) =>
    group.toLowerCase().includes(groupSearch.toLowerCase().trim()),
  )

  const allSelected =
    filteredWhatsAppGroups.length > 0 &&
    filteredWhatsAppGroups.every((group) => selectedGroups.includes(group))

  const handleToggleSelectAll = () => {
    setSelectedGroups((prev) => {
      const visible = filteredWhatsAppGroups
      const allVisibleSelected = visible.every((g) => prev.includes(g))
      if (allVisibleSelected) {
        // Unselect only visible groups
        return prev.filter((g) => !visible.includes(g))
      }
      // Add all visible groups to selection
      const next = new Set(prev)
      visible.forEach((g) => next.add(g))
      return Array.from(next)
    })
  }

  const handleConnectSelected = () => {
    if (!selectedGroups.length) return
    // Placeholder for actual connect logic
    console.log('Connecting groups:', selectedGroups)
    handleCloseWhatsApp()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="w-10 hidden sm:block" aria-hidden />
        <div className="flex items-center gap-3 sm:gap-4 text-slate-500 dark:text-slate-300 flex-wrap justify-center sm:justify-start">
          {integrationIcons.map((icon) => {
            const isActive = !!activeIcons[icon.id]
            return (
              <button
                key={icon.id}
                onClick={() => handleIconClick(icon.id)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                aria-label={icon.label}
                aria-pressed={isActive}
              >
                <img
                  src={isActive ? icon.onSrc : icon.offSrc}
                  alt={icon.label}
                  className="w-[18px] h-[18px]"
                />
              </button>
            )
          })}
        </div>
        <button
          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center translate-y-1"
          aria-label="More"
        >
          <img src="/Frame 14.png" alt="More" className="w-full h-full rounded-full object-contain" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl sm:max-w-4xl mx-auto space-y-6 flex flex-col min-h-full">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-8 sm:py-12">
              <div className="mb-2">
                <div className="w-20 h-20 mx-auto mb-1">
                  <img
                    src="/ChatGPT Image Dec 15, 2025, 12_37_03 PM.png"
                    alt="Welcome"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                Welcome to TOAI
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md px-4 sm:px-0">
                Start a conversation by asking me anything. I'm here to help with your questions, creative projects, and more.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-3xl sm:max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} />
        </div>
      </div>

      {/* WhatsApp Integration Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCloseWhatsApp}
            aria-label="Close WhatsApp connection"
          />

          {/* Modal */}
          <div className="relative z-50 w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <img
                    src="/whatsapp-on.png"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    WhatsApp Connect
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {whatsAppStage === 'scan'
                      ? 'Scan the QR code with WhatsApp to continue'
                      : 'Select a group where TOAI should assist'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseWhatsApp}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
              {whatsAppStage === 'scan' ? (
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
                  {/* QR Preview / Scanner Placeholder */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-56 h-56 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-emerald-400/70 flex items-center justify-center shadow-inner">
                      <div className="absolute inset-3 rounded-xl border-2 border-emerald-400/70 pointer-events-none" />
                      <div className="relative z-10 text-center">
                        <svg
                          className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 5h4M5 4v4M4 19h4M5 16v4M16 4h4M19 4v4M16 20h4M19 16v4M9 9h1v1H9zM12 9h1v1h-1zM15 9h1v1h-1zM9 12h1v1H9zM12 12h1v1h-1zM15 12h1v1h-1zM9 15h1v1H9zM12 15h1v1h-1zM15 15h1v1h-1z"
                          />
                        </svg>
                        <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                          QR scanner preview
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          Open WhatsApp &gt; Linked devices &gt; Scan this code.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="flex-1 space-y-3 text-sm">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Link WhatsApp with TOAI
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Open WhatsApp on your phone.</li>
                      <li>Go to <span className="font-medium">Settings &gt; Linked devices</span>.</li>
                      <li>Tap <span className="font-medium">Link a device</span> and scan this code.</li>
                    </ol>
                    <button
                      onClick={() => setWhatsAppStage('groups')}
                      className="mt-3 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium bg-emerald-500 text-white shadow-soft hover:bg-emerald-600 transition-colors"
                    >
                      I have scanned the code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    Select the WhatsApp group where TOAI should assist:
                  </p>

                  <div className="flex flex-col gap-2 mb-1">
                    <div>
                      <input
                        type="text"
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
                        placeholder="Search groups…"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/70 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleToggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Select all (visible)</span>
                      </label>
                      <span>{selectedGroups.length} selected</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {filteredWhatsAppGroups.map((group) => {
                      const isSelected = selectedGroups.includes(group)
                      return (
                        <button
                          key={group}
                          type="button"
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-800 border text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500 shadow-md'
                              : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md'
                          }`}
                          onClick={() => toggleGroupSelection(group)}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleGroupSelection(group)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xs font-semibold">
                              {group
                                .split(' ')
                                .map((w) => w[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {group}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Connect this group as a WhatsApp workspace.
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      This is a UI preview only. Add your backend / WhatsApp API integration to complete the
                      flow.
                    </p>
                    <button
                      type="button"
                      onClick={handleConnectSelected}
                      disabled={!selectedGroups.length}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold bg-emerald-500 text-white shadow-soft hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Connect {selectedGroups.length ? `(${selectedGroups.length})` : ''}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface


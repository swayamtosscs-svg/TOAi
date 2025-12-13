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
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleWhatsAppClick = () => {
    setIsWhatsAppConnected(!isWhatsAppConnected)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-toai">TOAI</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your intelligent AI assistant</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connect WhatsApp Button */}
          <button 
            onClick={handleWhatsAppClick}
            className={`px-4 py-2.5 rounded-full border font-medium transition-all duration-200 flex items-center gap-2 ${
              isWhatsAppConnected
                ? 'bg-[#25D366] border-[#25D366] text-white hover:bg-[#20BA5A]'
                : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>{isWhatsAppConnected ? 'Connected' : 'Connect WhatsApp'}</span>
          </button>
          
          {/* Google Drive Button */}
          <button className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M7.71 2.5L1.15 13l2.56 4.43L10.27 6.93 7.71 2.5z" fill="#0066DA"/>
              <path d="M9.12 2.5L2.56 13l2.56 4.43L11.68 6.93 9.12 2.5z" fill="#00AC47"/>
              <path d="M16.29 2.5L9.73 13l2.56 4.43L18.84 6.93 16.29 2.5z" fill="#EA4335"/>
              <path d="M22.85 13l-6.56-10.5L13.73 6.93l6.56 10.5L22.85 13z" fill="#FFBA00"/>
            </svg>
            <span>Google Drive</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4">
                  <svg viewBox="0 0 32 32" className="w-full h-full">
                    <defs>
                      <linearGradient id="welcomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="16" cy="16" r="6" fill="url(#welcomeGradient)" opacity="0.9" />
                    <circle cx="8" cy="8" r="3" fill="url(#welcomeGradient)" opacity="0.7" />
                    <circle cx="24" cy="8" r="3" fill="url(#welcomeGradient)" opacity="0.7" />
                    <circle cx="8" cy="24" r="3" fill="url(#welcomeGradient)" opacity="0.7" />
                    <circle cx="24" cy="24" r="3" fill="url(#welcomeGradient)" opacity="0.7" />
                    <line x1="16" y1="16" x2="8" y2="8" stroke="url(#welcomeGradient)" strokeWidth="1.5" opacity="0.5" />
                    <line x1="16" y1="16" x2="24" y2="8" stroke="url(#welcomeGradient)" strokeWidth="1.5" opacity="0.5" />
                    <line x1="16" y1="16" x2="8" y2="24" stroke="url(#welcomeGradient)" strokeWidth="1.5" opacity="0.5" />
                    <line x1="16" y1="16" x2="24" y2="24" stroke="url(#welcomeGradient)" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Welcome to TOAI
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
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
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}

export default ChatInterface


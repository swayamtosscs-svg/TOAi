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

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-gradient-toai">TOAI</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your intelligent AI assistant</p>
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


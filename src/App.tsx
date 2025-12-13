import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import EmailManager from './components/EmailManager'
import { Message } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showEmailManager, setShowEmailManager] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply initial dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm TOAI, your AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', newMode.toString())
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        onNewChat={() => {
          setMessages([])
          setShowEmailManager(false)
        }}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        onOpenEmail={() => setShowEmailManager(true)}
      />
      {showEmailManager ? (
        <EmailManager onClose={() => setShowEmailManager(false)} />
      ) : (
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  )
}

export default App


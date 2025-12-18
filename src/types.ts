export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatHistory {
  id: string
  title: string
  timestamp: Date
}

export interface Project {
  id: string
  name: string
}

export interface Email {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  timestamp: Date
  read: boolean
  category?: string
  body?: string
  summary?: string
  threadId?: string
  messageId?: string
}

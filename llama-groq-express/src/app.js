import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chat.routes.js'
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userSaveRoutes from './routes/userSave.routes.js'
import userAddonRoutes from './routes/userAddon.routes.js'
import { initializeGroqClient } from './clients/groqClient.js'
import { testConnection } from './config/db.js'

/**
 * Express app setup
 */
const app = express()

// Middleware
app.use(cors()) // Enable CORS for frontend
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Initialize Groq client on app startup
initializeGroqClient()
// Test DB connection on startup (logs only)
testConnection()

// Routes
app.use('/api/chat', chatRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/user-saves', userSaveRoutes)
app.use('/api/user-addons', userAddonRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LLaMA Groq Express API',
    version: '1.0.0',
    endpoints: {
      health: '/api/chat/health',
      status: '/api/chat/status',
      chat: '/api/chat',
      auth: '/api/auth',
      messages: '/api/messages',
      userSaves: '/api/user-saves',
      userAddons: '/api/user-addons',
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  })
})

export default app


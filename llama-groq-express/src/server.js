import app from './app.js'
import { config } from './config/env.js'

/**
 * Server entry point
 */
const PORT = config.port

const server = app.listen(PORT, () => {
  console.log(`
🚀 Server is running!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
🤖 Model: ${config.modelName}
🔌 Plugin Status: ${config.pluginEnabled ? '✅ Enabled' : '❌ Disabled'}
${config.groqApiKey ? '🔑 API Key: ✅ Set' : '⚠️  API Key: ❌ Not Set'}
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})


import { llamaService } from '../services/llamaService.js'

/**
 * Chat Controller - Handles chat-related requests
 */

/**
 * Send a chat message and get AI response
 * POST /api/chat
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string',
      })
    }

    // Check if plugin is enabled
    if (!llamaService.isEnabled()) {
      return res.status(503).json({
        success: false,
        error: 'LLaMA plugin is not enabled or Groq client is not available',
        pluginStatus: llamaService.getStatus(),
      })
    }

    // Generate AI response
    const response = await llamaService.generateChatCompletion(message, conversationHistory)

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        message: response.content,
        model: response.model,
        usage: response.usage,
        finishReason: response.finishReason,
      },
    })
  } catch (error) {
    console.error('Error in sendMessage controller:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

/**
 * Get plugin status
 * GET /api/chat/status
 */
export const getStatus = async (req, res) => {
  try {
    const status = llamaService.getStatus()
    res.status(200).json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('Error in getStatus controller:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

/**
 * Health check endpoint
 * GET /api/chat/health
 */
export const healthCheck = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chat service is running',
    timestamp: new Date().toISOString(),
  })
}


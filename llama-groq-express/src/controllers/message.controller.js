import { messageModel } from '../models/message.model.js'

/**
 * Message Controller - toai_message table
 */

/**
 * Create a new message
 * POST /api/messages
 */
export const createMessage = async (req, res) => {
  try {
    const { session_id, sender_type, message, meta } = req.body
    const user_id = req.user?.id || req.user?.user_id

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    if (!session_id || !sender_type || !message) {
      return res.status(400).json({
        success: false,
        error: 'session_id, sender_type, and message are required',
      })
    }

    if (!['user', 'user_admin', 'toai_ai'].includes(sender_type)) {
      return res.status(400).json({
        success: false,
        error: 'sender_type must be one of: user, user_admin, toai_ai',
      })
    }

    const newMessage = await messageModel.create({
      user_id,
      session_id,
      sender_type,
      message,
      meta,
    })

    res.status(201).json({
      success: true,
      data: newMessage,
    })
  } catch (error) {
    console.error('Error in createMessage:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create message',
    })
  }
}

/**
 * Get message by ID
 * GET /api/messages/:id
 */
export const getMessage = async (req, res) => {
  try {
    const { id } = req.params
    const message = await messageModel.findById(id)

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      })
    }

    res.status(200).json({
      success: true,
      data: message,
    })
  } catch (error) {
    console.error('Error in getMessage:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get message',
    })
  }
}

/**
 * Get messages by session_id
 * GET /api/messages/session/:session_id
 */
export const getMessagesBySession = async (req, res) => {
  try {
    const { session_id } = req.params
    const { limit = 100, offset = 0 } = req.query

    const messages = await messageModel.findBySessionId(
      session_id,
      parseInt(limit),
      parseInt(offset)
    )

    res.status(200).json({
      success: true,
      data: messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('Error in getMessagesBySession:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get messages',
    })
  }
}

/**
 * Get messages by current user
 * GET /api/messages
 */
export const getMyMessages = async (req, res) => {
  try {
    const user_id = req.user?.id || req.user?.user_id
    const { limit = 100, offset = 0, session_id } = req.query

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    let messages
    if (session_id) {
      messages = await messageModel.findByUserAndSession(
        user_id,
        session_id,
        parseInt(limit),
        parseInt(offset)
      )
    } else {
      messages = await messageModel.findByUserId(
        user_id,
        parseInt(limit),
        parseInt(offset)
      )
    }

    res.status(200).json({
      success: true,
      data: messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('Error in getMyMessages:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get messages',
    })
  }
}

/**
 * Update message
 * PUT /api/messages/:id
 */
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params
    const { message, meta } = req.body
    const user_id = req.user?.id || req.user?.user_id

    const existingMessage = await messageModel.findById(id)
    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      })
    }

    // Check if user owns the message
    if (existingMessage.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this message',
      })
    }

    const updatedMessage = await messageModel.update(id, { message, meta })

    res.status(200).json({
      success: true,
      data: updatedMessage,
    })
  } catch (error) {
    console.error('Error in updateMessage:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update message',
    })
  }
}

/**
 * Delete message
 * DELETE /api/messages/:id
 */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const existingMessage = await messageModel.findById(id)
    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      })
    }

    // Check if user owns the message
    if (existingMessage.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this message',
      })
    }

    const deleted = await messageModel.delete(id)

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete message',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (error) {
    console.error('Error in deleteMessage:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete message',
    })
  }
}

/**
 * Delete messages by session_id
 * DELETE /api/messages/session/:session_id
 */
export const deleteMessagesBySession = async (req, res) => {
  try {
    const { session_id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    // Verify user owns at least one message in this session
    const messages = await messageModel.findBySessionId(session_id, 1, 0)
    if (messages.length > 0 && messages[0].user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this session',
      })
    }

    const deletedCount = await messageModel.deleteBySessionId(session_id)

    res.status(200).json({
      success: true,
      message: 'Session messages deleted successfully',
      deletedCount,
    })
  } catch (error) {
    console.error('Error in deleteMessagesBySession:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete messages',
    })
  }
}


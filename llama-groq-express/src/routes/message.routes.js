import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import {
  createMessage,
  getMessage,
  getMessagesBySession,
  getMyMessages,
  updateMessage,
  deleteMessage,
  deleteMessagesBySession,
} from '../controllers/message.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post('/', createMessage)

/**
 * @route   GET /api/messages
 * @desc    Get messages by current user (optionally filtered by session_id)
 * @access  Private
 */
router.get('/', getMyMessages)

/**
 * @route   GET /api/messages/session/:session_id
 * @desc    Get messages by session_id
 * @access  Private
 */
router.get('/session/:session_id', getMessagesBySession)

/**
 * @route   GET /api/messages/:id
 * @desc    Get message by ID
 * @access  Private
 */
router.get('/:id', getMessage)

/**
 * @route   PUT /api/messages/:id
 * @desc    Update message by ID
 * @access  Private
 */
router.put('/:id', updateMessage)

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete message by ID
 * @access  Private
 */
router.delete('/:id', deleteMessage)

/**
 * @route   DELETE /api/messages/session/:session_id
 * @desc    Delete all messages in a session
 * @access  Private
 */
router.delete('/session/:session_id', deleteMessagesBySession)

export default router


import express from 'express'
import { sendMessage, getStatus, healthCheck } from '../controllers/chat.controller.js'

const router = express.Router()

/**
 * @route   GET /api/chat/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', healthCheck)

/**
 * @route   GET /api/chat/status
 * @desc    Get plugin status
 * @access  Public
 */
router.get('/status', getStatus)

/**
 * @route   POST /api/chat
 * @desc    Send a chat message and get AI response
 * @access  Public
 */
router.post('/', sendMessage)

export default router


import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import {
  createUserSave,
  getUserSave,
  getMyUserSaves,
  updateUserSave,
  deleteUserSave,
} from '../controllers/userSave.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

/**
 * @route   POST /api/user-saves
 * @desc    Create a new saved prompt/response
 * @access  Private
 */
router.post('/', createUserSave)

/**
 * @route   GET /api/user-saves
 * @desc    Get saved items by current user (optionally filtered by session_id or search)
 * @access  Private
 */
router.get('/', getMyUserSaves)

/**
 * @route   GET /api/user-saves/:id
 * @desc    Get saved item by ID
 * @access  Private
 */
router.get('/:id', getUserSave)

/**
 * @route   PUT /api/user-saves/:id
 * @desc    Update saved item by ID
 * @access  Private
 */
router.put('/:id', updateUserSave)

/**
 * @route   DELETE /api/user-saves/:id
 * @desc    Delete saved item by ID
 * @access  Private
 */
router.delete('/:id', deleteUserSave)

export default router


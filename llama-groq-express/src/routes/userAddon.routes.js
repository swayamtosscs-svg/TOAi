import express from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import {
  createUserAddon,
  getUserAddon,
  getMyUserAddons,
  updateUserAddon,
  toggleUserAddon,
  deleteUserAddon,
} from '../controllers/userAddon.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

/**
 * @route   POST /api/user-addons
 * @desc    Create a new user addon
 * @access  Private
 */
router.post('/', createUserAddon)

/**
 * @route   GET /api/user-addons
 * @desc    Get addons by current user (optionally filtered by active_only)
 * @access  Private
 */
router.get('/', getMyUserAddons)

/**
 * @route   GET /api/user-addons/:id
 * @desc    Get addon by ID
 * @access  Private
 */
router.get('/:id', getUserAddon)

/**
 * @route   PUT /api/user-addons/:id
 * @desc    Update addon by ID
 * @access  Private
 */
router.put('/:id', updateUserAddon)

/**
 * @route   PATCH /api/user-addons/:id/toggle
 * @desc    Toggle addon active status
 * @access  Private
 */
router.patch('/:id/toggle', toggleUserAddon)

/**
 * @route   DELETE /api/user-addons/:id
 * @desc    Delete addon by ID
 * @access  Private
 */
router.delete('/:id', deleteUserAddon)

export default router


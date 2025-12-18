import { userAddonModel } from '../models/userAddon.model.js'

/**
 * User Addon Controller - toai_user_adon table
 */

/**
 * Create a new user addon
 * POST /api/user-addons
 */
export const createUserAddon = async (req, res) => {
  try {
    const {
      addon_code,
      addon_name,
      description,
      is_active = 0,
      purchased_at,
      expires_at,
    } = req.body
    const user_id = req.user?.id || req.user?.user_id

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    if (!addon_code || !addon_name) {
      return res.status(400).json({
        success: false,
        error: 'addon_code and addon_name are required',
      })
    }

    // Check if addon already exists for this user
    const existing = await userAddonModel.findByUserAndCode(user_id, addon_code)
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Addon already exists for this user',
      })
    }

    const newAddon = await userAddonModel.create({
      user_id,
      addon_code,
      addon_name,
      description,
      is_active,
      purchased_at: purchased_at || new Date(),
      expires_at,
    })

    res.status(201).json({
      success: true,
      data: newAddon,
    })
  } catch (error) {
    console.error('Error in createUserAddon:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create addon',
    })
  }
}

/**
 * Get addon by ID
 * GET /api/user-addons/:id
 */
export const getUserAddon = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const addon = await userAddonModel.findById(id)

    if (!addon) {
      return res.status(404).json({
        success: false,
        error: 'Addon not found',
      })
    }

    // Check if user owns the addon
    if (addon.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this addon',
      })
    }

    res.status(200).json({
      success: true,
      data: addon,
    })
  } catch (error) {
    console.error('Error in getUserAddon:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get addon',
    })
  }
}

/**
 * Get addons by current user
 * GET /api/user-addons
 */
export const getMyUserAddons = async (req, res) => {
  try {
    const user_id = req.user?.id || req.user?.user_id
    const { limit = 100, offset = 0, active_only } = req.query

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    let addons
    if (active_only === 'true') {
      addons = await userAddonModel.findActiveByUserId(user_id)
    } else {
      addons = await userAddonModel.findByUserId(
        user_id,
        parseInt(limit),
        parseInt(offset)
      )
    }

    res.status(200).json({
      success: true,
      data: addons,
      count: addons.length,
    })
  } catch (error) {
    console.error('Error in getMyUserAddons:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get addons',
    })
  }
}

/**
 * Update addon
 * PUT /api/user-addons/:id
 */
export const updateUserAddon = async (req, res) => {
  try {
    const { id } = req.params
    const {
      addon_name,
      description,
      is_active,
      purchased_at,
      expires_at,
    } = req.body
    const user_id = req.user?.id || req.user?.user_id

    const existingAddon = await userAddonModel.findById(id)
    if (!existingAddon) {
      return res.status(404).json({
        success: false,
        error: 'Addon not found',
      })
    }

    // Check if user owns the addon
    if (existingAddon.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this addon',
      })
    }

    const updatedAddon = await userAddonModel.update(id, {
      addon_name,
      description,
      is_active,
      purchased_at,
      expires_at,
    })

    res.status(200).json({
      success: true,
      data: updatedAddon,
    })
  } catch (error) {
    console.error('Error in updateUserAddon:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update addon',
    })
  }
}

/**
 * Toggle addon active status
 * PATCH /api/user-addons/:id/toggle
 */
export const toggleUserAddon = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const existingAddon = await userAddonModel.findById(id)
    if (!existingAddon) {
      return res.status(404).json({
        success: false,
        error: 'Addon not found',
      })
    }

    // Check if user owns the addon
    if (existingAddon.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to toggle this addon',
      })
    }

    const updatedAddon = await userAddonModel.toggleActive(id)

    res.status(200).json({
      success: true,
      data: updatedAddon,
    })
  } catch (error) {
    console.error('Error in toggleUserAddon:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to toggle addon',
    })
  }
}

/**
 * Delete addon
 * DELETE /api/user-addons/:id
 */
export const deleteUserAddon = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const existingAddon = await userAddonModel.findById(id)
    if (!existingAddon) {
      return res.status(404).json({
        success: false,
        error: 'Addon not found',
      })
    }

    // Check if user owns the addon
    if (existingAddon.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this addon',
      })
    }

    const deleted = await userAddonModel.delete(id)

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete addon',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Addon deleted successfully',
    })
  } catch (error) {
    console.error('Error in deleteUserAddon:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete addon',
    })
  }
}


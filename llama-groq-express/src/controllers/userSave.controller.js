import { userSaveModel } from '../models/userSave.model.js'

/**
 * User Save Controller - toai_user_save table
 */

/**
 * Create a new saved prompt/response
 * POST /api/user-saves
 */
export const createUserSave = async (req, res) => {
  try {
    const {
      session_id,
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    } = req.body
    const user_id = req.user?.id || req.user?.user_id

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    if (!prompt_template) {
      return res.status(400).json({
        success: false,
        error: 'prompt_template is required',
      })
    }

    const newSave = await userSaveModel.create({
      user_id,
      session_id,
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    })

    res.status(201).json({
      success: true,
      data: newSave,
    })
  } catch (error) {
    console.error('Error in createUserSave:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create saved item',
    })
  }
}

/**
 * Get saved item by ID
 * GET /api/user-saves/:id
 */
export const getUserSave = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const savedItem = await userSaveModel.findById(id)

    if (!savedItem) {
      return res.status(404).json({
        success: false,
        error: 'Saved item not found',
      })
    }

    // Check if user owns the saved item
    if (savedItem.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to view this item',
      })
    }

    res.status(200).json({
      success: true,
      data: savedItem,
    })
  } catch (error) {
    console.error('Error in getUserSave:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get saved item',
    })
  }
}

/**
 * Get saved items by current user
 * GET /api/user-saves
 */
export const getMyUserSaves = async (req, res) => {
  try {
    const user_id = req.user?.id || req.user?.user_id
    const { limit = 100, offset = 0, session_id, search } = req.query

    if (!user_id) {
      return res.status(401).json({
        success: false,
        error: 'User ID is required',
      })
    }

    let savedItems
    if (search) {
      savedItems = await userSaveModel.search(
        user_id,
        search,
        parseInt(limit),
        parseInt(offset)
      )
    } else if (session_id) {
      savedItems = await userSaveModel.findByUserAndSession(
        user_id,
        session_id,
        parseInt(limit),
        parseInt(offset)
      )
    } else {
      savedItems = await userSaveModel.findByUserId(
        user_id,
        parseInt(limit),
        parseInt(offset)
      )
    }

    res.status(200).json({
      success: true,
      data: savedItems,
      count: savedItems.length,
    })
  } catch (error) {
    console.error('Error in getMyUserSaves:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get saved items',
    })
  }
}

/**
 * Update saved item
 * PUT /api/user-saves/:id
 */
export const updateUserSave = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    } = req.body
    const user_id = req.user?.id || req.user?.user_id

    const existingSave = await userSaveModel.findById(id)
    if (!existingSave) {
      return res.status(404).json({
        success: false,
        error: 'Saved item not found',
      })
    }

    // Check if user owns the saved item
    if (existingSave.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this item',
      })
    }

    const updatedSave = await userSaveModel.update(id, {
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    })

    res.status(200).json({
      success: true,
      data: updatedSave,
    })
  } catch (error) {
    console.error('Error in updateUserSave:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update saved item',
    })
  }
}

/**
 * Delete saved item
 * DELETE /api/user-saves/:id
 */
export const deleteUserSave = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user?.id || req.user?.user_id

    const existingSave = await userSaveModel.findById(id)
    if (!existingSave) {
      return res.status(404).json({
        success: false,
        error: 'Saved item not found',
      })
    }

    // Check if user owns the saved item
    if (existingSave.user_id != user_id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this item',
      })
    }

    const deleted = await userSaveModel.delete(id)

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete saved item',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Saved item deleted successfully',
    })
  } catch (error) {
    console.error('Error in deleteUserSave:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete saved item',
    })
  }
}


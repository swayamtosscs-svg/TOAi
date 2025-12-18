import { pool } from '../config/db.js'

/**
 * User Addon Model - toai_user_adon table
 */
export const userAddonModel = {
  /**
   * Create a new user addon
   */
  async create(data) {
    const {
      user_id,
      addon_code,
      addon_name,
      description,
      is_active = 0,
      purchased_at = null,
      expires_at = null,
    } = data
    const query = `
      INSERT INTO toai_user_adon 
      (user_id, addon_code, addon_name, description, is_active, purchased_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [
      user_id,
      addon_code,
      addon_name,
      description || null,
      is_active,
      purchased_at || null,
      expires_at || null,
    ])
    return this.findById(result.insertId)
  },

  /**
   * Find addon by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM toai_user_adon WHERE id = ?'
    const [rows] = await pool.execute(query, [id])
    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Find addons by user_id
   */
  async findByUserId(user_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_user_adon 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [user_id, limit, offset])
    return rows
  },

  /**
   * Find addon by user_id and addon_code
   */
  async findByUserAndCode(user_id, addon_code) {
    const query = 'SELECT * FROM toai_user_adon WHERE user_id = ? AND addon_code = ?'
    const [rows] = await pool.execute(query, [user_id, addon_code])
    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Find active addons by user_id
   */
  async findActiveByUserId(user_id) {
    const query = `
      SELECT * FROM toai_user_adon 
      WHERE user_id = ? AND is_active = 1 
      AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY created_at DESC
    `
    const [rows] = await pool.execute(query, [user_id])
    return rows
  },

  /**
   * Update addon by ID
   */
  async update(id, data) {
    const {
      addon_name,
      description,
      is_active,
      purchased_at,
      expires_at,
    } = data
    const updates = []
    const values = []

    if (addon_name !== undefined) {
      updates.push('addon_name = ?')
      values.push(addon_name)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(is_active)
    }
    if (purchased_at !== undefined) {
      updates.push('purchased_at = ?')
      values.push(purchased_at)
    }
    if (expires_at !== undefined) {
      updates.push('expires_at = ?')
      values.push(expires_at)
    }

    if (updates.length === 0) return this.findById(id)

    values.push(id)
    const query = `UPDATE toai_user_adon SET ${updates.join(', ')} WHERE id = ?`
    await pool.execute(query, values)
    return this.findById(id)
  },

  /**
   * Toggle addon active status
   */
  async toggleActive(id) {
    const addon = await this.findById(id)
    if (!addon) return null
    const newStatus = addon.is_active === 1 ? 0 : 1
    return this.update(id, { is_active: newStatus })
  },

  /**
   * Delete addon by ID
   */
  async delete(id) {
    const query = 'DELETE FROM toai_user_adon WHERE id = ?'
    const [result] = await pool.execute(query, [id])
    return result.affectedRows > 0
  },

  /**
   * Delete addon by user_id and addon_code
   */
  async deleteByUserAndCode(user_id, addon_code) {
    const query = 'DELETE FROM toai_user_adon WHERE user_id = ? AND addon_code = ?'
    const [result] = await pool.execute(query, [user_id, addon_code])
    return result.affectedRows > 0
  },

  /**
   * Count addons by user_id
   */
  async countByUserId(user_id) {
    const query = 'SELECT COUNT(*) as count FROM toai_user_adon WHERE user_id = ?'
    const [rows] = await pool.execute(query, [user_id])
    return rows[0].count
  },

  /**
   * Check if addon is expired
   */
  async isExpired(id) {
    const addon = await this.findById(id)
    if (!addon || !addon.expires_at) return false
    return new Date(addon.expires_at) < new Date()
  },
}


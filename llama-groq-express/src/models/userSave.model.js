import { pool } from '../config/db.js'

/**
 * User Save Model - toai_user_save table
 */
export const userSaveModel = {
  /**
   * Create a new saved prompt/response
   */
  async create(data) {
    const {
      user_id,
      session_id,
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    } = data
    const query = `
      INSERT INTO toai_user_save (
        user_id,
        session_id,
        name,
        description,
        tags,
        scope,
        prompt_template,
        preview,
        viewer
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [
      user_id,
      session_id || null,
      name || null,
      description || null,
      tags || null,
      scope || null,
      prompt_template,
      preview || null,
      viewer || null,
    ])
    return this.findById(result.insertId)
  },

  /**
   * Find saved item by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM toai_user_save WHERE id = ?'
    const [rows] = await pool.execute(query, [id])
    return rows.length > 0 ? rows[0] : null
  },

  /**
   * Find saved items by user_id
   */
  async findByUserId(user_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_user_save 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [user_id, limit, offset])
    return rows
  },

  /**
   * Find saved items by session_id
   */
  async findBySessionId(session_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_user_save 
      WHERE session_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [session_id, limit, offset])
    return rows
  },

  /**
   * Find saved items by user_id and session_id
   */
  async findByUserAndSession(user_id, session_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_user_save 
      WHERE user_id = ? AND session_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [user_id, session_id, limit, offset])
    return rows
  },

  /**
   * Search saved items by title or prompt_text
   */
  async search(user_id, searchTerm, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_user_save 
      WHERE user_id = ?
        AND (
          name LIKE ?
          OR description LIKE ?
          OR tags LIKE ?
          OR prompt_template LIKE ?
        )
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const searchPattern = `%${searchTerm}%`
    const [rows] = await pool.execute(query, [
      user_id,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset,
    ])
    return rows
  },

  /**
   * Update saved item by ID
   */
  async update(id, data) {
    const {
      name,
      description,
      tags,
      scope,
      prompt_template,
      preview,
      viewer,
    } = data
    const updates = []
    const values = []

    if (name !== undefined) {
      updates.push('name = ?')
      values.push(name)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    if (tags !== undefined) {
      updates.push('tags = ?')
      values.push(tags)
    }
    if (scope !== undefined) {
      updates.push('scope = ?')
      values.push(scope)
    }
    if (prompt_template !== undefined) {
      updates.push('prompt_template = ?')
      values.push(prompt_template)
    }
    if (preview !== undefined) {
      updates.push('preview = ?')
      values.push(preview)
    }
    if (viewer !== undefined) {
      updates.push('viewer = ?')
      values.push(viewer)
    }

    if (updates.length === 0) return this.findById(id)

    values.push(id)
    const query = `UPDATE toai_user_save SET ${updates.join(', ')} WHERE id = ?`
    await pool.execute(query, values)
    return this.findById(id)
  },

  /**
   * Delete saved item by ID
   */
  async delete(id) {
    const query = 'DELETE FROM toai_user_save WHERE id = ?'
    const [result] = await pool.execute(query, [id])
    return result.affectedRows > 0
  },

  /**
   * Delete saved items by user_id
   */
  async deleteByUserId(user_id) {
    const query = 'DELETE FROM toai_user_save WHERE user_id = ?'
    const [result] = await pool.execute(query, [user_id])
    return result.affectedRows
  },

  /**
   * Count saved items by user_id
   */
  async countByUserId(user_id) {
    const query = 'SELECT COUNT(*) as count FROM toai_user_save WHERE user_id = ?'
    const [rows] = await pool.execute(query, [user_id])
    return rows[0].count
  },
}


import { pool } from '../config/db.js'

/**
 * Message Model - toai_message table
 */
export const messageModel = {
  /**
   * Create a new message
   */
  async create(data) {
    const { user_id, session_id, sender_type, message, meta = null } = data
    const query = `
      INSERT INTO toai_message (user_id, session_id, sender_type, message, meta)
      VALUES (?, ?, ?, ?, ?)
    `
    const [result] = await pool.execute(query, [
      user_id,
      session_id,
      sender_type,
      message,
      meta ? JSON.stringify(meta) : null,
    ])
    return this.findById(result.insertId)
  },

  /**
   * Find message by ID
   */
  async findById(id) {
    const query = 'SELECT * FROM toai_message WHERE id = ?'
    const [rows] = await pool.execute(query, [id])
    if (rows.length === 0) return null
    const message = rows[0]
    // Parse JSON meta field
    if (message.meta) {
      try {
        message.meta = JSON.parse(message.meta)
      } catch (e) {
        message.meta = null
      }
    }
    return message
  },

  /**
   * Find messages by user_id
   */
  async findByUserId(user_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_message 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [user_id, limit, offset])
    return rows.map((msg) => {
      if (msg.meta) {
        try {
          msg.meta = JSON.parse(msg.meta)
        } catch (e) {
          msg.meta = null
        }
      }
      return msg
    })
  },

  /**
   * Find messages by session_id
   */
  async findBySessionId(session_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_message 
      WHERE session_id = ? 
      ORDER BY created_at ASC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [session_id, limit, offset])
    return rows.map((msg) => {
      if (msg.meta) {
        try {
          msg.meta = JSON.parse(msg.meta)
        } catch (e) {
          msg.meta = null
        }
      }
      return msg
    })
  },

  /**
   * Find messages by user_id and session_id
   */
  async findByUserAndSession(user_id, session_id, limit = 100, offset = 0) {
    const query = `
      SELECT * FROM toai_message 
      WHERE user_id = ? AND session_id = ? 
      ORDER BY created_at ASC 
      LIMIT ? OFFSET ?
    `
    const [rows] = await pool.execute(query, [user_id, session_id, limit, offset])
    return rows.map((msg) => {
      if (msg.meta) {
        try {
          msg.meta = JSON.parse(msg.meta)
        } catch (e) {
          msg.meta = null
        }
      }
      return msg
    })
  },

  /**
   * Update message by ID
   */
  async update(id, data) {
    const { message, meta } = data
    const updates = []
    const values = []

    if (message !== undefined) {
      updates.push('message = ?')
      values.push(message)
    }
    if (meta !== undefined) {
      updates.push('meta = ?')
      values.push(meta ? JSON.stringify(meta) : null)
    }

    if (updates.length === 0) return this.findById(id)

    values.push(id)
    const query = `UPDATE toai_message SET ${updates.join(', ')} WHERE id = ?`
    await pool.execute(query, values)
    return this.findById(id)
  },

  /**
   * Delete message by ID
   */
  async delete(id) {
    const query = 'DELETE FROM toai_message WHERE id = ?'
    const [result] = await pool.execute(query, [id])
    return result.affectedRows > 0
  },

  /**
   * Delete messages by session_id
   */
  async deleteBySessionId(session_id) {
    const query = 'DELETE FROM toai_message WHERE session_id = ?'
    const [result] = await pool.execute(query, [session_id])
    return result.affectedRows
  },

  /**
   * Count messages by user_id
   */
  async countByUserId(user_id) {
    const query = 'SELECT COUNT(*) as count FROM toai_message WHERE user_id = ?'
    const [rows] = await pool.execute(query, [user_id])
    return rows[0].count
  },
}


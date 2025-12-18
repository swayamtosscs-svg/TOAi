import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'

export const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    return rows[0] || null
  },

  async create({ name, email, password, role = 'user', user_admin_id = null, user_admin_email = null }) {
    const passwordHash = await bcrypt.hash(password, 12)
    const now = new Date()

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, user_admin_id, user_admin_email, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, passwordHash, role, user_admin_id, user_admin_email, now],
    )

    return {
      id: result.insertId,
      name,
      email,
      role,
      user_admin_id,
      user_admin_email,
      created_at: now,
    }
  },

  async verifyPassword(user, password) {
    if (!user?.password_hash) return false
    return bcrypt.compare(password, user.password_hash)
  },
}



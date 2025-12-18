import { pool } from '../config/db.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Helper to verify legacy scrypt hashes (format from the SQL dump)
const verifyScryptHash = (password, storedHash) => {
  if (!storedHash.startsWith('scrypt:')) return false

  try {
    // Example format: scrypt:N:r:p$salt$hexhash
    const [, params, saltB64, hashHex] = storedHash.split('$')
    const [_, Nstr, rstr, pstr] = params.split(':') // ignore first element ("scrypt")
    const N = parseInt(Nstr, 10)
    const r = parseInt(rstr, 10)
    const p = parseInt(pstr, 10)

    const salt = Buffer.from(saltB64, 'base64')
    const keyLen = Buffer.from(hashHex, 'hex').length

    const derivedKey = crypto.scryptSync(password, salt, keyLen, { N, r, p })
    return crypto.timingSafeEqual(derivedKey, Buffer.from(hashHex, 'hex'))
  } catch (err) {
    console.error('Error verifying scrypt hash:', err)
    return false
  }
}

export const AdminModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? LIMIT 1', [email])
    return rows[0] || null
  },

  async create({ email, username, password, role = 'admin', module = null }) {
    const passwordHash = await bcrypt.hash(password, 12)
    const now = new Date()

    const [result] = await pool.query(
      `INSERT INTO admins (email, username, password_hash, role, module, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, username, passwordHash, role, module, now],
    )

    return {
      id: result.insertId,
      email,
      username,
      role,
      module,
      created_at: now,
    }
  },

  async verifyPassword(admin, password) {
    if (!admin?.password_hash) return false
    const hash = admin.password_hash

    if (hash.startsWith('scrypt:')) {
      return verifyScryptHash(password, hash)
    }

    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      return bcrypt.compare(password, hash)
    }

    // Unknown format
    return false
  },
}



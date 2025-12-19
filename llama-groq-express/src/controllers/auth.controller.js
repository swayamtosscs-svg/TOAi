import jwt from 'jsonwebtoken'
import { AdminModel } from '../models/admin.model.js'
import { UserModel } from '../models/user.model.js'
import { config } from '../config/env.js'

// Use the same JWT secret/expiry as the auth middleware to ensure tokens validate correctly
const createToken = (payload) =>
  jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn || '1d',
  })

const sanitizeAdmin = (admin) => {
  if (!admin) return null
  const { password_hash, ...rest } = admin
  return rest
}

const sanitizeUser = (user) => {
  if (!user) return null
  const { password_hash, ...rest } = user
  return rest
}

// Admin registration
export const registerAdmin = async (req, res) => {
  try {
    const { email, username, password, role = 'admin', module = null } = req.body

    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'email, username and password are required',
      })
    }

    const existing = await AdminModel.findByEmail(email)
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Admin with this email already exists',
      })
    }

    const admin = await AdminModel.create({ email, username, password, role, module })
    const token = createToken({ id: admin.id, email: admin.email, role: admin.role, type: 'admin' })

    res.status(201).json({
      success: true,
      data: {
        admin,
        token,
      },
    })
  } catch (error) {
    console.error('Error in registerAdmin:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'email and password are required',
      })
    }

    const admin = await AdminModel.findByEmail(email)
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    const valid = await AdminModel.verifyPassword(admin, password)
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    const token = createToken({ id: admin.id, email: admin.email, role: admin.role, type: 'admin' })

    res.status(200).json({
      success: true,
      data: {
        admin: sanitizeAdmin(admin),
        token,
      },
    })
  } catch (error) {
    console.error('Error in loginAdmin:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

// User registration (uses `users` table, role always 'user')
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'name, email and password are required',
      })
    }

    const existing = await UserModel.findByEmail(email)
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      })
    }

    // Always create normal user; ignore any role in body
    const user = await UserModel.create({
      name,
      email,
      password,
      role: 'user',
      user_admin_id: null,
      user_admin_email: null,
    })
    const token = createToken({ id: user.id, email: user.email, role: 'user', type: 'user' })

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    console.error('Error in registerUser:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'email and password are required',
      })
    }

    const user = await UserModel.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    const valid = await UserModel.verifyPassword(user, password)
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role, type: 'user' })

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    })
  } catch (error) {
    console.error('Error in loginUser:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}

// Google OAuth login
export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken, name, email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'email is required',
      })
    }

    // Check if user exists
    let user = await UserModel.findByEmail(email)

    if (!user) {
      // Create new user if doesn't exist
      // For Google OAuth users, we don't have a password, so we'll set a random one
      // In production, you might want to add a flag to indicate OAuth users
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
      user = await UserModel.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        role: 'user',
        user_admin_id: null,
        user_admin_email: null,
      })
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role, type: 'user' })

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    })
  } catch (error) {
    console.error('Error in loginWithGoogle:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}



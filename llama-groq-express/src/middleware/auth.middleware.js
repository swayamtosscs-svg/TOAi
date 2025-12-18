import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

/**
 * JWT Authentication Middleware
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
    })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded // Attach user info to request
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    })
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      req.user = decoded
    } catch (error) {
      // Ignore invalid token for optional auth
    }
  }
  next()
}


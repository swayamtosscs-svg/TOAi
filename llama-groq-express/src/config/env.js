import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 5001,
  groqApiKey: process.env.GROQ_API_KEY, // Must be set in .env file
  modelName: process.env.MODEL_NAME || 'llama-3.3-70b-versatile',
  // Plugin activation state (can be toggled)
  pluginEnabled: process.env.PLUGIN_ENABLED !== 'false', // Default to enabled
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'Toai-Toss',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
}


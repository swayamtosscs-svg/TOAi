import Groq from 'groq-sdk'
import { config } from '../config/env.js'

let groqClient = null

/**
 * Initialize Groq client
 * @returns {Groq | null} Groq client instance or null if API key is missing
 */
export const initializeGroqClient = () => {
  if (!config.groqApiKey) {
    console.warn('⚠️  GROQ_API_KEY is not set. Groq client will not be initialized.')
    return null
  }

  try {
    groqClient = new Groq({
      apiKey: config.groqApiKey,
    })
    console.log('✅ Groq client initialized successfully')
    return groqClient
  } catch (error) {
    console.error('❌ Failed to initialize Groq client:', error.message)
    return null
  }
}

/**
 * Get the Groq client instance
 * @returns {Groq | null} Groq client instance
 */
export const getGroqClient = () => {
  return groqClient
}

/**
 * Check if Groq client is available
 * @returns {boolean} True if client is initialized
 */
export const isGroqClientAvailable = () => {
  return groqClient !== null && config.groqApiKey !== ''
}


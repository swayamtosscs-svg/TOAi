import { getGroqClient, isGroqClientAvailable } from '../clients/groqClient.js'
import { config } from '../config/env.js'

/**
 * LLaMA 3.3 Service - Plugin-based AI chat service
 * Can be activated/deactivated via PLUGIN_ENABLED environment variable
 */
class LlamaService {
  /**
   * Check if the plugin is enabled
   * @returns {boolean} True if plugin is enabled
   */
  isEnabled() {
    return config.pluginEnabled && isGroqClientAvailable()
  }

  /**
   * Generate chat completion using LLaMA 3.3
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise<Object>} Response object with content and metadata
   */
  async generateChatCompletion(message, conversationHistory = []) {
    // Check if plugin is enabled
    if (!this.isEnabled()) {
      throw new Error('LLaMA plugin is not enabled or Groq client is not available')
    }

    const groqClient = getGroqClient()
    if (!groqClient) {
      throw new Error('Groq client is not initialized')
    }

    try {
      // Build messages array with conversation history
      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ]

      // Call Groq API
      const completion = await groqClient.chat.completions.create({
        messages,
        model: config.modelName,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      })

      const responseContent = completion.choices[0]?.message?.content || 'No response generated'

      return {
        content: responseContent,
        model: completion.model,
        usage: completion.usage,
        finishReason: completion.choices[0]?.finish_reason,
      }
    } catch (error) {
      console.error('Error generating chat completion:', error)
      throw new Error(`Failed to generate chat completion: ${error.message}`)
    }
  }

  /**
   * Get plugin status
   * @returns {Object} Plugin status information
   */
  getStatus() {
    return {
      enabled: this.isEnabled(),
      pluginEnabled: config.pluginEnabled,
      clientAvailable: isGroqClientAvailable(),
      modelName: config.modelName,
    }
  }

  /**
   * Toggle plugin activation (runtime toggle - for future use)
   * Note: This would require a way to update config at runtime
   * For now, use PLUGIN_ENABLED environment variable
   */
  togglePlugin() {
    // This is a placeholder for future runtime toggle functionality
    // Currently, plugin state is controlled via environment variable
    console.warn('Plugin toggle via API not yet implemented. Use PLUGIN_ENABLED environment variable.')
  }
}

// Export singleton instance
export const llamaService = new LlamaService()


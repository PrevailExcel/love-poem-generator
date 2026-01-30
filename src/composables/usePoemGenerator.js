import { ref } from 'vue'
import { api } from '@/services/api'

export const poemStyles = [
  {
    id: 'classic',
    name: 'Classic Romance',
    description: 'Timeless and elegant, like a love letter from centuries past',
    icon: '📜',
    premium: false
  },
  {
    id: 'playful',
    name: 'Playful & Light',
    description: 'Fun, whimsical verses that bring a smile',
    icon: '😊',
    premium: false
  },
  {
    id: 'passionate',
    name: 'Passionate',
    description: 'Intense, heartfelt emotion that burns bright',
    icon: '🔥',
    premium: false
  },
  {
    id: 'haiku',
    name: 'Haiku',
    description: 'Simple, beautiful moments in three lines',
    icon: '🌸',
    premium: false
  },
  {
    id: 'sonnet',
    name: 'Shakespearean Sonnet',
    description: 'Classic 14-line structure with perfect rhythm',
    icon: '👑',
    premium: true
  },
  {
    id: 'acrostic',
    name: 'Acrostic',
    description: 'Each line begins with a letter of their name',
    icon: '✍️',
    premium: true
  }
]

const isGenerating = ref(false)
const generationError = ref(null)

export function usePoemGenerator() {
  /**
   * Generate a poem using the API
   */
  const generatePoem = async (poemData, usePhotoBackground = false) => {
    isGenerating.value = true
    generationError.value = null

    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append('anonymous_id', poemData.anonymousId)
      formData.append('description', poemData.description)
      formData.append('style', poemData.style)
      formData.append('uses_photo_background', usePhotoBackground ? '1' : '0')
      
      if (poemData.name) {
        formData.append('recipient_name', poemData.name)
      }
      
      if (poemData.photo) {
        formData.append('image', poemData.photo)
      }

      const response = await api.poems.generate(formData)

      if (response.data.success) {
        return {
          success: true,
          poem: response.data.poem,
          remaining: response.data.remaining_generations
        }
      }
    } catch (error) {
      console.error('Poem generation error:', error)
      
      const errorData = error.response?.data
      
      // Handle specific error types
      if (errorData?.limit_reached) {
        return {
          success: false,
          limitReached: true,
          error: 'Daily generation limit reached'
        }
      }
      
      if (errorData?.requires_premium) {
        return {
          success: false,
          requiresPremium: true,
          error: errorData.error || 'Premium feature required'
        }
      }
      
      generationError.value = errorData?.error || 'Failed to generate poem'
      
      return {
        success: false,
        error: generationError.value
      }
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Get available poem styles from API
   */
  const getAvailableStyles = async () => {
    try {
      const response = await api.poems.getStyles()
      if (response.data.success) {
        return response.data.styles
      }
      return poemStyles // Fallback to local
    } catch (error) {
      console.error('Failed to load styles:', error)
      return poemStyles // Fallback to local
    }
  }

  /**
   * Get a specific poem by UUID
   */
  const getPoem = async (uuid) => {
    try {
      const response = await api.poems.get(uuid)
      if (response.data.success) {
        return {
          success: true,
          poem: response.data.poem
        }
      }
    } catch (error) {
      console.error('Failed to load poem:', error)
      return {
        success: false,
        error: 'Poem not found'
      }
    }
  }

  /**
   * Get user's poem list
   */
  const getUserPoems = async (page = 1) => {
    try {
      const response = await api.poems.list(page)
      if (response.data.success) {
        return {
          success: true,
          poems: response.data.poems,
          pagination: response.data.pagination
        }
      }
    } catch (error) {
      console.error('Failed to load poems:', error)
      return {
        success: false,
        error: 'Failed to load poems',
        poems: [],
        pagination: null
      }
    }
  }

  /**
   * Delete a poem
   */
  const deletePoem = async (uuid) => {
    try {
      const response = await api.poems.delete(uuid)
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error) {
      console.error('Failed to delete poem:', error)
      return {
        success: false,
        error: 'Failed to delete poem'
      }
    }
  }

  /**
   * Track poem share
   */
  const trackShare = async (uuid) => {
    try {
      await api.poems.trackShare(uuid)
    } catch (error) {
      console.error('Failed to track share:', error)
    }
  }

  return {
    poemStyles,
    isGenerating,
    generationError,
    generatePoem,
    getAvailableStyles,
    getPoem,
    getUserPoems,
    deletePoem,
    trackShare,
  }
}
import { ref, computed } from 'vue'
import { api } from '@/services/api'

const anonymousUserId = ref(null)
const authToken = ref(null)
const currentUser = ref(null)
const generationCount = ref(0)
const remainingGenerations = ref(2)
const credits = ref(0) // Pay-per-poem credits
const poemDraft = ref({
  name: '',
  description: '',
  photo: null,
  photoPreview: null,
  style: 'classic'
})
const currentPoem = ref(null)
const currentPoemId = ref(null)
const isCurrentPoemUnlocked = ref(false)

export function useUser() {
  // Initialize user
  const initializeUser = () => {
    // Get or create anonymous ID
    let storedId = localStorage.getItem('loveverse_anonymous_id')
    if (!storedId) {
      storedId = generateUUID()
      localStorage.setItem('loveverse_anonymous_id', storedId)
    }
    anonymousUserId.value = storedId

    // Get auth token
    const token = localStorage.getItem('loveverse_auth_token')
    if (token) {
      authToken.value = token
      loadCurrentUser()
    }

    // Load draft
    const savedDraft = localStorage.getItem('loveverse_draft')
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft)
        poemDraft.value = {
          name: data.name || '',
          description: data.description || '',
          photo: null,
          photoPreview: data.photoPreview || null,
          style: data.style || 'classic'
        }
      } catch (e) {
        console.error('Failed to parse draft:', e)
      }
    }

    // Check limits
    checkLimits()
  }

  // Generate UUID v4
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Load current user from API
  const loadCurrentUser = async () => {
    try {
      const response = await api.auth.me()
      if (response.data.success) {
        currentUser.value = response.data.user
        remainingGenerations.value = response.data.user.remaining_generations
        credits.value = response.data.user.credits || 0
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      // Clear invalid token
      localStorage.removeItem('loveverse_auth_token')
      authToken.value = null
    }
  }

  // Load credits
  const loadCredits = async () => {
    try {
      const response = await api.payments.getCredits()
      if (response.data.success) {
        credits.value = response.data.credits
      }
    } catch (error) {
      console.error('Failed to load credits:', error)
    }
  }

  // Check generation limits
  const checkLimits = async () => {
    try {
      const response = await api.poems.checkLimits(anonymousUserId.value)
      if (response.data.success) {
        remainingGenerations.value = response.data.remaining
        generationCount.value = response.data.remaining === 2 ? 0 : (2 - response.data.remaining)
      }
    } catch (error) {
      console.error('Failed to check limits:', error)
    }
  }

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      name: poemDraft.value.name,
      description: poemDraft.value.description,
      photoPreview: poemDraft.value.photoPreview,
      style: poemDraft.value.style
    }
    localStorage.setItem('loveverse_draft', JSON.stringify(draft))
  }

  // Clear draft
  const clearDraft = () => {
    poemDraft.value = {
      name: '',
      description: '',
      photo: null,
      photoPreview: null,
      style: 'classic'
    }
    localStorage.removeItem('loveverse_draft')
  }

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.auth.login({
        email,
        password,
        anonymous_id: anonymousUserId.value
      })
      
      if (response.data.success) {
        authToken.value = response.data.token
        currentUser.value = response.data.user
        localStorage.setItem('loveverse_auth_token', response.data.token)
        remainingGenerations.value = response.data.user.remaining_generations
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  // Register
  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const response = await api.auth.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        anonymous_id: anonymousUserId.value
      })
      
      if (response.data.success) {
        authToken.value = response.data.token
        currentUser.value = response.data.user
        localStorage.setItem('loveverse_auth_token', response.data.token)
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { general: ['Registration failed'] }
      }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      authToken.value = null
      currentUser.value = null
      localStorage.removeItem('loveverse_auth_token')
      await checkLimits() // Refresh limits for anonymous user
    }
  }

  // Computed
  const isAuthenticated = computed(() => !!authToken.value && !!currentUser.value)
  const isPremium = computed(() => currentUser.value?.is_premium || false)
  const canGenerate = computed(() => {
    if (isPremium.value) return true
    return remainingGenerations.value > 0
  })

  // Unlock current poem
  const unlockPoem = async (poemId) => {
    try {
      const response = await api.poems.unlock(poemId)
      if (response.data.success) {
        credits.value = response.data.credits_remaining
        isCurrentPoemUnlocked.value = true
        return { success: true }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to unlock poem'
      }
    }
  }

  return {
    anonymousUserId,
    authToken,
    currentUser,
    generationCount,
    remainingGenerations,
    credits,
    poemDraft,
    currentPoem,
    currentPoemId,
    isCurrentPoemUnlocked,
    isAuthenticated,
    isPremium,
    canGenerate,
    initializeUser,
    saveDraft,
    clearDraft,
    login,
    register,
    logout,
    checkLimits,
    loadCurrentUser,
    loadCredits,
    unlockPoem,
  }
}

import { ref, computed } from 'vue'

const anonymousUserId = ref(null)
const generationCount = ref(0)
const maxFreeGenerations = 2

const poemDraft = ref({
  name: '',
  description: '',
  photo: null,
  photoPreview: null,
  style: null
})

const currentPoem = ref(null)

export function useUser() {
  const initializeUser = () => {
    let userId = localStorage.getItem('loveverse_anonymous_id')
    if (!userId) {
      userId = generateUUID()
      localStorage.setItem('loveverse_anonymous_id', userId)
    }
    anonymousUserId.value = userId

    const count = localStorage.getItem('loveverse_generation_count')
    generationCount.value = count ? parseInt(count) : 0

    loadDraft()
  }

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const canGenerate = computed(() => {
    return generationCount.value < maxFreeGenerations
  })

  const incrementGeneration = () => {
    generationCount.value++
    localStorage.setItem('loveverse_generation_count', generationCount.value)
  }

  const saveDraft = () => {
    const draft = {
      name: poemDraft.value.name,
      description: poemDraft.value.description,
      photoPreview: poemDraft.value.photoPreview,
      style: poemDraft.value.style
    }
    localStorage.setItem('loveverse_draft', JSON.stringify(draft))
  }

  const loadDraft = () => {
    const draft = localStorage.getItem('loveverse_draft')
    if (draft) {
      const data = JSON.parse(draft)
      poemDraft.value = {
        name: data.name || '',
        description: data.description || '',
        photo: null,
        photoPreview: data.photoPreview || null,
        style: data.style || null
      }
    }
  }

  const clearDraft = () => {
    poemDraft.value = {
      name: '',
      description: '',
      photo: null,
      photoPreview: null,
      style: null
    }
    localStorage.removeItem('loveverse_draft')
  }

  return {
    anonymousUserId,
    generationCount,
    maxFreeGenerations,
    poemDraft,
    currentPoem,
    canGenerate,
    initializeUser,
    incrementGeneration,
    saveDraft,
    clearDraft
  }
}

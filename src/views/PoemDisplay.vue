<template>
  <div class="poem-display-wrapper">

    <!-- Loading State for Database Poem -->
    <div v-if="loadingPoem" class="generating">
      <div class="heart-loading">
        <Heart :size="64" :stroke-width="2" :fill="'var(--color-rose)'" />
      </div>
      <p class="generating-text">Loading your poem...</p>
    </div>

        <!-- Generating State -->
    <div v-else-if="isGenerating" class="generating">
      <div class="heart-loading">
        <Heart :size="64" :stroke-width="2" :fill="'var(--color-rose)'" />
      </div>
      <p class="generating-text">Wrting your poem with love...</p>
    </div>

    <!-- Poem Display -->
    <div v-else-if="currentPoem" class="poem-display">

      <!-- Poem Card with Canvas -->
      <div class="poem-card-wrapper" ref="poemCardWrapper">
        <div class="poem-card" ref="poemCard" :class="[
          `bg-${selectedBackground}`,
          `font-${selectedFont}`,
          { 'has-photo-bg': usePhotoBackground && poemDraft.photoPreview }
        ]">
          <!-- Photo Background (Premium Feature) -->
          <div v-if="usePhotoBackground && poemDraft.photoPreview" class="photo-background">
            <img :src="poemDraft.photoPreview" alt="Background" class="bg-image" />
            <div class="photo-overlay"></div>

            <!-- Floating Bubbles -->
            <div class="bubbles">
              <div class="bubble" v-for="n in 15" :key="n"></div>
            </div>

            <!-- Large Watermark -->
            <div class="large-watermark">dear luv</div>
          </div>

          <div v-if="!usePhotoBackground" class="poem-background-overlay"></div>

          <div class="poem-content">
            <div class="poem-header" v-if="poemDraft.name">
              <div class="poem-for" :class="{ 'photo-bg-text': usePhotoBackground }">
                For {{ poemDraft.name }}
              </div>
            </div>

            <template v-if="!canViewFullPoem">
              <div class="visible-lines">
                <p v-for="(line, index) in visibleLines" :key="index" class="poem-text poem-line">
                  {{ line }}
                </p>
              </div>

              <!-- Remaining lines - blurred -->
              <div class="locked-lines">
                <div class="blur-overlay">
                  <p v-for="(line, index) in lockedLines" :key="index" class="poem-text poem-line blurred">
                    {{ line }}
                  </p>
                </div>

                <div class="lock-indicator">
                  <Lock :size="32" />
                </div>

                <!-- Unlock Prompt (if locked) -->
                <div class="unlock-prompt">
                  <template v-if="!isAuthenticated">
                    <h3 class="prompt-title">This poem is ready.</h3>
                    <p class="prompt-text">Create a free account to receive it.</p>

                    <div class="auth-buttons">
                      <button @click="handleContinueWithEmail" class="btn btn-google">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path
                            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                            fill="#4285F4" />
                          <path
                            d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.438 15.983 5.482 18 9.003 18z"
                            fill="#34A853" />
                          <path
                            d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                            fill="#FBBC05" />
                          <path
                            d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
                            fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </button>
                    </div>

                    <p class="helper-text">3 free poems included</p>
                  </template>

                  <!-- AUTHENTICATED BUT NO CREDITS -->
                  <template v-else>
                    <h3 class="prompt-title">You’ve used your free poems</h3>
                    <p class="prompt-text">
                      Unlock this poem by getting more credits.
                    </p>

                    <button @click="showPaywallModal = true" class="btn btn-primary">
                      Unlock poem
                    </button>
                  </template>
                </div>
              </div>
            </template>

            <!-- Full poem visible for authenticated users -->
            <template v-else>
              <div class="poem-text" :class="{ 'photo-bg-text': usePhotoBackground }">
                {{ currentPoem }}
              </div>
            </template>
            <div class="poem-footer">
              <span class="watermark" :class="{ 'photo-bg-text': usePhotoBackground }">dear.luv</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Customization Bar -->
      <div class="customization-bar">
        <!-- Photo Background Toggle (Premium Feature) -->
        <div v-if="poemDraft.photoPreview" class="customization-section photo-bg-section">
          <h4 class="customization-label">
            <ImageIcon :size="16" :stroke-width="2" />
            Photo Background
            <span class="premium-badge-small">
              <Crown :size="12" />
              PREMIUM
            </span>
          </h4>
          <div class="photo-bg-toggle">
            <button class="toggle-btn" :class="{ active: usePhotoBackground }" @click="togglePhotoBackground">
              <Check v-if="usePhotoBackground" :size="16" />
              {{ usePhotoBackground ? 'Photo Background Active' : 'Use Photo as Background' }}
            </button>            
            <p class="toggle-hint">
              {{ usePhotoBackground ? '✨ Beautiful! Upgrade to download & share without watermark' : 'Click to preview premium photo background' }}
            </p>
          </div>
        </div>

        <div class="customization-section" :class="{ disabled: usePhotoBackground }">
          <h4 class="customization-label">
            <Palette :size="16" :stroke-width="2" />
            Background
            <span v-if="usePhotoBackground" class="disabled-label">(Disabled with photo)</span>
          </h4>
          <div class="background-options">
            <button v-for="bg in backgrounds" :key="bg.id" class="background-option"
              :class="{ active: selectedBackground === bg.id }" :style="{ background: bg.preview }"
              @click="changeBackground(bg.id)" @mouseenter="previewBackground = bg.id"
              @mouseleave="previewBackground = null" :title="bg.name" :disabled="usePhotoBackground">
              <Check v-if="selectedBackground === bg.id" :size="20" class="check-icon" />
              <span class="bg-name">{{ bg.name }}</span>
            </button>
          </div>
        </div>

        <div class="customization-section">
          <h4 class="customization-label">
            <Type :size="16" :stroke-width="2" />
            Font Style
          </h4>
          <div class="font-options">
            <button v-for="font in fonts" :key="font.id" class="font-option"
              :class="{ active: selectedFont === font.id }" @click="changeFont(font.id)">
              <span :style="{ fontFamily: font.family }" class="font-sample">{{ font.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Card (shows on hover) -->
      <div v-if="previewBackground && !usePhotoBackground" class="preview-card-mini">
        <div class="mini-poem" :class="`bg-${previewBackground}`">
          <div class="mini-text">Preview</div>
        </div>
      </div>

      <!-- Public Share CTA - Only show for public shares -->
      <div v-if="isPublicShare" class="public-cta-section">
        <h3 class="cta-title">Your turn.</h3>
        <p class="cta-subtitle">Create your own in less than a minute.</p>
        
        <button @click="handleCreateYourOwn" class="btn-cta-primary">
          Create Your Poem
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" v-if="!isPublicShare">
        <button class="action-btn tooltip-trigger" @click="copyPoem">
          <Copy :size="20" :stroke-width="2" />
          Copy Text
          <span class="tooltip">Copy poem text to clipboard</span>
        </button>
        <button class="action-btn action-btn-primary tooltip-trigger" @click="shareAsImage">
          <Share2 :size="20" :stroke-width="2" />
          Share as Image
          <span class="tooltip">{{ usePhotoBackground && !isPremium ? '⭐ Premium Feature' : 'Share this poem ❤️'
            }}</span>
        </button>
        <button class="action-btn tooltip-trigger" @click="copyLink">
          <Link :size="20" :stroke-width="2" />
          Copy Link
          <span class="tooltip">Share poem link</span>
        </button>

        <button v-if="!isAuthenticated" class="action-btn tooltip-trigger" @click="openRegisterModal()">
          <Save :size="20" :stroke-width="2" />
          Save Forever
          <span class="tooltip">Create account to save</span>
        </button>
        <button class="action-btn tooltip-trigger" @click="createAnother">
          <Sparkles :size="20" :stroke-width="2" />
          Create Another
          <span class="tooltip">Make a new poem</span>
        </button>
      </div>

      <!-- Multi-Image Gallery -->
      <div v-if="generatedImages.length > 0" class="image-gallery">
        <h3 class="gallery-title">Your Poem Variations</h3>
        <div class="gallery-grid">
          <div v-for="(img, index) in generatedImages" :key="index" class="gallery-item">
            <img :src="img.url" :alt="`Variation ${index + 1}`" />
            <div class="gallery-actions">
              <button @click="downloadSingleImage(img.url, index)" class="mini-btn">
                <Download :size="16" />
              </button>
              <button @click="shareSingleImage(img.url)" class="mini-btn">
                <Share2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <SaveModal v-if="showSaveModal" @close="showSaveModal = false" />
    <ShareImageModal v-if="showShareImageModal" @close="showShareImageModal = false" :imageUrl="generatedImageUrl" />
    <CopiedModal v-if="showCopiedModal" @close="showCopiedModal = false" :message="copiedMessage" />
    <LimitModal v-if="showLimitModal" @close="showLimitModal = false" />

    <!-- Paywall Modal -->
    <PaywallModal v-if="showPaywallModal" @close="showPaywallModal = false"
      @success="handlePurchaseComplete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import {api} from '@/services/api'
import { poemStyles } from '@/composables/usePoemGenerator'
import { Heart, Copy, Share2, Save, Sparkles, Check, Palette, Type, Link, Download, Crown, Lock, PenTool, Image as ImageIcon } from 'lucide-vue-next'

import SaveModal from '@/components/SaveModal.vue'
import ShareImageModal from '@/components/ShareImageModal.vue'
import CopiedModal from '@/components/CopiedModal.vue'
import LimitModal from '@/components/LimitModal.vue'
import PaywallModal from '@/components/PaywallModal.vue'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const { 
  poemDraft, 
  currentPoem, 
  currentPoemId, 
  canGenerate, 
  clearDraft, 
  isAuthenticated,
  credits,
  remainingGenerations,
  isCurrentPoemUnlocked,
  loadCurrentUser,
  unlockPoem,
  loadCredits
} = useUser()

const showPaywallModal = ref(false)
const isGenerating = computed(() => route.params.id === 'generating')
const showSaveModal = ref(false)
const showShareImageModal = ref(false)
const showCopiedModal = ref(false)
const showLimitModal = ref(false)
const copiedMessage = ref('Copied!')
const generatedImageUrl = ref(null)
const generatedImages = ref([])
const poemCard = ref(null)
const previewBackground = ref(null)
const loadingPoem = ref(false)
const poemFromDatabase = ref(null)

// Inject the modal controls
const openRegisterModal = inject('openRegisterModal')

// Customization options
const selectedBackground = ref('gradient-rose')
const selectedFont = ref('serif-elegant')
const usePhotoBackground = ref(false)

const backgrounds = [
  {
    id: 'gradient-rose',
    name: 'Rose Sunset',
    preview: 'linear-gradient(135deg, #FFE5E5 0%, #FFD6E8 50%, #FFF0F5 100%)'
  },
  {
    id: 'gradient-lavender',
    name: 'Lavender Dreams',
    preview: 'linear-gradient(135deg, #E8DAEF 0%, #D5C6E0 50%, #F5F0FA 100%)'
  },
  {
    id: 'gradient-peach',
    name: 'Peach Glow',
    preview: 'linear-gradient(135deg, #FFE8D6 0%, #FFDAB9 50%, #FFF5E6 100%)'
  },
  {
    id: 'gradient-mint',
    name: 'Mint Fresh',
    preview: 'linear-gradient(135deg, #D4F1F4 0%, #C8E9E1 50%, #E8F8F5 100%)'
  },
  {
    id: 'paper-vintage',
    name: 'Vintage Paper',
    preview: 'linear-gradient(135deg, #F5EDE4 0%, #EDE2D5 50%, #FAF3EA 100%)'
  },
  {
    id: 'gradient-sunset',
    name: 'Golden Hour',
    preview: 'linear-gradient(135deg, #FFD89B 0%, #FFC98B 50%, #FFE8C5 100%)'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Breeze',
    preview: 'linear-gradient(135deg, #A8E6CF 0%, #88D4AB 50%, #C8F2E0 100%)'
  },
  {
    id: 'gradient-mauve',
    name: 'Soft Mauve',
    preview: 'linear-gradient(135deg, #DCC7E8 0%, #C5A8D9 50%, #F0E6F5 100%)'
  }
]

const fonts = [
  { id: 'serif-elegant', name: 'Elegant', family: 'var(--font-serif)' },
  { id: 'serif-dramatic', name: 'Dramatic', family: "'Playfair Display', serif" },
  { id: 'script-romantic', name: 'Romantic', family: "'Dancing Script', cursive" },
  { id: 'script-fancy', name: 'Fancy', family: "'Great Vibes', cursive" },
  { id: 'script-flowing', name: 'Flowing', family: "'Sacramento', cursive" },
  { id: 'modern-minimal', name: 'Modern', family: "'Josefin Sans', sans-serif" },
  { id: 'handwritten', name: 'Handwritten', family: "'Kalam', cursive" }
]

// Check if we're viewing a public share link
const isPublicShare = computed(() => {
  return route.name === 'poem-share'
})

// Check if we're viewing a specific poem by ID
const isViewingPoemById = computed(() => {
  return route.params.id && route.params.id !== 'generating'
})

// Load poem from database if viewing by ID
const loadPoemById = async (poemId) => {
  loadingPoem.value = true
  try {
    // Choose the correct API endpoint based on route
    const response = isPublicShare.value 
      ? await api.poems.showPublic(poemId)
      : await api.poems.get(poemId)
    
    if (response.data.success) {
      poemFromDatabase.value = response.data.poem
      
      // Set the current poem content
      currentPoem.value = response.data.poem.content
      currentPoemId.value = response.data.poem.id
      isCurrentPoemUnlocked.value = response.data.poem.is_unlocked
      
      // Update poem draft with metadata
      poemDraft.value = {
        ...poemDraft.value,
        name: response.data.poem.recipient_name,
        style: response.data.poem.style,
      }
    } else {
      // Poem not found
      alert(response.data.message || 'Poem not found')
      router.push('/')
    }
  } catch (error) {
    console.error('Failed to load poem:', error)
    
    if (error.response?.status === 404) {
      alert('This poem does not exist or has been deleted.')
    } else if (error.response?.status === 403) {
      alert('You do not have permission to view this poem.')
    } else {
      alert('Failed to load poem. Please try again.')
    }
    
    router.push(isPublicShare.value ? '/' : '/dashboard')
  } finally {
    loadingPoem.value = false
  }
}


const selectedStyleName = computed(() => {
  const style = poemStyles.find(s => s.id === poemDraft.value.style)
  return style ? style.name : ''
})

// Split poem into lines
const poemLines = computed(() => {
  return currentPoem.value.split('\n').filter(line => line.trim())
})

// First 2-3 lines visible
const visibleLines = computed(() => {
  return poemLines.value.slice(0, 3)
})

// Remaining lines locked
const lockedLines = computed(() => {
  return poemLines.value.slice(3)
})

const handleContinueWithEmail = () => {
  openRegisterModal()
}


const changeBackground = (bgId) => {
  if (usePhotoBackground.value) return
  selectedBackground.value = bgId
}

const changeFont = (fontId) => {
  selectedFont.value = fontId
}

const togglePhotoBackground = () => {
  usePhotoBackground.value = !usePhotoBackground.value
}

// Handler for CTA buttons on public shares
const handleCreateYourOwn = () => {
  if (isAuthenticated.value) {
    // Already logged in, go straight to create
    router.push('/create')
  } else {
    // Not logged in, show register modal then redirect to create
    openRegisterModal()
    // You might want to store an intent to redirect after login
    localStorage.setItem('redirect_after_login', '/create')
  }
}

// Update the canViewFullPoem computed to consider public shares
const canViewFullPoem = computed(() => {
  
  // For public shares, poem is always viewable if unlocked
  if (isPublicShare.value) {
    return isCurrentPoemUnlocked.value
  }
  
  // For regular views, need authentication AND unlock
  return isAuthenticated.value && isCurrentPoemUnlocked.value
})


const handlePurchaseComplete = async () => {
  alert('Thank you for your purchase! Unlocking your poem now...')
  showPaywallModal.value = false
  await loadCredits()
  await autoUnlock()
}

const copyPoem = async () => {
  if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  try {
    await navigator.clipboard.writeText(currentPoem.value)
    copiedMessage.value = 'Poem copied!'
    showCopiedModal.value = true
    setTimeout(() => {
      showCopiedModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const copyLink = async () => {
  // For public shares, allow copying without login
  if (isPublicShare.value) {
    try {
      await navigator.clipboard.writeText(currentPoem.value)
      copiedMessage.value = 'Poem copied!'
      showCopiedModal.value = true
      setTimeout(() => {
        showCopiedModal.value = false
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
    return
  }
    else if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url + '/share')
    copiedMessage.value = 'Share Link copied!'
    showCopiedModal.value = true
    setTimeout(() => {
      showCopiedModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const generateImage = async () => {
    if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  const canvas = await html2canvas(poemCard.value, {
    backgroundColor: null,
    scale: 3,
    useCORS: true,
    logging: false,
    width: poemCard.value.offsetWidth,
    height: poemCard.value.scrollHeight,
    onclone: (clonedDoc) => {
      const texts = clonedDoc.querySelectorAll('.photo-bg-text');
      texts.forEach(el => {
        el.style.color = '#ffffff';
        el.style.textShadow = '0px 0px 2px rgba(0,0,0,0.5)';
        el.style.fontWeight = '600';
      });
    }
  });
  return canvas;
};

const shareAsImage = async () => {
    if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  if (usePhotoBackground.value && !isPremium.value) {
    copiedMessage.value = '⭐ Upgrade to Premium'
    showCopiedModal.value = true
    setTimeout(() => {
      showCopiedModal.value = false
      showSaveModal.value = true
    }, 2000)
    return
  }

  try {
    const canvas = await generateImage()
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'dearluv-poem.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My dear.luv Poem',
            text: 'I created this beautiful poem with dear.luv ❤️'
          })
        } catch (err) {
          if (err.name !== 'AbortError') {
            downloadImage(canvas)
          }
        }
      } else {
        generatedImageUrl.value = canvas.toDataURL('image/png')
        showShareImageModal.value = true
      }
    }, 'image/png')
  } catch (error) {
    console.error('Failed to generate image:', error)
    alert('Failed to generate image. Please try again.')
  }
}

const downloadImage = (canvas) => {
    if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  const link = document.createElement('a')
  link.download = 'dearluv-poem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const downloadSingleImage = (url, index) => {
    if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  const link = document.createElement('a')
  link.download = `dearluv-poem-${index + 1}.png`
  link.href = url
  link.click()
}

const shareSingleImage = async (url) => {
    if (!isAuthenticated.value) {
    openRegisterModal()
    return
  } else if (!canViewFullPoem.value) {
    showPaywallModal.value = true
    return
  }

  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], 'dearluv-poem.png', { type: 'image/png' })

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'My dear.luv Poem'
      })
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const createAnother = () => {
  if (!canGenerate.value) {
    showLimitModal.value = true
    return
  }
  clearDraft()
  router.push('/create')
}


// Watch route params AND route name for changes
watch(() => [route.params.id, route.name], ([newId, newName]) => {
  if (newId && newId !== 'generating') {
    loadPoemById(newId)
  }
}, { immediate: true })

onMounted(() => {
  showPaywallModal.value = false;

  // If viewing a specific poem, load it
  if (isViewingPoemById.value) {
    loadPoemById(route.params.id)
  } else if (!currentPoem.value && !isGenerating.value) {
    // No poem to display, redirect
    router.push('/')
  }

  if (isAuthenticated.value) {
    loadCurrentUser()
  }

  // Load additional fonts
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Sacramento&family=Josefin+Sans:wght@300;400&family=Kalam:wght@300;400;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)

  // If user just logged in and has credits, auto-unlock
  if (isAuthenticated.value && remainingGenerations.value > 0) {
    autoUnlock()
  }

})

const autoUnlock = async () => {
  if (currentPoemId.value) {
    const result = await unlockPoem(currentPoemId.value)
    if (result.success) {
      isCurrentPoemUnlocked.value = true

      // Reload the poem to get full content
      if (isViewingPoemById.value) {
        await loadPoemById(route.params.id)
      }
    }
  }
}
</script>

<style scoped>
.poem-display-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.8s ease-out;
  position: relative;
}

.locked-lines {
  position: relative;
  min-height: 100px;
}

.blur-overlay {
  filter: blur(4px);
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}

.blurred {
  color: var(--color-ink);
}

.lock-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(139, 71, 93, 0.2);
  color: var(--color-rose);
}

.sparkle {
  position: absolute;
  font-size: 2rem;
  animation: sparkle 1s ease-out forwards;
}

@keyframes sparkle {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: scale(1.5) rotate(360deg);
    opacity: 0;
  }
}

.generating {
  text-align: center;
  padding: 4rem 2rem;
}

.heart-loading {
  display: inline-block;
  color: var(--color-rose);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.generating-text {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-top: 2rem;
  font-style: italic;
}

/* Photo Background Toggle */
.photo-bg-section {
  background: linear-gradient(135deg, rgba(201, 165, 114, 0.1), rgba(230, 213, 184, 0.1));
  padding: 1.5rem;
  border-radius: 15px;
  border: 2px solid var(--color-gold-light);
}

.premium-badge-small {
  background: var(--color-gold);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.photo-bg-toggle {
  margin-top: 1rem;
}

.toggle-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-gold-light);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-rose-dark);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.toggle-btn:hover {
  background: white;
  border-color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.toggle-btn.active {
  background: var(--color-gold);
  color: white;
  border-color: var(--color-gold);
}

.toggle-hint {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-rose);
  text-align: center;
  font-style: italic;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.disabled-label {
  font-size: 0.75rem;
  color: var(--color-rose-light);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
}

/* Customization Bar */
.customization-bar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(139, 71, 93, 0.1);
}

.customization-section {
  margin-bottom: 1.5rem;
}

.customization-section:last-child {
  margin-bottom: 0;
}

.customization-label {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--color-rose-dark);
  margin-bottom: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.background-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
}

.background-option {
  width: 100%;
  height: 70px;
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-ink);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.background-option:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.background-option:hover:not(:disabled) {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 4px 16px rgba(139, 71, 93, 0.2);
}

.background-option.active {
  border-color: var(--color-rose);
  box-shadow: 0 4px 12px rgba(139, 71, 93, 0.3);
}

.check-icon {
  color: var(--color-rose-dark);
  filter: drop-shadow(0 0 2px white);
}

.bg-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.background-option:hover .bg-name {
  opacity: 1;
}

/* Preview Mini Card */
.preview-card-mini {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  z-index: 100;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.mini-poem {
  width: 150px;
  height: 150px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-elevated);
  border: 2px solid rgba(139, 71, 93, 0.2);
}

.mini-text {
  font-family: var(--font-script);
  font-size: 1.25rem;
  color: var(--color-rose-dark);
}

.font-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.75rem;
}

.font-option {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(139, 71, 93, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.font-sample {
  display: inline-block;
  transition: transform 0.3s ease;
}

.font-option:hover .font-sample {
  animation: bounceLetters 0.6s ease;
}

@keyframes bounceLetters {

  0%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-3px);
  }

  75% {
    transform: translateY(-3px);
  }
}

.font-option:hover {
  border-color: var(--color-rose-light);
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.font-option.active {
  border-color: var(--color-rose);
  background: rgba(139, 71, 93, 0.05);
  box-shadow: var(--shadow-soft);
}

/* Poem Card */
.poem-card-wrapper {
  margin-bottom: 2rem;
}

.poem-card {
  border-radius: 30px;
  padding: 4rem;
  box-shadow: 0 20px 40px rgba(255, 105, 180, 0.2);
  position: relative;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 0.5s ease;
}

.poem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 50px rgba(255, 105, 180, 0.3);
}

/* Photo Background Styles */
.photo-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7) blur(2px);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(139, 71, 93, 0.85) 0%,
      rgba(92, 46, 61, 0.75) 50%,
      rgba(139, 71, 93, 0.85) 100%);
}

/* Floating Bubbles */
.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  opacity: 0.4;
  animation: rise 6s infinite ease-in;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
}

.bubble:nth-child(1) {
  left: 10%;
  width: 30px;
  height: 30px;
  animation-delay: 0s;
}

.bubble:nth-child(2) {
  left: 20%;
  width: 50px;
  height: 50px;
  animation-delay: 0.5s;
  animation-duration: 7s;
}

.bubble:nth-child(3) {
  left: 30%;
  width: 35px;
  height: 35px;
  animation-delay: 1s;
}

.bubble:nth-child(4) {
  left: 40%;
  width: 45px;
  height: 45px;
  animation-delay: 1.5s;
  animation-duration: 8s;
}

.bubble:nth-child(5) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 2s;
}

.bubble:nth-child(6) {
  left: 60%;
  width: 40px;
  height: 40px;
  animation-delay: 2.5s;
  animation-duration: 6.5s;
}

.bubble:nth-child(7) {
  left: 70%;
  width: 35px;
  height: 35px;
  animation-delay: 3s;
}

.bubble:nth-child(8) {
  left: 80%;
  width: 30px;
  height: 30px;
  animation-delay: 3.5s;
  animation-duration: 7.5s;
}

.bubble:nth-child(9) {
  left: 15%;
  width: 45px;
  height: 45px;
  animation-delay: 1s;
  animation-duration: 8.5s;
}

.bubble:nth-child(10) {
  left: 35%;
  width: 28px;
  height: 28px;
  animation-delay: 0.3s;
}

.bubble:nth-child(11) {
  left: 55%;
  width: 38px;
  height: 38px;
  animation-delay: 2.2s;
  animation-duration: 6.8s;
}

.bubble:nth-child(12) {
  left: 75%;
  width: 32px;
  height: 32px;
  animation-delay: 1.8s;
}

.bubble:nth-child(13) {
  left: 25%;
  width: 42px;
  height: 42px;
  animation-delay: 0.8s;
  animation-duration: 7.2s;
}

.bubble:nth-child(14) {
  left: 65%;
  width: 36px;
  height: 36px;
  animation-delay: 2.8s;
}

.bubble:nth-child(15) {
  left: 85%;
  width: 29px;
  height: 29px;
  animation-delay: 1.3s;
  animation-duration: 6.3s;
}

@keyframes rise {
  0% {
    bottom: -100px;
    opacity: 0;
  }

  10% {
    opacity: 0.4;
  }

  90% {
    opacity: 0.4;
  }

  100% {
    bottom: 110%;
    opacity: 0;
  }
}

/* Large Watermark */
.large-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  font-family: var(--font-script);
  font-size: 8rem;
  color: rgba(255, 255, 255, 0.15);
  z-index: 1;
  pointer-events: none;
  letter-spacing: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Photo Background Text Styling */
.photo-bg-text {
  color: white !important;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-stroke: 0.2px white;
}

.poem-card.has-photo-bg .poem-for {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.poem-card.has-photo-bg .poem-footer {
  border-top-color: rgba(255, 255, 255, 0.3);
}

.poem-background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 28.5c-6.9 0-12.5-5.6-12.5-12.5S23.1 3.5 30 3.5 42.5 9.1 42.5 16 36.9 28.5 30 28.5z' fill='%238B475D' fill-opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}

.poem-content {
  position: relative;
  z-index: 3;
  width: 100%;
}

/* Background Styles */
.poem-card.bg-gradient-rose {
  background: linear-gradient(135deg, #FFE5E5 0%, #FFD6E8 50%, #FFF0F5 100%);
}

.poem-card.bg-gradient-lavender {
  background: linear-gradient(135deg, #E8DAEF 0%, #D5C6E0 50%, #F5F0FA 100%);
}

.poem-card.bg-gradient-peach {
  background: linear-gradient(135deg, #FFE8D6 0%, #FFDAB9 50%, #FFF5E6 100%);
}

.poem-card.bg-gradient-mint {
  background: linear-gradient(135deg, #D4F1F4 0%, #C8E9E1 50%, #E8F8F5 100%);
}

.poem-card.bg-paper-vintage {
  background: linear-gradient(135deg, #F5EDE4 0%, #EDE2D5 50%, #FAF3EA 100%);
}

.poem-card.bg-gradient-sunset {
  background: linear-gradient(135deg, #FFD89B 0%, #FFC98B 50%, #FFE8C5 100%);
}

.poem-card.bg-gradient-ocean {
  background: linear-gradient(135deg, #A8E6CF 0%, #88D4AB 50%, #C8F2E0 100%);
}

.poem-card.bg-gradient-mauve {
  background: linear-gradient(135deg, #DCC7E8 0%, #C5A8D9 50%, #F0E6F5 100%);
}

/* Font Styles */
.poem-card.font-serif-elegant .poem-text {
  font-family: var(--font-serif);
}

.poem-card.font-serif-dramatic .poem-text {
  font-family: 'Playfair Display', serif;
  font-weight: 400;
}

.poem-card.font-script-romantic .poem-text {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5rem;
  text-shadow: 0 0 20px rgba(255, 182, 193, 0.3);
}

.poem-card.has-photo-bg.font-script-romantic .poem-text {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 182, 193, 0.5);
}

.poem-card.font-script-fancy .poem-text {
  font-family: 'Great Vibes', cursive;
  font-size: 1.6rem;
  text-shadow: 0 0 20px rgba(255, 182, 193, 0.3);
}

.poem-card.has-photo-bg.font-script-fancy .poem-text {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 182, 193, 0.5);
}

.poem-card.font-script-flowing .poem-text {
  font-family: 'Sacramento', cursive;
  font-size: 1.6rem;
  text-shadow: 0 0 20px rgba(255, 182, 193, 0.3);
}

.poem-card.has-photo-bg.font-script-flowing .poem-text {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 182, 193, 0.5);
}

.poem-card.font-modern-minimal .poem-text {
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.poem-card.font-handwritten .poem-text {
  font-family: 'Kalam', cursive;
  font-size: 1.25rem;
  text-shadow: 0 0 15px rgba(139, 71, 93, 0.2);
}

.poem-card.has-photo-bg.font-handwritten .poem-text {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.poem-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(139, 71, 93, 0.1);
}

.poem-for {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose);
  font-style: italic;
}

.poem-text {
  font-size: 1.375rem;
  line-height: 2;
  color: var(--color-ink);
  white-space: pre-wrap;
  text-align: center;
  margin-bottom: 3rem;
  animation: writeIn 2s ease-out;
  transition: font-family 0.3s ease;
}

.poem-line {
  font-size: 1.375rem;
  line-height: 1.3;
  margin: 1rem !important;
  text-align: center;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
  gap: 1rem;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.watermark {
  font-family: var(--font-script);
  color: var(--color-rose-light);
  font-size: 0.875rem;
}

/* Unlock Prompt */
.unlock-prompt {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(139, 71, 93, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%);
  border-radius: 16px;
  margin-top: 2rem;
}

.prompt-title {
  font-family: var(--font-serif) !important;
  font-size: 1.75rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
}

.prompt-text {
  font-size: 1.125rem;
  color: var(--color-ink);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 1rem;
}

.btn-google,
.btn-email {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
}

.btn-google {
  background: white;
  border-color: #dadce0;
  color: #3c4043;
}

.btn-google:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-email {
  background: var(--color-rose);
  border-color: var(--color-rose);
  color: white;
}

.btn-email:hover {
  background: var(--color-rose-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 71, 93, 0.3);
}

.helper-text {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.6;
  margin-top: 1rem;
}

/* Action Buttons with Tooltips */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-rose-light);
  padding: 0.875rem 1.75rem;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-rose-dark);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.tooltip-trigger:hover .tooltip {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  background: var(--color-rose-dark);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  box-shadow: var(--shadow-soft);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-rose-dark);
}

.action-btn:hover {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
  transform: translateY(-2px);
}

.action-btn-primary {
  background: linear-gradient(135deg, var(--color-rose) 0%, var(--color-rose-dark) 100%);
  color: white;
  border-color: var(--color-rose);
  font-weight: 500;
}

.action-btn-primary:hover {
  background: linear-gradient(135deg, var(--color-rose-dark) 0%, var(--color-rose) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}

/* Image Gallery */
.image-gallery {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.gallery-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 1.5rem;
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  width: 100%;
  display: block;
}

/* Public CTA Section */
.public-cta-section {
  margin-top: 3rem;
  padding: 2.5rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  border: 1px solid rgba(139, 71, 93, 0.1);
}

.cta-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.cta-subtitle {
  font-size: 1rem;
  color: var(--color-ink);
  opacity: 0.7;
  margin-bottom: 2rem;
  font-weight: 400;
}

.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: var(--font-body);
  color: white;
  background: linear-gradient(135deg, var(--color-rose), var(--color-rose-dark));
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(139, 71, 93, 0.2);
}

.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 71, 93, 0.3);
}

.btn-cta-primary:active {
  transform: translateY(0);
}

.gallery-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 0.75rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-actions {
  opacity: 1;
}

.mini-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-rose-dark);
  transition: all 0.3s ease;
}

.mini-btn:hover {
  background: white;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .poem-card {
    padding: 2rem;
  }

  .poem-text {
    font-size: 1.125rem;
  }

  .large-watermark {
    font-size: 4rem;
  }

  .background-options {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .background-option {
    width: 60px;
    flex-shrink: 0;
  }

  .font-options {
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .font-option {
    flex-shrink: 0;
  }

  .preview-card-mini {
    display: none;
  }

  .poem-footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-right {
    align-items: center;
  }


  .public-cta-section {
    padding: 2rem 1.5rem;
    margin-top: 2rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .btn-cta-primary {
    width: 100%;
    padding: 0.875rem 2rem;
  }
}
</style>

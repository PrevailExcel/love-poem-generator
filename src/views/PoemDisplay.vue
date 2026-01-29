<template>
  <div class="poem-display-wrapper">
    <!-- Sparkle Effects -->
    <div class="sparkles-container" ref="sparklesContainer"></div>

    <!-- Generating State -->
    <div v-if="isGenerating" class="generating">
      <div class="heart-loading">
        <Heart :size="64" :stroke-width="2" :fill="'var(--color-rose)'" />
      </div>
      <p class="generating-text">Crafting your poem with love...</p>
    </div>

    <!-- Poem Display -->
    <div v-else-if="currentPoem" class="poem-display">
 
      <!-- Poem Card with Canvas -->
      <div class="poem-card-wrapper" ref="poemCardWrapper">
        <div 
          class="poem-card" 
          ref="poemCard"
          :class="[
            `bg-${selectedBackground}`,
            `font-${selectedFont}`,
            { 'has-photo-bg': usePhotoBackground && poemDraft.photoPreview }
          ]"
        >
          <!-- Photo Background (Premium Feature) -->
          <div v-if="usePhotoBackground && poemDraft.photoPreview" class="photo-background">
            <img :src="poemDraft.photoPreview" alt="Background" class="bg-image" />
            <div class="photo-overlay"></div>
            
            <!-- Floating Bubbles -->
            <div class="bubbles">
              <div class="bubble" v-for="n in 15" :key="n"></div>
            </div>
            
            <!-- Large Watermark -->
            <div class="large-watermark">dear.luv</div>
          </div>

          <div v-if="!usePhotoBackground" class="poem-background-overlay"></div>
          
          <div class="poem-content">
            <div class="poem-header" v-if="poemDraft.name">
              <div class="poem-for" :class="{ 'photo-bg-text': usePhotoBackground }">
                For {{ poemDraft.name }}
              </div>
            </div>

            <div class="poem-text" :class="{ 'photo-bg-text': usePhotoBackground }">
              {{ currentPoem }}
            </div>

            <div class="poem-footer">
              <span class="watermark" :class="{ 'photo-bg-text': usePhotoBackground }">dear.luv</span>
              <div class="footer-right">
               <span class="watermark" :class="{ 'photo-bg-text': usePhotoBackground }">dear.luv</span>
              </div>
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
            <button 
              class="toggle-btn"
              :class="{ active: usePhotoBackground }"
              @click="togglePhotoBackground"
            >
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
            <button
              v-for="bg in backgrounds"
              :key="bg.id"
              class="background-option"
              :class="{ active: selectedBackground === bg.id }"
              :style="{ background: bg.preview }"
              @click="changeBackground(bg.id)"
              @mouseenter="previewBackground = bg.id"
              @mouseleave="previewBackground = null"
              :title="bg.name"
              :disabled="usePhotoBackground"
            >
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
            <button
              v-for="font in fonts"
              :key="font.id"
              class="font-option"
              :class="{ active: selectedFont === font.id }"
              @click="changeFont(font.id)"
            >
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


      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="action-btn tooltip-trigger" @click="copyPoem">
          <Copy :size="20" :stroke-width="2" />
          Copy Text
          <span class="tooltip">Copy poem text to clipboard</span>
        </button>
        <button class="action-btn action-btn-primary tooltip-trigger" @click="shareAsImage">
          <Share2 :size="20" :stroke-width="2" />
          Share as Image
          <span class="tooltip">{{ usePhotoBackground && !isPremium ? '⭐ Premium Feature' : 'Share this poem ❤️' }}</span>
        </button>
        <button class="action-btn tooltip-trigger" @click="copyLink">
          <Link :size="20" :stroke-width="2" />
          Copy Link
          <span class="tooltip">Share poem link</span>
        </button>
        <button class="action-btn tooltip-trigger" @click="showSaveModal = true">
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
    <ShareImageModal 
      v-if="showShareImageModal" 
      @close="showShareImageModal = false" 
      :imageUrl="generatedImageUrl"
    />
    <CopiedModal v-if="showCopiedModal" @close="showCopiedModal = false" :message="copiedMessage" />
    <LimitModal v-if="showLimitModal" @close="showLimitModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { poemStyles } from '@/composables/usePoemGenerator'
import { Heart, Copy, Share2, Save, Sparkles, Check, Palette, Type, Link, Download, Crown, Image as ImageIcon } from 'lucide-vue-next'
import SaveModal from '@/components/SaveModal.vue'
import ShareImageModal from '@/components/ShareImageModal.vue'
import CopiedModal from '@/components/CopiedModal.vue'
import LimitModal from '@/components/LimitModal.vue'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const { poemDraft, currentPoem, canGenerate, clearDraft } = useUser()

const isGenerating = computed(() => route.params.id === 'generating')
const showSaveModal = ref(false)
const showShareImageModal = ref(false)
const showCopiedModal = ref(false)
const showLimitModal = ref(false)
const copiedMessage = ref('Copied!')
const generatedImageUrl = ref(null)
const generatedImages = ref([])
const poemCard = ref(null)
const poemCardWrapper = ref(null)
const sparklesContainer = ref(null)
const previewBackground = ref(null)

// Customization options
const selectedBackground = ref('gradient-rose')
const selectedFont = ref('serif-elegant')
const usePhotoBackground = ref(false)
const isPremium = ref(false) // In production, check user subscription status

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

const selectedStyleName = computed(() => {
  const style = poemStyles.find(s => s.id === poemDraft.value.style)
  return style ? style.name : ''
})

const createSparkle = () => {
  if (!sparklesContainer.value) return
  
  const sparkle = document.createElement('div')
  sparkle.className = 'sparkle'
  sparkle.innerHTML = '✨'
  sparkle.style.left = Math.random() * 100 + '%'
  sparkle.style.top = Math.random() * 100 + '%'
  sparkle.style.animationDuration = (Math.random() * 1 + 0.5) + 's'
  
  sparklesContainer.value.appendChild(sparkle)
  
  setTimeout(() => {
    sparkle.remove()
  }, 1500)
}

const changeBackground = (bgId) => {
  if (usePhotoBackground.value) return
  selectedBackground.value = bgId
  createSparkle()
  createSparkle()
  createSparkle()
}

const changeFont = (fontId) => {
  selectedFont.value = fontId
  createSparkle()
  createSparkle()
}

const togglePhotoBackground = () => {
  usePhotoBackground.value = !usePhotoBackground.value
  if (usePhotoBackground.value) {
    createSparkle()
    createSparkle()
    createSparkle()
  }
}

const copyPoem = async () => {
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
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    copiedMessage.value = 'Link copied!'
    showCopiedModal.value = true
    setTimeout(() => {
      showCopiedModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const generateImage = async () => {
  const canvas = await html2canvas(poemCard.value, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    width: 600,
    height: poemCard.value.scrollHeight,
    windowWidth: 600
  })
  return canvas
}

const shareAsImage = async () => {
  // Check if using photo background without premium
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
  const link = document.createElement('a')
  link.download = 'dearluv-poem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const downloadSingleImage = (url, index) => {
  const link = document.createElement('a')
  link.download = `dearluv-poem-${index + 1}.png`
  link.href = url
  link.click()
}

const shareSingleImage = async (url) => {
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

onMounted(() => {
  if (!currentPoem.value && !isGenerating.value) {
    router.push('/')
  }
  
  // Load additional fonts
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Sacramento&family=Josefin+Sans:wght@300;400&family=Kalam:wght@300;400;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})
</script>

<style scoped>
.poem-display-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.8s ease-out;
  position: relative;
}

/* Sparkles Animation */
.sparkles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
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
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-3px); }
  75% { transform: translateY(-3px); }
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

.bubble:nth-child(1) { left: 10%; width: 30px; height: 30px; animation-delay: 0s; }
.bubble:nth-child(2) { left: 20%; width: 50px; height: 50px; animation-delay: 0.5s; animation-duration: 7s; }
.bubble:nth-child(3) { left: 30%; width: 35px; height: 35px; animation-delay: 1s; }
.bubble:nth-child(4) { left: 40%; width: 45px; height: 45px; animation-delay: 1.5s; animation-duration: 8s; }
.bubble:nth-child(5) { left: 50%; width: 25px; height: 25px; animation-delay: 2s; }
.bubble:nth-child(6) { left: 60%; width: 40px; height: 40px; animation-delay: 2.5s; animation-duration: 6.5s; }
.bubble:nth-child(7) { left: 70%; width: 35px; height: 35px; animation-delay: 3s; }
.bubble:nth-child(8) { left: 80%; width: 30px; height: 30px; animation-delay: 3.5s; animation-duration: 7.5s; }
.bubble:nth-child(9) { left: 15%; width: 45px; height: 45px; animation-delay: 1s; animation-duration: 8.5s; }
.bubble:nth-child(10) { left: 35%; width: 28px; height: 28px; animation-delay: 0.3s; }
.bubble:nth-child(11) { left: 55%; width: 38px; height: 38px; animation-delay: 2.2s; animation-duration: 6.8s; }
.bubble:nth-child(12) { left: 75%; width: 32px; height: 32px; animation-delay: 1.8s; }
.bubble:nth-child(13) { left: 25%; width: 42px; height: 42px; animation-delay: 0.8s; animation-duration: 7.2s; }
.bubble:nth-child(14) { left: 65%; width: 36px; height: 36px; animation-delay: 2.8s; }
.bubble:nth-child(15) { left: 85%; width: 29px; height: 29px; animation-delay: 1.3s; animation-duration: 6.3s; }

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
  z-index: 2;
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

/* Font Styles with Text Shadows */
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

.gallery-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
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
}
</style>
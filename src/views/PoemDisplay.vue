<template>
  <div class="poem-display-wrapper">
    <!-- Generating State -->
    <div v-if="isGenerating" class="generating">
      <div class="heart-loading">
        <Heart :size="64" :stroke-width="2" :fill="'var(--color-rose)'" />
      </div>
      <p class="generating-text">Crafting your poem with love...</p>
    </div>

    <!-- Poem Display -->
    <div v-else-if="currentPoem" class="poem-display">
      <!-- Customization Bar -->
      <div class="customization-bar">
        <div class="customization-section">
          <h4 class="customization-label">Background</h4>
          <div class="background-options">
            <button
              v-for="bg in backgrounds"
              :key="bg.id"
              class="background-option"
              :class="{ active: selectedBackground === bg.id }"
              :style="{ background: bg.preview }"
              @click="selectedBackground = bg.id"
              :title="bg.name"
            >
              <Check v-if="selectedBackground === bg.id" :size="20" />
            </button>
          </div>
        </div>

        <div class="customization-section">
          <h4 class="customization-label">Font Style</h4>
          <div class="font-options">
            <button
              v-for="font in fonts"
              :key="font.id"
              class="font-option"
              :class="{ active: selectedFont === font.id }"
              @click="selectedFont = font.id"
            >
              <span :style="{ fontFamily: font.family }">{{ font.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Poem Card with Canvas -->
      <div class="poem-card-wrapper" ref="poemCardWrapper">
        <div 
          class="poem-card" 
          ref="poemCard"
          :class="`bg-${selectedBackground} font-${selectedFont}`"
        >
          <div class="poem-background-overlay"></div>
          
          <div class="poem-content">
            <div class="poem-header" v-if="poemDraft.name || poemDraft.photoPreview">
              <img v-if="poemDraft.photoPreview" :src="poemDraft.photoPreview" class="poem-photo" />
              <div v-if="poemDraft.name" class="poem-for">For {{ poemDraft.name }}</div>
            </div>

            <div class="poem-text">{{ currentPoem }}</div>

            <div class="poem-footer">
              <span class="watermark">LoveVerse</span>
              <span class="poem-style-badge">{{ selectedStyleName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="action-btn" @click="copyPoem">
          <Copy :size="20" :stroke-width="2" />
          Copy Text
        </button>
        <button class="action-btn action-btn-primary" @click="shareAsImage">
          <Share2 :size="20" :stroke-width="2" />
          Share as Image
        </button>
        <button class="action-btn" @click="showSaveModal = true">
          <Save :size="20" :stroke-width="2" />
          Save Forever
        </button>
        <button class="action-btn" @click="createAnother">
          <Sparkles :size="20" :stroke-width="2" />
          Create Another
        </button>
      </div>
    </div>

    <!-- Modals -->
    <SaveModal v-if="showSaveModal" @close="showSaveModal = false" />
    <ShareImageModal 
      v-if="showShareImageModal" 
      @close="showShareImageModal = false" 
      :imageUrl="generatedImageUrl"
    />
    <CopiedModal v-if="showCopiedModal" @close="showCopiedModal = false" />
    <LimitModal v-if="showLimitModal" @close="showLimitModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { poemStyles } from '@/composables/usePoemGenerator'
import { Heart, Copy, Share2, Save, Sparkles, Check } from 'lucide-vue-next'
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
const generatedImageUrl = ref(null)
const poemCard = ref(null)
const poemCardWrapper = ref(null)

// Customization options
const selectedBackground = ref('gradient-rose')
const selectedFont = ref('serif-elegant')

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
    preview: '#F5EDE4'
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
  { id: 'modern-minimal', name: 'Modern', family: "'Josefin Sans', sans-serif" },
  { id: 'handwritten', name: 'Handwritten', family: "'Kalam', cursive" }
]

const selectedStyleName = computed(() => {
  const style = poemStyles.find(s => s.id === poemDraft.value.style)
  return style ? style.name : ''
})

const copyPoem = async () => {
  try {
    await navigator.clipboard.writeText(currentPoem.value)
    showCopiedModal.value = true
    setTimeout(() => {
      showCopiedModal.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const shareAsImage = async () => {
  try {
    // Create a high-quality canvas capture
    const canvas = await html2canvas(poemCard.value, {
      backgroundColor: null,
      scale: 2, // Higher quality
      logging: false,
      width: 800,
      height: poemCard.value.scrollHeight,
      windowWidth: 800
    })

    // Convert to blob
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'loveverse-poem.png', { type: 'image/png' })
      
      // Check if Web Share API is available
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My LoveVerse Poem',
            text: 'I created this beautiful poem with LoveVerse ❤️'
          })
        } catch (err) {
          if (err.name !== 'AbortError') {
            // Fallback to download if share fails
            downloadImage(canvas)
          }
        }
      } else {
        // Fallback: Show modal with download option
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
  link.download = 'loveverse-poem.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
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
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Josefin+Sans:wght@300;400&family=Kalam:wght@300;400;700&display=swap'
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
}

.background-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
}

.background-option {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.background-option:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.background-option.active {
  border-color: var(--color-rose);
  box-shadow: 0 4px 12px rgba(139, 71, 93, 0.3);
}

.font-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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

.font-option:hover {
  border-color: var(--color-rose-light);
  background: rgba(255, 255, 255, 0.9);
}

.font-option.active {
  border-color: var(--color-rose);
  background: rgba(139, 71, 93, 0.05);
  box-shadow: var(--shadow-soft);
}

/* Poem Card Wrapper */
.poem-card-wrapper {
  margin-bottom: 2rem;
}

.poem-card {
  border-radius: 30px;
  padding: 4rem;
  box-shadow: var(--shadow-elevated);
  position: relative;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
  z-index: 1;
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
  background: #F5EDE4;
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
}

.poem-card.font-modern-minimal .poem-text {
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.poem-card.font-handwritten .poem-text {
  font-family: 'Kalam', cursive;
  font-size: 1.25rem;
}

.poem-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(139, 71, 93, 0.1);
}

.poem-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-rose-light);
  margin-bottom: 1rem;
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
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.watermark {
  font-family: var(--font-script);
  color: var(--color-rose-light);
  font-size: 0.875rem;
}

.poem-style-badge {
  background: rgba(139, 71, 93, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--color-rose-dark);
}

/* Action Buttons */
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

@media (max-width: 768px) {
  .poem-card {
    padding: 2rem;
  }

  .poem-text {
    font-size: 1.125rem;
  }

  .background-options {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }

  .background-option {
    width: 50px;
    height: 50px;
  }

  .font-options {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
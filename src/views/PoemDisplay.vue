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
      <div class="poem-card">
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

      <div class="action-buttons">
        <button class="action-btn" @click="copyPoem">
          <Copy :size="20" :stroke-width="2" />
          Copy Text
        </button>
        <button class="action-btn" @click="showShareModal = true">
          <Share2 :size="20" :stroke-width="2" />
          Share
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
    <ShareModal v-if="showShareModal" @close="showShareModal = false" :poem="currentPoem" />
    <CopiedModal v-if="showCopiedModal" @close="showCopiedModal = false" />
    <LimitModal v-if="showLimitModal" @close="showLimitModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { poemStyles } from '@/composables/usePoemGenerator'
import { Heart, Copy, Share2, Save, Sparkles } from 'lucide-vue-next'
import SaveModal from '@/components/SaveModal.vue'
import ShareModal from '@/components/ShareModal.vue'
import CopiedModal from '@/components/CopiedModal.vue'
import LimitModal from '@/components/LimitModal.vue'

const route = useRoute()
const router = useRouter()
const { poemDraft, currentPoem, canGenerate, clearDraft } = useUser()

const isGenerating = computed(() => route.params.id === 'generating')
const showSaveModal = ref(false)
const showShareModal = ref(false)
const showCopiedModal = ref(false)
const showLimitModal = ref(false)

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
})
</script>

<style scoped>
.poem-display-wrapper {
  max-width: 800px;
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

.poem-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 4rem;
  box-shadow: var(--shadow-elevated);
  border: 1px solid rgba(139, 71, 93, 0.15);
  position: relative;
  overflow: hidden;
}

.poem-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, var(--color-rose) 0%, var(--color-gold) 100%);
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
  font-family: var(--font-serif);
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

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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

@media (max-width: 768px) {
  .poem-card {
    padding: 2rem;
  }

  .poem-text {
    font-size: 1.125rem;
  }
}
</style>

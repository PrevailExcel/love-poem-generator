<template>
  <BaseModal @close="$emit('close')" size="large">
    <div class="poem-view">
      <div class="poem-header">
        <h2 v-if="poem.recipient_name" class="recipient">For {{ poem.recipient_name }}</h2>
        <span class="poem-style">{{ styleName }}</span>
      </div>

      <div class="poem-content">
        <p class="poem-text">{{ poem.content }}</p>
      </div>

      <div class="poem-footer">
        <span class="character-count">✨ {{ poem.character_count }} characters of love ✨</span>
        <span class="poem-date">Created {{ formatDate(poem.created_at) }}</span>
      </div>

      <div class="action-buttons">
        <button @click="copyPoem" class="action-btn">
          <Copy :size="18" />
          <span>Copy</span>
        </button>

        <button @click="sharePoem" class="action-btn">
          <Share2 :size="18" />
          <span>Share</span>
        </button>

        <button @click="downloadPoem" class="action-btn">
          <Download :size="18" />
          <span>Download</span>
        </button>
      </div>

      <!-- Copied notification -->
      <div v-if="showCopied" class="copied-notification">
        ✓ Copied to clipboard!
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Copy, Share2, Download } from 'lucide-vue-next'
import { usePoemGenerator } from '@/composables/usePoemGenerator'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  poem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const { poemStyles } = usePoemGenerator()
const showCopied = ref(false)

const styleName = computed(() => {
  const style = poemStyles.find(s => s.id === props.poem.style)
  return style ? style.name : props.poem.style
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
}

const copyPoem = async () => {
  try {
    await navigator.clipboard.writeText(props.poem.content)
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const sharePoem = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.poem.recipient_name 
          ? `A poem for ${props.poem.recipient_name}` 
          : 'A beautiful poem',
        text: props.poem.content,
        url: props.poem.share_url
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  } else {
    copyPoem()
  }
}

const downloadPoem = () => {
  const element = document.createElement('a')
  const file = new Blob([props.poem.content], { type: 'text/plain' })
  element.href = URL.createObjectURL(file)
  element.download = props.poem.recipient_name 
    ? `poem-for-${props.poem.recipient_name.toLowerCase().replace(/\s+/g, '-')}.txt`
    : 'poem.txt'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>

<style scoped>
.poem-view {
  max-width: 700px;
  margin: 0 auto;
}

.poem-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(139, 71, 93, 0.1);
}

.recipient {
  font-family: var(--font-script);
  font-size: 2.5rem;
  color: var(--color-rose);
  margin: 0 0 0.5rem 0;
}

.poem-style {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.poem-content {
  margin-bottom: 2rem;
}

.poem-text {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 2;
  color: var(--color-ink);
  white-space: pre-line;
  text-align: center;
}

.poem-footer {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.character-count {
  font-size: 0.875rem;
  color: var(--color-rose-light);
  font-style: italic;
}

.poem-date {
  font-size: 0.75rem;
  color: var(--color-ink);
  opacity: 0.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid var(--color-rose-light);
  border-radius: 25px;
  color: var(--color-rose-dark);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
  transform: translateY(-2px);
}

.copied-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-rose);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(139, 71, 93, 0.3);
  animation: slideUp 0.3s ease-out;
  z-index: 1000;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 768px) {
  .recipient {
    font-size: 2rem;
  }

  .poem-text {
    font-size: 1.125rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

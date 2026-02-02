<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Smartphone :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Share Your Poem</h3>
      <p class="modal-text">
        Spread the love! Share your poem on social media or copy the link.
      </p>
      <div class="button-group">
        <button class="btn btn-secondary" @click="shareTwitter">
          Twitter
        </button>
        <button class="btn btn-secondary" @click="shareWhatsApp">
          WhatsApp
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { Smartphone } from 'lucide-vue-next'

const props = defineProps({
  poem: String
})

defineEmits(['close'])

const shareTwitter = () => {
  const text = `I just created a beautiful love poem with LoveVerse! ✨`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
}

const shareWhatsApp = () => {
  const text = `Check out this love poem I created:\n\n${props.poem}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}
</script>

<style scoped>
.modal-content {
  text-align: center;
}

.modal-icon {
  color: var(--color-rose);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 2rem;
  color: var(--color-rose-dark);
  margin-bottom: 1rem;
}

.modal-text {
  color: var(--color-ink);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>

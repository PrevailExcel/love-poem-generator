// PremiumModal.vue
<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Crown :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Unlock Premium Styles</h3>
      <p class="modal-text">
        Get access to Shakespearean sonnets, acrostic poems, and more with LoveVerse Premium.
      </p>
      <div class="modal-highlight">
        <strong>Premium Benefits:</strong><br>
        • All poem styles unlocked<br>
        • Unlimited generations<br>
        • No watermark<br>
        • Save & edit poems<br>
        • HD downloads
      </div>
      <div class="button-group">
        <button class="btn btn-primary" @click="upgradeToPremium">
          Upgrade Now
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { Crown } from 'lucide-vue-next'

defineEmits(['close'])

const upgradeToPremium = () => {
  alert('Premium upgrade would redirect to payment flow. This is a demo.')
}
</script>

<style scoped>
.modal-content {
  text-align: center;
}

.modal-icon {
  color: var(--color-gold);
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

.modal-highlight {
  background: rgba(139, 71, 93, 0.1);
  padding: 1rem;
  border-radius: 15px;
  margin: 1rem 0 2rem;
  border-left: 4px solid var(--color-rose);
  text-align: left;
  line-height: 1.8;
}

.button-group {
  display: flex;
  justify-content: center;
}
</style>

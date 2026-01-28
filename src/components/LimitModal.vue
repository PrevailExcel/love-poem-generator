<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Clock :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Daily Limit Reached</h3>
      <p class="modal-text">
        You've used your free poems for today. Upgrade to Premium for unlimited poem generation!
      </p>
      <div class="button-group">
        <button class="btn btn-primary" @click="upgradeToPremium">
          Go Premium
        </button>
        <button class="btn btn-secondary" @click="$emit('close')">
          Come Back Tomorrow
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { Clock } from 'lucide-vue-next'

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
  flex-wrap: wrap;
}
</style>

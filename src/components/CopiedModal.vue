<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <CheckCircle :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Copied!</h3>
      <p class="modal-text">
        Your poem has been copied to clipboard. Paste it anywhere you'd like!
      </p>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { CheckCircle } from 'lucide-vue-next'

defineEmits(['close'])
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
}
</style>

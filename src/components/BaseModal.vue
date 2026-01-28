<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <button class="modal-close" @click="$emit('close')">
        <X :size="24" />
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 36, 36, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal {
  background: var(--color-cream);
  border-radius: 30px;
  padding: 3rem;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-elevated);
  animation: slideUp 0.4s ease-out;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-rose-light);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-rose-dark);
  transform: scale(1.1);
}
</style>

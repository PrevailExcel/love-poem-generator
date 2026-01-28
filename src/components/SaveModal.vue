<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Heart :size="48" :stroke-width="2" :fill="'var(--color-rose-light)'" />
      </div>
      <h3 class="modal-title">Save This Poem Forever</h3>
      <p class="modal-text">
        Create an account to save your poems, access them anytime, and never lose a precious memory.
      </p>
      <div class="button-group">
        <button class="btn btn-primary" @click="createAccount">
          Create Free Account
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'
import { Heart } from 'lucide-vue-next'

defineEmits(['close'])

const createAccount = () => {
  alert('Account creation would show signup form. This is a demo.')
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
  justify-content: center;
}
</style>

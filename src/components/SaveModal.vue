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

      <div class="features-list">
        <div class="feature">
          <Check :size="18" />
          <span>Save all your poems</span>
        </div>
        <div class="feature">
          <Check :size="18" />
          <span>Access from any device</span>
        </div>
        <div class="feature">
          <Check :size="18" />
          <span>Share with loved ones</span>
        </div>
      </div>

      <div class="button-group">
        <button class="btn btn-primary" @click="createAccount">
          Create Free Account
        </button>
      </div>
      
      <p class="small-text">
        Already have an account? 
        <button @click="showLogin" class="link-btn">Sign in</button>
      </p>
    </div>
  </BaseModal>
</template>

<script setup>
import { inject } from 'vue'
import BaseModal from './BaseModal.vue'
import { Heart, Check } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const openRegisterModal = inject('openRegisterModal', null)
const openLoginModal = inject('openLoginModal', null)

const createAccount = () => {
  emit('close')
  if (openRegisterModal) {
    openRegisterModal()
  }
}

const showLogin = () => {
  emit('close')
  if (openLoginModal) {
    openLoginModal()
  }
}
</script>

<style scoped>
.modal-content {
  text-align: center;
  max-width: 450px;
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
  margin-bottom: 1.5rem;
}

.features-list {
  text-align: left;
  margin: 1.5rem auto;
  max-width: 300px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-ink);
  font-size: 0.875rem;
}

.feature svg {
  color: var(--color-rose);
  flex-shrink: 0;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.small-text {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.7;
  margin-top: 1rem;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-rose);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;
}

.link-btn:hover {
  color: var(--color-rose-dark);
}
</style>

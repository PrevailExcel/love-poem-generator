<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Clock :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Daily Limit Reached</h3>
      <p class="modal-text">
        You've used your <strong>2 free poems</strong> for today. Upgrade to Premium for unlimited poem generation!
      </p>

      <div class="features-list">
        <div class="feature">
          <Check :size="20" />
          <span>Unlimited poem generation</span>
        </div>
        <div class="feature">
          <Check :size="20" />
          <span>All 6 premium styles (Sonnet & Acrostic)</span>
        </div>
        <div class="feature">
          <Check :size="20" />
          <span>Photo background feature</span>
        </div>
        <div class="feature">
          <Check :size="20" />
          <span>Download without watermark</span>
        </div>
        <div class="feature">
          <Check :size="20" />
          <span>Save & manage all your poems</span>
        </div>
      </div>

      <div class="button-group">
        <button class="btn btn-premium" @click="upgradeToPremium" :disabled="loading">
          <Crown :size="20" v-if="!loading" />
          <Loader :size="20" class="spinner" v-else />
          Upgrade to Premium
        </button>
        <button class="btn btn-secondary" @click="$emit('close')">
          Come Back Tomorrow
        </button>
      </div>

      <p class="small-text">Reset happens at midnight. Or upgrade now for unlimited access!</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUser } from '@/composables/useUser'
import { api } from '@/services/api'
import BaseModal from './BaseModal.vue'
import { Clock, Crown, Check, Loader } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const { isAuthenticated } = useUser()
const loading = ref(false)

const openRegisterModal = inject('openRegisterModal', null)

const upgradeToPremium = async () => {
  // If not authenticated, prompt to create account first
  if (!isAuthenticated.value) {
    emit('close')
    if (openRegisterModal) {
      openRegisterModal()
    } else {
      alert('Please create an account first to upgrade to Premium')
    }
    return
  }

  loading.value = true

  try {
    // Create Stripe checkout session
    const response = await api.subscription.createCheckout()
    
    if (response.data.success) {
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url
    } else {
      alert('Failed to create checkout session. Please try again.')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    alert('Failed to start checkout. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-content {
  text-align: center;
  max-width: 500px;
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

.modal-text strong {
  color: var(--color-rose-dark);
  font-weight: 600;
}

.features-list {
  text-align: left;
  margin: 2rem auto;
  max-width: 400px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(139, 71, 93, 0.05);
  border-radius: 8px;
  color: var(--color-ink);
}

.feature svg {
  color: var(--color-rose);
  flex-shrink: 0;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-premium {
  background: linear-gradient(135deg, var(--color-gold) 0%, #d4af37 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

.btn-premium:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.small-text {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.6;
  margin-top: 1rem;
}
</style>

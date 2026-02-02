<template>
  <BaseModal @close="$emit('close')" :blur-background="true">
    <div class="paywall-content">
      <div class="modal-icon">
        <Sparkles :size="48" :stroke-width="2" />
      </div>
      
      <h3 class="modal-title">You're out of poems.</h3>
      <p class="modal-text">Unlock this one, or get more for later.</p>

      <div class="pricing-options">
        <!-- Single Poem -->
        <button 
          @click="selectOption('single')" 
          class="pricing-card" 
          :class="{ selected: selectedOption === 'single' }"
        >
          <div class="price-header">
            <span class="price">{{ singlePrice }}</span>
          </div>
          <div class="price-description">Unlock this poem</div>
        </button>

        <!-- 10 Poems Bundle -->
        <button 
          @click="selectOption('bundle10')" 
          class="pricing-card recommended" 
          :class="{ selected: selectedOption === 'bundle10' }"
        >
          <div class="best-value-badge">Best value</div>
          <div class="price-header">
            <span class="price">{{ bundle10Price }}</span>
          </div>
          <div class="price-description">Get 10 poems</div>
          <div class="savings">Save {{ savingsPercentage }}%</div>
        </button>
      </div>

      <button 
        @click="handlePurchase" 
        class="btn btn-primary btn-large"
        :disabled="loading || !selectedOption"
      >
        <Loader v-if="loading" :size="20" class="spinner" />
        <span v-else>{{ purchaseButtonText }}</span>
      </button>

      <p class="small-text">Secure payment • All styles included</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import BaseModal from './BaseModal.vue'
import { Sparkles, Loader } from 'lucide-vue-next'

const props = defineProps({
  currency: {
    type: String,
    default: 'NGN' // NGN or USD
  }
})

const emit = defineEmits(['close', 'success'])

const selectedOption = ref('bundle10') // Default to best value
const loading = ref(false)

// Pricing based on currency
const prices = computed(() => {
  if (props.currency === 'NGN') {
    return {
      single: 200,
      bundle10: 1500
    }
  } else {
    return {
      single: 0.99,
      bundle10: 5.99
    }
  }
})

const singlePrice = computed(() => {
  return props.currency === 'NGN' 
    ? `₦${prices.value.single}` 
    : `$${prices.value.single}`
})

const bundle10Price = computed(() => {
  return props.currency === 'NGN' 
    ? `₦${prices.value.bundle10}` 
    : `$${prices.value.bundle10}`
})

const savingsPercentage = computed(() => {
  const single = prices.value.single
  const bundle = prices.value.bundle10
  const savings = ((single * 10 - bundle) / (single * 10)) * 100
  return Math.round(savings)
})

const purchaseButtonText = computed(() => {
  if (!selectedOption.value) return 'Select an option'
  
  const optionMap = {
    single: 'Unlock This Poem',
    bundle10: 'Get 10 Poems'
  }
  
  return optionMap[selectedOption.value]
})

const selectOption = (option) => {
  selectedOption.value = option
}

const handlePurchase = async () => {
  if (!selectedOption.value) return

  loading.value = true

  try {
    // For MVP - would integrate with payment gateway
    // For now, simulate success
    setTimeout(() => {
      emit('success', selectedOption.value)
      emit('close')
      loading.value = false
    }, 1000)

    // Real implementation:
    // const response = await api.payments.createSession({
    //   option: selectedOption.value,
    //   currency: props.currency
    // })
    // if (response.data.success) {
    //   window.location.href = response.data.payment_url
    // }
  } catch (error) {
    console.error('Payment error:', error)
    alert('Failed to process payment. Please try again.')
    loading.value = false
  }
}
</script>

<style scoped>
.paywall-content {
  text-align: center;
  max-width: 500px;
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
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 1.125rem;
  color: var(--color-ink);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.pricing-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.pricing-card {
  position: relative;
  background: white;
  border: 3px solid rgba(139, 71, 93, 0.15);
  border-radius: 16px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.pricing-card:hover {
  border-color: var(--color-rose-light);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(139, 71, 93, 0.15);
}

.pricing-card.selected {
  border-color: var(--color-rose);
  background: rgba(139, 71, 93, 0.05);
  box-shadow: 0 8px 24px rgba(139, 71, 93, 0.2);
}

.pricing-card.recommended {
  border-color: var(--color-gold);
}

.best-value-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-gold);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-header {
  margin-bottom: 0.5rem;
}

.price {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-rose-dark);
}

.price-description {
  color: var(--color-ink);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.savings {
  color: var(--color-gold);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.btn-large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  margin-bottom: 1rem;
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
}

@media (max-width: 768px) {
  .pricing-options {
    grid-template-columns: 1fr;
  }

  .modal-title {
    font-size: 1.5rem;
  }
}
</style>

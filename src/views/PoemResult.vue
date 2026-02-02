<template>
  <div class="poem-result-page">
    <PoemReveal
      :poemContent="currentPoem"
      :recipientName="poemDraft.name"
      :isAuthenticated="isAuthenticated"
      :credits="credits"
      :isUnlocked="isCurrentPoemUnlocked"
      @googleLogin="handleGoogleLogin"
      @emailLogin="handleEmailLogin"
      @showPaywall="showPaywallModal = true"
      @copy="handleCopy"
      @share="handleShare"
      @save="handleSave"
      @requestUnlock="handleRequestUnlock"
    />

    <!-- Paywall Modal -->
    <PaywallModal
      v-if="showPaywallModal"
      @close="showPaywallModal = false"
      @purchaseComplete="handlePurchaseComplete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import PoemReveal from '@/components/PoemReveal.vue'
import PaywallModal from '@/components/PaywallModal.vue'

const router = useRouter()
const {
  currentPoem,
  poemDraft,
  currentPoemId,
  isAuthenticated,
  credits,
  isCurrentPoemUnlocked,
  unlockPoem,
  loadCredits
} = useUser()

const showPaywallModal = ref(false)

const openRegisterModal = inject('openRegisterModal', null)
const openLoginModal = inject('openLoginModal', null)

onMounted(() => {
  if (!currentPoem.value) {
    router.push('/create')
  }

  // If user just logged in and has credits, auto-unlock
  if (isAuthenticated.value && credits.value > 0 && !isCurrentPoemUnlocked.value) {
    autoUnlock()
  }
})

const autoUnlock = async () => {
  if (currentPoemId.value) {
    const result = await unlockPoem(currentPoemId.value)
    if (result.success) {
      isCurrentPoemUnlocked.value = true
    }
  }
}

const handleGoogleLogin = () => {
  // TODO: Implement Google OAuth
  alert('Google login would be implemented here')
}

const handleEmailLogin = () => {
  if (openLoginModal) {
    openLoginModal()
  }
}

const handleRequestUnlock = () => {
  if (!isAuthenticated.value) {
    if (openRegisterModal) {
      openRegisterModal()
    }
  } else if (credits.value === 0) {
    showPaywallModal.value = true
  }
}

const handlePurchaseComplete = async () => {
  showPaywallModal.value = false
  await loadCredits()
  await autoUnlock()
}

const handleCopy = () => {
  navigator.clipboard.writeText(currentPoem.value)
  alert('Poem copied to clipboard!')
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: 'My Love Poem',
      text: currentPoem.value
    })
  } else {
    alert('Share functionality')
  }
}

const handleSave = () => {
  // Trigger download or save to account
  alert('Save functionality')
}
</script>

<style scoped>
.poem-result-page {
  min-height: 100vh;
  padding: 2rem 0;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<template>
  <div class="creator">
    <div class="step-indicator">
      <div v-for="i in 3" :key="i" 
           class="step" 
           :class="{ active: currentStep === i, completed: currentStep > i }">
      </div>
    </div>

    <div class="form-wrapper">
      <transition name="slide" mode="out-in">
        <component 
          :is="currentStepComponent" 
          @next="handleNext" 
          @prev="handlePrev"
          @generate="handleGenerate"
        />
      </transition>
    </div>

    <LimitModal 
      v-if="showLimitModal"
      @close="showLimitModal = false"
    />
    
    <PremiumModal 
      v-if="showPremiumModal"
      @close="showPremiumModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { usePoemGenerator } from '@/composables/usePoemGenerator'
import StepDetails from '@/components/StepDetails.vue'
import StepPhoto from '@/components/StepPhoto.vue'
import StepStyle from '@/components/StepStyle.vue'
import LimitModal from '@/components/LimitModal.vue'
import PremiumModal from '@/components/PremiumModal.vue'

const router = useRouter()
const { 
  canGenerate, 
  poemDraft, 
  currentPoem, 
  currentPoemId, 
  anonymousUserId,
  remainingGenerations,
  checkLimits 
} = useUser()
const { generatePoem } = usePoemGenerator()

const currentStep = ref(1)
const showLimitModal = ref(false)
const showPremiumModal = ref(false)

onMounted(() => {
  if (!canGenerate.value) {
    showLimitModal.value = true
  }
})

const currentStepComponent = computed(() => {
  const components = {
    1: StepDetails,
    2: StepPhoto,
    3: StepStyle
  }
  return components[currentStep.value]
})

const handleNext = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const handlePrev = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.push('/')
  }
}

const handleGenerate = async () => {
  if (!canGenerate.value) {
    showLimitModal.value = true
    return
  }

  // Navigate to generating state
  router.push('/poem/generating')
  
  try {
    // Prepare poem data
    const poemData = {
      anonymousId: anonymousUserId.value,
      name: poemDraft.value.name,
      description: poemDraft.value.description,
      style: poemDraft.value.style,
      photo: poemDraft.value.photo
    }

    // Generate poem via API
    const result = await generatePoem(poemData, false)

    if (result.success) {
      // Store the generated poem
      currentPoem.value = result.poem.content
      currentPoemId.value = result.poem.id
      
      // Update remaining generations
      if (result.remaining !== undefined) {
        remainingGenerations.value = result.remaining
      }
      
      // Navigate to poem display
      router.push('/poem')
    } else if (result.limitReached) {
      showLimitModal.value = true
      router.push('/create')
    } else if (result.requiresPremium) {
      showPremiumModal.value = true
      router.push('/create')
    } else {
      // Generic error
      alert(result.error || 'Failed to generate poem. Please try again.')
      router.push('/create')
    }
  } catch (error) {
    console.error('Failed to generate poem:', error)
    alert('An unexpected error occurred. Please try again.')
    router.push('/create')
  }
}
</script>

<style scoped>
.creator {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.step {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(139, 71, 93, 0.2);
  transition: all 0.3s ease;
}

.step.active {
  background: var(--color-rose);
  transform: scale(1.3);
}

.step.completed {
  background: var(--color-rose-light);
}

.form-wrapper {
  min-height: 500px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
<template>
  <div class="poem-reveal">
    <!-- Poem Card with Blur Effect -->
    <div class="poem-card" :class="{ locked: !isUnlocked }">
      <!-- Visible Lines -->
      <div class="poem-header">
        <h2 v-if="recipientName" class="recipient">For {{ recipientName }}</h2>
      </div>

      <div class="poem-content">
        <!-- First 2-3 lines visible -->
        <div class="visible-lines">
          <p v-for="(line, index) in visibleLines" :key="index" class="poem-line">
            {{ line }}
          </p>
        </div>

        <!-- Remaining lines - blurred -->
        <div v-if="!isUnlocked" class="locked-lines">
          <div class="blur-overlay">
            <p v-for="(line, index) in lockedLines" :key="index" class="poem-line blurred">
              {{ line }}
            </p>
          </div>
          
          <div class="lock-indicator">
            <Lock :size="32" />
          </div>
        </div>

        <!-- Unlocked - show all -->
        <div v-else class="unlocked-lines">
          <p v-for="(line, index) in lockedLines" :key="index" class="poem-line">
            {{ line }}
          </p>
        </div>
      </div>

      <!-- Character Count (always visible) -->
      <div class="poem-footer">
        <span class="character-count">✨ {{ characterCount }} characters of love ✨</span>
      </div>
    </div>

    <!-- Unlock Prompt (if locked) -->
    <div v-if="!isUnlocked" class="unlock-prompt">
      <h3 class="prompt-title">This poem is ready.</h3>
      <p class="prompt-text">Create a free account to receive it.</p>

      <div class="auth-buttons">
        <button @click="continueWithGoogle" class="btn btn-google">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        
        <button @click="continueWithEmail" class="btn btn-email">
          <Mail :size="18" />
          Continue with Email
        </button>
      </div>

      <p class="helper-text">3 free poems included</p>
    </div>

    <!-- Action Buttons (disabled if locked) -->
    <div class="action-buttons">
      <button 
        @click="handleCopy" 
        class="action-btn"
        :disabled="!isUnlocked"
        :class="{ disabled: !isUnlocked }"
      >
        <Copy :size="20" />
        <span>Copy</span>
      </button>

      <button 
        @click="handleShare" 
        class="action-btn"
        :disabled="!isUnlocked"
        :class="{ disabled: !isUnlocked }"
      >
        <Share2 :size="20" />
        <span>Share</span>
      </button>

      <button 
        @click="handleSave" 
        class="action-btn"
        :disabled="!isUnlocked"
        :class="{ disabled: !isUnlocked }"
      >
        <Save :size="20" />
        <span>Save</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Lock, Mail, Copy, Share2, Save } from 'lucide-vue-next'

const props = defineProps({
  poemContent: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    default: null
  },
  isUnlocked: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'continueWithGoogle',
  'continueWithEmail',
  'copy',
  'share',
  'save'
])

// Split poem into lines
const poemLines = computed(() => {
  return props.poemContent.split('\n').filter(line => line.trim())
})

// First 2-3 lines visible
const visibleLines = computed(() => {
  return poemLines.value.slice(0, 3)
})

// Remaining lines locked
const lockedLines = computed(() => {
  return poemLines.value.slice(3)
})

const characterCount = computed(() => {
  return props.poemContent.length
})

const continueWithGoogle = () => {
  emit('continueWithGoogle')
}

const continueWithEmail = () => {
  emit('continueWithEmail')
}

const handleCopy = () => {
  if (props.isUnlocked) {
    emit('copy')
  }
}

const handleShare = () => {
  if (props.isUnlocked) {
    emit('share')
  }
}

const handleSave = () => {
  if (props.isUnlocked) {
    emit('save')
  }
}
</script>

<style scoped>
.poem-reveal {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

.poem-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(139, 71, 93, 0.15);
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.poem-card.locked {
  padding-bottom: 5rem;
}

.poem-header {
  text-align: center;
  margin-bottom: 2rem;
}

.recipient {
  font-family: var(--font-script);
  font-size: 2rem;
  color: var(--color-rose);
  margin: 0;
}

.poem-content {
  position: relative;
}

.visible-lines {
  margin-bottom: 1rem;
}

.poem-line {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 2;
  color: var(--color-ink);
  margin: 0.5rem 0;
  white-space: pre-wrap;
}

.locked-lines {
  position: relative;
  min-height: 200px;
}

.blur-overlay {
  filter: blur(8px);
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}

.blurred {
  color: var(--color-ink);
}

.lock-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(139, 71, 93, 0.2);
  color: var(--color-rose);
}

.unlocked-lines {
  margin-top: 1rem;
}

.poem-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.character-count {
  font-size: 0.875rem;
  color: var(--color-rose-light);
  font-style: italic;
}

/* Unlock Prompt */
.unlock-prompt {
  text-align: center;
  margin: 2rem 0 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(139, 71, 93, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%);
  border-radius: 16px;
}

.prompt-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
}

.prompt-text {
  font-size: 1.125rem;
  color: var(--color-ink);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 1rem;
}

.btn-google,
.btn-email {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
}

.btn-google {
  background: white;
  border-color: #dadce0;
  color: #3c4043;
}

.btn-google:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-email {
  background: var(--color-rose);
  border-color: var(--color-rose);
  color: white;
}

.btn-email:hover {
  background: var(--color-rose-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 71, 93, 0.3);
}

.helper-text {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.6;
  margin-top: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid var(--color-rose-light);
  border-radius: 25px;
  color: var(--color-rose-dark);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(.disabled) {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
  transform: translateY(-2px);
}

.action-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .poem-card {
    padding: 2rem 1.5rem;
  }

  .poem-line {
    font-size: 1.125rem;
  }

  .recipient {
    font-size: 1.5rem;
  }

  .auth-buttons {
    max-width: 100%;
  }
}
</style>

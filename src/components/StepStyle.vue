<template>
  <div class="form-card">
    <h2 class="form-title">Choose your style</h2>
    <p class="form-subtitle">Each style brings a different feeling</p>

    <div class="styles-grid">
      <div 
        v-for="style in poemStyles" 
        :key="style.id"
        class="style-card"
        :class="{ selected: poemDraft.style === style.id, premium: style.premium }"
        @click="selectStyle(style)"
      >
        <span v-if="style.premium" class="premium-badge">
          <Crown :size="12" />
          PREMIUM
        </span>
        <div class="style-name">{{ style.name }}</div>
        <div class="style-description">{{ style.description }}</div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="$emit('prev')">Back</button>
      <button 
        class="btn btn-primary" 
        @click="$emit('generate')"
        :disabled="!poemDraft.style"
      >
        <Sparkles :size="20" :stroke-width="2" />
        Generate Poem
      </button>
    </div>

    <PremiumModal v-if="showPremiumModal" @close="showPremiumModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { poemStyles } from '@/composables/usePoemGenerator'
import { Crown, Sparkles } from 'lucide-vue-next'
import PremiumModal from './PremiumModal.vue'

const { poemDraft, saveDraft } = useUser()
const showPremiumModal = ref(false)

defineEmits(['prev', 'generate'])

const selectStyle = (style) => {
  if (style.premium) {
    showPremiumModal.value = true
    return
  }
  poemDraft.value.style = style.id
  saveDraft()
}
</script>

<style scoped>
.form-card {
  background: rgba(255, 255, 255, 0.8);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: var(--shadow-elevated);
  border: 1px solid rgba(139, 71, 93, 0.1);
  backdrop-filter: blur(10px);
}

.form-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 400;
}

.form-subtitle {
  text-align: center;
  color: var(--color-rose);
  margin-bottom: 2rem;
  font-style: italic;
}

.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.style-card {
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(139, 71, 93, 0.15);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.style-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
  border-color: var(--color-rose-light);
}

.style-card.selected {
  border-color: var(--color-rose);
  background: rgba(139, 71, 93, 0.05);
  box-shadow: var(--shadow-soft);
}

.style-card.premium {
  background: linear-gradient(135deg, rgba(201, 165, 114, 0.1), rgba(230, 213, 184, 0.1));
}

.premium-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--color-gold);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.style-name {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.style-description {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.7;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .form-card {
    padding: 2rem;
  }

  .form-title {
    font-size: 2rem;
  }

  .styles-grid {
    grid-template-columns: 1fr;
  }
}
</style>

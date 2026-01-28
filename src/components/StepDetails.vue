<template>
  <div class="form-card">
    <h2 class="form-title">Who is this poem for?</h2>
    <p class="form-subtitle">Tell us about someone special</p>

    <div class="form-group">
      <label>Their Name (optional)</label>
      <input 
        type="text" 
        v-model="poemDraft.name" 
        @input="saveDraft"
        placeholder="Sola, Chinedu, or just ‘my love’" 
      />
    </div>

    <div class="form-group">
      <label>What makes them special to you?</label>
      <textarea 
        v-model="poemDraft.description" 
        @input="saveDraft"
        placeholder="Their smile… the way they laugh… how they make ordinary moments feel special… the little things only you notice."
      ></textarea>
        <small class="helper-text">
    Just write from the heart. It doesn’t have to be perfect.
        </small>
      <div class="char-counter">{{ poemDraft.description.length }} characters</div>
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="$emit('prev')">Back</button>
      <button 
        class="btn btn-primary" 
        @click="$emit('next')" 
        :disabled="!poemDraft.description.trim()"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUser } from '@/composables/useUser'

const { poemDraft, saveDraft } = useUser()

defineEmits(['next', 'prev'])
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

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.75rem;
  font-weight: 500;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(139, 71, 93, 0.15);
  border-radius: 15px;
  font-family: var(--font-body);
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-ink);
  transition: all 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-rose);
  box-shadow: 0 0 0 3px rgba(139, 71, 93, 0.1);
}

textarea {
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;
}

.char-counter {
  text-align: right;
  font-size: 0.875rem;
  color: var(--color-rose-light);
  margin-top: 0.5rem;
}
.helper-text {
  font-size: 0.875rem;
  color: var(--color-rose);
  margin-top: 0.5rem;
  display: block;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-card {
    padding: 2rem;
  }

  .form-title {
    font-size: 2rem;
  }
}
</style>

<template>
  <div class="form-card">
    <h2 class="form-title">Add a photo?</h2>
    <p class="form-subtitle">Optional, but makes it more personal</p>

    <div class="form-group">
      <div 
        v-if="!poemDraft.photoPreview"
        class="photo-upload" 
        @click="triggerPhotoUpload"
      >
        <ImagePlus :size="48" :stroke-width="2" />
        <p class="upload-text">Click to upload a photo</p>
        <p class="upload-hint">JPG or PNG, max 5MB</p>
      </div>
      
      <div v-else class="photo-preview-container">
        <img :src="poemDraft.photoPreview" alt="Preview" class="photo-preview" />
        <button class="remove-photo" @click="removePhoto">
          <X :size="20" />
        </button>
      </div>
      
      <input 
        type="file" 
        ref="photoInput" 
        accept="image/jpeg,image/png" 
        style="display: none;"
        @change="handlePhotoUpload"
      />
    </div>

    <div class="button-group">
      <button class="btn btn-secondary" @click="$emit('prev')">Back</button>
      <button class="btn btn-primary" @click="$emit('next')">
        {{ poemDraft.photoPreview ? 'Continue' : 'Skip for now' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { ImagePlus, X } from 'lucide-vue-next'

const { poemDraft, saveDraft } = useUser()
const photoInput = ref(null)

defineEmits(['next', 'prev'])

const triggerPhotoUpload = () => {
  photoInput.value.click()
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.size <= 5 * 1024 * 1024) {
    poemDraft.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      poemDraft.value.photoPreview = e.target.result
      saveDraft()
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  poemDraft.value.photo = null
  poemDraft.value.photoPreview = null
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

.form-group {
  margin-bottom: 2rem;
}

.photo-upload {
  border: 2px dashed rgba(139, 71, 93, 0.3);
  border-radius: 15px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-rose);
}

.photo-upload:hover {
  border-color: var(--color-rose);
  background: rgba(255, 255, 255, 0.8);
}

.upload-text {
  color: var(--color-rose);
  font-size: 1.125rem;
}

.upload-hint {
  font-size: 0.875rem;
  opacity: 0.6;
}

.photo-preview-container {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
}

.photo-preview {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
}

.remove-photo {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-rose-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-soft);
}

.remove-photo:hover {
  background: var(--color-rose);
  color: white;
  transform: scale(1.1);
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

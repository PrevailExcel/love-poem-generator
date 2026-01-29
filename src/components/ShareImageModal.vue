<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <div class="modal-icon">
        <Image :size="48" :stroke-width="2" />
      </div>
      <h3 class="modal-title">Share Your Poem</h3>
      <p class="modal-text">
        Your poem has been converted to an image. Download or share it!
      </p>

      <div class="image-preview">
        <img :src="imageUrl" alt="Poem Image" />
      </div>

      <div class="share-options">
        <button class="btn btn-primary" @click="downloadImage">
          <Download :size="20" :stroke-width="2" />
          Download Image
        </button>
        <button v-if="canShare" class="btn btn-secondary" @click="shareNative">
          <Share2 :size="20" :stroke-width="2" />
          Share
        </button>
      </div>

      <div class="social-share">
        <p class="social-label">Or share to:</p>
        <div class="social-buttons">
          <button class="social-btn twitter" @click="shareTwitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </button>
          <button class="social-btn whatsapp" @click="shareWhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
          <button class="social-btn facebook" @click="shareFacebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { Image, Download, Share2 } from 'lucide-vue-next'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
})

defineEmits(['close'])

const canShare = computed(() => {
  return navigator.share !== undefined
})

const downloadImage = () => {
  const link = document.createElement('a')
  link.download = 'loveverse-poem.png'
  link.href = props.imageUrl
  link.click()
}

const shareNative = async () => {
  try {
    // Convert data URL to blob
    const response = await fetch(props.imageUrl)
    const blob = await response.blob()
    const file = new File([blob], 'loveverse-poem.png', { type: 'image/png' })
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'My dear.luv Poem',
        text: 'I created this beautiful poem with dear.luv ❤️'
      })
    }
  } catch (error) {
    console.error('Share failed:', error)
  }
}

const shareTwitter = () => {
  const text = 'I just created a beautiful love poem with dear.luv! ❤️✨'
  const url = 'https://loveverse.app'
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
}

const shareWhatsApp = () => {
  const text = 'I just created a beautiful love poem with dear.luv! ❤️ Check it out!'
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

const shareFacebook = () => {
  const url = 'https://loveverse.app'
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
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

.image-preview {
  margin: 2rem 0;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  max-height: 300px;
  overflow-y: auto;
}

.image-preview img {
  width: 100%;
  display: block;
}

.share-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.social-share {
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.social-label {
  font-size: 0.875rem;
  color: var(--color-rose);
  margin-bottom: 1rem;
  font-weight: 500;
}

.social-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}

.social-btn.twitter {
  background: #1DA1F2;
}

.social-btn.twitter:hover {
  background: #1a8cd8;
}

.social-btn.whatsapp {
  background: #25D366;
}

.social-btn.whatsapp:hover {
  background: #20bd5a;
}

.social-btn.facebook {
  background: #1877F2;
}

.social-btn.facebook:hover {
  background: #1564d6;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
</style>

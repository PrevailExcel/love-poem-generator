<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <!-- <div class="modal-icon">
        <LogIn :size="48" :stroke-width="2" />
      </div> -->
      
      <h3 class="modal-title">Welcome Back</h3>
      <p class="modal-text">Sign in to save your poems</p>
        <div class="auth-buttons">
          <button @click="loginWithGoogle" class="btn btn-google">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      <div class="auth-footer">
        <p>
          Don't have an account?
          <button @click="switchToRegister" class="link-btn">Sign up</button>
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import BaseModal from './BaseModal.vue'

const emit = defineEmits(['close', 'switchToRegister'])

const { anonymousUserId } = useUser()

const loading = ref(false)

const switchToRegister = () => {
  emit('switchToRegister')
}

const loginWithGoogle = () => {
  loading.value = true
  const url = `http://127.0.0.1:8001/auth/google?anonymous_id=${anonymousUserId.value}`
  console.log("anonymous user", anonymousUserId.value);
  
  const popup = window.open(
    url,
    'google-login',
    'width=500,height=600'
  )

  if (!popup) {
    // Popup blocked → fallback
    window.location.href = url
  }

  // Optional: stop spinner if user closes popup manually
  const timer = setInterval(() => {
    if (popup?.closed) {
      clearInterval(timer)
      loading.value = false
    }
  }, 500)
}
</script>

<style scoped>
.modal-content {
  text-align: center;
  max-width: 400px;
}

.modal-icon {
  color: var(--color-rose);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 6px;
}

.modal-text {
  color: var(--color-ink);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 1rem;
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
  gap: 0.5rem;
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

.auth-form {
  text-align: left;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 0.475rem 0.7rem;
  border: 2px solid rgba(139, 71, 93, 0.15);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-rose);
  box-shadow: 0 0 0 3px rgba(139, 71, 93, 0.1);
}

.form-group input:disabled {
  background: rgba(0, 0, 0, 0.05);
  cursor: not-allowed;
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  position: relative;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.auth-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.auth-footer p {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.7;
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
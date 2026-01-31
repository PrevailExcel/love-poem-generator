<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <!-- <div class="modal-icon">
        <LogIn :size="48" :stroke-width="2" />
      </div> -->
      
      <h3 class="modal-title">Welcome Back</h3>
      <p class="modal-text">Sign in to save your poems and unlock premium features</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <Loader v-if="loading" :size="20" class="spinner" />
          <span v-else>Sign In</span>
        </button>
      </form>

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
import { LogIn, Loader } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'

const emit = defineEmits(['close', 'switchToRegister'])

const { login } = useUser()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  const result = await login(email.value, password.value)

  if (result.success) {
    emit('close')
    window.location.reload() // Reload to update user state
  } else {
    error.value = result.error || 'Login failed. Please try again.'
  }

  loading.value = false
}

const switchToRegister = () => {
  emit('switchToRegister')
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

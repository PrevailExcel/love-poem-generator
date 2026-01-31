<template>
  <BaseModal @close="$emit('close')">
    <div class="modal-content">
      <!-- <div class="modal-icon">
        <UserPlus :size="48" :stroke-width="2" />
      </div> -->
      
      <h3 class="modal-title">Create Account</h3>
      <p class="modal-text">Join dear.luv to save your poems forever</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Your name"
            :disabled="loading"
          />
        </div>

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
          <span v-if="errors.email" class="field-error">{{ errors.email[0] }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            placeholder="At least 8 characters"
            :disabled="loading"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password[0] }}</span>
        </div>

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="8"
            placeholder="Repeat password"
            :disabled="loading"
          />
        </div>

        <div v-if="generalError" class="error-message">
          {{ generalError }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <Loader v-if="loading" :size="20" class="spinner" />
          <span v-else>Create Account</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Already have an account?
          <button @click="switchToLogin" class="link-btn">Sign in</button>
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { UserPlus, Loader } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'

const emit = defineEmits(['close', 'switchToLogin'])

const { register } = useUser()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errors = ref({})
const generalError = ref(null)

const handleRegister = async () => {
  loading.value = true
  errors.value = {}
  generalError.value = null

  const result = await register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )

  if (result.success) {
    emit('close')
    window.location.reload() // Reload to update user state
  } else {
    if (result.errors) {
      errors.value = result.errors
      generalError.value = result.errors.general?.[0] || 'Registration failed. Please try again.'
    } else {
      generalError.value = 'Registration failed. Please try again.'
    }
  }

  loading.value = false
}

const switchToLogin = () => {
  emit('switchToLogin')
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
  margin-bottom: 0.5rem;
}

.auth-form {
  text-align: left;
  margin-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 0.5rem;
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

.field-error {
  display: block;
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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
  padding-top: 0.5rem;
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

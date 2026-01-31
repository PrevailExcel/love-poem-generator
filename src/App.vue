<template>
  <div class="app-wrapper">
    <div class="hearts-background">
      <div class="heart-float" style="top: 10%; left: 10%; animation-delay: 0s;">♥</div>
      <div class="heart-float" style="top: 20%; left: 80%; animation-delay: 2s;">♥</div>
      <div class="heart-float" style="top: 60%; left: 15%; animation-delay: 4s;">♥</div>
      <div class="heart-float" style="top: 70%; left: 85%; animation-delay: 6s;">♥</div>
      <div class="heart-float" style="top: 40%; left: 50%; animation-delay: 3s;">♥</div>
    </div>

    <header>
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <div class="logo">dear.luv</div>
        </router-link>
        <div class="tagline">Craft love into words, instantly</div>
      </div>

      <transition name="fade">
        <div class="header-actions" v-if="!isLandingPage">
          <template v-if="isAuthenticated">
            <div class="user-info">
              <User :size="20" />
              <span>{{ currentUser?.name }}</span>
              <span v-if="isPremium" class="premium-badge">
                <Crown :size="14" />
                Premium
              </span>
            </div>
            <button @click="handleLogout" class="btn-secondary">
              <LogOut :size="18" />
              Logout
            </button>
          </template>
          <template v-else>
            <button @click="showLoginModal = true" class="btn-text">
              Sign In
            </button>
            <button @click="showRegisterModal = true" class="btn-primary-small">
              Get Started
            </button>
          </template>
        </div>
      </transition>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Auth Modals -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="showLoginModal = false"
      @switchToRegister="switchToRegister"
    />
    
    <RegisterModal 
      v-if="showRegisterModal" 
      @close="showRegisterModal = false"
      @switchToLogin="switchToLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { User, Crown, LogOut } from 'lucide-vue-next'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const { isAuthenticated, isPremium, currentUser, logout } = useUser()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const route = useRoute()
const isLandingPage = computed(() => route.name === 'landing')

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const handleLogout = async () => {
  await logout()
  window.location.href = '/'
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}

.hearts-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
}

.heart-float {
  position: absolute;
  animation: float-heart 20s ease-in-out infinite;
  font-size: 40px;
  color: var(--color-rose);
}

header {
  padding: 2rem;
  animation: fadeInDown 0.8s ease-out;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content {
  text-align: center;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--color-rose-dark);
}

.premium-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-gold);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-text {
  background: none;
  border: none;
  color: var(--color-rose);
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.btn-text:hover {
  color: var(--color-rose-dark);
}

.btn-primary-small {
  background: var(--color-rose);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-primary-small:hover {
  background: var(--color-rose-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-rose-light);
  color: var(--color-rose-dark);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
}

.logo-link {
  text-decoration: none;
}

.logo {
  font-family: var(--font-script);
  font-size: 3rem;
  color: var(--color-rose);
  text-shadow: 2px 2px 4px rgba(139, 71, 93, 0.1);
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.tagline {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--color-rose-light);
  font-style: italic;
  font-weight: 300;
}

main {
  position: relative;
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: center;
  }

  .header-content {
    margin-bottom: 1rem;
  }

  .logo {
    font-size: 2rem;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-info {
    font-size: 0.75rem;
  }
}
</style>
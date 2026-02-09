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
        <div class="tagline">Say what you feel. Finally.</div>
      </div>

      <div class="header-actions">
        <template v-if="isAuthenticated">
          <!-- Desktop View -->
          <div class="desktop-nav">
            <router-link to="/dashboard" class="user-link">
              <Heart :size="18" />
              <span>My Poems</span>
            </router-link>

            <router-link to="/dashboard" class="user-link">
              <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="user-avatar" />
              <User v-else :size="20" />
              <span class="user-name" :title="currentUser?.name">
                {{ currentUser?.name }}
              </span>
              <span v-if="isPremium" class="premium-badge">
                <Crown :size="14" />
                Premium
              </span>
            </router-link>

            <button @click="handleLogout" class="btn-secondary">
              <LogOut :size="18" />
              Logout
            </button>
          </div>

          <!-- Mobile View -->
          <div class="mobile-nav">
            <router-link to="/dashboard" class="icon-link" title="My Poems">
              <Heart :size="20" />
            </router-link>
            
            <button @click="showMobileMenu = !showMobileMenu" class="icon-link" :class="{ active: showMobileMenu }">
              <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="user-avatar-mobile" />
              <User v-else :size="20" />
            </button>

            <!-- Mobile Dropdown Menu -->
            <div v-if="showMobileMenu" class="mobile-menu" @click.stop>
              <div class="mobile-menu-header">
                <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="user-avatar-large" />
                <User v-else :size="32" />
                <div class="mobile-user-info">
                  <div class="mobile-user-name">{{ currentUser?.name }}</div>
                  <div v-if="isPremium" class="premium-badge-mobile">
                    <Crown :size="12" />
                    Premium
                  </div>
                </div>
              </div>
              
              <div class="mobile-menu-divider"></div>
              
              <router-link to="/dashboard" class="mobile-menu-item" @click="showMobileMenu = false">
                <Heart :size="18" />
                My Poems
              </router-link>
              
              <button @click="handleLogout" class="mobile-menu-item">
                <LogOut :size="18" />
                Logout
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <!-- Desktop View -->
          <div class="desktop-nav">
            <button @click="showLoginModal = true" class="btn-text">
              Sign In
            </button>
            <button @click="showRegisterModal = true" class="btn-primary-small">
              Get Started
            </button>
          </div>

          <!-- Mobile View -->
          <div class="mobile-nav">
            <button @click="showLoginModal = true" class="btn-text-mobile">
              Sign In
            </button>
            <button @click="showRegisterModal = true" class="btn-primary-small">
              Get Started
            </button>
          </div>
        </template>
      </div>
    </header>

    <!-- Overlay for mobile menu -->
    <div v-if="showMobileMenu" class="menu-overlay" @click="showMobileMenu = false"></div>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Auth Modals -->
    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" @switchToRegister="switchToRegister" />
    <RegisterModal v-if="showRegisterModal" @close="showRegisterModal = false" @switchToLogin="switchToLogin" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { User, Crown, LogOut, Sparkles, Heart } from 'lucide-vue-next'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const router = useRouter()
const { isAuthenticated, isPremium, currentUser, unlockPoem, currentPoemId, loginWithToken, logout } = useUser()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showMobileMenu = ref(false)

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const handleLogout = async () => {
  showMobileMenu.value = false
  await logout()
  window.location.href = '/'
}

// Provide modal controls to child components
provide('openLoginModal', () => {
  showLoginModal.value = true
})

provide('closeLoginModal', () => {
  showLoginModal.value = false
  showRegisterModal.value = false
})

provide('openRegisterModal', () => {
  showRegisterModal.value = true
})

const FRONTEND_API_ORIGIN = new URL("http://127.0.0.1:8001").origin

const handleAuthMessage = (event) => {
  if (event.origin !== FRONTEND_API_ORIGIN) return
  console.log("Received auth message:", event.data)

  if (event.data?.token) {
    loginWithToken(event.data.token)
    showLoginModal.value = false
    showRegisterModal.value = false

    const redirectPath = localStorage.getItem('redirect_after_login')
    if (redirectPath) {
      localStorage.removeItem('redirect_after_login')
      router.push(redirectPath)
      return
    }

    unlockPoem(currentPoemId.value).then(result => {
      console.log('result from app.vue', result)
      if (result.success) {
        isCurrentPoemUnlocked.value = true
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('message', handleAuthMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleAuthMessage)
})
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
  z-index: 1000;
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
  position: relative;
  z-index: 1001;
}

/* Desktop Navigation - visible by default */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Mobile Navigation - hidden by default */
.mobile-nav {
  display: none;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--color-rose-dark);
  text-decoration: none;
  transition: all 0.3s ease;
}

.user-link:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
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

.user-name {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
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

/* Mobile Styles */
@media (max-width: 968px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-link {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--color-rose-light);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-rose-dark);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .icon-link:hover,
  .icon-link.active {
    background: var(--color-rose);
    color: white;
    border-color: var(--color-rose);
  }

  .user-avatar-mobile {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  .btn-text-mobile {
    background: none;
    border: none;
    color: var(--color-rose);
    font-family: var(--font-body);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem;
    white-space: nowrap;
  }

  /* Mobile Menu Dropdown */
  .mobile-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    opacity: 1;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(139, 71, 93, 0.2);
    min-width: 200px;
    overflow: hidden;
    animation: slideDown 0.3s ease-out;
    z-index: 99 !important;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-menu-header {
    padding: 1.25rem;
    background: linear-gradient(135deg, rgba(139, 71, 93, 0.05), rgba(212, 175, 55, 0.05));
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-avatar-large {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .mobile-user-info {
    flex: 1;
  }

  .mobile-user-name {
    font-weight: 600;
    color: var(--color-rose-dark);
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
  }

  .premium-badge-mobile {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--color-gold);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .mobile-menu-divider {
    height: 1px;
    background: rgba(139, 71, 93, 0.1);
  }

  .mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    color: var(--color-rose-dark);
    font-family: var(--font-body);
    font-size: 0.9375rem;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
  }

  .mobile-menu-item:hover {
    background: rgba(139, 71, 93, 0.05);
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 2;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  header {
    padding: 1.5rem 1rem;
  }

  .logo {
    font-size: 2.25rem;
  }

  .tagline {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 2rem;
  }

  .tagline {
    font-size: 0.9375rem;
  }

  .btn-primary-small {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>
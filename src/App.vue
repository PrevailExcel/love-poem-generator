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
      <router-link to="/" class="logo-link">
        <div class="logo">dear.luv</div>
      </router-link>
      <div class="tagline">Say what you feel. Finally.</div>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
// App component handles layout and routing
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
  text-align: center;
  animation: fadeInDown 0.8s ease-out;
  position: relative;
  z-index: 10;
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
  .logo {
    font-size: 2rem;
  }
}
</style>

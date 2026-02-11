import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Landing from './views/Landing.vue'
import Creator from './views/Creator.vue'
import PoemDisplay from './views/PoemDisplay.vue'
import Privacy from './views/Privacy.vue'
import Terms from './views/Terms.vue'
import Dashboard from './views/Dashboard.vue'
import { useUser } from './composables/useUser'
import './style.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: Landing },
    { path: '/create', name: 'create', component: Creator },
    { path: '/poem', name: 'poem-result', component: PoemDisplay },
    { path: '/privacy-policy', name: 'privacy', component:  Privacy},
    { path: '/terms', name: 'terms', component:  Terms},
    { path: '/poem/:id', name: 'poem', component: PoemDisplay },
    { path: '/poem/:id/share', name: 'poem-share', component: PoemDisplay },
    { 
      path: '/dashboard', 
      name: 'dashboard', 
      component: Dashboard,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useUser()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.use(Toast, { timeout: 3000 })
app.mount('#app')

// Initialize user tracking
const { initializeUser } = useUser()
initializeUser()

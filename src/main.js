import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Landing from './views/Landing.vue'
import Creator from './views/Creator.vue'
import PoemDisplay from './views/PoemDisplay.vue'
import { useUser } from './composables/useUser'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: Landing },
    { path: '/create', name: 'create', component: Creator },
    { path: '/poem/:id?', name: 'poem', component: PoemDisplay }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')

// Initialize user tracking
const { initializeUser } = useUser()
initializeUser()

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds for poem generation
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('loveverse_auth_token')
    const anonymousId = localStorage.getItem('loveverse_anonymous_id')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (anonymousId) {
      config.headers['X-Anonymous-ID'] = anonymousId
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('loveverse_auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// API Service
export const api = {
  // Authentication
  auth: {
    register: (data) => apiClient.post('/register', data),
    login: (data) => apiClient.post('/login', data),
    logout: () => apiClient.post('/logout'),
    me: () => apiClient.get('/me'),
    updateProfile: (data) => apiClient.put('/profile', data),
  },

  // Poems
  poems: {
    generate: (formData) => apiClient.post('/poems/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    getStyles: () => apiClient.get('/poems/styles'),
    checkLimits: (anonymousId) => apiClient.post('/poems/check-limits', { anonymous_id: anonymousId }),
    get: (uuid) => apiClient.get(`/poems/${uuid}`),
    list: (page = 1) => apiClient.get(`/poems?page=${page}`),
    delete: (uuid) => apiClient.delete(`/poems/${uuid}`),
    trackShare: (uuid) => apiClient.post(`/poems/${uuid}/share`),
  },

  // Subscriptions
  subscription: {
    status: () => apiClient.get('/subscription/status'),
    createCheckout: () => apiClient.post('/subscription/checkout'),
    createPortal: () => apiClient.post('/subscription/portal'),
  },
}

export default apiClient
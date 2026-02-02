<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Your Poems</h1>
      <div class="poems-counter">
        <Sparkles :size="20" />
        <span>{{ poemsRemaining }} {{ poemsRemaining === 1 ? 'poem' : 'poems' }} left</span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="createNewPoem" class="btn btn-primary">
        <PenTool :size="18" />
        Create New Poem
      </button>
      <button @click="showPaywallModal = true" class="btn btn-secondary">
        <Plus :size="18" />
        Get More Poems
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        @click="activeTab = 'poems'" 
        class="tab" 
        :class="{ active: activeTab === 'poems' }"
      >
        <Heart :size="18" />
        My Poems ({{ totalPoems }})
      </button>
      <button 
        @click="activeTab = 'payments'" 
        class="tab" 
        :class="{ active: activeTab === 'payments' }"
      >
        <CreditCard :size="18" />
        Payment History
      </button>
    </div>

    <!-- Poems List -->
    <div v-if="activeTab === 'poems'" class="poems-list">
      <div v-if="loading" class="loading-state">
        <Loader :size="32" class="spinner" />
        <p>Loading your poems...</p>
      </div>

      <div v-else-if="poems.length === 0" class="empty-state">
        <Heart :size="64" :stroke-width="1.5" />
        <h3>No poems yet</h3>
        <p>Create your first love poem to get started</p>
        <button @click="createNewPoem" class="btn btn-primary">
          Create Your First Poem
        </button>
      </div>

      <div v-else class="poems-grid">
        <div 
          v-for="poem in poems" 
          :key="poem.id" 
          class="poem-card"
          @click="viewPoem(poem)"
        >
          <div class="poem-preview">
            <p class="poem-excerpt">{{ getExcerpt(poem.content) }}</p>
          </div>
          <div class="poem-meta">
            <div class="poem-info">
              <span v-if="poem.recipient_name" class="recipient">
                For {{ poem.recipient_name }}
              </span>
              <span class="poem-style">{{ getStyleName(poem.style) }}</span>
            </div>
            <div class="poem-actions">
              <button @click.stop="sharePoem(poem)" class="icon-btn" title="Share">
                <Share2 :size="16" />
              </button>
              <button @click.stop="deletePoem(poem)" class="icon-btn" title="Delete">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
          <div class="poem-date">
            {{ formatDate(poem.created_at) }}
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="pagination">
        <button 
          @click="loadPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="btn btn-secondary"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage }} of {{ pagination.last_page }}
        </span>
        <button 
          @click="loadPage(currentPage + 1)" 
          :disabled="currentPage === pagination.last_page"
          class="btn btn-secondary"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Payment History -->
    <div v-if="activeTab === 'payments'" class="payments-list">
      <div v-if="loadingPayments" class="loading-state">
        <Loader :size="32" class="spinner" />
        <p>Loading payment history...</p>
      </div>

      <div v-else-if="payments.length === 0" class="empty-state">
        <CreditCard :size="64" :stroke-width="1.5" />
        <h3>No payments yet</h3>
        <p>Your payment history will appear here</p>
      </div>

      <div v-else class="payments-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Poems</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ formatDate(payment.created_at) }}</td>
              <td>{{ payment.type }}</td>
              <td>{{ formatAmount(payment.amount, payment.currency) }}</td>
              <td>{{ payment.poems_count }}</td>
              <td>
                <span class="status-badge" :class="payment.status">
                  {{ payment.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paywall Modal -->
    <PaywallModal
      v-if="showPaywallModal"
      :currency="userCurrency"
      @close="showPaywallModal = false"
      @success="handlePaymentSuccess"
    />

    <!-- Poem View Modal -->
    <PoemViewModal
      v-if="selectedPoem"
      :poem="selectedPoem"
      @close="selectedPoem = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { usePoemGenerator } from '@/composables/usePoemGenerator'
import { api } from '@/services/api'
import { 
  Heart, 
  Sparkles, 
  PenTool, 
  Plus, 
  CreditCard, 
  Share2, 
  Trash2,
  Loader 
} from 'lucide-vue-next'
import PaywallModal from '@/components/PaywallModal.vue'
import PoemViewModal from '@/components/PoemViewModal.vue'

const router = useRouter()
const { currentUser, remainingGenerations } = useUser()
const { poemStyles } = usePoemGenerator()

const activeTab = ref('poems')
const poems = ref([])
const payments = ref([])
const loading = ref(true)
const loadingPayments = ref(false)
const currentPage = ref(1)
const pagination = ref(null)
const showPaywallModal = ref(false)
const selectedPoem = ref(null)

const totalPoems = computed(() => pagination.value?.total || poems.value.length)

const poemsRemaining = computed(() => {
  if (remainingGenerations.value === -1) return '∞'
  return remainingGenerations.value
})

const userCurrency = computed(() => {
  // Would be determined from user profile/location
  return 'NGN'
})

onMounted(() => {
  loadPoems()
})

const loadPoems = async (page = 1) => {
  loading.value = true
  try {
    const response = await api.poems.list(page)
    if (response.data.success) {
      poems.value = response.data.poems
      pagination.value = response.data.pagination
      currentPage.value = page
    }
  } catch (error) {
    console.error('Failed to load poems:', error)
  } finally {
    loading.value = false
  }
}

const loadPayments = async () => {
  if (payments.value.length > 0) return // Already loaded
  
  loadingPayments.value = true
  try {
    const response = await api.payments.history()
    if (response.data.success) {
      payments.value = response.data.payments
    }
  } catch (error) {
    console.error('Failed to load payments:', error)
  } finally {
    loadingPayments.value = false
  }
}

// Watch tab changes to load payments when needed
const handleTabChange = async (tab) => {
  activeTab.value = tab
  if (tab === 'payments' && payments.value.length === 0) {
    await loadPayments()
  }
}

const loadPage = (page) => {
  loadPoems(page)
}

const createNewPoem = () => {
  router.push('/create')
}

const viewPoem = (poem) => {
  selectedPoem.value = poem
}

const sharePoem = async (poem) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: poem.recipient_name ? `A poem for ${poem.recipient_name}` : 'A beautiful poem',
        text: poem.content,
        url: poem.share_url
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(poem.content)
      alert('Poem copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }
}

const deletePoem = async (poem) => {
  if (!confirm('Are you sure you want to delete this poem?')) return

  try {
    const response = await api.poems.delete(poem.id)
    if (response.data.success) {
      poems.value = poems.value.filter(p => p.id !== poem.id)
      if (pagination.value) {
        pagination.value.total--
      }
    }
  } catch (error) {
    console.error('Failed to delete poem:', error)
    alert('Failed to delete poem. Please try again.')
  }
}

const getExcerpt = (content) => {
  const lines = content.split('\n').filter(line => line.trim())
  return lines.slice(0, 2).join('\n') + '...'
}

const getStyleName = (styleId) => {
  const style = poemStyles.find(s => s.id === styleId)
  return style ? style.name : styleId
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const formatAmount = (amount, currency) => {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString()}`
  }
  return `$${amount.toFixed(2)}`
}

const handlePaymentSuccess = async (option) => {
  showPaywallModal.value = false
  // Reload user data to get updated poem count
  await loadPoems()
  alert('Payment successful! Your poems have been added.')
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--color-rose-dark);
  margin: 0;
}

.poems-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(139, 71, 93, 0.1), rgba(212, 175, 55, 0.1));
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  color: var(--color-rose-dark);
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.quick-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid rgba(139, 71, 93, 0.1);
  margin-bottom: 2rem;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  color: var(--color-ink);
  opacity: 0.6;
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab:hover {
  opacity: 0.8;
}

.tab.active {
  opacity: 1;
  color: var(--color-rose-dark);
  border-bottom-color: var(--color-rose);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state .spinner {
  animation: spin 1s linear infinite;
  color: var(--color-rose);
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state svg {
  color: var(--color-rose-light);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--color-rose-dark);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-ink);
  opacity: 0.7;
  margin-bottom: 2rem;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.poem-card {
  background: white;
  border: 2px solid rgba(139, 71, 93, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.poem-card:hover {
  border-color: var(--color-rose-light);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(139, 71, 93, 0.1);
}

.poem-preview {
  margin-bottom: 1rem;
}

.poem-excerpt {
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-ink);
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.poem-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recipient {
  font-weight: 600;
  color: var(--color-rose-dark);
  font-size: 0.875rem;
}

.poem-style {
  font-size: 0.75rem;
  color: var(--color-ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.poem-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  color: var(--color-rose-light);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.icon-btn:hover {
  background: rgba(139, 71, 93, 0.1);
  color: var(--color-rose);
}

.poem-date {
  font-size: 0.75rem;
  color: var(--color-ink);
  opacity: 0.5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 71, 93, 0.1);
}

.page-info {
  color: var(--color-ink);
  opacity: 0.7;
}

/* Payments Table */
.payments-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(139, 71, 93, 0.1);
}

.payments-table table {
  width: 100%;
  border-collapse: collapse;
}

.payments-table th,
.payments-table td {
  padding: 1rem;
  text-align: left;
}

.payments-table th {
  background: rgba(139, 71, 93, 0.05);
  color: var(--color-rose-dark);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payments-table td {
  border-top: 1px solid rgba(139, 71, 93, 0.1);
  color: var(--color-ink);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.completed,
.status-badge.success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .dashboard-header h1 {
    font-size: 2rem;
  }

  .quick-actions {
    flex-direction: column;
    width: 100%;
  }

  .quick-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .poems-grid {
    grid-template-columns: 1fr;
  }

  .payments-table {
    overflow-x: auto;
  }

  .payments-table table {
    min-width: 600px;
  }
}
</style>

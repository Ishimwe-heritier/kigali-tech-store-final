<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { User, Mail, Shield, Package, MapPin, Loader2, Calendar, CreditCard } from 'lucide-vue-next'

const auth = useAuthStore()
const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://kigali-tech-store-final.onrender.com';
    const response = await axios.get(`${apiBaseUrl}/api/orders`)
    orders.value = response.data
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">My Account</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="md:col-span-1 space-y-4">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div class="w-24 h-24 bg-rwanda-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rwanda-blue">
              <User :size="48" />
            </div>
            <h2 class="font-bold text-xl">{{ auth.user?.name }}</h2>
            <p class="text-gray-500 text-sm">{{ auth.user?.email }}</p>
          </div>

          <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <nav class="flex flex-col">
              <button class="flex items-center gap-3 px-6 py-4 bg-gray-50 text-rwanda-blue font-bold border-l-4 border-rwanda-blue">
                <Package :size="20" />
                Orders
              </button>
              <button class="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-500 transition-colors">
                <MapPin :size="20" />
                Addresses
              </button>
              <button class="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-500 transition-colors">
                <Shield :size="20" />
                Security
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-2 space-y-8">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold mb-8 flex items-center gap-2">
              <Package class="text-rwanda-blue" />
              Order History
            </h3>
            
            <div v-if="loading" class="flex justify-center py-12">
              <Loader2 class="animate-spin text-rwanda-blue" :size="32" />
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-12">
              <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Package :size="32" />
              </div>
              <p class="text-gray-500">You haven't placed any orders yet.</p>
            </div>

            <div v-else class="space-y-6">
              <div v-for="order in orders" :key="order.id" class="border border-gray-100 rounded-2xl p-6 hover:bg-gray-50 transition-colors">
                <div class="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <div class="text-sm text-gray-400 font-medium uppercase mb-1">Order #{{ order.id }}</div>
                    <div class="flex items-center gap-2 text-gray-700 font-bold">
                      <Calendar :size="16" />
                      {{ formatDate(order.date) }}
                    </div>
                  </div>
                  <div class="bg-rwanda-green/10 text-rwanda-green px-4 py-1 rounded-full font-bold text-sm">
                    {{ order.status.toUpperCase() }}
                  </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                  <div class="flex -space-x-4 overflow-hidden">
                    <img 
                      v-for="item in order.items.slice(0, 3)" 
                      :key="item.id"
                      :src="item.image" 
                      class="inline-block h-12 w-12 rounded-full border-2 border-white bg-white object-contain" 
                    />
                    <div v-if="order.items.length > 3" class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-500">
                      +{{ order.items.length - 3 }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-400 font-bold mb-1">TOTAL AMOUNT</div>
                    <div class="text-xl font-black text-rwanda-green">${{ order.total.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold mb-6">Personal Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="p-4 bg-gray-50 rounded-2xl">
                <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Full Name</div>
                <div class="font-bold">{{ auth.user?.name }}</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-2xl">
                <div class="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">Email Address</div>
                <div class="font-bold">{{ auth.user?.email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

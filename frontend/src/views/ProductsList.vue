<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useProductStore } from '../stores/products'
import { useWishlistStore } from '../stores/wishlist'
import { useRoute, RouterLink } from 'vue-router'
import { Heart, Search, SlidersHorizontal } from 'lucide-vue-next'

const productStore = useProductStore()
const wishlistStore = useWishlistStore()
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref(route.query.category || '')

onMounted(() => {
  productStore.fetchProducts()
})

watch(() => route.query.category, (newCat) => {
  selectedCategory.ref = newCat || ''
})

const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h1 class="text-3xl font-bold">Gadgets & Electronics</h1>
      
      <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
        <div class="relative flex-grow md:flex-grow-0">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rwanda-blue focus:border-transparent outline-none w-full"
          />
        </div>

        <select 
          v-model="selectedCategory"
          class="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-rwanda-blue"
        >
          <option value="">All Categories</option>
          <option v-for="cat in productStore.categories" :key="cat" :value="cat">
            {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="productStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-rwanda-blue border-t-transparent"></div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
      <p class="text-xl text-gray-500">No products found matching your criteria.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 flex flex-col"
      >
        <div class="relative">
          <RouterLink :to="`/products/${product.id}`">
            <div class="h-64 p-8 flex items-center justify-center bg-white">
              <img :src="product.image" :alt="product.title" class="max-h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
          </RouterLink>
          <button 
            @click="wishlistStore.toggleWishlist(product)"
            class="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
            :class="wishlistStore.isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'"
          >
            <Heart :size="20" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" />
          </button>
        </div>

        <div class="p-6 flex-grow flex flex-col">
          <div class="text-xs text-rwanda-blue font-bold uppercase mb-2">{{ product.category }}</div>
          <RouterLink :to="`/products/${product.id}`" class="block mb-2">
            <h3 class="font-bold text-gray-800 line-clamp-2 hover:text-rwanda-blue transition-colors">{{ product.title }}</h3>
          </RouterLink>
          
          <div class="mt-auto pt-4 flex justify-between items-center">
            <span class="text-2xl font-bold text-rwanda-green">${{ product.price }}</span>
            <div class="flex items-center gap-1">
              <span class="text-rwanda-yellow text-lg">★</span>
              <span class="text-sm font-medium">{{ product.rating.rate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

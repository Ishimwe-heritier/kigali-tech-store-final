<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref(null)
const loading = ref(true)

onMounted(async () => {
  product.value = await productStore.fetchProductById(route.params.id)
  loading.value = false
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <button @click="router.back()" class="flex items-center gap-2 text-gray-500 hover:text-rwanda-blue mb-8 transition-colors">
      <ArrowLeft :size="20" />
      Back to results
    </button>

    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-rwanda-blue border-t-transparent"></div>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <!-- Product Image -->
      <div class="bg-white p-12 flex items-center justify-center rounded-2xl border border-gray-50">
        <img :src="product.image" :alt="product.title" class="max-h-[400px] object-contain" />
      </div>

      <!-- Product Info -->
      <div class="flex flex-col">
        <div class="text-sm font-bold text-rwanda-blue uppercase tracking-wider mb-2">{{ product.category }}</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ product.title }}</h1>
        
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center bg-rwanda-yellow/10 px-3 py-1 rounded-full text-rwanda-yellow-600 font-bold">
            <Star :size="16" fill="currentColor" class="mr-1" />
            {{ product.rating.rate }}
          </div>
          <span class="text-gray-400">({{ product.rating.count }} reviews)</span>
        </div>

        <div class="text-5xl font-bold text-rwanda-green mb-8">${{ product.price }}</div>

        <p class="text-gray-600 leading-relaxed mb-8 text-lg">
          {{ product.description }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <Truck class="text-rwanda-blue mt-1" />
            <div>
              <div class="font-bold">Fast Delivery</div>
              <div class="text-sm text-gray-500">Same day delivery in Kigali</div>
            </div>
          </div>
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <ShieldCheck class="text-rwanda-blue mt-1" />
            <div>
              <div class="font-bold">Local Warranty</div>
              <div class="text-sm text-gray-500">12 months support</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mt-auto">
          <button 
            @click="cartStore.addToCart(product)"
            class="flex-grow bg-rwanda-blue text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-rwanda-blue/20"
          >
            <ShoppingCart :size="24" />
            Add to Cart
          </button>
          <button 
            @click="wishlistStore.toggleWishlist(product)"
            class="p-4 border-2 rounded-2xl transition-all"
            :class="wishlistStore.isInWishlist(product.id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-gray-300'"
          >
            <Heart :size="24" :fill="wishlistStore.isInWishlist(product.id) ? 'currentColor' : 'none'" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

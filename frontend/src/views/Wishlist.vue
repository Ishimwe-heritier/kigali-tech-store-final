<script setup>
import { useWishlistStore } from '../stores/wishlist'
import { useCartStore } from '../stores/cart'
import { RouterLink } from 'vue-router'
import { Heart, ShoppingCart, Trash2 } from 'lucide-vue-next'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const moveToCart = (product) => {
  cartStore.addToCart(product)
  wishlistStore.toggleWishlist(product)
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">My Wishlist</h1>

    <div v-if="wishlistStore.items.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div class="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-red-200">
        <Heart :size="48" />
      </div>
      <p class="text-xl text-gray-500 mb-8">Your wishlist is empty.</p>
      <RouterLink to="/products" class="bg-rwanda-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all inline-block">
        Find Products
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        v-for="product in wishlistStore.items" 
        :key="product.id"
        class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col"
      >
        <div class="relative group">
          <RouterLink :to="`/products/${product.id}`">
            <div class="h-64 p-8 flex items-center justify-center bg-white">
              <img :src="product.image" :alt="product.title" class="max-h-full object-contain" />
            </div>
          </RouterLink>
          <button 
            @click="wishlistStore.toggleWishlist(product)"
            class="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full shadow-sm hover:bg-red-100 transition-colors"
          >
            <Trash2 :size="18" />
          </button>
        </div>

        <div class="p-6 flex-grow flex flex-col">
          <h3 class="font-bold text-gray-800 line-clamp-1 mb-4">{{ product.title }}</h3>
          <div class="text-2xl font-bold text-rwanda-green mb-6">${{ product.price }}</div>
          
          <button 
            @click="moveToCart(product)"
            class="w-full bg-rwanda-yellow text-rwanda-green py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all mt-auto"
          >
            <ShoppingCart :size="20" />
            Move to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

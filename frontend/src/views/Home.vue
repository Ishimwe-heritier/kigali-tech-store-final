<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../stores/products'
import { RouterLink } from 'vue-router'

const productStore = useProductStore()

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="relative h-[500px] flex items-center overflow-hidden bg-rwanda-blue">
      <div class="absolute inset-0 bg-gradient-to-r from-rwanda-blue to-transparent z-10"></div>
      <div class="container mx-auto px-4 relative z-20 text-white">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Next-Gen Tech <br />
          <span class="text-rwanda-yellow text-glow">In the Heart of Kigali</span>
        </h1>
        <p class="text-xl mb-8 max-w-2xl text-rwanda-blue-100">
          Discover the latest smartphones, laptops, and accessories with local warranty and support.
        </p>
        <RouterLink to="/products" class="bg-rwanda-yellow text-rwanda-green px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-block">
          Shop Now
        </RouterLink>
      </div>
      <!-- Abstract Flag Gradient -->
      <div class="absolute right-0 top-0 w-1/2 h-full opacity-30 skew-x-12 translate-x-1/4">
        <div class="h-1/2 bg-rwanda-yellow"></div>
        <div class="h-1/2 bg-rwanda-green"></div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8">Popular Categories</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <RouterLink 
          v-for="cat in productStore.categories.slice(0, 4)" 
          :key="cat"
          :to="`/products?category=${cat}`"
          class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center group border border-gray-100"
        >
          <div class="w-16 h-16 bg-rwanda-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform text-rwanda-blue">
            <span class="uppercase font-bold">{{ cat.charAt(0) }}</span>
          </div>
          <h3 class="font-bold capitalize">{{ cat }}</h3>
        </RouterLink>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container mx-auto px-4 pb-12">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h2 class="text-3xl font-bold">Featured Products</h2>
          <p class="text-gray-500">Handpicked gadgets just for you</p>
        </div>
        <RouterLink to="/products" class="text-rwanda-blue font-bold hover:underline">View All</RouterLink>
      </div>
      
      <div v-if="productStore.loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-rwanda-blue border-t-transparent"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="product in productStore.products.slice(0, 4)" 
          :key="product.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100"
        >
          <RouterLink :to="`/products/${product.id}`">
            <div class="h-64 p-8 flex items-center justify-center bg-white">
              <img :src="product.image" :alt="product.title" class="max-h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
          </RouterLink>
          <div class="p-6">
            <div class="text-xs text-rwanda-blue font-bold uppercase mb-2">{{ product.category }}</div>
            <RouterLink :to="`/products/${product.id}`" class="block">
              <h3 class="font-bold text-gray-800 line-clamp-1 hover:text-rwanda-blue transition-colors mb-2">{{ product.title }}</h3>
            </RouterLink>
            <div class="flex justify-between items-center mt-4">
              <span class="text-xl font-bold text-rwanda-green">${{ product.price }}</span>
              <div class="flex items-center gap-1">
                <span class="text-rwanda-yellow">★</span>
                <span class="text-sm font-medium">{{ product.rating.rate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-glow {
  text-shadow: 0 0 20px rgba(250, 210, 1, 0.4);
}
</style>

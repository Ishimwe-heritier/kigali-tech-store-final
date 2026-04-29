<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { ShoppingCart, Heart, User, LogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const cart = useCartStore()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-gray-900">
    <!-- Navigation -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <RouterLink to="/" class="text-2xl font-bold text-rwanda-blue flex items-center gap-2">
          <span class="bg-rwanda-yellow p-1 rounded">KT</span>
          Kigali Tech
        </RouterLink>

        <div class="hidden md:flex items-center gap-8">
          <RouterLink to="/" class="hover:text-rwanda-blue transition-colors">Home</RouterLink>
          <RouterLink to="/products" class="hover:text-rwanda-blue transition-colors">Products</RouterLink>
        </div>

        <div class="flex items-center gap-4">
          <RouterLink to="/wishlist" class="p-2 hover:bg-gray-100 rounded-full relative" title="Wishlist">
            <Heart :size="24" />
          </RouterLink>
          
          <RouterLink to="/cart" class="p-2 hover:bg-gray-100 rounded-full relative" title="Cart">
            <ShoppingCart :size="24" />
            <span v-if="cart.itemCount > 0" class="absolute -top-1 -right-1 bg-rwanda-yellow text-xs font-bold px-2 py-0.5 rounded-full">
              {{ cart.itemCount }}
            </span>
          </RouterLink>

          <template v-if="auth.isAuthenticated">
            <RouterLink to="/profile" class="p-2 hover:bg-gray-100 rounded-full" title="Profile">
              <User :size="24" />
            </RouterLink>
            <button @click="auth.logout" class="p-2 hover:bg-red-50 text-red-500 rounded-full" title="Logout">
              <LogOut :size="24" />
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="bg-rwanda-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium">
              Login
            </RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-rwanda-green text-white py-12 mt-12">
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Kigali Tech Store</h3>
          <p class="text-gray-300">Providing affordable and quality electronics to the heart of Rwanda.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-rwanda-yellow">Quick Links</h4>
          <ul class="space-y-2 text-gray-300">
            <li><RouterLink to="/products">All Products</RouterLink></li>
            <li><RouterLink to="/cart">My Cart</RouterLink></li>
            <li><RouterLink to="/wishlist">Wishlist</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-rwanda-yellow">Categories</h4>
          <ul class="space-y-2 text-gray-300">
            <li><RouterLink to="/products?category=electronics">Electronics</RouterLink></li>
            <li><RouterLink to="/products?category=jewelery">Jewelery</RouterLink></li>
            <li><RouterLink to="/products?category=men's clothing">Men's Clothing</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-rwanda-yellow">Contact</h4>
          <p class="text-gray-300">Kigali, Rwanda</p>
          <p class="text-gray-300">info@kigalitech.rw</p>
        </div>
      </div>
      <div class="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
        &copy; 2024 Kigali Tech Store. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style>
/* Any global styles if needed, though Tailwind covers most */
body {
  @apply bg-gray-50;
}
</style>

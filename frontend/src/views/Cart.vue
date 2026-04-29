<script setup>
import { useCartStore } from '../stores/cart'
import { RouterLink } from 'vue-router'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-vue-next'

const cartStore = useCartStore()
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Your Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div class="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <ShoppingBag :size="48" />
      </div>
      <p class="text-xl text-gray-500 mb-8">Your cart is empty.</p>
      <RouterLink to="/products" class="bg-rwanda-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all inline-block">
        Browse Products
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-6">
        <div v-for="item in cartStore.items" :key="item.id" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div class="w-24 h-24 bg-gray-50 p-4 rounded-xl flex items-center justify-center flex-shrink-0">
            <img :src="item.image" :alt="item.title" class="max-h-full object-contain" />
          </div>
          
          <div class="flex-grow">
            <h3 class="font-bold text-gray-800 line-clamp-1 mb-1">{{ item.title }}</h3>
            <div class="text-rwanda-green font-bold text-xl mb-4">${{ item.price }}</div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="p-1 hover:bg-white rounded transition-colors text-gray-500">
                  <Minus :size="16" />
                </button>
                <span class="w-10 text-center font-bold">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="p-1 hover:bg-white rounded transition-colors text-gray-500">
                  <Plus :size="16" />
                </button>
              </div>
              
              <button @click="cartStore.removeFromCart(item.id)" class="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-8">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span class="text-rwanda-green font-medium">Free</span>
            </div>
            <div class="border-t pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span class="text-rwanda-green">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <RouterLink 
            to="/checkout" 
            class="w-full bg-rwanda-blue text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-rwanda-blue/20"
          >
            Checkout
            <ArrowRight :size="20" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

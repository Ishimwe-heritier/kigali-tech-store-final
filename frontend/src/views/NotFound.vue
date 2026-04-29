<script setup>
import { RouterLink } from 'vue-router'
import { Home, AlertCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="container mx-auto px-4 py-32 text-center">
    <div class="bg-rwanda-blue/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-rwanda-blue">
      <AlertCircle :size="48" />
    </div>
    <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
    <p class="text-xl text-gray-500 mb-12">Oops! The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="bg-rwanda-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2">
      <Home :size="20" />
      Back to Home
    </RouterLink>
  </div>
</template>

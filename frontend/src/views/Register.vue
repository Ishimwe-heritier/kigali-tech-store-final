<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, RouterLink } from 'vue-router'
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  const success = await auth.register({ 
    name: name.value, 
    email: email.value, 
    password: password.value 
  })
  if (success) {
    router.push('/profile')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-20 flex justify-center">
    <div class="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p class="text-gray-500">Join Kigali Tech Store today</p>
      </div>

      <div v-if="auth.error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm border border-red-100">
        <AlertCircle :size="20" />
        {{ auth.error }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
            <input 
              v-model="name"
              type="text" 
              required
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rwanda-blue focus:bg-white outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rwanda-blue focus:bg-white outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="20" />
            <input 
              v-model="password"
              type="password" 
              required
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rwanda-blue focus:bg-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit"
          :disabled="auth.loading"
          class="w-full bg-rwanda-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-rwanda-blue/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Loader2 v-if="auth.loading" class="animate-spin" />
          {{ auth.loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="mt-8 text-center text-gray-500">
        Already have an account? 
        <RouterLink to="/login" class="text-rwanda-blue font-bold hover:underline">Login here</RouterLink>
      </div>
    </div>
  </div>
</template>

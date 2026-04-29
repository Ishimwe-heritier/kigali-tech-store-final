<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { CreditCard, Lock, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-vue-next'

const cartStore = useCartStore()
const router = useRouter()

const stripe = ref(null)
const elements = ref(null)
const cardElement = ref(null)
const isProcessing = ref(false)
const orderSuccess = ref(false)
const errorMessage = ref('')

// REPLACE THIS with your actual Stripe Publishable Key from the Stripe Dashboard
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51TRThdCa1stTj2fNvJGYcybHh5Jm4tbUCQjl0jQWsnCJNvszCVaAli0ZFc4pY0Of4FzF3m7yEiY6Y9lGEUhUhV4R00ywzxdy6u'

onMounted(async () => {
  stripe.value = await loadStripe(STRIPE_PUBLISHABLE_KEY)
  if (stripe.value) {
    elements.value = stripe.value.elements()
    cardElement.value = elements.value.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#fa755a' },
      },
    })
    cardElement.value.mount('#card-element')
  }
})

const handlePayment = async () => {
  if (!stripe.value || !elements.value) return

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // 1. Create Payment Intent on the backend
    const { data: { clientSecret } } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
      amount: cartStore.totalPrice
    })

    // 2. Confirm the payment with Stripe
    const result = await stripe.value.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.value,
        billing_details: {
          name: 'Kigali Tech Customer', // In a real app, get this from a form
        },
      },
    })

    if (result.error) {
      errorMessage.value = result.error.message
      isProcessing.value = false
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // 3. Save order to our backend
        await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
          items: cartStore.items,
          total: cartStore.totalPrice,
          paymentIntentId: result.paymentIntent.id
        })

        orderSuccess.value = true
        cartStore.clearCart()
        isProcessing.value = false
      }
    }
  } catch (err) {
    errorMessage.value = 'An error occurred during payment. Please check if the backend is running.'
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div v-if="orderSuccess" class="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-8">
      <div class="bg-rwanda-green/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-rwanda-green">
        <CheckCircle :size="64" />
      </div>
      <h1 class="text-4xl font-bold mb-4">Order Successful!</h1>
      <p class="text-gray-500 mb-8 text-lg">Thank you for your purchase. We've sent a confirmation email and saved your order.</p>
      <button @click="router.push('/profile')" class="bg-rwanda-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all">
        View My Orders
      </button>
    </div>

    <div v-else class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Payment Details -->
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard class="text-rwanda-blue" />
              Secure Payment
            </h2>
            
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm border border-red-100">
              <AlertCircle :size="20" />
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handlePayment" class="space-y-6">
              <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label class="block text-sm font-bold text-gray-700 mb-4">Credit or Debit Card</label>
                <!-- Stripe Card Element will be mounted here -->
                <div id="card-element" class="p-2"></div>
              </div>

              <div class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <Lock :size="16" />
                Your payment is encrypted and secure.
              </div>

              <button 
                type="submit"
                :disabled="isProcessing || !cartStore.items.length"
                class="w-full bg-rwanda-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-rwanda-blue/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Loader2 v-if="isProcessing" class="animate-spin" />
                {{ isProcessing ? 'Processing Payment...' : `Pay $${cartStore.totalPrice.toFixed(2)}` }}
              </button>
            </form>
          </div>
        </div>

        <!-- Order Review -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 class="text-xl font-bold mb-6 text-rwanda-green">Order Summary</h2>
          
          <div class="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
            <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 pb-4 border-b border-gray-50">
              <div class="w-16 h-16 bg-gray-50 p-2 rounded-lg flex-shrink-0">
                <img :src="item.image" :alt="item.title" class="max-h-full object-contain mx-auto" />
              </div>
              <div class="flex-grow">
                <h4 class="font-bold text-sm line-clamp-1">{{ item.title }}</h4>
                <div class="text-gray-500 text-sm">Qty: {{ item.quantity }}</div>
                <div class="text-rwanda-green font-bold">${{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t-2 border-gray-50">
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span class="text-rwanda-green">${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#card-element {
  width: 100%;
}
</style>

import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    categories: []
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        // Fetch from Fake Store API as primary source
        const response = await axios.get('https://fakestoreapi.com/products')
        this.products = response.data
        
        // Also fetch categories
        const catRes = await axios.get('https://fakestoreapi.com/products/categories')
        this.categories = catRes.data
      } catch (err) {
        this.error = 'Failed to fetch products'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
        return response.data
      } catch (err) {
        console.error(err)
        return null
      }
    }
  }
})

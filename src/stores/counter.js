import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  // axios
  const List = ref([])
  async function fetchList() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts')  
      List.value = response.data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  return { count, doubleCount, increment, List, fetchList }
})

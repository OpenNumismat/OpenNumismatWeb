import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const currentStatusView = ref('full')

  const setStatusView = (status) => {
    currentStatusView.value = status
  }

  return {
    currentStatusView,
    setStatusView,
  }
}, {
  persist: true,
})

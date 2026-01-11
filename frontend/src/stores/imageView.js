import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useImageViewStore = defineStore('imageView', () => {
  const currentImageView = ref('image')

  const setImageView = (status) => {
    currentImageView.value = status
  }

  return {
    currentImageView,
    setImageView,
  }
}, {
  persist: true,
})

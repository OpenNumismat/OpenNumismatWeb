import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('light')

  const setTheme = (theme) => {
    currentTheme.value = theme

    localStorage.setItem('app-theme', theme)
  }

  return {
    currentTheme,
    setTheme,
  }
}, {
  persist: true,
})

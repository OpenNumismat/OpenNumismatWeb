import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref('en')

  const setLocale = (locale) => {
    currentLocale.value = locale

    localStorage.setItem('app-locale', locale)

    document.documentElement.lang = locale

    window.dispatchEvent(new CustomEvent('locale-changed', {
      detail: { locale }
    }))
  }

  return {
    currentLocale,
    setLocale,
  }
}, {
  persist: true,
})

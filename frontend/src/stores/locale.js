import { defineStore } from 'pinia'
import {computed, ref} from 'vue'

export const useLocaleStore = defineStore('locale', () => {
  const availableLanguages = ref([
    {lang: 'bg', name: 'Български'},
    {lang: 'ca', name: 'Català'},
    {lang: 'de', name: 'Deutsch'},
    {lang: 'en', name: 'English'},
    {lang: 'el', name: 'Ελληνικά'},
    {lang: 'es', name: 'Español'},
    {lang: 'fa', name: 'فارسی'},
    {lang: 'fr', name: 'Français'},
    {lang: 'it', name: 'Italiano'},
    {lang: 'nl', name: 'Nederlands'},
    {lang: 'pl', name: 'Polski'},
    {lang: 'pt', name: 'Português'},
    {lang: 'ru', name: 'Русский'},
    {lang: 'tr', name: 'Türkçe'},
    {lang: 'uk', name: 'Український'},
  ])
  const availableLocales = computed(() => availableLanguages.value.map(item => item.lang))

  const detectLocale = () => {
    const navigatorLocale = navigator.language.split('-')[0]
    if (availableLocales.value.includes(navigatorLocale))
      return navigatorLocale

    return 'en'
  }

  const currentLocale = ref(detectLocale())

  const setLocale = (locale) => {
    if (availableLocales.value.includes(locale)) {
      currentLocale.value = locale

      document.documentElement.lang = locale
    }
  }

  return {
    currentLocale,
    availableLanguages,
    setLocale,
  }
}, {
  persist: true,
})

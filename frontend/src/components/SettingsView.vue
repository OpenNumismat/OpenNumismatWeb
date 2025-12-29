<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import { useLocale, useTheme } from 'vuetify'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const appTheme = useTheme()
const localeStore = useLocaleStore()
const appLocale = useLocale()

const langs = ref([
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
]);

const props = defineProps({
  title: String,
});
const emit = defineEmits(['update:title']);
let oldTitle = null;

onMounted(async () => {
  oldTitle = props.title;
  emit('update:title', 'Settings');
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
})

const handleLocaleChange = (locale) => {
  localeStore.setLocale(locale)
  appLocale.current.value = locale
}

const handleThemeChange = (theme) => {
  themeStore.setTheme(theme)
  appTheme.change(theme)
}
</script>

<template>
  <v-container>
    <v-list>
      <v-list-item>
        <v-btn-toggle
            v-model="themeStore.currentTheme"
            rounded="xl"
            border
            @update:model-value="handleThemeChange"
        >
          <v-btn value="dark" icon="mdi-weather-night"></v-btn>
          <v-btn value="system" icon="mdi-brightness-auto"></v-btn>
          <v-btn value="light" icon="mdi-weather-sunny"></v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-select
            v-model="localeStore.currentLocale"
            :items="langs"
            item-title="name"
            item-value="lang"
            @update:model-value="handleLocaleChange"
        ></v-select>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

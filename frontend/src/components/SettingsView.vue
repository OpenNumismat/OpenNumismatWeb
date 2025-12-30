<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import { useLocale, useTheme } from 'vuetify'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const appTheme = useTheme()
const localeStore = useLocaleStore()
const appLocale = useLocale()

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
            :items="localeStore.availableLanguages"
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

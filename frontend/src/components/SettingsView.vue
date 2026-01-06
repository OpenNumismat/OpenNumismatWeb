<script setup>
import {onMounted, onUnmounted, nextTick} from "vue";
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/theme'
import { languageList, setLocale } from '@/i18n'
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"

const languageItems = Object.entries(languageList).map(([key, value]) => ({
  lang: key,
  name: value
}))

const themeStore = useThemeStore()
const appTheme = useTheme()

onMounted(async () => {
  appTitle.pushTitle(i18n.global.t('title_settings'))
})
onUnmounted(async () => {
  appTitle.popTitle()
})

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
            v-model="$i18n.locale"
            :items="languageItems"
            item-title="name"
            item-value="lang"
            @update:model-value="setLocale"
        >
        </v-select>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

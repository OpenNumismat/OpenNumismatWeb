<script setup>
import {onMounted, onUnmounted, nextTick} from "vue";
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/theme'
import { useStatusStore } from '@/stores/status'
import { languageList, setLocale } from '@/i18n'
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"

const languageItems = Object.entries(languageList).map(([key, value]) => ({
  lang: key,
  name: value
}))

const statusItems = [
  {value: 'text', title: 'status_view_text'},
  {value: 'icon', title: 'status_view_icon'},
  {value: 'full', title: 'status_view_full'},
]
const statusStore = useStatusStore()

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
      <v-list-item>
        <v-btn-toggle
            v-model="statusStore.currentStatusView"
            rounded="xl"
            border
        >
          <v-btn
              v-for="item in statusItems" :key="item.value" :value="item.value">
            {{ i18n.global.t(item.title) }}
          </v-btn>
        </v-btn-toggle>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

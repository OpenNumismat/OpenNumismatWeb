<script setup>
import {onMounted, onUnmounted} from "vue";
import { useTheme } from 'vuetify'
import { languageList, setLocale } from '@/i18n'
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"
import { imagePresentation, statusPresentation, currentTheme } from "@/composables/useSettings";

const languageItems = Object.entries(languageList).map(([key, value]) => ({
  lang: key,
  name: value
}))

const statusItems = [
  {value: 'text', title: 'status_view_text'},
  {value: 'icon', title: 'status_view_icon'},
  {value: 'full', title: 'status_view_full'},
]

const imageViewItems = [
  {value: 'image', title: 'image_view_image'},
  {value: 'obverse', title: 'image_view_obverse'},
  {value: 'reverse', title: 'image_view_reverse'},
  {value: 'both', title: 'image_view_both'},
]

const appTheme = useTheme()

onMounted(async () => {
  appTitle.pushTitle(i18n.global.t('title_settings'))
})
onUnmounted(async () => {
  appTitle.popTitle()
})

const handleThemeChange = (theme) => {
  appTheme.change(theme)
}
</script>

<template>
  <v-container>
    <v-list>
      <v-list-item :title="i18n.global.t('settings_theme')">
        <template v-slot:append>
          <v-list-item-action start>
            <v-btn-toggle
                v-model="currentTheme"
                rounded="xl"
                border
                @update:model-value="handleThemeChange"
            >
              <v-btn value="dark" icon="mdi-weather-night"></v-btn>
              <v-btn value="system" icon="mdi-brightness-auto"></v-btn>
              <v-btn value="light" icon="mdi-weather-sunny"></v-btn>
            </v-btn-toggle>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="i18n.global.t('settings_language')">
        <template v-slot:append>
          <v-list-item-action start>
            <v-select
                v-model="$i18n.locale"
                :items="languageItems"
                item-title="name"
                item-value="lang"
                @update:model-value="setLocale"
            >
            </v-select>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="i18n.global.t('settings_status')">
        <template v-slot:append>
          <v-list-item-action start>
            <v-btn-toggle
                v-model="statusPresentation"
                rounded="xl"
                border
            >
              <v-btn
                  v-for="item in statusItems" :key="item.value" :value="item.value">
                {{ i18n.global.t(item.title) }}
              </v-btn>
            </v-btn-toggle>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item :title="i18n.global.t('settings_image_view')">
        <template v-slot:append>
          <v-list-item-action start>
            <v-select
                v-model="imagePresentation"
                :items="imageViewItems"
                :item-title="item => i18n.global.t(item.title)"
            >
            </v-select>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>
</style>

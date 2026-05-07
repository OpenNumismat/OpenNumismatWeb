<script setup>
import {onMounted, onUnmounted} from "vue";
import { useTheme } from 'vuetify'
import { languageList, setLocale } from '@/i18n'
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"
import {imagePresentation, statusPresentation, currentTheme, apiKey, serverUrl} from "@/composables/useSettings";

const isServerLess = import.meta.env.VITE_SERVERLESS;
const isNativeApp = import.meta.env.VITE_PLATFORM_ANDROID;

const languageItems = Object.entries(languageList).map(([key, value]) => ({
  lang: key,
  name: value
}))

const statusItems = [
  {value: 'text', title: 'status_view_text'},
  {value: 'icon', title: 'status_view_icon'},
  {value: 'icon_text', title: 'status_view_icon_text'},
  {value: 'text_icon', title: 'status_view_text_icon'},
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
  <v-list>
    <v-list-subheader>
      {{ i18n.global.t('Interface') }}
    </v-list-subheader>
    <v-divider />
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
              density="comfortable"
              hide-details
          >
          </v-select>
        </v-list-item-action>
      </template>
    </v-list-item>
    <v-list-item :title="i18n.global.t('settings_status')">
      <template v-slot:append>
        <v-list-item-action start>
          <v-select
              v-model="statusPresentation"
              :items="statusItems"
              :item-title="item => i18n.global.t(item.title)"
              density="comfortable"
              hide-details
          >
          </v-select>
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
              density="comfortable"
              hide-details
          >
          </v-select>
        </v-list-item-action>
      </template>
    </v-list-item>
    <template  v-if="!isServerLess">
      <v-list-subheader>
        {{ i18n.global.t('Server') }}
      </v-list-subheader>
      <v-divider />
      <template  v-if="isNativeApp">
        <v-list-item>
          <v-list-item-action start>
            <v-text-field
                :label="i18n.global.t('Server URL')"
                v-model="serverUrl"
                density="comfortable"
                hide-details
            />
          </v-list-item-action>
        </v-list-item>
      </template>
      <v-list-item>
          <v-list-item-action start>
            <v-text-field
                :label="i18n.global.t('API Key')"
                v-model="apiKey"
                density="comfortable"
                hide-details
            />
          </v-list-item-action>
      </v-list-item>
    </template>
  </v-list>
</template>

<style scoped>
</style>

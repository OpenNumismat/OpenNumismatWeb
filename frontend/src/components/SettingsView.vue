<script setup>
import {onMounted, onUnmounted} from "vue";
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/stores/theme'
import { languageList, setLocale } from '@/i18n'

const languageItems = Object.entries(languageList).map(([key, value]) => ({
  lang: key,
  name: value
}))

const themeStore = useThemeStore()
const appTheme = useTheme()

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

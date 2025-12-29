<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()

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

const changeLanguage = (lang) => {
  localeStore.setLocale(lang)
}
</script>

<template>
  <v-container>
    <v-list>
      <v-list-item>
        <v-btn-toggle
            rounded="xl"
            border
        >
          <v-btn icon="mdi-weather-night"></v-btn>
          <v-btn icon="mdi-brightness-auto"></v-btn>
          <v-btn icon="mdi-weather-sunny"></v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-select
            v-model="localeStore.currentLocale"
            :items="langs"
            item-title="name"
            item-value="lang"
            @update:modelValue="changeLanguage"
        ></v-select>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

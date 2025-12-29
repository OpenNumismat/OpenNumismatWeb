<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useLocale, useTheme} from 'vuetify'
import {useSQLite} from "@/composables/useSQLite.js";
import {useThemeStore} from '@/stores/theme'
import {useLocaleStore} from '@/stores/locale'
import FileUploaderView from '@/components/FileUploaderView.vue'
import CoinListView from "@/components/CoinListView.vue";
import SettingsView from "@/components/SettingsView.vue";
import AboutView from "@/components/AboutView.vue";
import CoinView from "@/components/CoinView.vue";
import ImagesView from "@/components/ImagesView.vue";

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

const selectedFile = ref(null)
const coinsList = ref([])
let isOpened = false;
const title = ref('OpenNumismat')

const drawer = ref(false)

const router = useRouter()
const route = useRoute()

const themeStore = useThemeStore()
const theme = useTheme()
const localeStore = useLocaleStore()
const appLocale = useLocale()

onMounted(async () => {
  theme.change(themeStore.currentTheme)
  appLocale.current.value = localeStore.currentLocale

  await router.replace('/')
})

const handleFileUpload = async (file) => {
  if (!file)
    return;

  await openDatabase(file)

  selectedFile.value = file;
  isOpened = true;
  await router.replace('/')

  const sql = `
      SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
      FROM coins LEFT OUTER JOIN images ON images.id = coins.image
    `
  coinsList.value = await executeQuery(sql)
}
</script>

<template>
  <v-layout>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon v-if="route.name === 'home' || (route.name === 'open' && !isOpened)"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-nav-icon  v-else
        icon="mdi-chevron-left"
        @click="router.back()"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-cloud-upload"
          title="Open"
          value="open"
          @click="router.push('/open'); drawer = false"
          :active="route.name === 'open'"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          value="settings"
          @click="router.push('/settings'); drawer = false"
          :active="route.name === 'settings'"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-information"
          title="About"
          value="about"
          @click="router.push('about'); drawer = false"
          :active="route.name === 'about'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <FileUploaderView v-if="(route.name === 'home' && !isOpened) || route.name === 'open'"
        v-model:title="title" :onFileUploaded="handleFileUpload" />
      <KeepAlive>
        <CoinListView v-if="route.name === 'home' && isOpened"
          v-model:title="title" :file_name="selectedFile.name" :coins_list="coinsList" />
      </KeepAlive>
      <CoinView v-if="route.name === 'coin' && isOpened"
        v-model:title="title" />
      <ImagesView v-if="route.name === 'images' && isOpened" />
      <SettingsView v-model:title="title" v-if="route.name === 'settings'" />
      <AboutView v-model:title="title" v-if="route.name === 'about'" />
      <div v-if="status" class="status">{{ status }}</div>
    </v-main>
  </v-layout>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>

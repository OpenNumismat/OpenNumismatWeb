<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTheme} from 'vuetify'
import {useSQLite} from "@/composables/useSQLite.js";
import {appTitle} from "@/composables/appTitle.js";
import {useThemeStore} from '@/stores/theme'
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
const settingsDb = ref([])
let isOpened = false;

const drawer = ref(false)
const coinListViewRef = ref(null)

const router = useRouter()
const route = useRoute()

const themeStore = useThemeStore()
const theme = useTheme()

onMounted(async () => {
  theme.change(themeStore.currentTheme)

  await router.replace('/')
})

const handleFileUpload = async (file) => {
  if (!file)
    return;

  await openDatabase(file)

  selectedFile.value = file;
  isOpened = true;
  await router.replace('/')
  appTitle.pushTitle(file.name)

  const sql_settings = `
      SELECT * FROM settings
    `
  settingsDb.value = await executeQuery(sql_settings)

  const sql = `
      SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
      FROM coins LEFT OUTER JOIN images ON images.id = coins.image
    `
  coinsList.value = await executeQuery(sql)

  coinListViewRef.value.onOpenFile()
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon v-if="route.name === 'home' || (route.name === 'open' && !isOpened)"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-nav-icon  v-else
        icon="mdi-chevron-left"
        @click="router.back()"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ appTitle.title }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-cloud-upload"
          :title="$t('title_open')"
          value="open"
          @click="router.push('/open'); drawer = false"
          :active="route.name === 'open'"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cog"
          :title="$t('title_settings')"
          value="settings"
          @click="router.push('/settings'); drawer = false"
          :active="route.name === 'settings'"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-information"
          :title="$t('title_about')"
          value="about"
          @click="router.push('about'); drawer = false"
          :active="route.name === 'about'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <FileUploaderView v-if="(route.name === 'home' && !isOpened) || route.name === 'open'"
        :onFileUploaded="handleFileUpload" />
      <KeepAlive>
        <CoinListView v-if="route.name === 'home' && isOpened"
          :coins_list="coinsList" :settings="settingsDb"
          ref="coinListViewRef" />
      </KeepAlive>
      <CoinView v-if="route.name === 'coin' && isOpened" />
      <ImagesView v-if="route.name === 'images' && isOpened" />
      <SettingsView v-if="route.name === 'settings'" />
      <AboutView v-if="route.name === 'about'" />

      <div class="text-center">
        <v-overlay 
          v-model="isLoading" 
          class="align-center justify-center"
          persistent
        >
          <div class="d-flex flex-column align-center">
            <v-progress-circular
              color="primary"
              indeterminate
              size="64"
            ></v-progress-circular>
            <span class="mt-4 text-white">{{ status }}</span>
          </div>
        </v-overlay>
      </div>

    </v-main>
  </v-app>
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

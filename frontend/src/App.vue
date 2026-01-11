<script setup>
import {onMounted, ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTheme} from 'vuetify'
import {useSQLite} from "@/composables/useSQLite.js";
import {appTitle} from "@/composables/appTitle.js";
import FileUploaderView from '@/components/FileUploaderView.vue'
import CoinListView from "@/components/CoinListView.vue";
import SettingsView from "@/components/SettingsView.vue";
import AboutView from "@/components/AboutView.vue";
import CoinView from "@/components/CoinView.vue";
import ImagesView from "@/components/ImagesView.vue";
import i18n from './i18n'
import { currentTheme } from "@/composables/useSettings";

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

const selectedFile = ref(null)
const coinsList = ref([])
let isOpened = false;
const hasError = computed({
  get: () => error.value !== null,
  set: (_) => error.value = null,
})
const warning = ref(null)
const hasWarning = computed({
  get: () => warning.value !== null,
  set: (_) => warning.value = null,
})

const drawer = ref(false)
const coinListViewRef = ref(null)

const router = useRouter()
const route = useRoute()

const appTheme = useTheme()

onMounted(async () => {
  appTheme.change(currentTheme.value)

  await router.replace('/')
})

const collectionSettings = ref({})

const initSettings = async () => {
    collectionSettings.value = {};
    collectionSettings.value.version = 0;
    collectionSettings.value.password = '';
    collectionSettings.value.type = null;
    collectionSettings.value.convert_fraction = true;
    collectionSettings.value.enable_bc = true;
    collectionSettings.value.statuses = {
      'demo': 'demo',
      'pass': 'pass',
      'owned': 'owned',
      'ordered': 'ordered',
      'sold': 'sold',
      'sale': 'sale',
      'wish': 'wish',
      'missing': 'missing',
      'bidding': 'bidding',
      'duplicate': 'duplicate',
      'replacement': 'replacement',
  };
}

const checkDbVersion = async (settings) => {
    status.value = 'Check collection'

    if (settings.value.type !== 'OpenNumismat') {
      error.value = i18n.global.t('wrong_version');
      return false;
    }

    if (settings.value.version < 6) {
      error.value = i18n.global.t('too_old_version');
      return false;
    }
    else if (settings.value.version < 10) {
      warning.value = i18n.global.t('old_version');
    }
    else if (settings.value.version > 10) {
      warning.value = i18n.global.t('newest_version');
    }

    return true;
}

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
  const settingsDb = await executeQuery(sql_settings)

  await initSettings()

  settingsDb.forEach(function(elem) {
      if (elem[0] === 'Version')
          collectionSettings.value.version = Number(elem[1]);
      else if (elem[0] === 'Password')
          collectionSettings.value.password = elem[1];
      else if (elem[0] === 'Type')
          collectionSettings.value.type = elem[1];
      else if (elem[0] === 'convert_fraction')
          collectionSettings.value.convert_fraction = Boolean(elem[1]);
      else if (elem[0] === 'enable_bc')
          collectionSettings.value.enable_bc = Boolean(elem[1]);
      else {
        Object.keys(collectionSettings.value.statuses).forEach(key => {
          if (elem[0] === key + '_status_title')
            collectionSettings.value.statuses[key] = elem[1]
        })
      }
  })

  const versionValid = await checkDbVersion(collectionSettings);
  if (versionValid) {
    const sql = `
        SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
        FROM coins LEFT OUTER JOIN images ON images.id = coins.image
      `
    coinsList.value = await executeQuery(sql)

    coinListViewRef.value.onOpenFile()
  }
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
          :coins_list="coinsList" :settings="collectionSettings"
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
<!-- Alternative alert message
      <v-alert
        v-model="hasError"
        border="start"
        icon="$error"
        color="error"
        :title="status"
        variant="tonal"
        closable
        @click:close="hasError = false"
      >
        {{ error }}
      </v-alert>
-->
      <v-snackbar v-model="hasError" :timeout="15000" color="error" variant="tonal">
        <div class="text-subtitle-1 pb-2">{{ status }}</div>
        <p>{{ error }}</p>

        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="hasError = false"
          ></v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="hasWarning" :timeout="10000" color="warning" variant="tonal">
        <div class="text-subtitle-1 pb-2">{{ warning }}</div>

        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="hasWarning = false"
          ></v-btn>
        </template>
      </v-snackbar>

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

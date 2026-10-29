<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useDisplay, useTheme} from 'vuetify'
import {appTitle} from "@/composables/appTitle.js";
import FileUploaderView from '@/components/FileUploaderView.vue'
import CoinListView from "@/components/CoinListView.vue";
import SettingsView from "@/components/SettingsView.vue";
import AboutView from "@/components/AboutView.vue";
import CoinView from "@/components/CoinView.vue";
import ImagesView from "@/components/ImagesView.vue";
import SummaryView from "@/components/SummaryView.vue";
import {currentTheme, serverUrl, apiKey, currentLayout} from "@/composables/useSettings";
import PasswordDialog from '@/components/PasswordDialog.vue'
import FileServerView from "@/components/FileServerView.vue";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";
import {useService} from "@/composables/useService.js";
import UpdatedPrompt from "@/components/UpdatedPrompt.vue";
import i18n from "@/i18n";

const appVersion = import.meta.env.VITE_APP_VERSION;

const passwordDialog = ref()

const globalStatus = useGlobalStatus();
const service = useService(passwordDialog);
const isLoading = globalStatus.isLoading;
const hasError = globalStatus.hasError;
const hasWarning = globalStatus.hasWarning;

const isNativeApp = import.meta.env.VITE_PLATFORM_ANDROID;
const isServerLess = import.meta.env.VITE_SERVERLESS;
const serverVersion = ref(null)
const serverFileList = ref([])
const collectionSettings = ref({})
let isOpened = false;

const drawer = ref(false)
const coinListViewRef = ref(null)

const router = useRouter()
const route = useRoute()

const appTheme = useTheme()

const updateAddressBar = () => {
  const primaryColor = appTheme.current.value.colors.primary
  let metaTag = document.querySelector('meta[name="theme-color"]')
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = 'theme-color'
    document.head.appendChild(metaTag)
  }

  metaTag.setAttribute('content', primaryColor)
}

const refreshApp = async () => {
  if (coinListViewRef.value)
    coinListViewRef.value.clear()

  await router.replace('/');
  isOpened = false;

  if (await testServerConnection()) {
    serverFileList.value = await service.getServerFileList();
  }
}

const { mdAndUp } = useDisplay();
const isTabletView = computed(() => {
  return currentLayout.value === 'tablet' && mdAndUp.value;
});
watch(isTabletView, () => {
  refreshApp();
});
const isCoinDetailsPage = computed(() => !!coinListViewRef.value?.coinId);

const testServerConnection = async () => {
  if (isServerConfigured.value) {
    serverVersion.value = await service.getServerVersion();
    if (serverVersion.value !== null) {
      if (serverVersion.value !== appVersion) {
        globalStatus.warning.value = i18n.global.t('The server version is different from the application version');
      }

      return true;
    }
  }

  return false;
}

const isServerConfigured = computed(() => {
  if (isServerLess)
    return false;

  if (isNativeApp) {
    const serverUrl = localStorage.getItem('serverUrl');
    if (!serverUrl)
      return false;
  }

  return true;
});

const isServerAvailable = computed(() => {
  if (!isServerConfigured.value)
    return false;

  if (serverVersion.value === null)
    return false;

  return true;
});

watch(() => appTheme.global.name.value, updateAddressBar)

onMounted(async () => {
  appTheme.change(currentTheme.value)
  updateAddressBar();

  if (!isServerLess) {
    watch(serverUrl, async () => {
      await refreshApp();
    });
    watch(apiKey, async () => {
      await refreshApp();
    });
  }

  if (isNativeApp) {
    const { App } = await import('@capacitor/app');
    await App.addListener('backButton', ({ canGoBack }) => {
      if (router.currentRoute.value.name === 'home' || !canGoBack) {
        App.minimizeApp();
        // App.exitApp();
      } else {
        router.back();
      }
    });
  }

  await router.isReady()
  const urlParam = route.query.db

  await refreshApp();

  if (urlParam) {
    const dbUrl = decodeURIComponent(urlParam)
    await openFile(dbUrl, 'url')
  }
})

const openFile = async (file, connection_type) => {
  if (!file)
    return;

  if (coinListViewRef.value !== null)
    coinListViewRef.value.clear()

  const stopClearWatch = watch(coinListViewRef, (newVal) => {
    if (newVal) {
      coinListViewRef.value.clear()
    }
  })

  await router.replace('/')
  collectionSettings.value = {};
  isOpened = true;

  let ret = null

  if (connection_type === 'remote') {
    appTitle.pushTitle(file.replace(/\.db$/, ""))

    ret = await service.openRemoteFile(file);
  }
  else if (connection_type === 'local') {
    appTitle.pushTitle(file.name.replace(/\.db$/, ""))

    ret = await service.openLocalFile(file);
  }
  else if (connection_type === 'url') {
    const urlObj = new URL(file)
    appTitle.pushTitle(urlObj.pathname.split('/').pop().replace(/\.db$/, ""))

    ret = await service.openUrlFile(file);
  }

  if (ret) {
    collectionSettings.value = ret;

    await coinListViewRef.value.onOpenFile()
  }

  stopClearWatch()
}

const handleRemoteFileSelected = async (file) => {
  await openFile(file, 'remote')
}

const handleFileUpload = async (file) => {
  await openFile(file, 'local')
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
          v-if="isOpened"
          prepend-icon="mdi-text-box-outline"
          :title="$t('title_summary')"
          value="summary"
          @click="router.push('/summary'); drawer = false"
          :active="route.name === 'summary'"
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
        :onFileUploaded="handleFileUpload" class="mx-auto" />
      <FileServerView v-if="((route.name === 'home' && !isOpened) || route.name === 'open') && isServerAvailable"
        :file_list="serverFileList" :onFileSelected="handleRemoteFileSelected" class="mx-auto" />

      <!-- phone layout -->
      <template v-if="!isTabletView && isOpened">
        <KeepAlive>
          <CoinListView v-if="route.name === 'home'"
            :settings="collectionSettings"
            :isTabletView="false"
            ref="coinListViewRef" />
        </KeepAlive>
        <CoinView v-if="route.name === 'coin'"
          :settings="collectionSettings" />
      </template>
      <!-- tablet layout -->
      <KeepAlive v-if="isTabletView && isOpened">
        <v-container v-if="route.name === 'home'"
                     fluid class="pa-0">
          <v-row no-gutters>
            <v-col cols="12" md="4" class="border-end fill-height">
              <CoinListView :settings="collectionSettings"
                :isTabletView="true"
                ref="coinListViewRef" />
            </v-col>
            <v-col cols="12" md="8" v-if="isCoinDetailsPage">
              <CoinView :settings="collectionSettings" :coin_id="coinListViewRef.coinId" />
            </v-col>
          </v-row>
        </v-container>
      </KeepAlive>

      <SummaryView v-if="route.name === 'summary' && isOpened" />
      <ImagesView v-if="route.name === 'images' && isOpened" class="mx-auto" />
      <SettingsView v-if="route.name === 'settings'" />
      <AboutView v-if="route.name === 'about'" class="mx-auto" />

      <v-overlay
        v-model="isLoading"
        class="align-center justify-center"
        persistent
        location="center"
      >
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          ></v-progress-circular>
          <span class="mt-4 text-white">{{ globalStatus.status }}</span>
        </div>
      </v-overlay>

<!-- Alternative alert message
      <v-alert
        v-model="hasError"
        border="start"
        icon="$error"
        color="error"
        :title="globalStatus.status"
        variant="tonal"
        closable
        @click:close="globalStatus.clear()"
      >
        {{ error }}
      </v-alert>
-->
      <v-snackbar v-model="hasError" :timeout="15000" color="error" variant="tonal">
        <div class="text-subtitle-1 pb-2">{{ globalStatus.status }}</div>
        <p>{{ globalStatus.error }}</p>

        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="globalStatus.clear()"
          ></v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="hasWarning" :timeout="10000" color="warning" variant="tonal">
        <div class="text-subtitle-1 pb-2">{{ globalStatus.warning }}</div>

        <template v-slot:actions>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="globalStatus.clear()"
          ></v-btn>
        </template>
      </v-snackbar>

      <PasswordDialog ref="passwordDialog" />
      <UpdatedPrompt />

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

.mx-auto {
    margin-left: auto !important;
    margin-right: auto !important;
}
</style>

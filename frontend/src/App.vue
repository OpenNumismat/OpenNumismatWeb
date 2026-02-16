<script setup>
import {onMounted, ref, watch} from 'vue'
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
import { currentTheme } from "@/composables/useSettings";
import PasswordDialog from '@/components/PasswordDialog.vue'
import FileServerView from "@/components/FileServerView.vue";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";
import {useService} from "@/composables/useService.js";

const passwordDialog = ref()

useSQLite() // TODO: for call initialize?
const globalStatus = useGlobalStatus();
const service = useService(passwordDialog);
const isLoading = globalStatus.isLoading;
const hasError = globalStatus.hasError;
const hasWarning = globalStatus.hasWarning;

const isServerLess = import.meta.env.VITE_SERVERLESS;
const selectedFile = ref(null)
const serverFileList = ref([])
const coinsList = ref([])
const statusesList = ref([])
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

watch(() => appTheme.global.name.value, updateAddressBar)

onMounted(async () => {
  appTheme.change(currentTheme.value)
  updateAddressBar();

  await router.replace('/')

  if (isServerLess === undefined) {
    serverFileList.value = await service.getServerFileList();
  }
})

const handleRemoteFileSelected = async (file) => {
  if (!file)
    return;

  coinsList.value = [];
  selectedFile.value = file;
  isOpened = true;
  await router.replace('/')
  appTitle.pushTitle(file)

  const ret = await service.openRemoteFile(file);
  coinsList.value = ret.coinsList;
  collectionSettings.value = ret.collectionSettings;
  statusesList.value = ret.statusesList;

  coinListViewRef.value.onOpenFile()
}

const handleFileUpload = async (file) => {
  if (!file)
    return;

  coinsList.value = [];
  selectedFile.value = file;
  isOpened = true;
  await router.replace('/')
  appTitle.pushTitle(file.name)

  const ret = await service.openLocalFile(file);
  coinsList.value = ret.coinsList;
  collectionSettings.value = ret.collectionSettings;
  statusesList.value = ret.statusesList;

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
      <FileServerView v-if="((route.name === 'home' && !isOpened) || route.name === 'open') && !isServerLess"
        :file_list="serverFileList" :onFileSelected="handleRemoteFileSelected" />
      <KeepAlive>
        <CoinListView v-if="route.name === 'home' && isOpened"
          :coins_list="coinsList" :settings="collectionSettings" :statuses_list="statusesList"
          ref="coinListViewRef" />
      </KeepAlive>
      <CoinView v-if="route.name === 'coin' && isOpened"
        :settings="collectionSettings" />
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
            <span class="mt-4 text-white">{{ globalStatus.status }}</span>
          </div>
        </v-overlay>
      </div>
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

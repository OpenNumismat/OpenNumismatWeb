<script setup>
import {onMounted, ref, computed, watch} from 'vue'
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
import PasswordDialog from '@/components/PasswordDialog.vue'
import axios from 'axios'

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
const passwordDialog = ref()

const drawer = ref(false)
const coinListViewRef = ref(null)

const router = useRouter()
const route = useRoute()

const appTheme = useTheme()

const api = axios.create({
//  baseURL: 'http://localhost:5000',
  timeout: 5000,
})

onMounted(async () => {
  appTheme.change(currentTheme.value)

  await router.replace('/')

  isLoading.value = true
  error.value = null
  status.value = 'Open collection'

  try {
    const response = await api.get('/api/settings')
    collectionSettings.value = response.data
  }
  catch (err) {
    error.value = err
  }
  finally {
    isLoading.value = false
  }

  isLoading.value = true
  error.value = null
  status.value = 'Read collection'

  try {
    const response = await api.get('/api/coins')
    coinsList.value = response.data
  }
  catch (err) {
    error.value = err
  }
  finally {
    isLoading.value = false
  }

//  coinListViewRef.value.onOpenFile()
  isOpened = true;
})

const updateAddressBar = () => {
  const primaryColor = appTheme.current.value.colors.primary
  console.log(primaryColor)
  let metaTag = document.querySelector('meta[name="theme-color"]')
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = 'theme-color'
    document.head.appendChild(metaTag)
  }

  metaTag.setAttribute('content', primaryColor)
}

watch(() => appTheme.global.name.value, updateAddressBar)

const collectionSettings = ref({})

const fieldIds = {
  13: 'status',
  75: 'region',
  4: 'country',
  6: 'period',
  74: 'ruler',
  10: 'type',
  11: 'series',
  12: 'subjectshort',
  9: 'issuedate',
  5: 'year',
  25: 'mintage',
  14: 'material',
  7: 'mint',
  8: 'mintmark',
  20: 'grade',
  40: 'paydate',
  41: 'payprice',
  67: 'storage',
  83: 'condition',
  71: 'quantity',
}
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

  collectionSettings.value.fields = {};
  Object.values(fieldIds).forEach(field => {
    collectionSettings.value.fields[field] = field;
  })
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

function MD5(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()}function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

const checkDbPassword = async (settings) => {
  status.value = 'Check password'

  if (MD5('') !== settings.value.password) {
    const enteredPassword = await passwordDialog.value.promptPassword()
    if (enteredPassword && MD5(enteredPassword) === settings.value.password) {
      return true
    }
    else {
      error.value = 'Wrong password'
      return false
    }
  }

  return true
}

const handleFileUpload = async (file) => {
  if (!file)
    return;

  await openDatabase(file)

  selectedFile.value = file;
  isOpened = true;
  await router.replace('/')
  appTitle.pushTitle(file.name)

  coinsList.value = []

  const sql_settings = `SELECT * FROM settings`
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

  const field_sql = `SELECT id, title FROM fields WHERE id IN (${Object.keys(fieldIds)})`
  const fieldsDb = await executeQuery(field_sql)

  fieldsDb.forEach(function(elem) {
    const field = fieldIds[elem[0]]
    collectionSettings.value.fields[field] = elem[1]
  })

  const versionValid = await checkDbVersion(collectionSettings);
  if (versionValid) {
    const passwordValid = await checkDbPassword(collectionSettings)
    if (passwordValid) {
      const sql = `
          SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
          FROM coins LEFT OUTER JOIN images ON images.id = coins.image
        `
      coinsList.value = await executeQuery(sql)

      coinListViewRef.value.onOpenFile()
    }
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

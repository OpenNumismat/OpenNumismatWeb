<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import initSqlJs from 'sql.js';
import FileUploaderView from './components/FileUploaderView.vue'
import CoinListView from "@/components/CoinListView.vue";
import AboutView from "@/components/AboutView.vue";

const selectedFile = ref(null)
const coinsList = ref([])
let isOpened = false;
const title = ref('OpenNumismat')

const db = ref(null);
const status = ref('');

let SQL = null;

const drawer = ref(false)

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    status.value = 'SQL.js loaded successfully';
  } catch (err) {
    console.error('Failed to load SQL.js:', err);
    status.value = 'Failed to load SQL.js';
  }
});

const handleFileUpload = async (file) => {
  if (!file) return;

  status.value = 'Loading database...';
  router.replace('/')
  isOpened = true;
  selectedFile.value = file;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load database
      db.value = new SQL.Database(uint8Array);

      status.value = `Database loaded successfully: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

      const coins = db.value.exec(`
        SELECT coins.id, images.image, title, status, subjectshort, value, unit, year, mintmark, series, country
        FROM coins LEFT OUTER JOIN images on images.id = coins.image
      `);
      coinsList.value = coins.length > 0
        ? coins[0].values
        : [];

      selectedFile.value = file;
    } catch (err) {
      console.error('Error loading database:', err);
      status.value = 'Error loading database';
    }
  };

  reader.onerror = () => {
    status.value = `Error reading file`;
  };

  reader.readAsArrayBuffer(file);
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
          prepend-icon="mdi-information"
          title="About"
          value="about"
          @click="router.push('about'); drawer = false"
          :active="route.name === 'about'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div v-if="(route.name === 'home' && !isOpened) || route.name === 'open'">
        <FileUploaderView v-model:title="title" :onFileUploaded="handleFileUpload" />
      </div>
      <div v-if="route.name === 'home' && isOpened">
        <CoinListView v-model:title="title" :file_name="selectedFile.name" :coins_list="coinsList" />
      </div>
      <div v-if="route.name === 'about'">
        <AboutView v-model:title="title" />
      </div>
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

<script setup>
import { ref, onMounted } from 'vue'
import initSqlJs from 'sql.js';
import FileUploader from './components/FileUploader.vue'
import CoinList from "@/components/CoinList.vue";

const selectedFile = ref(null)
const coinsList = ref([])

const db = ref(null);
const status = ref('');

let SQL = null;

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const drawer = ref(false)

const goToHome = () => {
  router.push('/')
  drawer.value = false
}

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
};
</script>

<template>
  <v-layout>
    <v-app-bar color="primary" v-if="route.path === '/'">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>OpenNumismat</v-toolbar-title>
    </v-app-bar>
    <v-app-bar color="primary" v-else>
      <v-app-bar-nav-icon
        icon="mdi-chevron-left"
        @click.stop="goToHome()"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>About</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item
          prepend-icon="mdi-information"
          title="About"
          value="about"
          @click="router.push('/about')"
          :active="route.path === '/about'"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>

    <v-main v-if="route.path !== '/about'">
      <div v-if="!selectedFile" class="select-view">
        <FileUploader :handleFile="handleFileUpload" />
        <p>Your file not will be uploaded to the internet. You can disable internet connection.</p>
      </div>
      <div v-else class="file-view">
        <CoinList :file_name="selectedFile.name" :coins_list="coinsList" />
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

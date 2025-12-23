<script setup>
import { ref, onMounted } from 'vue'
import initSqlJs from 'sql.js';
import FileUploader from './components/FileUploader.vue'
import CoinList from "@/components/CoinList.vue";
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import Menubar from 'primevue/menubar';


const menuVisible = ref(false);
const menuItems = ref([
  { label: 'Home', icon: 'pi pi-home', to: '/' },
  { label: 'About', icon: 'pi pi-info-circle', to: '/about' },
]);

const selectedFile = ref(null)
const coinsList = ref([])

const db = ref(null);
const status = ref('');

let SQL = null;

const navigateTo = (path) => {
  menuVisible.value = false;
};

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
  <Menubar  class="p-menubar-fixed-top">
    <template #start>
        <Button icon="pi pi-bars" class="mr-2" severity="secondary"  @click="menuVisible = true" />
    </template>
  </Menubar>

  <Drawer v-model:visible="menuVisible">
    <div class="sidebar-content">
      <div class="menu-section">
        <div
          v-for="item in menuItems"
          :key="item.label"
          class="menu-item"
          @click="navigateTo(item.to)"
        >
          <i :class="item.icon" class="menu-icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </Drawer>

  <main>
    <div v-if="!selectedFile" class="select-view">
      <FileUploader :handleFile="handleFileUpload" />
      <p>Your file not will be uploaded to the internet. You can disable internet connection.</p>
    </div>
    <div v-else class="file-view">
      <CoinList :file_name="selectedFile.name" :coins_list="coinsList" />
    </div>
    <div v-if="status" class="status">{{ status }}</div>
  </main>
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

.p-menubar-fixed-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.menu-section {
  margin-bottom: 2rem;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 0.5rem;
}

.menu-item:hover {
  background-color: var(--surface-hover);
}

.menu-icon {
  margin-right: 0.75rem;
  color: var(--primary-color);
}

.content {
  padding: 1.5rem;
  background-color: var(--surface-ground);
  min-height: calc(100vh - 64px);
}
</style>

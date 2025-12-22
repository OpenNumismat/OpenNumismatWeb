<script setup>
import { ref, onMounted } from 'vue'
import initSqlJs from 'sql.js';
import FileUploader from './components/FileUploader.vue'
import CoinList from "@/components/CoinList.vue";

const selectedFile = ref(null)

const db = ref(null);
const status = ref('');

let SQL = null;

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

      const result = db.value.exec(`SELECT COUNT(*) FROM coins`);
      console.log(`Coins in database: ${result[0].values[0][0]}`);

      status.value = `Database loaded successfully: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;

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
  <main>
    <div v-if="!selectedFile" class="select-view">
      <FileUploader :handleFile="handleFileUpload" />
      <p>Your file not will be uploaded to the internet. You can disable internet connection.</p>
    </div>
    <div v-else class="file-view">
      <CoinList :file_name="selectedFile.name" />
    </div>
    <div v-if="status" class="status">{{ status }}</div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

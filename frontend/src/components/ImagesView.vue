<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useService} from "@/composables/useService.js";
import i18n from "@/i18n/index.js";
import {useGlobalStatus} from "@/composables/useGlobalStatus.js";

const route = useRoute()
const service = useService();
const globalStatus = useGlobalStatus();

const images = ref([])

onMounted(async () => {
  const coinId = route.params['id']
  images.value = [];

  const photos = await service.getPhotos(coinId);
  photos.forEach((photo) => {
    if (photo) {
      images.value.push(URL.createObjectURL(photo));
    }
  });
})

onUnmounted(async () => {
  images.value.forEach((img) => {
    URL.revokeObjectURL(img);
  });
  images.value = [];
})

const openImageInNewTab = (blobUrl) => {
  const newTab = window.open('', '_blank')

  if (!newTab) {
    globalStatus.warning.value = i18n.global.t('The browser has blocked a pop-up window. Please allow pop-up windows.')
    return
  }

  const style = newTab.document.createElement('style')
  style.textContent = `
    body {
      margin: 0;
      background-color: #121212;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
    }
  `
  newTab.document.head.appendChild(style)

  const img = newTab.document.createElement('img')
  img.src = blobUrl

  newTab.document.body.appendChild(img)
}
</script>

<template>
  <div v-for="image in images">
    <v-img :src="image" width="100%" class="cursor-pointer" @click="openImageInNewTab(image)" />
  </div>
</template>

<style scoped>

</style>

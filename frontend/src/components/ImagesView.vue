<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useService} from "@/composables/useService.js";

const route = useRoute()
const service = useService();

const images = ref([])

onMounted(async () => {
  const coinId = route.params['id']
  images.value = [];

  const photos = await service.getPhotos(coinId);
  photos.forEach((photo) => {
    if (photo) {
      if (photo instanceof Uint8Array) {
        photo = new Blob([photo], { type: 'image/webp' });
      }
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
</script>

<template>
  <div v-for="image in images">
    <v-img :src="image" width="100%" />
  </div>
</template>

<style scoped>

</style>

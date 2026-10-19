<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useService} from "@/composables/useService.js";
import { VueZoomable } from 'vue-zoomable'
import 'vue-zoomable/dist/style.css'

const route = useRoute()
const service = useService();

const images = ref([])
const isOpen = ref(false)
const selectedImage = ref()

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

const openLightbox = (image) => {
  selectedImage.value = image
  isOpen.value = true
}
</script>

<template>
  <v-container class="pa-0">
    <div v-for="(image, idx) in images" :key="idx" class="mb-4">
      <v-img
        :src="image"
        width="100%"
        class="cursor-pointer"
        @click="openLightbox(image)"
      />
    </div>

    <v-dialog
      v-model="isOpen"
      fullscreen
      transition="dialog-bottom-transition"
      scrim="black"
      rounded="0"
    >
      <v-card class="bg-black d-flex flex-column justify-center align-center position-relative w-100 h-100 overflow-hidden" rounded="0">

        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          class="position-absolute top-0 right-0 ma-4"
          style="z-index: 100;"
          @click="isOpen = false"
        ></v-btn>

        <vue-zoomable
          v-if="isOpen"
          class="w-100 h-100 d-flex justify-center align-center"
          :maxZoom="5"
          :minZoom="1"
          :enableControlButton="false"
          zoom-origin="content-center"
        >
          <img
            :src="selectedImage"
            style="max-width: 100%; max-height: 100vh; object-fit: contain;"
            alt="Zoomable Image"
          />
        </vue-zoomable>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>

<script setup>
import { onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import {useService} from "@/composables/useService.js";

const route = useRoute()
const service = useService();

const images = ref([])

onMounted(async () => {
  const id = route.params['id']
  images.value = await service.getPhotos(id);
})
</script>

<template>
  <div v-for="image in images">
    <v-img :src="arrayBufferToBase64(image)" width="100%" />
  </div>
</template>

<style scoped>

</style>

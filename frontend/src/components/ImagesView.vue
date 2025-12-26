<script setup>
import { onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useSQLite} from "@/composables/useSQLite.js";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"

const route = useRoute()

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

const images = ref([])

onMounted(async () => {
  const id = route.params['id']
  const sql = `SELECT obverseimg.image, reverseimg.image, edgeimg.image, photo1.image, photo2.image, photo3.image, photo4.image FROM coins
        LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
        LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
        LEFT JOIN photos AS edgeimg ON coins.edgeimg = edgeimg.id
        LEFT JOIN photos AS photo1 ON coins.photo1 = photo1.id
        LEFT JOIN photos AS photo2 ON coins.photo2 = photo2.id
        LEFT JOIN photos AS photo3 ON coins.photo3 = photo3.id
        LEFT JOIN photos AS photo4 ON coins.photo4 = photo4.id
        WHERE coins.id=?`
  const results = await executeQuery(sql, [id,])
  images.value = results[0]
})
</script>

<template>
  <div v-for="image in images">
    <v-img :src="arrayBufferToBase64(image)" width="100%" />
  </div>
</template>

<style scoped>

</style>

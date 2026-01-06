<script setup>
import {onMounted, onUnmounted} from "vue"
import {useRoute} from "vue-router"
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"

const props = defineProps({
  onFileUploaded: Function,
});

const route = useRoute()
let titleChanged = false

onMounted(async () => {
  if (route.name === 'open') {
    titleChanged = true
    appTitle.pushTitle(i18n.global.t('title_open'))
  }
})
onUnmounted(async () => {
  if (titleChanged)
    appTitle.popTitle()
})

function onFileChange(event) {
  console.log('Selected files:', event.target.files);

  if (props.onFileUploaded) {
    props.onFileUploaded(event.target.files[0]);
  }
}
</script>

<template>
  <v-container>
    <v-file-upload density="default" accept=".db" @change="onFileChange"></v-file-upload>
    <p>{{ $t('uploading_safety_warranty') }}</p>
  </v-container>
</template>

<style scoped>

</style>

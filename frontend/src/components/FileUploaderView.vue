<script setup>
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const props = defineProps({
  onFileUploaded: Function,
});

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
    <p>Your file not will be uploaded to the internet. You can disable internet connection.</p>
  </v-container>
</template>

<style scoped>

</style>

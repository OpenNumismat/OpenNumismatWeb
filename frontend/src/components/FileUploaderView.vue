<script setup>
import {onMounted, onUnmounted} from "vue";
import {useRoute} from "vue-router";
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const props = defineProps({
  title: String,
  onFileUploaded: Function,
});

const emit = defineEmits(['update:title']);
let oldTitle = null;

const route = useRoute()

onMounted(async () => {
  oldTitle = props.title;
  if (route.name === 'open')
    emit('update:title', 'Open File');
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
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
    <p>Your file not will be uploaded to the internet. You can disable internet connection.</p>
  </v-container>
</template>

<style scoped>

</style>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  handleFile: Function,
});

const handleFileUpload = (event) => {
  if (props.handleFile) {
    // TODO: Check file extension here

    props.handleFile(event.target.files[0]);
  }
}
</script>

<template>
  <label for="file-input" class="btn">
    Select an OpenNumismat collection file (*.db):
  </label>
  <input id="file-input" type="file" @change="handleFileUpload">
</template>

<style scoped>

</style>

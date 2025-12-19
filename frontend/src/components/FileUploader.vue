<script setup>
const handleFileUpload = (event) => {
  console.log(event.target.files);
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

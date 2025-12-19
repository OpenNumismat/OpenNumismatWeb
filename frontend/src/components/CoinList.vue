<script setup>
import { defineProps } from 'vue';

defineProps({
  file_name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h2 class="file-name">{{ file_name }}</h2>
</template>

<style scoped>

</style>

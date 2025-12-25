<script setup>
import {defineProps, onMounted, onUnmounted} from "vue";

const appVersion = import.meta.env.VITE_APP_VERSION;

const props = defineProps({
  title: String,
});
const emit = defineEmits(['update:title']);
let oldTitle = null;

onMounted(async () => {
  oldTitle = props.title;
  emit('update:title', 'About');
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
})
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>OpenNumismat Web {{ appVersion }}</v-card-title>
      <v-card-text>
        <p>Copyright (C) 2025 Vitaly Ignatov</p>
        <p>OpenNumismat Web is freeware licensed under a GPLv3</p>
        <p>Homepage: https://opennumismat.github.io</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>

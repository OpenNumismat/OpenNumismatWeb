<script setup>
const appVersion = import.meta.env.VITE_APP_VERSION;
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

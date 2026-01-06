<script setup>
import {onMounted, onUnmounted} from "vue";
import i18n from '../i18n'
import {appTitle} from "@/composables/appTitle.js"

const appVersion = import.meta.env.VITE_APP_VERSION;

onMounted(async () => {
  appTitle.pushTitle(i18n.global.t('title_about'))
})
onUnmounted(async () => {
  appTitle.popTitle()
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

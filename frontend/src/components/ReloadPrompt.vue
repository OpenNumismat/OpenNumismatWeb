<template>
  <v-snackbar
    v-model="needRefresh"
    :timeout="-1"
    color="info"
    vertical
  >
    {{ i18n.global.t('New version is available') }}

    <template v-slot:actions>
      <v-btn variant="text" @click="updateServiceWorker()">{{ i18n.global.t('Update') }}</v-btn>
      <v-btn variant="text" @click="close">{{ i18n.global.t('Close') }}</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'
import i18n from "@/i18n/index.js";

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = () => {
  needRefresh.value = false
}
</script>

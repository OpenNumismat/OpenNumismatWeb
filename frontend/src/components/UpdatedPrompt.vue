<template>
  <v-snackbar
    v-model="updatedToast"
    :timeout="5000"
    color="info"
    vertical
  >
    {{ i18n.global.t('New version is available') }}

    <template v-slot:actions>
      <v-btn variant="text" @click="location.reload()">{{ i18n.global.t('Update') }}</v-btn>
      <v-btn variant="text" @click="close">{{ i18n.global.t('Close') }}</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import i18n from "@/i18n/index.js";

const updatedToast = ref(false)

const { updateServiceWorker } = useRegisterSW({
  onServiceWorkerUpdated() {
    updatedToast.value = true
  }
})

const close = () => {
  updatedToast.value = false
}
</script>

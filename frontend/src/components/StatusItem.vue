<script setup>
import { statusPresentation } from "@/composables/useSettings";

const props = defineProps(['status', 'statuses'])
</script>

<template>
  <template v-if="statusPresentation === 'icon'">
    <v-img :src="`${props.status}.png`" :width="16" />
  </template>
  <template v-if="statusPresentation === 'text'">
    {{ statuses[props.status] }}
  </template>
  <template v-if="statusPresentation === 'full'">
    <v-img :src="`${props.status}.png`" :width="16" class="mr-1" />
    {{ statuses[props.status] }}
  </template>
</template>

<style scoped>

</style>

<script setup>
import { useStatusStore } from '@/stores/status'

const statusStore = useStatusStore()

const props = defineProps(['status',])
</script>

<template>
  <template v-if="statusStore.currentStatusView === 'icon'">
    <v-img :src="`/${props.status}.png`" :width="16" />
  </template>
  <template v-if="statusStore.currentStatusView === 'text'">
    {{ props.status }}
  </template>
  <template v-if="statusStore.currentStatusView === 'full'">
    <v-img :src="`${props.status}.png`" :width="16" />
    {{ props.status }}
  </template>
</template>

<style scoped>

</style>

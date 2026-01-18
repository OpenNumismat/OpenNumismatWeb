<script setup>

const props = defineProps(['status', 'statuses', 'statusPresentation', 'class'])
</script>

<template>
  <template v-if="statusPresentation === 'icon'">
    <v-img :src="`${props.status}.png`" :width="16" />
  </template>
  <template v-if="statusPresentation === 'text'">
    {{ statuses[props.status] }}
  </template>
  <template v-if="statusPresentation === 'full'">
    <v-row align="center" no-gutters>
      <v-col cols="auto">
        <v-img :src="`${props.status}.png`" width="16"></v-img>
      </v-col>
      <v-col class="ps-2" :class="$attrs.class">
        {{ statuses[props.status] }}
      </v-col>
    </v-row>
  </template>
</template>

<style scoped>

</style>

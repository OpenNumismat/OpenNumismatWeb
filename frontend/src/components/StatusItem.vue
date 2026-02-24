<script setup>

const props = defineProps(['status', 'statuses', 'statusPresentation', 'class'])
</script>

<template>
  <template v-if="statusPresentation === 'icon'">
    <v-img :src="`${status}.png`" :width="16" />
  </template>
  <template v-if="statusPresentation === 'text'">
    {{ statuses[status] }}
  </template>
  <template v-if="statusPresentation === 'icon_text'">
    <v-row align="center" no-gutters>
      <v-col cols="auto">
        <v-img :src="`${status}.png`" width="16"></v-img>
      </v-col>
      <v-col class="ps-2" :class="props.class">
        {{ statuses[status] }}
      </v-col>
    </v-row>
  </template>
  <template v-if="statusPresentation === 'text_icon'">
    <v-row align="center" no-gutters>
      <v-col class="pe-2" :class="props.class">
        {{ statuses[status] }}
      </v-col>
      <v-col cols="auto">
        <v-img :src="`${status}.png`" width="16"></v-img>
      </v-col>
    </v-row>
  </template>
</template>

<style scoped>

</style>

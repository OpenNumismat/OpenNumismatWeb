<template>
  <template v-if="value || $slots.default">
    <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
      {{ title }}
    </v-col>

    <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
      <slot>{{ value }}</slot>
    </v-col>
  </template>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: null
  }
})
</script>

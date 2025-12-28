<script setup>
import {onMounted, onUnmounted} from "vue";

const props = defineProps({
  title: String,
});
const emit = defineEmits(['update:title']);
let oldTitle = null;

onMounted(async () => {
  oldTitle = props.title;
  emit('update:title', 'Settings');
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
})
</script>

<template>
  <v-container>
    <v-list>
      <v-list-item>
        <v-btn-toggle
          rounded="xl"
          border
        >
          <v-btn icon="mdi-weather-night"></v-btn>
          <v-btn icon="mdi-brightness-auto"></v-btn>
          <v-btn icon="mdi-weather-sunny"></v-btn>
        </v-btn-toggle>
      </v-list-item>
      <v-list-item>
        <v-select
          :items="['English',]"
        ></v-select>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

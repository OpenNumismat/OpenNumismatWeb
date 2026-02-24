<script setup>
import {ref} from "vue";
import i18n from "@/i18n/index.js";

const props = defineProps(['filters', 'field', 'settings'])
const emit = defineEmits(['filterChanged'])
const selectedFilter = defineModel()

const isMenuOpen = ref(false)

const onFilterChanged = async (val) => {
  emit('filterChanged', props.field, val)
}

const onFilterClear = async () => {
  isMenuOpen.value = false
  selectedFilter.value = null
  emit('filterChanged', props.field, null)
}
</script>

<template>
  <v-select v-if="filters.length > 1"
    v-model="selectedFilter"
    :label="settings.fields[field]"
    :items="filters"
    :item-title="item => settings.statuses[item]"
    @update:modelValue="onFilterChanged"
    return-object
    v-model:menu="isMenuOpen"
  >
    <template v-slot:prepend-item>
      <v-list-item :title="i18n.global.t('All')" @click="onFilterClear"></v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
</template>

<style scoped>

</style>

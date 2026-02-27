<script setup>
import i18n from "@/i18n/index.js";

const items = ['title', 'status', 'country', 'series', 'type', 'period']

const props = defineProps(['filters', 'settings'])
const emit = defineEmits(['sortByChanged'])
const sortedBy = defineModel()

const onChanged = async (val) => {
  emit('sortByChanged', val)
}
</script>

<template>
  <v-select v-if="filters.length > 1"
    v-model="sortedBy"
    :items="items"
    :label="i18n.global.t('Sort by')"
    :item-title="item => settings.fields[item]"
    @update:modelValue="onChanged"
    return-object
  ></v-select>
</template>

<style scoped>

</style>

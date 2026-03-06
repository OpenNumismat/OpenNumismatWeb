<script setup>
import StatusItem from "@/components/StatusItem.vue";

const props = defineProps(['filters', 'field', 'settings'])
const emit = defineEmits(['filterChanged'])
const selectedFilter = defineModel()

const onFilterChanged = async (val) => {
  emit('filterChanged', props.field, val)
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
    clearable
    density="comfortable"
    inputmode="none"
  >
    <template v-slot:selection="{ item }" v-if="field === 'status'">
      <StatusItem :status="item" :statuses="settings.statuses" statusPresentation="icon_text" />
    </template>
    <template v-slot:item="{ props, item }" v-if="field === 'status'">
      <v-list-item v-bind="props" title="">
        <StatusItem :status="item" :statuses="settings.statuses" statusPresentation="icon_text" />
      </v-list-item>
    </template>
  </v-select>
</template>

<style scoped>

</style>

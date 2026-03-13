<script setup>
import i18n from "@/i18n/index.js";

const props = defineProps(['fields', 'settings'])
const emit = defineEmits(['sortByChanged'])
const sortedBy = defineModel()
const isReverse = defineModel('reverse')

const onChanged = async (val) => {
  emit('sortByChanged', val)
}
</script>

<template>
  <v-row align="center" density="compact" v-if="fields.length > 0 && settings.type">
    <v-col class="mr-4">
      <v-select
        v-model="sortedBy"
        :items="fields"
        :label="i18n.global.t('Sort by')"
        :item-title="item => settings.fields[item]"
        @update:modelValue="onChanged"
        return-object
        clearable
        density="comfortable"
        inputmode="none"
        hide-details
      ></v-select>
    </v-col>

    <v-col cols="auto">
      <v-btn-toggle v-model="isReverse" @update:modelValue="onChanged" mandatory>
        <v-btn :value="false" icon="mdi-sort-ascending"></v-btn>
        <v-btn :value="true" icon="mdi-sort-descending"></v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>

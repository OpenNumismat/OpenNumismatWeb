<script setup>
const props = defineProps({
  file_list: {
    type: Array,
    required: true,
  },
  onFileSelected: Function,
});

function onFileSelected(file) {
  console.log('Selected file:', file);

  if (props.onFileSelected) {
    props.onFileSelected(file);
  }
}
</script>

<template>
  <v-container>
    <v-list>
      <v-list-item
        v-for="file in file_list"
        :title="file"
        @click="onFileSelected(file)"
      ></v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

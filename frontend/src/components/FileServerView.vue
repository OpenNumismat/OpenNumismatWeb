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
    <v-card>
      <v-card-title>Select server file</v-card-title>
        <v-list>
          <template v-for="file in file_list">
            <v-divider ></v-divider>
            <v-list-item
                :title="file"
                @click="onFileSelected(file)"
            ></v-list-item>
          </template>
        </v-list>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>

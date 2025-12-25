<script setup>
import {defineProps, onMounted, onUnmounted} from "vue";

const props = defineProps({
  title: String,
  file_name: {
    type: String,
    required: true,
  },
  coins_list: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:title']);
let oldTitle = null;

onMounted(async () => {
  oldTitle = props.title;
  emit('update:title', props.file_name);
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
})

function arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  const base64String = window.btoa( binary );
  return `data:image/png;base64,${base64String}`;
}

function generateDescription( coin_data ) {
  let desc = [];
  if (coin_data[4])
    desc.push(coin_data[4]);
  if (coin_data[5] || coin_data[6])
    desc.push(coin_data[5] + ' ' + coin_data[6]);
  if (coin_data[10])
    desc.push(coin_data[10]);
  if (coin_data[7]) {
    desc.push(coin_data[7]);
  }
  if (coin_data[8])
    desc.push(coin_data[8]);
  if (coin_data[9])
    desc.push(coin_data[9]);

  return desc;
}
</script>

<template>
  <div>
    <table>
      <tr v-for="coin_data in coins_list">
        <td class="image" :data-id="coin_data[0]"><img :src="arrayBufferToBase64(coin_data[1])"></td>
        <td class="data">
          <div class="title">
            {{ coin_data[2] }}&nbsp;
          </div>
          <div class="description">
            {{ generateDescription(coin_data).join(', ') }}&nbsp;
          </div>
        </td>
        <td>{{ coin_data[3] }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

</style>

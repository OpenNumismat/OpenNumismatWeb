<script setup>
import {onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"

const router = useRouter()

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
  <v-container>
    <v-list lines="two">
      <v-list-item
        v-for="coin in coins_list"
        :key="coin[0]"
        :subtitle="generateDescription(coin).join(', ')"
        :title="coin[2]"
        @click="router.push('/coin/' + coin[0])"
      >
        <template v-slot:prepend>
          <v-img :src="arrayBufferToBase64(coin[1])" :width="100" />
        </template>
        <template v-slot:append>
          {{ coin[3] }}
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

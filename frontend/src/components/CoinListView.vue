<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import StatusItem from "./StatusItem.vue"

const router = useRouter()

const props = defineProps({
  coins_list: {
    type: Array,
    required: true,
  },
  settings: {
    type: Array,
    required: true,
  },
});

const statuses = ref({
  'demo': 'demo',
  'pass': 'pass',
  'owned': 'owned',
  'ordered': 'ordered',
  'sold': 'sold',
  'sale': 'sale',
  'wish': 'wish',
  'missing': 'missing',
  'bidding': 'bidding',
  'duplicate': 'duplicate',
  'replacement': 'replacement',
})

onMounted(async () => {
})
onUnmounted(async () => {
})

const onOpenFile = () => {
  props.settings.forEach((val) => {
    Object.keys(statuses.value).forEach(key => {
      if (val[0] === key + '_status_title')
        statuses.value[key] = val[1]
    })
  })
}

defineExpose({
  onOpenFile
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
          <StatusItem :status="coin[3]" :statuses="statuses"/>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>

</style>

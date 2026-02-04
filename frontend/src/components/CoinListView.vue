<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import StatusItem from "./StatusItem.vue"
import { imagePresentation, statusPresentation } from "@/composables/useSettings";
import {convertFraction, formatYear} from "@/utils/formatter.js";
import {useService} from "@/composables/useService.js";

const router = useRouter()
const service = useService();

const images = ref([])

const props = defineProps({
  coins_list: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
})
onUnmounted(async () => {
})

const onOpenFile = () => {
  images.value = new Array(props.coins_list.length).fill('')
}

defineExpose({
  onOpenFile
})

function generateDescription( coin_data ) {
  let desc = [];
  if (coin_data[4])
    desc.push(coin_data[4]);
  if (coin_data[5] || coin_data[6])
    desc.push(convertFraction(props.settings.convert_fraction, coin_data[5]) + ' ' + coin_data[6]);
  if (coin_data[10])
    desc.push(coin_data[10]);
  if (coin_data[7]) {
    desc.push(formatYear(props.settings.enable_bc, coin_data[7]));
  }
  if (coin_data[8])
    desc.push(coin_data[8]);
  if (coin_data[9])
    desc.push(coin_data[9]);

  return desc;
}

const loadImage = async (index, coinId) => {
  images.value[index] = await service.loadImage(coinId, imagePresentation.value);
}
</script>

<template>
  <v-container class="pa-0 ma-0">
    <v-list lines="two">
      <v-list-item
        v-for="(coin, index) in coins_list"
        :key="coin[0]"
        :subtitle="generateDescription(coin).join(', ')"
        :title="coin[2]"
        @click="router.push('/coin/' + coin[0])"
        class="pa-1"
      >
        <template v-slot:prepend v-if="imagePresentation === 'obverse'">
          <v-lazy :width="56">
            <v-img :src="images[index]" :width="56" max-height="56" :tmp="loadImage(index, coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else-if="imagePresentation === 'reverse'">
          <v-lazy :width="56">
            <v-img :src="images[index]" :width="56" max-height="56" :tmp="loadImage(index, coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else-if="imagePresentation === 'both'">
          <v-lazy :width="100">
            <v-img :src="images[index]" :width="100" max-height="56" :tmp="loadImage(index, coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else>
          <v-img :src="arrayBufferToBase64(coin[1])" :width="100" max-height="56" />
        </template>
        <template v-slot:append>
          <StatusItem :status="coin[3]" :statuses="settings.statuses" :statusPresentation="statusPresentation" />
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>
:deep(.v-list-item__spacer) {
  width: 6px !important;
}
</style>

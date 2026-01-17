<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import StatusItem from "./StatusItem.vue"
import {useSQLite} from "@/composables/useSQLite.js"
import { imagePresentation } from "@/composables/useSettings";

const router = useRouter()

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

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

function convertFraction(value) {
  if (props.settings.convert_fraction) {
    if (value == 0.02)
        return '1⁄48'
    else if (value == 0.04)
        return '1⁄24';
    else if (value == 0.05)
        return '1⁄20'
    else if (value == 0.06)
        return '1⁄16';
    else if (value == 0.08)
        return '1⁄12';
    else if (value == 0.1)
        return '⅒';
    else if (value == 0.12)
        return '⅛';
    else if (value == 0.16)
        return '⅙';
    else if (value == 0.2)
        return '⅕';
    else if (value == 0.25)
        return '¼';
    else if (value == 0.33)
        return '⅓';
    else if (value == 0.5)
        return '½';
    else if (value == 0.66)
        return '⅔';
    else if (value == 0.75)
        return '¾';
    else if (value == 1.25)
        return '1¼';
    else if (value == 1.5)
        return '1½';
    else if (value == 2.5)
        return '2½';
    else if (value == 4.5)
        return '4½';
    else if (value == 7.5)
        return '7½';
    else if (value == 12.5)
        return '12½';
  }

  return value;
}

function generateDescription( coin_data ) {
  let desc = [];
  if (coin_data[4])
    desc.push(coin_data[4]);
  if (coin_data[5] || coin_data[6])
    desc.push(convertFraction(coin_data[5]) + ' ' + coin_data[6]);
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

const images = ref([])

const loadImage = async (index, coinId) => {
  let sql
  if (imagePresentation.value === 'obverse') {
    sql = `SELECT obverseimg.image FROM coins
        LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
        WHERE coins.id=?`
  }
  else if (imagePresentation.value === 'reverse') {
    sql = `SELECT reverseimg.image FROM coins
        LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
        WHERE coins.id=?`
  }
  else {
    sql = `SELECT obverseimg.image, reverseimg.image FROM coins
        LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
        LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
        WHERE coins.id=?`
  }

  const results = await executeQuery(sql, [coinId,])
  let img
  if (imagePresentation.value === 'both') {
    const maxHeight = 54*4 // Step-down scaling for better quality
    let aspectRatio
    let img1 = null, img2 = null
    let newWidth1 = 0, newWidth2 = 0

    if (results[0][0]) {
      const b64_img1 = arrayBufferToBase64(results[0][0])
      img1 = new Image()
      img1.src = b64_img1
      await img1.decode()
      aspectRatio = img1.naturalWidth / img1.naturalHeight
      newWidth1 = maxHeight * aspectRatio
    }

    if (results[0][1]) {
      const b64_img2 = arrayBufferToBase64(results[0][1])
      img2 = new Image()
      img2.src = b64_img2
      await img2.decode()
      aspectRatio = img2.naturalWidth / img2.naturalHeight
      newWidth2 = maxHeight * aspectRatio
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = newWidth1 + newWidth2
    canvas.height = maxHeight
    if (img1)
      ctx.drawImage(img1, 0, 0, newWidth1, maxHeight)
    if (img2)
      ctx.drawImage(img2, newWidth1, 0, newWidth2, maxHeight)
    img = canvas.toDataURL('image/png')
  }
  else {
    img = arrayBufferToBase64(results[0][0])
  }

  images.value[index] = img
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
          <StatusItem :status="coin[3]" :statuses="settings.statuses"/>
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

<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import StatusItem from "./StatusItem.vue"
import { imagePresentation, statusPresentation } from "@/composables/useSettings";
import {convertFraction, formatYear} from "@/utils/formatter.js";
import {useService} from "@/composables/useService.js";
import FilterItem from "@/components/FilterItem.vue";
import SortItem from "@/components/SortItem.vue";
import i18n from "@/i18n/index.js";

const router = useRouter()
const service = useService();

const images = ref({})
const coinsList = ref([])
const searchVal = ref(null)
const sortedBy = ref(null)
const reverseSort = ref(false)
const selectedStatus = ref(null)
const selectedCountry = ref(null)
const selectedYear = ref(null)
const selectedSeries = ref(null)
const selectedType = ref(null)
const selectedPeriod = ref(null)
const selectedMint = ref(null)
const fields = ref([])

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  filters: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  watch(imagePresentation,async () => {
    images.value = {}
    if (imagePresentation.value === 'image' && props.settings.type) {
      const coin_images = await service.loadImages()
      coin_images.forEach((coin_image) => {
        images.value[coin_image[0]] = coin_image[1];
      });
    }
  })
})
onUnmounted(async () => {
})

const onOpenFile = async () => {
  images.value = {};
  coinsList.value = await service.loadCoins()
  if (imagePresentation.value === 'image') {
    const coin_images = await service.loadImages()
    coin_images.forEach((coin_image) => {
      images.value[coin_image[0]] = coin_image[1];
    });
  }

  fields.value = ['title',]
  if (props.filters['status'].length > 1)
    fields.value.push('status')
  if (props.filters['country'].length > 1)
    fields.value.push('country')
  if (props.filters['year'].length > 1)
    fields.value.push('year')
  if (props.filters['series'].length > 1)
    fields.value.push('series')
  if (props.filters['type'].length > 1)
    fields.value.push('type')
  if (props.filters['period'].length > 1)
    fields.value.push('period')
}

const clear = async () => {
  searchVal.value = null
  sortedBy.value = null
  reverseSort.value = false
  selectedStatus.value = null
  selectedCountry.value = null
  selectedYear.value = null
  selectedSeries.value = null
  selectedType.value = null
  selectedPeriod.value = null
  selectedMint.value = null
  coinsList.value = []
}

defineExpose({
  onOpenFile,
  clear
})

function generateDescription( coin_data ) {
  let desc = [];
  if (coin_data[3])
    desc.push(coin_data[3]);
  if (coin_data[4] || coin_data[5])
    desc.push(convertFraction(props.settings.convert_fraction, coin_data[4]) + ' ' + coin_data[5]);
  if (coin_data[9])
    desc.push(coin_data[9]);
  if (coin_data[6]) {
    desc.push(formatYear(props.settings.enable_bc, coin_data[6]));
  }
  if (coin_data[7])
    desc.push(coin_data[7]);
  if (coin_data[8])
    desc.push(coin_data[8]);

  return desc;
}

const onChanged = async () => {
  coinsList.value = []
  coinsList.value = await service.loadCoins(
      searchVal.value,
      sortedBy.value,
      reverseSort.value,
      selectedStatus.value,
      selectedCountry.value,
      selectedYear.value,
      selectedSeries.value,
      selectedType.value,
      selectedPeriod.value,
      selectedMint.value
  );
}

const loadImage = async (coinId) => {
  if (coinId in images.value)
    return;

  images.value[coinId] = await service.loadImage(coinId, imagePresentation.value);
}
</script>

<template>
  <v-container>
    <SortItem :fields="fields" :settings="settings" @sort-by-changed="onChanged" v-model="sortedBy" v-model:reverse="reverseSort" />
  </v-container>

  <v-container>
    <FilterItem :filters="filters['status']" field="status" :settings="settings" @filter-changed="onChanged" v-model="selectedStatus" />
    <FilterItem :filters="filters['country']" field="country" :settings="settings" @filter-changed="onChanged" v-model="selectedCountry" />
    <FilterItem :filters="filters['year']" field="year" :settings="settings" @filter-changed="onChanged" v-model="selectedYear" />
    <FilterItem :filters="filters['series']" field="series" :settings="settings" @filter-changed="onChanged" v-model="selectedSeries" />
    <FilterItem :filters="filters['type']" field="type" :settings="settings" @filter-changed="onChanged" v-model="selectedType" />
    <FilterItem :filters="filters['period']" field="period" :settings="settings" @filter-changed="onChanged" v-model="selectedPeriod" />
    <FilterItem :filters="filters['mint']" field="mint" :settings="settings" @filter-changed="onChanged" v-model="selectedMint" />
  </v-container>

  <v-container v-if="coinsList.length > 0">
    <v-text-field
        v-model="searchVal"
        :label="i18n.global.t('Search')"
        @change="onChanged"
        @click:clear="onChanged"
        @keydown.enter="$event.target.blur()"
        clearable
        density="comfortable"
        hide-details
    />
  </v-container>

  <v-container class="pa-0 ma-0">
    <v-list lines="two">
      <v-list-item
        v-for="(coin, index) in coinsList"
        :key="coin[0]"
        :subtitle="generateDescription(coin).join(', ')"
        :title="coin[1]"
        @click="router.push('/coin/' + coin[0])"
        class="pa-1"
      >
        <template v-slot:prepend v-if="imagePresentation === 'obverse'">
          <v-lazy :width="56">
            <v-img :src="images[coin[0]]" :width="56" max-height="56" :tmp="loadImage(coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else-if="imagePresentation === 'reverse'">
          <v-lazy :width="56">
            <v-img :src="images[coin[0]]" :width="56" max-height="56" :tmp="loadImage(coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else-if="imagePresentation === 'both'">
          <v-lazy :width="100">
            <v-img :src="images[coin[0]]" :width="100" max-height="56" :tmp="loadImage(coin[0])" />
          </v-lazy>
        </template>
        <template v-slot:prepend v-else>
          <v-img :src="arrayBufferToBase64(images[coin[0]])" :width="100" max-height="56" />
        </template>
        <template v-slot:append>
          <StatusItem :status="coin[2]" :statuses="settings.statuses" :statusPresentation="statusPresentation" />
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

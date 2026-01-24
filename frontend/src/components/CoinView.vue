<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useSQLite} from "@/composables/useSQLite.js";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import {appTitle} from "@/composables/appTitle.js"
import i18n from '../i18n'
import StatusItem from "./StatusItem.vue"
import {convertFraction, formatYear} from "@/utils/formatter.js";

const router = useRouter()
const route = useRoute()

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

const coinData = ref([])

const infoFields = ['coins.title', 'obverseimg.image', 'reverseimg.image',
    'status', 'region', 'country', 'period', 'ruler', 'value', 'unit', 'type',
    'series', 'subjectshort', 'issuedate', 'year', 'mintage', 'material',
    'mint', 'mintmark', 'features', 'subject', 'grade', 'paydate', 'payprice',
    'storage', 'condition', 'quantity'];
function infoFieldIndex(field) {
  return infoFields.findIndex(element => element === field);
}

onMounted(async () => {
  const id = route.params['id']
  const sql = `SELECT ${ infoFields.join(',') } FROM coins
      LEFT JOIN photos AS obverseimg ON coins.obverseimg = obverseimg.id
      LEFT JOIN photos AS reverseimg ON coins.reverseimg = reverseimg.id
      WHERE coins.id=?`
  const results = await executeQuery(sql, [id,])
  coinData.value = results[0]

  appTitle.pushTitle(coinData.value[0])
})
onUnmounted(async () => {
  appTitle.popTitle()
})
</script>

<template>
  <v-container>
    <v-row>
      <div class="text-h5">{{ coinData[0] }}</div>
    </v-row>
    <v-row>
      <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('obverseimg.image')])"
            width="150"
            @click="router.push('/images/' + route.params['id'])" />
      <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('reverseimg.image')])"
            width="150"
            @click="router.push('/images/' + route.params['id'])" />
    </v-row>
  </v-container>

  <v-container>
    <dl>
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['status'] }}</dt>
            <dd class="v-col-sm-9">
              <StatusItem :status="coinData[infoFieldIndex('status')]" :statuses="settings.statuses" statusPresentation="full" class="font-weight-bold" />
            </dd>
            <template v-if="coinData[infoFieldIndex('region')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['region'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('region')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('country')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['country'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('country')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('period')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['period'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('period')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('ruler')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['ruler'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('ruler')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('value')] || coinData[infoFieldIndex('unit')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ i18n.global.t('Denomination') }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">
                {{ convertFraction(props.settings.convert_fraction, coinData[infoFieldIndex('value')]) }}
                {{ coinData[infoFieldIndex('unit')] }}
              </dd>
            </template>
            <template v-if="coinData[infoFieldIndex('type')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['type'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('type')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('series')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['series'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('series')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('subjectshort')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['subjectshort'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('subjectshort')] }}</dd>
            </template>

            <template v-if="coinData[infoFieldIndex('issuedate')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['issuedate'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.d(coinData[infoFieldIndex('issuedate')]) }}</dd>
            </template>
            <template v-else-if="coinData[infoFieldIndex('year')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['year'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ formatYear(props.settings.enable_bc, coinData[infoFieldIndex('year')]) }}</dd>
            </template>

            <template v-if="coinData[infoFieldIndex('mintage')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mintage'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.n(coinData[infoFieldIndex('mintage')]) }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('material')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['material'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('material')] }}</dd>
            </template>

            <template v-if="coinData[infoFieldIndex('mint')] && coinData[infoFieldIndex('mintmark')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mint'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('mint')] }} ({{ coinData[infoFieldIndex('mintmark')] }})</dd>
            </template>
            <template v-else-if="coinData[infoFieldIndex('mint')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mint'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('mint')] }}</dd>
            </template>
            <template v-else-if="coinData[infoFieldIndex('mintmark')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mintmark'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('mintmark')] }}</dd>
            </template>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row no-gutters>
            <template v-if="coinData[infoFieldIndex('grade')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['grade'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('grade')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('paydate')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['paydate'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.d(coinData[infoFieldIndex('paydate')]) }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('payprice')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['payprice'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.n(coinData[infoFieldIndex('payprice')]) }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('storage')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['storage'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('storage')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('condition')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['condition'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('condition')] }}</dd>
            </template>
            <template v-if="coinData[infoFieldIndex('quantity')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['quantity'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[infoFieldIndex('quantity')] }}</dd>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </dl>
  </v-container>

  <v-container>
    <p>{{ coinData[infoFieldIndex('features')] }}</p>
    <p>{{ coinData[infoFieldIndex('subject')] }}</p>
  </v-container>
</template>

<style scoped>

</style>

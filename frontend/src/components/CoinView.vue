<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useSQLite} from "@/composables/useSQLite.js";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import {appTitle} from "@/composables/appTitle.js"
import i18n from '../i18n'
import StatusItem from "./StatusItem.vue"

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
      <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('obverseimg.image')])"
            :width="200"
            @click="router.push('/images/' + route.params['id'])" />
      <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('reverseimg.image')])"
            :width="200"
            @click="router.push('/images/' + route.params['id'])" />
    </v-row>

    <v-container>
      <dl class="v-row pt-3">
        <dt class="v-col-sm-3 pa-0">{{ settings.fields['status'] }}</dt>
        <dd class="v-col-sm-9 pa-0">
          <StatusItem :status="coinData[infoFieldIndex('status')]" :statuses="settings.statuses" statusPresentation="full" class="font-weight-bold" />
        </dd>
        <template v-if="coinData[infoFieldIndex('region')]">
          <dt class="v-col-sm-3 pa-0">{{ settings.fields['region'] }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('region')] }}</dd>
        </template>
        <template v-if="coinData[infoFieldIndex('country')]">
          <dt class="v-col-sm-3 pa-0">{{ settings.fields['country'] }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('country')] }}</dd>
        </template>
        <template v-if="coinData[infoFieldIndex('period')]">
          <dt class="v-col-sm-3 pa-0">{{ settings.fields['period'] }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('period')] }}</dd>
        </template>
        <template v-if="coinData[infoFieldIndex('ruler')]">
          <dt class="v-col-sm-3 pa-0">{{ settings.fields['ruler'] }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('ruler')] }}</dd>
        </template>
        <template v-if="coinData[infoFieldIndex('value')] || coinData[infoFieldIndex('unit')]">
          <dt class="v-col-sm-3 pa-0">{{ i18n.global.t('Denomination') }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('value')] }}&nbsp;{{ coinData[infoFieldIndex('unit')] }}</dd>
        </template>
        <template v-if="coinData[infoFieldIndex('type')]">
          <dt class="v-col-sm-3 pa-0">{{ settings.fields['type'] }}</dt>
          <dd class="v-col-sm-9 pa-0 font-weight-bold">{{ coinData[infoFieldIndex('type')] }}</dd>
        </template>
      </dl>

      <v-row>
      <p>{{ coinData[infoFieldIndex('features')] }}</p>
      <p>{{ coinData[infoFieldIndex('subject')] }}</p>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>

</style>

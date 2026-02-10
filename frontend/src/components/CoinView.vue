<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import {appTitle} from "@/composables/appTitle.js"
import i18n from '../i18n'
import StatusItem from "./StatusItem.vue"
import {convertFraction, formatYear} from "@/utils/formatter.js";
import {useService} from "@/composables/useService.js";

const router = useRouter()
const route = useRoute()
const service = useService();

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
});

const coinData = ref([])

onMounted(async () => {
  const id = route.params['id']
  coinData.value = await service.getDetails(id)

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
      <v-img :src="arrayBufferToBase64(coinData[service.infoFieldIndex('obverseimg.image')])"
            width="150"
            @click="router.push('/images/' + route.params['id'])" />
      <v-img :src="arrayBufferToBase64(coinData[service.infoFieldIndex('reverseimg.image')])"
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
              <StatusItem :status="coinData[service.infoFieldIndex('status')]" :statuses="settings.statuses" statusPresentation="icon_text" class="font-weight-bold" />
            </dd>
            <template v-if="coinData[service.infoFieldIndex('region')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['region'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('region')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('country')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['country'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('country')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('period')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['period'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('period')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('ruler')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['ruler'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('ruler')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('value')] || coinData[service.infoFieldIndex('unit')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ i18n.global.t('Denomination') }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">
                {{ convertFraction(props.settings.convert_fraction, coinData[service.infoFieldIndex('value')]) }}
                {{ coinData[service.infoFieldIndex('unit')] }}
              </dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('type')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['type'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('type')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('series')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['series'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('series')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('subjectshort')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['subjectshort'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('subjectshort')] }}</dd>
            </template>

            <template v-if="coinData[service.infoFieldIndex('issuedate')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['issuedate'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.d(coinData[service.infoFieldIndex('issuedate')]) }}</dd>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('year')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['year'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">
                {{ formatYear(props.settings.enable_bc, coinData[service.infoFieldIndex('year')]) }}
              </dd>
            </template>

            <template v-if="coinData[service.infoFieldIndex('mintage')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mintage'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.n(coinData[service.infoFieldIndex('mintage')]) }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('material')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['material'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('material')] }}</dd>
            </template>

            <template v-if="coinData[service.infoFieldIndex('mint')] && coinData[service.infoFieldIndex('mintmark')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mint'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">
                {{ coinData[service.infoFieldIndex('mint')] }} ({{ coinData[service.infoFieldIndex('mintmark')] }})
              </dd>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('mint')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mint'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('mint')] }}</dd>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('mintmark')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['mintmark'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('mintmark')] }}</dd>
            </template>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row no-gutters>
            <template v-if="coinData[service.infoFieldIndex('grade')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['grade'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('grade')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('paydate')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['paydate'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.d(coinData[service.infoFieldIndex('paydate')]) }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('payprice')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['payprice'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ i18n.global.n(coinData[service.infoFieldIndex('payprice')]) }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('storage')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['storage'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('storage')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('condition')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['condition'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('condition')] }}</dd>
            </template>
            <template v-if="coinData[service.infoFieldIndex('quantity')]">
              <dt class="v-col-sm-3 text-medium-emphasis">{{ settings.fields['quantity'] }}</dt>
              <dd class="v-col-sm-9 font-weight-bold">{{ coinData[service.infoFieldIndex('quantity')] }}</dd>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </dl>
  </v-container>

  <v-container>
    <p>{{ coinData[service.infoFieldIndex('features')] }}</p>
    <p>{{ coinData[service.infoFieldIndex('subject')] }}</p>
  </v-container>
</template>

<style scoped>

</style>

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
  <v-container class="pa-1">
    <v-row density="compact">
      <div class="text-headline-small pb-1">{{ coinData[0] }}</div>
    </v-row>
    <v-row density="compact" class="photos">
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
      <v-row density="compact">
        <v-col cols="12" md="6">
          <v-row density="compact">
            <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
              {{ settings.fields['status'] }}
            </v-col>
            <v-col tag="dd" cols="12" sm="9">
              <StatusItem :status="coinData[service.infoFieldIndex('status')]" :statuses="settings.statuses" statusPresentation="icon_text" class="font-weight-bold" />
            </v-col>
            <template v-if="coinData[service.infoFieldIndex('region')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['region'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('region')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('country')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['country'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('country')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('period')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['period'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('period')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('ruler')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['ruler'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('ruler')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('value')] || coinData[service.infoFieldIndex('unit')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ i18n.global.t('Denomination') }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ convertFraction(props.settings.convert_fraction, coinData[service.infoFieldIndex('value')]) }}
                {{ coinData[service.infoFieldIndex('unit')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('type')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['type'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('type')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('series')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['series'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('series')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('subjectshort')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['subjectshort'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('subjectshort')] }}
              </v-col>
            </template>

            <template v-if="coinData[service.infoFieldIndex('issuedate')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['issuedate'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('issuedate')] }}
              </v-col>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('year')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['year'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ formatYear(props.settings.enable_bc, coinData[service.infoFieldIndex('year')]) }}
              </v-col>
            </template>

            <template v-if="coinData[service.infoFieldIndex('mintage')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['mintage'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('mintage')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('material')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['material'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('material')] }}
              </v-col>
            </template>

            <template v-if="coinData[service.infoFieldIndex('mint')] && coinData[service.infoFieldIndex('mintmark')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['mint'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('mint')] }} ({{ coinData[service.infoFieldIndex('mintmark')] }})
              </v-col>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('mint')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['mint'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('mint')] }}
              </v-col>
            </template>
            <template v-else-if="coinData[service.infoFieldIndex('mintmark')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['mintmark'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('mintmark')] }}
              </v-col>
            </template>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row density="compact">
            <template v-if="coinData[service.infoFieldIndex('grade')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['grade'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('grade')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('paydate')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['paydate'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('paydate')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('payprice')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['payprice'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('payprice')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('storage')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['storage'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('storage')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('condition')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['condition'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('condition')] }}
              </v-col>
            </template>
            <template v-if="coinData[service.infoFieldIndex('quantity')]">
              <v-col tag="dt" cols="12" sm="3" class="text-medium-emphasis">
                {{ settings.fields['quantity'] }}
              </v-col>
              <v-col tag="dd" cols="12" sm="9" class="font-weight-bold">
                {{ coinData[service.infoFieldIndex('quantity')] }}
              </v-col>
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
.v-row--density-compact {
    --v-col-gap-x: 8px;
    --v-col-gap-y: 0px;
}
.photos {
  --v-col-gap-x: 4px;
  --v-col-gap-y: 4px;
}
</style>

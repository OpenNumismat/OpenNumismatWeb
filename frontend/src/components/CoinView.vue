<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {arrayBufferToBase64} from "@/utils/bytes2img.js"
import {appTitle} from "@/composables/appTitle.js"
import i18n from '../i18n'
import StatusItem from "./StatusItem.vue"
import {convertFraction, convertLinksToAnchors, formatYear} from "@/utils/formatter.js";
import {useService} from "@/composables/useService.js";
import InfoRow from "@/components/InfoRow.vue";

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
            <InfoRow :title="settings.fields['status']">
              <StatusItem :status="coinData[service.infoFieldIndex('status')]" :statuses="settings.statuses" statusPresentation="icon_text" class="font-weight-bold" />
            </InfoRow>
            <InfoRow
              :title="settings.fields['region']"
              :value="coinData[service.infoFieldIndex('region')]"
            />
            <InfoRow
              :title="settings.fields['country']"
              :value="coinData[service.infoFieldIndex('country')]"
            />
            <InfoRow
              :title="settings.fields['period']"
              :value="coinData[service.infoFieldIndex('period')]"
            />
            <InfoRow
              :title="settings.fields['ruler']"
              :value="coinData[service.infoFieldIndex('ruler')]"
            />
            <InfoRow
                v-if="coinData[service.infoFieldIndex('value')] || coinData[service.infoFieldIndex('unit')]"
                :title="i18n.global.t('Denomination')"
            >
              {{ convertFraction(props.settings.convert_fraction, coinData[service.infoFieldIndex('value')]) }}
              {{ coinData[service.infoFieldIndex('unit')] }}
            </InfoRow>
            <InfoRow
              :title="settings.fields['type']"
              :value="coinData[service.infoFieldIndex('type')]"
            />
            <InfoRow
              :title="settings.fields['series']"
              :value="coinData[service.infoFieldIndex('series')]"
            />
            <InfoRow
              :title="settings.fields['subjectshort']"
              :value="coinData[service.infoFieldIndex('subjectshort')]"
            />

            <InfoRow
                v-if="coinData[service.infoFieldIndex('issuedate')]"
                :title="i18n.global.t('Issuedate')"
            >
              {{ i18n.global.d(coinData[service.infoFieldIndex('issuedate')]) }}
            </InfoRow>
            <InfoRow
                v-else-if="coinData[service.infoFieldIndex('year')]"
                :title="i18n.global.t('year')"
            >
              {{ formatYear(props.settings.enable_bc, coinData[service.infoFieldIndex('year')]) }}
            </InfoRow>

            <InfoRow
              v-if="coinData[service.infoFieldIndex('mintage')]"
              :title="settings.fields['mintage']"
              :value="i18n.global.n(coinData[service.infoFieldIndex('mintage')])"
            />
            <InfoRow
              :title="settings.fields['material']"
              :value="coinData[service.infoFieldIndex('material')]"
            />

            <InfoRow
                v-if="coinData[service.infoFieldIndex('mint')] && coinData[service.infoFieldIndex('mintmark')]"
                :title="settings.fields['mint']"
            >
              {{ coinData[service.infoFieldIndex('mint')] }} ({{ coinData[service.infoFieldIndex('mintmark')] }})
            </InfoRow>
            <InfoRow
                v-else-if="coinData[service.infoFieldIndex('mint')]"
                :title="settings.fields['mint']"
            >
              {{ coinData[service.infoFieldIndex('mint')] }}
            </InfoRow>
            <InfoRow
                v-else-if="coinData[service.infoFieldIndex('mintmark')]"
                :title="settings.fields['mintmark']"
            >
              {{ coinData[service.infoFieldIndex('mintmark')] }}
            </InfoRow>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-row density="compact">
            <InfoRow
              :title="settings.fields['grade']"
              :value="coinData[service.infoFieldIndex('grade')]"
            />
            <InfoRow
              v-if="coinData[service.infoFieldIndex('paydate')]"
              :title="settings.fields['paydate']"
              :value="i18n.global.d(coinData[service.infoFieldIndex('paydate')])"
            />
            <InfoRow
              v-if="coinData[service.infoFieldIndex('payprice')]"
              :title="settings.fields['payprice']"
              :value="i18n.global.n(coinData[service.infoFieldIndex('payprice')])"
            />
            <InfoRow
              :title="settings.fields['storage']"
              :value="coinData[service.infoFieldIndex('storage')]"
            />
            <InfoRow
              :title="settings.fields['condition']"
              :value="coinData[service.infoFieldIndex('condition')]"
            />
            <InfoRow
              :title="settings.fields['quantity']"
              :value="coinData[service.infoFieldIndex('quantity')]"
            />
          </v-row>
        </v-col>
      </v-row>
    </dl>
  </v-container>

  <v-container>
    <p v-html="convertLinksToAnchors(coinData[service.infoFieldIndex('features')])"></p>
    <p v-html="convertLinksToAnchors(coinData[service.infoFieldIndex('subject')])"></p>
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

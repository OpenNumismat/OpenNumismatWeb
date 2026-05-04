<script setup>
import {useService} from "@/composables/useService.js";
import {onMounted, ref} from "vue";
import i18n from "@/i18n/index.js";
import { dSys, nSys } from '@/utils/formatter'

const service = useService();

const summary = ref({})

onMounted(async () => {
  summary.value = await service.getSummary()
})
</script>

<template>
  <v-container>
    {{ i18n.global.t('Total count') }}: {{ nSys(summary.total_count) }}<br>
    <template v-if="summary.count_owned">
      {{ i18n.global.t('Count owned') }}: {{ nSys(summary.count_owned) }}<br>
    </template>
    <template v-if="summary.count_wish">
      {{ i18n.global.t('Count wish') }}: {{ nSys(summary.count_wish) }}<br>
    </template>
    <template v-if="summary.count_sold">
      {{ i18n.global.t('Count sales') }}: {{ nSys(summary.count_sold) }}<br>
    </template>
    <template v-if="summary.count_bidding">
      {{ i18n.global.t('Count biddings') }}: {{ nSys(summary.count_bidding) }}<br>
    </template>
    <template v-if="summary.count_missing">
      {{ i18n.global.t('Count missing') }}: {{ nSys(summary.count_missing) }}<br>
    </template>
    <template v-if="summary.paid">
      {{ i18n.global.t('Paid') }}: {{ nSys(summary.paid) }}
      <template v-if="summary.paid_without_commission">
        ({{ i18n.global.t('commission') }}:
        {{ Math.round((summary.paid - summary.paid_without_commission) / summary.paid_without_commission * 100) }}%)
      </template>
      <br>
      <template v-if="summary.count_owned">
        {{ i18n.global.t('Average paid per item') }}:
        {{ nSys(summary.paid/summary.count_owned, { maximumFractionDigits: 2 }) }}
        <br>
      </template>
    </template>
    <template v-if="summary.first_purchase">
      {{ i18n.global.t('First purchase') }}: {{ dSys(summary.first_purchase) }}<br>
    </template>
  </v-container>
</template>

<style scoped>

</style>
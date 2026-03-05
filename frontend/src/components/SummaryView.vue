<script setup>
import {useService} from "@/composables/useService.js";
import {onMounted, ref} from "vue";
import i18n from "@/i18n/index.js";

const service = useService();

const summary = ref({})

onMounted(async () => {
  summary.value = await service.getSummary()
})
</script>

<template>
  <v-container>
    {{ i18n.global.t('Total count') }}: {{ summary.total_count }}<br>
    <template v-if="summary.count_owned">
      {{ i18n.global.t('Count owned') }}: {{ summary.count_owned }}<br>
    </template>
    <template v-if="summary.count_wish">
      {{ i18n.global.t('Count wish') }}: {{ summary.count_wish }}<br>
    </template>
    <template v-if="summary.count_sold">
      {{ i18n.global.t('Count sales') }}: {{ summary.count_sold }}<br>
    </template>
    <template v-if="summary.count_bidding">
      {{ i18n.global.t('Count biddings') }}: {{ summary.count_bidding }}<br>
    </template>
    <template v-if="summary.count_missing">
      {{ i18n.global.t('Count missing') }}: {{ summary.count_missing }}<br>
    </template>
    <template v-if="summary.paid">
      {{ i18n.global.t('Paid') }}: {{ i18n.global.n(summary.paid) }}
      <template v-if="summary.paid_without_commission">
        ({{ i18n.global.t('commission') }}:
        {{ Math.round((summary.paid - summary.paid_without_commission) / summary.paid_without_commission * 100) }}%)
      </template>
      <br>
      <template v-if="summary.count_owned">
        {{ i18n.global.t('Average paid per item') }}:
        {{ i18n.global.n(summary.paid/summary.count_owned, { maximumFractionDigits: 2 }) }}
        <br>
      </template>
    </template>
    <template v-if="summary.first_purchase">
      {{ i18n.global.t('First purchase') }}: {{ i18n.global.d(summary.first_purchase) }}<br>
    </template>
  </v-container>
</template>

<style scoped>

</style>
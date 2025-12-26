<script setup>
import {defineProps, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useSQLite} from "@/composables/useSQLite.js";

const route = useRoute()

const {isLoading,
    error,
    status,
    openDatabase,
    executeQuery} = useSQLite()

const props = defineProps({
  title: String,
});

const emit = defineEmits(['update:title']);
let oldTitle = null;
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

  oldTitle = props.title;
  emit('update:title', coinData.value[0]);
})
onUnmounted(async () => {
  emit('update:title', oldTitle);
})

function arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  const base64String = window.btoa( binary );
  return `data:image/png;base64,${base64String}`;
}
</script>

<template>
  <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('obverseimg.image')])" :width="200" />
  <v-img :src="arrayBufferToBase64(coinData[infoFieldIndex('reverseimg.image')])" :width="200" />
  {{ coinData[infoFieldIndex('status')] }}
  {{ coinData[infoFieldIndex('country')] }}
  {{ coinData[infoFieldIndex('type')] }}

  {{ coinData[infoFieldIndex('features')] }}
  {{ coinData[infoFieldIndex('subject')] }}
</template>

<style scoped>

</style>

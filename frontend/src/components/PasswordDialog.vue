<template>
  <v-dialog v-model="showDialog" width="400">
    <v-card>
      <v-card-title>Enter password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputPassword"
          type="password"
          label="Password"
          @keyup.enter="submit"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="submit">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const showDialog = ref(false)
const inputPassword = ref('')

let resolveFn = null

const promptPassword = () => {
  showDialog.value = true
  inputPassword.value = ''
  
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

const submit = () => {
  showDialog.value = false
  if (resolveFn) {
    resolveFn(inputPassword.value)
  }
}

const cancel = () => {
  showDialog.value = false
  if (resolveFn) {
    resolveFn(null)
  }
}

defineExpose({ promptPassword })
</script>

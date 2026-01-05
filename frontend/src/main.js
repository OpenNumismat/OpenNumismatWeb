import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import colors from 'vuetify/util/colors'
import { md3 } from 'vuetify/blueprints'
import { useI18n } from 'vue-i18n'

// Components
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.orange.lighten1,
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.orange.darken2,
        }
      }
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')

import {
  bg as vuetify_bg,
  ca as vuetify_ca,
  de as vuetify_de,
  el as vuetify_el,
  en as vuetify_en,
  es as vuetify_es,
  fa as vuetify_fa,
  fr as vuetify_fr,
  it as vuetify_it,
  nl as vuetify_nl,
  pl as vuetify_pl,
  pt as vuetify_pt,
  ru as vuetify_ru,
  tr as vuetify_tr,
  uk as vuetify_uk,
} from 'vuetify/locale'
import { createI18n } from 'vue-i18n'
import en from './en.json'
import ru from './ru.json'

const languageList = {
  'bg': 'Български',
  'ca': 'Català',
  'de': 'Deutsch',
  'en': 'English',
  'el': 'Ελληνικά',
  'es': 'Español',
  'fa': 'فارسی',
  'fr': 'Français',
  'it': 'Italiano',
  'nl': 'Nederlands',
  'pl': 'Polski',
  'pt': 'Português',
  'ru': 'Русский',
  'tr': 'Türkçe',
  'uk': 'Український',
}

en['$vuetify'] = { ...vuetify_en }
ru['$vuetify'] = { ...vuetify_ru }

let messages = {
    en, ru,
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
//  silentFallbackWarn: true,
//  silentTranslationWarn: true,
  messages: messages,
})

export default i18n

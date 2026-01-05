import { createI18n } from 'vue-i18n'
import {
  bg as vuetify_bg,
  de as vuetify_de,
  en as vuetify_en,
  es as vuetify_es,
  it as vuetify_it,
  nl as vuetify_nl,
  pt as vuetify_pt,
  ru as vuetify_ru,
  tr as vuetify_tr,
  uk as vuetify_uk,
} from 'vuetify/locale'
import bg from './bg.json'
import de from './de.json'
import en from './en.json'
import es from './es.json'
import it from './it.json'
import nl from './nl.json'
import pt from './pt.json'
import ru from './ru.json'
import tr from './tr.json'
import uk from './uk.json'

export const languageList = {
  'bg': 'Български',
  'de': 'Deutsch',
  'en': 'English',
  'es': 'Español',
  'it': 'Italiano',
  'nl': 'Nederlands',
  'pt': 'Português',
  'ru': 'Русский',
  'tr': 'Türkçe',
  'uk': 'Український',
}

bg['$vuetify'] = { ...vuetify_bg }
de['$vuetify'] = { ...vuetify_de }
en['$vuetify'] = { ...vuetify_en }
es['$vuetify'] = { ...vuetify_es }
it['$vuetify'] = { ...vuetify_it }
nl['$vuetify'] = { ...vuetify_nl }
pt['$vuetify'] = { ...vuetify_pt }
ru['$vuetify'] = { ...vuetify_ru }
tr['$vuetify'] = { ...vuetify_tr }
uk['$vuetify'] = { ...vuetify_uk }

let messages = {
    bg, de, en, es, it, nl, pt, ru, tr, uk,
}

const currentLocale = () => localStorage.locale
    || languageList[navigator.language] && navigator.language
    || languageList[navigator.language.substring(0, 2)] && navigator.language.substring(0, 2)
    || "en"

export function setLocale(locale) {
//  i18n.global.locale.value = locale
  localStorage.locale = locale
  document.documentElement.lang = locale
}

const i18n = createI18n({
  locale: currentLocale(),
  fallbackLocale: 'en',
  legacy: false,
//  silentFallbackWarn: true,
//  silentTranslationWarn: true,
  messages: messages,
})

export default i18n

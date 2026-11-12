import myConfig from './app/config'
import customjson from './assets/custom.json?raw'
{
  const patch: any = JSON.parse(customjson)
  for(const p in patch) (myConfig as any)[p] = patch[p]
}

import langFr from 'quasar/lang/fr'
import langEn from 'quasar/lang/en-GB'
const locales:any = { fr: langFr, en: langEn }
for (const lo of myConfig.LANGOPTIONS) if (lo.value !== 'en') (lo as any)['props'] = locales[lo.value]

import { createApp } from 'vue'
// @ts-expect-error
import Quasar from 'quasar/src/vue-plugin.js'

import { createPinia } from 'pinia'

import { createI18n } from 'vue-i18n'
import en from './i18n/en'
import fr from './i18n/fr'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: en, fr: fr }
})

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// A few examples for animations from Animate.css:
// import '@quasar/extras/animate/fadeIn.css'
// import '@quasar/extras/animate/fadeOut.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'

const myApp = createApp(App)
myApp.provide('appConfig', myConfig)

import { QBtn, QSelect, QDialog, QCard, QToolbar, QToolbarTitle,
  
 } from 'quasar'

myApp.use(createPinia())

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    framework: {
      components: [QBtn, QSelect ]
    }
  }
})

myApp.use(i18n)

try {
myApp.mount('#app')
} catch(e) {
  console.log(e)
}

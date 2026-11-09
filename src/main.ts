

import { createApp } from 'vue'
// @ts-expect-error
import Quasar from 'quasar/src/vue-plugin.js'
import { createPinia } from 'pinia'

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

myApp.use(createPinia())

// @ts-expect-error
import components from './myComponents.js'

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    framework: {
      components: components
    }
  }
})

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

myApp.use(i18n)

myApp.mount('#app')

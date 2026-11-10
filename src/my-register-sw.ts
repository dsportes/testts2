import { register } from 'register-service-worker'

import myConfig from './app/config'
import customjson from './assets/custom.json?raw'
{
  const patch: any = JSON.parse(customjson)
  for(const p in patch) (myConfig as any)[p] = patch[p]
}

const encoder = new TextEncoder()

function urlFromText (text: string, type?: string) : string {
  const blob = new Blob([encoder.encode(text)], { type: type || 'text/html' })
  return URL.createObjectURL(blob)
}

const NODUPSTART = myConfig.NODUPSTART
const DEBUG = myConfig.DEBUG
const DUPBYE = (myConfig.DUPBYE as any)[myConfig.LANG]

export let myRegistration = null
export let _onAppUpdate: Function
export function setOnAppUpdate(f: any) {
  _onAppUpdate = f
}
export let _onSwMessage: Function
export function setOnSwMessage(f: any) {
  _onSwMessage = f
}
export let _onPushMessage: Function
export function setOnPushMessage(f: any) {
  _onPushMessage = f
}

console.log('Register SW ...')

// Traite les messages émis par le SW
navigator.serviceWorker.onmessage = async (message) => {
  try {
    if (message.data) { // { type:, payload: }
      if (message.data.type === 'STOP') {
        window.location.href = urlFromText(DUPBYE)
      } else if (message.data.type === 'PUSH') {
        if (DEBUG)
          console.log('Notification received by web-push')
        if (_onPushMessage)
          await _onPushMessage(message.data.payload)
      } else {
        if (message.data.type === 'LOG') {
          console.log(`Log reçu dans App envoyé par SW: ${message.data.payload}`);
        } else if (_onSwMessage)
          _onSwMessage(message.data)
      }
    }
  } catch (e: any) {
    console.log(e)
  }
}

/*
En dev, vite génère un dv-sw.js?dev-sw en guise de service-worker script.
Mais celui-ci contient des 'import': il faut forcer les options d'enregistrement avec { type:'module' }
qui sont à indiquer dans 'registrationOptions.
*/
const sw = import.meta.env.MODE === 'production' ? './my-sw.js' : '/dev-sw.js?dev-sw'

register(
  sw, 
  {
    registrationOptions: { type: 'module' },
    registered (registration: any) {
      myRegistration = registration
      const ok = myRegistration ? 'ok' : 'KO'
      console.log('Service worker is registered: ', ok)
    },

    ready (registration: any) {
      myRegistration = registration
      const ok = myRegistration ? 'ok' : 'KO'
      console.log('Service worker is active: ', ok)
      if (NODUPSTART) registration.active.postMessage({ type: 'STARTING' })
    },

    updated (/* registration */) {
      console.log('Service worker is UPDATED.')
      if (_onAppUpdate)
        _onAppUpdate()
    },

    cached (/* registration */) { }, // console.log('Content has been cached for offline use.')
    updatefound (/* registration */) { }, // console.log('New content is downloading.')
    offline () { }, // console.log('No internet connection found. App is running in offline mode.')
    error (/* err */) { } // console.error('Error during service worker registration:', err)
  }
)

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

const DEBUG = myConfig.DEBUG
const DUPBYE = !myConfig.DUPBYE ? '' : (myConfig.DUPBYE as any)[myConfig.LANG]

export let myRegistration: ServiceWorkerRegistration
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

/*
// options: { body: 'texte', data: { url: '...' } }
*/
export async function showNotification (title: string, options: any) {
  if (myRegistration)
    await myRegistration.showNotification(title, options)
}

export async function setRegistration (applicationServerKey: BufferSource) 
  : Promise<[number, string]> {
  function sleep (delai: number) {
    if (delai >= 0) 
      return new Promise((resolve: Function) => { setTimeout(() => resolve(), delai) })
  }

  let nn = 1
  while (!myRegistration) {
    console.log('Waiting registration ...')
    await sleep(300 * nn++)
  }
  const pm = myRegistration.pushManager
  if (!pm) return [1, 'Cannot get pushManager']

  try {
    const sub = await pm.getSubscription()
    if (sub) return [0, JSON.stringify(sub)]
    else {
      const opt: PushSubscriptionOptionsInit = { userVisibleOnly: true, applicationServerKey }
      try {
        const nsub = await pm.subscribe(opt)
        return [0, JSON.stringify(nsub)]
      } catch(e: any) {
        return [2, e.toString()]
      }
    }
  } catch(e: any) {
    return [3, e.toString()]
  }
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
    registered (registration: ServiceWorkerRegistration) {
      myRegistration = registration
      console.log('Service worker is registered: ', myRegistration ? 'OK' : 'KO')
    },

    ready (registration: ServiceWorkerRegistration) {
      myRegistration = registration
      console.log('Service worker is active: ', myRegistration ? 'OK' : 'KO')
      if (DUPBYE && registration && registration.active)
        registration.active.postMessage({ type: 'STARTING' })
    },

    updated (registration: ServiceWorkerRegistration) {
      myRegistration = registration
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

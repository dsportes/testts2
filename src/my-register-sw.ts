import { register } from 'register-service-worker'

export let myRegistration = null
export let _onAppUpdate = null
export function setOnAppUpdate(f: any) {
  _onAppUpdate = f
}

console.log('In my my-register-sw')

navigator.serviceWorker.addEventListener('message', event => {
  // event is a MessageEvent object
  const msg = event.data
  console.log(`Reçu dans App envoyé par SW: ${msg.type} ${msg.payload}`);
})

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
    registered (registration) {
      // @ts-expect-error
      myRegistration = registration
      const ok = myRegistration ? 'ok' : 'KO'
      console.log('Service worker is registered', ok)
    },

    ready (registration) {
      // @ts-expect-error
      myRegistration = registration
      const ok = myRegistration ? 'ok' : 'KO'
      console.log('Service worker is active', ok)
      // @ts-expect-error
      registration.active.postMessage({ type: 'STARTING' })
    },

    updated (/* registration */) {
      if (_onAppUpdate)
        // @ts-expect-error
        _onAppUpdate()
    },

    cached (/* registration */) { }, // console.log('Content has been cached for offline use.')
    updatefound (/* registration */) { }, // console.log('New content is downloading.')
    offline () { }, // console.log('No internet connection found. App is running in offline mode.')
    error (/* err */) { } // console.error('Error during service worker registration:', err)
  }
)

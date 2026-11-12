declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { decode } from '@msgpack/msgpack'

import myConfig from '../src/app/config'
import customjson from '../src/assets/custom.json?raw'
{
  const patch: any = JSON.parse(customjson)
  for(const p in patch) (myConfig as any)[p] = patch[p]
}

const truc = 3

const HASDUPBYE = myConfig.DUPBYE ? true : false
const NOTIFICATIONCLICK = myConfig.NOTIFICATIONCLICK
const DEBUG = myConfig.DEBUG
const WEBPUSH = myConfig.WEBPUSH

function u8ToB64 (u8: Uint8Array | null | undefined) : string {
  // @ts-expect-error
  return !u8 ? '' : window.btoa(String.fromCharCode.apply(null, u8))
}

function b64ToU8 (b64: string) : Uint8Array {
  if (!b64) return new Uint8Array([])
  const s = self.atob(b64)
  const u8 = new Uint8Array(s.length)
  for (let i = 0, strLen = b64.length; i < strLen; i++) u8[i] = s.charCodeAt(i)
  return u8
}

function b64ToObj (b64: string) : any {
  return decode(b64ToU8(b64))
}

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

async function sendToApp (type: string, msg: string) {
  // @ts-expect-error
  const windowClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
  for (const client of windowClients) {
    if (client.focus && (client.visibilityState === 'hidden' || client.visibilityState === 'visible'))  { // "hidden", "visible", or "prerender"
      // Appli running : on lui poste directement buf
      client.postMessage({ type: type, payload: msg })
    }
  }
}

function trace (msg: string, cc?: boolean, debug?: boolean) {
  if (!debug || (debug && DEBUG)) {
    console.log(msg)
    if (cc) sendToApp('LOG', msg)
  } 
}

trace('SW init ... start', true)

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()

// Pre-cache all the assets injected by the plugin
const mf = self.__WB_MANIFEST

mf.forEach(x => { trace('WB_MANIFEST: ' + (x as any).url, false, true) })

precacheAndRoute(mf, { ignoreURLParametersMatching: [/.*/] })

trace(`SW init ... end [${mf.length}]`, true)

const localProperties: any = { }

addEventListener("message", async (event: any) => {
  if (HASDUPBYE && event.data && event.data.type === 'STARTING') {
    trace('SW: detection of duplicate starting', false, true)
    // @ts-expect-error
    const clientList = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    for(const client of clientList) {
      if (client.id !== event.source.id) event.source.postMessage({ type: 'STOP' })
    }
    return
  } 
  
  if (event.data && event.data.type === 'SETPROPERTY') {
    const state: any = event.data.state
    if (state) for(const f in state) localProperties[f] = state[f]
    trace('SW: call from App:' + JSON.stringify(event.data), false, true)
    return
  }
  
  await customListener(event)
})


if (WEBPUSH) self.addEventListener('push', async (event: any) => {
  const x = event.data ? event.data.text() : null
  let buf
  if (x && x.startsWith('{')) {
    const y = JSON.parse(x)
    buf = y.body
  } else buf = x
  /* buf : objet "message" sérialisé en base64
  const message = {
    org: 'demo',
    title: 'myApp - demo'
    url: 'url d'ouverture de myApp avec ?options'
    body: 'texte donné par l'appli',
    defs: [a/v/c c/d/e ...]
  }
  */
  try {
    // @ts-expect-error
    const windowClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    let found = false
    for (const client of windowClients) {
      if (client.focus && (client.visibilityState === 'hidden' || client.visibilityState === 'visible'))  { // "hidden", "visible", or "prerender"
        // Appli running : on lui poste directement buf
        client.postMessage({ type: 'PUSH', payload: buf })
        found = true
      }
    }
    if (!found) { // Pas d'appli ni bg ni fg - notification par browser
      const payload = b64ToObj(buf)
      const options = {
        body: payload.body, // texte à afficher
        data: { url: payload.url } // données arbitraires à transmettre sur click
      }
      const title = payload.title || 'Notification'
      // @ts-expect-error
      await self.registration.showNotification(title, options)
      /*
      const options = { body: 'From browser: ' + payload.notification.body }
      if (payload.data.url) options.data = { url: payload.data.url }
      await self.registration.showNotification(payload.notification.title, options)
      */
    }
  } catch (e: any) {
    console.log('SW: error on push: ' + e.toString())
  }
})

/*
Construit une notification { title, options } depuis un objet
 https://developer.mozilla.org/fr/docs/Web/API/ServiceWorkerRegistration/showNotification
*/
function objectToNotification (obj: any) : any {
  return {
    title: obj.title,
    options: {
      body: obj.body, // texte à afficher
      data: { url: obj.url } // données arbitraires à transmettre sur click
    }
  }
}

/*
Extrait une URL depuis les options d'une notification.
C'est ce qui est toujours montré dans les exemples
*/
function urlFromNotification (notification: any) : string {
  return notification?.data?.url || ''
}

/* Gestion de Web-Push *******************************************************************
https://developer.mozilla.org/en-US/docs/Web/API/PushEvent/data
https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
Convention: la payload de l'event est un objet sérialisé,
- soit en JSON,
- soit en base64 de son encode 
Post un message à tous les clients window.
S'il n'y en a aucun, émet une notification dont le contenu est construit
depuis la payload de l'event.
*/
if (WEBPUSH) self.addEventListener('push', async (event: any) => {
  const payload = event && event.data ? event.data.text() : undefined
  try {
    // @ts-expect-error
    const windowClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    let found = false
    for (const client of windowClients) {
      if (client.focus && (client.visibilityState === 'hidden' || client.visibilityState === 'visible'))  { // "hidden", "visible", or "prerender"
        // Appli running : on lui poste directement buf
        client.postMessage({ type: 'PUSH', payload: payload })
        found = true
      }
    }
    if (!found) { // Pas d'appli ni bg ni fg - notification par browser
      let obj: any
      try {
        if (payload && payload.startsWith('{')) obj = JSON.parse(payload) 
        else obj = decode(b64ToObj(payload))
      } catch(_e) { /* */ }
      const { title, options } = objectToNotification(obj)
      // @ts-expect-error
      if (title) await self.registration.showNotification(title, options)
    }
  } catch (e: any) {
    console.log('SW: error on push: ' + e.toString())
  }
})

/*
Le clic sur une notification a pour effet:
- de mettre au premier plan (focus) l'application (ayant l'URL de la notification).
- de lancer l'application par son URL (si URL il y a)
https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow
Copier / coller de l'exemple de MSN
*/
if (NOTIFICATIONCLICK) self.addEventListener("notificationclick", (e: any) => {
  const url = urlFromNotification(e.notification)
  // Close the notification popout
  e.notification.close()
  if (!url) return
  e.waitUntil(
    // Get all the Window clients
    // @ts-expect-error
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      const windowToFocus = clientsArr.find(
        (windowClient: any) => windowClient.url === url
      )
      if (windowToFocus) {
        console.log('to focus')
        // If a Window tab matching the targeted URL already exists, focus that;
        windowToFocus.focus()
      } else {
        // Otherwise, open a new tab to the applicable URL and focus it.
        // @ts-expect-error
        self.clients
          .openWindow(url)
          .then((windowClient: any) => (windowClient ? windowClient.focus() : null))
      }
    }),
  )
})

// Exemple de customListener
async function customListener (event: any) {
  // event.source.postMessage({ type: 'ECHO', msg: JSON.stringify(event.data) })
}

trace('SW end', false, false)

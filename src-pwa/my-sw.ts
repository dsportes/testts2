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
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

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

// Pre-cache all the assets injected by the plugin
const mf = self.__WB_MANIFEST
let n = 0
mf.forEach(x => { 
  n++
  // @ts-expect-error
  console.log('WB_MANIFEST: ' + x.url) 
})

precacheAndRoute(mf)

cleanupOutdatedCaches()

trace(`SW init ... end [${n}]`, true)

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

// Gestion de Web-Push *******************************************************************
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

if (NOTIFICATIONCLICK) self.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  const url = event?.notification?.data?.url
  if (url) {
    trace('SW: On notification click: ' + url, false, true)
      // This looks to see if the current is already open and focuses if it is
    // @ts-expect-error
    event.waitUntil( self.clients.matchAll({type: 'window'}).then((clientList) => {
      for (const client of clientList)
        if ('focus' in client) return client.focus()
      // @ts-expect-error
      if (self.clients.openWindow) return self.clients.openWindow(url)
    }))
  }
})

// Exemple de customListener
async function customListener (event: any) {
  // event.source.postMessage({ type: 'ECHO', msg: JSON.stringify(event.data) })
}

trace('SW end', false, false)

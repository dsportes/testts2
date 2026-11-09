declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

async function sendToApp (msg: string) {
  // @ts-expect-error
  const windowClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
  for (const client of windowClients) {
    if (client.focus && (client.visibilityState === 'hidden' || client.visibilityState === 'visible'))  { // "hidden", "visible", or "prerender"
      // Appli running : on lui poste directement buf
      client.postMessage({ type: 'MSG', payload: msg })
    }
  }
}

console.log('In my-sw.ts (1)')
sendToApp('In my-sw.ts (1)')

self.skipWaiting()
clientsClaim()

// Pre-cache all the assets injected by the plugin
const mf = self.__WB_MANIFEST
{
  let n = 0
  console.log('SW: WB_MANIFEST >>>>>>>') 
  mf.forEach(x => { 
    n++
    // @ts-expect-error
    console.log('WB_MANIFEST: ' + x.url) 
  })
  console.log('SW: WB_MANIFEST <<<<<<< ' + n)
}

precacheAndRoute(mf)

cleanupOutdatedCaches()

console.log('In my-sw.ts (2)')
sendToApp('In my-sw.ts (2)')

// let client

addEventListener("message", (event) => {
  // client = event.source
  console.log(`Message reçu de App dans SW: ${event.data.type}`);
})

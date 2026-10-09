/* Service worker: permite abrir la app sin señal */
const CACHE = 'muestreo-revemin-v2';
const BASICOS = ['./', './index.html', './firebase-config.js', './manifest.json',
                 './icon-192.png', './icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).then(()=> self.skipWaiting()));
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(()=> self.clients.claim()));
});

self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  if(url.hostname.includes('firestore.googleapis.com')) return;   // los datos los maneja Firestore

  // Archivos del propio programa: se piden siempre a la red, de modo que una
  // versión nueva publicada en GitHub se vea de inmediato. La copia guardada
  // solo se usa cuando no hay señal.
  if(url.origin === location.origin){
    e.respondWith(
      fetch(e.request).then(resp=>{
        if(resp && resp.status === 200){
          const copia = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return resp;
      }).catch(()=> caches.match(e.request))
    );
    return;
  }

  // Librerías externas: primero la copia guardada, para abrir rápido y sin señal.
  const guardable = url.hostname.includes('gstatic') || url.hostname.includes('cdnjs');
  e.respondWith(
    caches.match(e.request).then(guardado =>
      guardado || fetch(e.request).then(resp=>{
        if(resp && resp.status === 200 && guardable){
          const copia = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return resp;
      }))
  );
});

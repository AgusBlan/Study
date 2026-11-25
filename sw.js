self.addEventListener('install', e=>{
  e.waitUntil(caches.open('estudio-v1').then(c=>c.addAll(['./','./index.html','./manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!=='estudio-v1').map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    let copy=res.clone();
    caches.open('estudio-v1').then(c=>c.put(e.request,copy));
    return res;
  }).catch(()=>caches.match('./index.html'))));
});
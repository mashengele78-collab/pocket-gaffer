const CACHE="pg-fix-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./index.html"])).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request; if(r.method!=="GET")return; e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const c=res.clone(); caches.open(CACHE).then(x=>x.put(r,c));} return res;}).catch(()=>caches.match(r).then(x=>x||caches.match("./index.html"))));});

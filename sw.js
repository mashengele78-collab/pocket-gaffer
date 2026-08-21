/* Pocket Gaffer offline service worker — generated */
const CACHE = "pocket-gaffer-offline-v1";
const PRECACHE = [
  "./index.html",
  "./apple-touch-icon.png",
  "./assets/barlow-500-BgYH2mbd.woff2",
  "./assets/barlow-600-DepVgxBB.woff2",
  "./assets/barlow-700-v1xN8_Wq.woff2",
  "./assets/ibm-plex-sans-IvpUvPa2.woff2",
  "./assets/index-Cw7RRwr-.css",
  "./assets/index-Du_IPSYz.js",
  "./favicon.svg",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./manifest.webmanifest",
  "./og.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || fetched;
    }),
  );
});

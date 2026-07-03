/* Service Worker do Case-já
   - Navegações: network-first (páginas sempre atuais quando online; offline → fallback)
   - Assets estáticos: stale-while-revalidate
   - Não intercepta requests cross-origin (Supabase/Asaas) nem métodos != GET
*/
const CACHE = "caseja-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // deixa Supabase/Asaas passarem

  // Navegações → network-first com fallback offline
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Assets estáticos → stale-while-revalidate
  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/background/") ||
    /\.(?:png|jpg|jpeg|avif|webp|svg|woff2?)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res && res.status === 200) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});

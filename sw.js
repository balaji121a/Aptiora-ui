// APTIORA Service Worker — Offline PWA support
const CACHE = "aptiora-v1";
const OFFLINE_FILES = [
  "/dashboard.html",
  "/login.html",
  "/aptitude.html",
  "/test.html",
  "/profile.html",
  "/leaderboard.html",
  "/assessment.html",
  "/code.html",
  "/result.html",
  "/practice.html",
  "/certificate.html",
  "/admin.html",
  "/style.css",
  "/dashboard.css",
  "/test.css",
  "/login.css",
  "/result.css",
  "/certificate.css",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Cache what we can, ignore failures (external fonts may fail)
      return Promise.allSettled(OFFLINE_FILES.map(f => cache.add(f).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // API calls — always network
  if (e.request.url.includes("api.anthropic.com")) return;
  // Navigation — cache first, fallback to network
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("/dashboard.html")))
    );
    return;
  }
  // Assets — cache first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) {
        let clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => new Response("", { status: 408 })))
  );
});

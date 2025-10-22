// 👑 Link Sub Generator — Service Worker v4.1R+
const CACHE_NAME = "link-sub-generator-v4.1R";
const urlsToCache = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./assets/script.js",
  "./libs/qrcode.min.js",
  "./pages/home.html",
  "./pages/generator.html",
  "./pages/support.html",
  "./pages/tools.html",
  "./pages/about.html"
];

// Install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});

// Fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

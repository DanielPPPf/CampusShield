// ── CampusShield Service Worker ───────────────────────────────────────────────
const CACHE_NAME = 'campusshield-v1';

// Recursos estáticos que se cachean en la instalación (cache-first)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/src/app.js',
    '/src/store.js',
    '/src/views.js',
    '/src/config.js',
    '/manifest.json',
];

// ── Install: precachear assets estáticos ─────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    // Activar inmediatamente sin esperar a que cierren pestañas viejas
    self.skipWaiting();
});

// ── Activate: limpiar caches de versiones anteriores ─────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch: estrategia por tipo de recurso ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Peticiones a la API futura → network-first (sin caché)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() =>
                new Response(JSON.stringify({ error: 'Offline. Intenta de nuevo más tarde.' }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 503,
                })
            )
        );
        return;
    }

    // Tiles de OpenStreetMap → network-first con fallback a caché
    if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Todo lo demás (assets estáticos) → cache-first
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            });
        })
    );
});

// ── Push notifications (Web Push VAPID — fase 2) ─────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title || 'CampusShield', {
            body: data.body || '',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            tag: data.tag || 'campusshield-alert',
            data: { url: data.url || '/' },
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});

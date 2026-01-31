/**
 * Sky Odyssey - Service Worker v2
 * Stratégie : Cache-First (Priorité au cache pour la performance et l'offline)
 */

const CACHE_NAME = 'sky-odyssey-cache-v2';

// Liste des ressources critiques à mettre en cache
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './skyico.png',
    'https://aframe.io/releases/1.4.0/aframe.min.js',
    'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js'
];

// Installation : Mise en cache des ressources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Mise en cache des ressources critiques');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation : Nettoyage des anciens caches (v1)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Nettoyage de l\'ancien cache :', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interception des requêtes : Mode Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retourne la ressource du cache si elle existe, sinon fait la requête réseau
                return response || fetch(event.request);
            })
            .catch(() => {
                // Optionnel : Gestion d'erreur si ni cache ni réseau ne répondent
                console.error('[SW] Ressource non trouvée au cache ni sur le réseau');
            })
    );
});


const CACHE_ESTATICO = 'adda-estatico-v1';
const CACHE_API = 'adda-api-v1';

const URL_API = 'https://adda-hujc.onrender.com';

const ARCHIVOS = ['/', '/index.html' ,'/css/variables.css','/css/reset.css','/css/components/navbar.css','/css/components/cards.css', '/js/index.js', '/js/navbar.js','/js/config.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_ESTATICO).then(cache =>
      Promise.allSettled(
        ARCHIVOS.map(archivo => cache.add(archivo))
      )
    )
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  
  if (url.startsWith(URL_API)) {
    e.respondWith(manejarAPI(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request))
    );
  }
});

async function manejarAPI(request) {
  const cache = await caches.open(CACHE_API);

  try {
    // Intenta ir a la red primero
    const respRed = await fetch(request);

    if (respRed.ok) {
      cache.put(request, respRed.clone());
    }

    return respRed;

  } catch (error) {
    const respCache = await cache.match(request);

    if (respCache) {
      return respCache;
    }

    // Nunca había cargado antes
    return new Response(
      JSON.stringify({ error: 'Sin conexión y sin datos guardados' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
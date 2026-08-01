const CACHE_NAME = "vuelo-creativo-v1";

const ARCHIVOS_BASE = [
  "index.html",
  "app.html",
  "catalogo.html",
  "personalizar.html",
  "rastreo.html",
  "mas.html",
  "manifest.json",
  "css/variables.css",
  "css/base.css",
  "css/componentes.css",
  "css/animaciones.css",
  "css/landing.css",
  "css/catalogo.css",
  "css/rastreo.css",
  "css/personalizar.css",
  "css/mas.css",
  "js/components/header.js",
  "js/components/bottom-nav.js",
  "js/components/mascota.js",
  "js/components/icono-marca.js",
  "js/utils/helpers.js",
  "js/utils/theme.js",
  "js/utils/iconos-landing.js",
  "js/utils/mis-pedidos.js",
  "js/modules/carrito.js",
  "js/modules/boleta.js",
  "js/modules/catalogo.js",
  "js/modules/rastreo.js",
  "js/modules/personalizacion.js",
  "js/modules/mas.js",
  "js/data/catalogo.js",
  "js/data/negocio-config.js",
  "js/data/preciosPersonalizado.js"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_BASE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuesta) => respuesta || fetch(evento.request))
  );
});

/* Notificaciones push (pedido listo) — se conecta con Firebase Cloud Messaging */
self.addEventListener("push", (evento) => {
  const datos = evento.data ? evento.data.json() : { titulo: "Vuelo Creativo", mensaje: "Tienes una actualización de tu pedido ✈️" };
  evento.waitUntil(
    self.registration.showNotification(datos.titulo, {
      body: datos.mensaje,
      icon: "assets/icons/icon-192.png",
      badge: "assets/icons/icon-192.png"
    })
  );
});

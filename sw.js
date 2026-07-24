// Service Worker de autodestrucción.
// Reemplaza al SW viejo que cacheaba la app y hacía volver la versión antigua.
// Al activarse: borra todos los cachés, se desregistra y recarga las pestañas.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => c.navigate(c.url));
    } catch (err) {}
  })());
});
// Sin interceptar fetch: la app siempre carga desde la red (versión actual).

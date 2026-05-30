self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Escucha las peticiones de notificación del panel
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'NOTIFY') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/117/117212.png',
      vibrate: [200, 100, 200],
      badge: 'https://cdn-icons-png.flaticon.com/512/117/117212.png'
    });
  }
});

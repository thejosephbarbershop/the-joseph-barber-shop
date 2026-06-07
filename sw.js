// =====================================================================
// sw.js - Service Worker Receptor de Alertas (The Joseph Barbershop)
// =====================================================================

self.addEventListener('install', (e) => {
    console.log('SW: Instalado con éxito.');
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    console.log('SW: Activado y controlando la app.');
    e.waitUntil(self.clients.claim());
});

// ESCUCHAR LOS MENSAJES ENVIADOS DESDE EL PANEL DE ADMINISTRACIÓN (admin.html)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFY') {
        const titulo = event.data.title || '🆕 ¡Nueva Reserva!';
        
        const opciones = {
            body: event.data.body || 'Se ha registrado una nueva actividad.',
            icon: 'https://cdn-icons-png.flaticon.com/512/117/117212.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/117/117212.png',
            vibrate: [200, 100, 200],
            tag: 'alerta-barberia-' + Date.now(), // Asegura que cada alerta sea única y suene
            renotify: true,
            data: {
                url: self.location.origin // Guarda la dirección para abrirla al tocar
            }
        };

        // Forzar al navegador/celular a mostrar la notificación en pantalla
        event.waitUntil(
            self.registration.showNotification(titulo, opciones)
        );
    }
});

// ACCIÓN AL TOCAR LA NOTIFICACIÓN (Abre el panel automáticamente)
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Cierra la notificación visualmente

    // Abre el panel de control si el usuario toca la alerta
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./admin.html');
        })
    );
});

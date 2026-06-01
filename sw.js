// Importar Supabase dentro del Service Worker
importScripts('https://cdn.jsdelivr.net/npm/@supabase/supabase-js');

const SUPABASE_URL = "https://xnfmqumhhxpkrigizvlu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZm1xdW1oaHhwa3JpZ2l6dmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTE3NjgsImV4cCI6MjA5NTQ4Nzc2OH0.zNSZ4Nw2Iz2IieExt9SErJddPseWb65Hxedg5ZGZCvI";

// Inicializar Supabase en segundo plano
const _supabaseSW = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

// ESCUCHAR SUPABASE DIRECTAMENTE DESDE EL CELULAR
_supabaseSW
    .channel('cambios-sw')
    .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reservas' }, 
        (payload) => {
            const nuevaCita = payload.new;
            
            const titulo = `🆕 ¡Nueva Reserva Agendada!`;
            const opciones = {
                body: `Cliente: ${nuevaCita.cliente || 'Sin nombre'}\nServicio: ${nuevaCita.servicio || 'No especificado'}\nHora: ${nuevaCita.hora}`,
                icon: 'https://cdn-icons-png.flaticon.com/512/117/117212.png',
                badge: 'https://cdn-icons-png.flaticon.com/512/117/117212.png',
                vibrate: [200, 100, 200],
                tag: 'nueva-reserva-' + nuevaCita.id, // Evita que se dupliquen
                renotify: true
            };

            // Esto despierta al celular de manera forzada
            self.registration.showNotification(titulo, opciones);
        }
    )
    .subscribe();

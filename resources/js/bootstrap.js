import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Laravel Echo + Reverb — Realtime WebSocket client.
 *
 * Echo menggunakan Pusher protocol (yang di-support Reverb) untuk
 * subscribe ke private/presence channels dan menerima events.
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    
    // Secara dinamis mengikuti URL website di production Azure (HTTPS),
    // sehingga terhindar dari error hardcode localhost atau port 8080.
    wsHost: window.location.protocol === 'https:' ? window.location.hostname : import.meta.env.VITE_REVERB_HOST,
    wsPort: window.location.protocol === 'https:' ? 443 : (import.meta.env.VITE_REVERB_PORT ?? 80),
    wssPort: window.location.protocol === 'https:' ? 443 : (import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: window.location.protocol === 'https:' ? true : (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

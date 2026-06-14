import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Ziggy mem-bake `APP_URL` (config app.url) ke dalam route(). Saat di-deploy ke
// Azure, APP_URL masih "http://localhost" sehingga route('login')/route('register')
// menghasilkan URL ke host yang salah dan Inertia menganggapnya link eksternal
// (link tidak berfungsi). Mengganti host Ziggy dengan origin halaman saat ini
// membuat semua route() memakai host + skema (https) yang benar di mana pun di-deploy.
if (typeof window !== 'undefined' && window.Ziggy) {
    window.Ziggy.url = window.location.origin;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

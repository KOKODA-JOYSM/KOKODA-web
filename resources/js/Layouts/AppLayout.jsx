import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Common/navbar.jsx';
import tailwindConfig from '../../../tailwind.config.js';

const { colors } = tailwindConfig.theme.extend;
const COLOR_BASE = colors.base;

/**
 * AppLayout — layout utama aplikasi KOKODA.
 *
 * Cukup bungkus konten halaman dengan komponen ini.
 * Navbar sudah otomatis muncul dan responsif.
 *
 * Cara pakai:
 *   import AppLayout from '@/Layouts/AppLayout';
 *
 *   export default function MyPage() {
 *       return (
 *           <AppLayout title="Nama Halaman">
 *               <p>Konten halaman di sini</p>
 *           </AppLayout>
 *       );
 *   }
 */
export default function AppLayout({ title, children }) {
    const { url } = usePage();
    const isChat = url?.startsWith('/chat');

    return (
        <>
            {/* Page title di browser tab */}
            {title && <Head title={title} />}

            {/* Wrapper utama: sidebar + konten */}
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLOR_BASE }}>

                {/* Navbar sudah handle hamburger, responsive, semua */}
                <Navbar />

                {/* Konten halaman — class kokoda-page-content sudah ada padding-top di mobile */}
                <main
                    className={`kokoda-page-content ${isChat ? 'chat-page' : ''}`}
                    style={{ flex: 1, boxSizing: 'border-box', overflowX: 'hidden' }}
                >
                    {children}
                </main>

            </div>
        </>
    );
}

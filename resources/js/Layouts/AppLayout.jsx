import { Head } from '@inertiajs/react';
import Navbar from '@/Components/navbar';

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
    return (
        <>
            {/* Page title di browser tab */}
            {title && <Head title={title} />}

            {/* Wrapper utama: sidebar + konten */}
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFF6EC' }}>

                {/* Navbar sudah handle hamburger, responsive, semua */}
                <Navbar />

                {/* Konten halaman — class kokoda-page-content sudah ada padding-top di mobile */}
                <main
                    className="kokoda-page-content"
                    style={{ flex: 1, boxSizing: 'border-box', overflowX: 'hidden' }}
                >
                    {children}
                </main>

            </div>
        </>
    );
}

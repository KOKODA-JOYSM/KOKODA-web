import AppLayout from '@/Layouts/AppLayout';

export default function Search() {
    return (
        <AppLayout title="Search">
            <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
                <h1 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '32px', color: '#333' }}>
                    Search Page
                </h1>
            </div>
        </AppLayout>
    );
}

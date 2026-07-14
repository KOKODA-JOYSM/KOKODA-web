import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ProfileLocationPicker from '@/Pages/Profile/ProfileLocationPicker';
import LanguageSwitcher from '@/Components/Common/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export default function Edit({ mustVerifyEmail }) {
    const { t } = useTranslation();
    // Mengambil data user yang sedang login dari props bawaan Inertia
    const user = usePage().props.auth.user;
    const [previewUrl, setPreviewUrl] = React.useState(null);

    // Menggunakan useForm dari Inertia untuk menangani input & submit data
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        description: user.description || '',
        profile_icon: null,
    });

    // Fungsi untuk mengirim pembaruan data ke backend saat tombol Save ditekan
    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            forceFormData: true,
        });
    };

    // Handle file input change — kompres gambar sebelum upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const MAX = 800;
                let w = img.width;
                let h = img.height;

                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
                    else       { w = Math.round((w * MAX) / h); h = MAX; }
                }

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                setPreviewUrl(dataUrl);

                canvas.toBlob((blob) => {
                    const compressed = new File(
                        [blob],
                        file.name.replace(/\.[^.]+$/, '.jpg'),
                        { type: 'image/jpeg', lastModified: Date.now() }
                    );
                    setData('profile_icon', compressed);
                }, 'image/jpeg', 0.85);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Get avatar URL
    const getAvatarUrl = () => {
        if (previewUrl) {
            return previewUrl;
        }
        if (user.profile_icon) {
            return '/' + user.profile_icon;
        }
        return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=F4C799&color=311A05';
    };

    return (
        <AppLayout title="Edit Profile - KOKODA">
            <Head title="Edit Profile" />

            {/* Kontainer Utama */}
            <div className="px-6 py-8 bg-background min-h-screen w-full font-quicksand flex flex-col items-center justify-start">

                {/* Batasi lebar konten maksimal agar proporsional dan rapi */}
                <form onSubmit={submit} className="w-full max-w-4xl flex flex-col gap-6">

                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
                            <p className="font-semibold">{t('profile.checkInput')}</p>
                            <ul className="mt-2">
                                {Object.entries(errors).map(([field, message]) => (
                                    <li key={field}>• {message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── CARD 1: HEADER & GANTI FOTO ── */}
                    <div className="bg-secondary rounded-[28px] p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md">
                        {/* Kiri: Foto & Info Singkat */}
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {/* Foto Profil — klik untuk ganti */}
                            <label htmlFor="photo-input" className="relative cursor-pointer group shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-base bg-white shadow-inner">
                                    <img
                                        src={getAvatarUrl()}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                {/* Badge kamera permanen */}
                                <div className="absolute bottom-0 right-0 bg-tertiary rounded-full p-1.5 border-2 border-base shadow">
                                    <svg className="w-3.5 h-3.5 text-base" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </label>

                            {/* Nama & Email */}
                            <div className="text-base flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                                <div className="flex items-center gap-2 opacity-90 text-sm">
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>{user.email}</span>
                                </div>
                                {previewUrl && (
                                    <p className="text-xs opacity-70 mt-2">{t('profile.newPhotoSelected')}</p>
                                )}
                            </div>
                        </div>

                        {/* Kanan: Dropdown Bahasa (menggantikan tombol Ganti Foto — klik foto di kiri untuk ganti) */}
                        <input
                            id="photo-input"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <LanguageSwitcher variant="solid" className="w-full sm:w-auto shadow" />
                    </div>


                    {/* ── CARD 2: FORM EDIT INFORMASI ── */}
                    <div className="bg-secondary rounded-[28px] p-6 sm:p-12 flex flex-col gap-6 shadow-md text-base">

                        {/* Baris Input: Username & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Input Username */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-semibold text-base">
                                    {t('profile.username')}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-base text-tertiary rounded-xl border-none px-4 py-3 text-sm focus:ring-2 focus:ring-tertiary shadow-sm"
                                    required
                                />
                                {errors.name && <span className="text-red-300 text-xs">{errors.name}</span>}
                            </div>

                            {/* Input Email Address */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="font-semibold text-base">
                                    {t('profile.emailAddress')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    disabled
                                    className="w-full bg-base/50 text-tertiary/60 cursor-not-allowed rounded-xl border-none px-4 py-3 text-sm shadow-sm"
                                    required
                                />
                                {errors.email && <span className="text-red-300 text-xs">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Input Location */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-base">
                                {t('profile.location')}
                            </label>
                            <ProfileLocationPicker
                                selected={data.location}
                                onChange={(locationName) => setData('location', locationName)}
                            />
                            {errors.location && <span className="text-red-300 text-xs">{errors.location}</span>}
                        </div>

                        {/* Input Description */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="font-semibold text-base">
                                {t('profile.description')}
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                maxLength={500}
                                rows={4}
                                placeholder={t('profile.descriptionPlaceholder')}
                                className="w-full bg-base text-tertiary rounded-xl border-none px-4 py-3 text-sm focus:ring-2 focus:ring-tertiary shadow-sm resize-none"
                            />
                            <span className="text-xs opacity-70 self-end">{data.description.length}/500</span>
                            {errors.description && <span className="text-red-300 text-xs">{errors.description}</span>}
                        </div>
                    </div>


                    {/* ── ACTION BUTTONS: CANCEL & SAVE ── */}
                    <div className="flex justify-end items-center gap-4 mt-2">
                        {/* Tombol Cancel: Kembali ke halaman Profile */}
                        <Link
                            href={route('profile')}
                            className="px-8 py-3 bg-base text-tertiary font-semibold rounded-full border border-tertiary text-sm hover:bg-gray-100 transition-all duration-200 text-center"
                        >
                            {t('profile.cancel')}
                        </Link>

                        {/* Tombol Save Change: Submit Form */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-tertiary text-base font-semibold rounded-full text-sm hover:bg-tertiary/90 transition-all duration-200 shadow disabled:opacity-50"
                        >
                            {t('profile.saveChange')}
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
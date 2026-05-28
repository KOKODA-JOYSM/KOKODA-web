import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    // Mengambil data user yang sedang login dari props bawaan Inertia
    const user = usePage().props.auth.user;
    const [previewUrl, setPreviewUrl] = React.useState(null);

    // Menggunakan useForm dari Inertia untuk menangani input & submit data
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        profile_icon: null,
    });

    // Fungsi untuk mengirim pembaruan data ke backend saat tombol Save ditekan
    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            forceFormData: true,
        });
    };

    // Handle file input change
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_icon', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Get avatar URL
    const getAvatarUrl = () => {
        if (previewUrl) {
            return previewUrl;
        }
        if (user.profile_icon) {
            return '/storage/' + user.profile_icon;
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

                    {/* ── CARD 1: HEADER & GANTI FOTO ── */}
                    <div className="bg-secondary rounded-[28px] p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md">
                        {/* Kiri: Foto & Info Singkat */}
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {/* Foto Profil */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-base shrink-0 bg-white shadow-inner">
                                <img
                                    src={getAvatarUrl()}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Nama & Email */}
                            <div className="text-base flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                                <div className="flex items-center gap-2 opacity-90 text-sm">
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Tombol Ganti Foto */}
                        <input
                            id="photo-input"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="photo-input"
                            className="w-full sm:w-auto px-6 py-3 bg-tertiary hover:bg-tertiary/90 text-base font-semibold text-sm rounded-full shadow transition-all duration-200 cursor-pointer text-center"
                        >
                            Change Photo
                        </label>
                    </div>


                    {/* ── CARD 2: FORM EDIT INFORMASI ── */}
                    <div className="bg-secondary rounded-[28px] p-6 sm:p-12 flex flex-col gap-6 shadow-md text-base">

                        {/* Baris Input: Username & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Input Username */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-semibold text-base">
                                    Username
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
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-base text-tertiary rounded-xl border-none px-4 py-3 text-sm focus:ring-2 focus:ring-tertiary shadow-sm"
                                    required
                                />
                                {errors.email && <span className="text-red-300 text-xs">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Input Location */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="location" className="font-semibold text-base">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full bg-base text-tertiary rounded-xl border-none px-4 py-3 text-sm focus:ring-2 focus:ring-tertiary shadow-sm"
                            />
                            {errors.location && <span className="text-red-300 text-xs">{errors.location}</span>}
                        </div>

                        {/* Notifikasi Status Berhasil (Opsional bawaan Breeze) */}
                        {status === 'profile-updated' && (
                            <div className="text-sm font-medium text-green-200">
                                Profile updated successfully.
                            </div>
                        )}
                    </div>


                    {/* ── ACTION BUTTONS: CANCEL & SAVE ── */}
                    <div className="flex justify-end items-center gap-4 mt-2">
                        {/* Tombol Cancel: Kembali ke halaman Profile */}
                        <Link
                            href={route('profile')}
                            className="px-8 py-3 bg-base text-tertiary font-semibold rounded-full border border-tertiary text-sm hover:bg-gray-100 transition-all duration-200 text-center"
                        >
                            Cancel
                        </Link>

                        {/* Tombol Save Change: Submit Form */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-tertiary text-base font-semibold rounded-full text-sm hover:bg-tertiary/90 transition-all duration-200 shadow disabled:opacity-50"
                        >
                            Save Change
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    // Mengambil data user yang sedang login dari props bawaan Inertia
    const user = usePage().props.auth.user;

    // Menggunakan useForm dari Inertia untuk menangani input & submit data
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '', // Asumsi ada field bio, jika tidak ada di DB abaikan saja
    });

    // Fungsi untuk mengirim pembaruan data ke backend saat tombol Save ditekan
    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // Placeholder data lokasi & avatar (karena bawaan Breeze belum ada field ini)
    const userLocation = 'Tangerang'; 
    const userAvatar = '/images/icon-profile-avatar.svg';

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
                                    src={userAvatar} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e)=>{e.target.src='https://ui-avatars.com/api/?name='+user.name+'&background=F4C799&color=311A05'}}
                                />
                            </div>

                            {/* Nama & Email */}
                            <div className="text-base flex flex-col justify-center">
                                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                                <div className="flex items-center gap-2 opacity-90 text-sm">
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Tombol Ganti Foto */}
                        <button 
                            type="button"
                            onClick={() => alert('Fitur upload foto belum tersedia')}
                            className="w-full sm:w-auto px-6 py-3 bg-tertiary hover:bg-tertiary/90 text-base font-semibold text-sm rounded-full shadow transition-all duration-200"
                        >
                            Change Photo
                        </button>
                    </div>


                    {/* ── CARD 2: FORM EDIT INFORMASI ── */}
                    <div className="bg-secondary rounded-[28px] p-6 sm:p-12 flex flex-col gap-6 shadow-md text-base">
                        
                        {/* Header Lokasi */}
                        <div className="flex items-center gap-2 font-semibold text-lg mb-2">
                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <span>{userLocation}</span>
                        </div>

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

                        {/* Input Bio */}
                        <div className="flex flex-col gap-2 mt-2">
                            <label htmlFor="bio" className="font-semibold text-base">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                rows="5"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell the community a little about yourself..."
                                className="w-full bg-base text-tertiary rounded-xl border-none p-4 text-sm focus:ring-2 focus:ring-tertiary shadow-sm resize-none placeholder:text-gray-text-field/60"
                            ></textarea>
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
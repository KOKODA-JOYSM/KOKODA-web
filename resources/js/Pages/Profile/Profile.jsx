import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import TabNavigation from './TabNavigation';
import RequestTab from './RequestTab';
import MyPostTab from './MyPostTab';
import HistoryTab from './HistoryTab';

export default function Profile({ posts, incomingClaims = [], sentClaims = [], status }) {
    // 1. Ambil data user yang sedang login langsung dari backend (database)
    const { auth } = usePage().props;
    const user = auth.user;

    // State untuk tab aktif: 'request', 'my_post', 'history'
    const [activeTab, setActiveTab] = useState('request');

    const userLocation = user.location || 'Tangerang';
    const userRating = user.rating > 0 ? Number(user.rating).toFixed(1) + '/5' : '0.0/5';
    const userPoints = user.points ?? 0;
    const userAvatar = user.profile_icon
        ? ('/' + user.profile_icon)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=F4C799&color=311A05`;

    // 2. Mengolah data postingan dari database
    // Backend mengirim array Collection langsung (sudah difilter user_id di controller)
    const allPosts = Array.isArray(posts) ? posts : (posts?.data || []);

    // Resolved posts otomatis pindah ke tab History dan tidak lagi tampil di My Post
    const myPosts = allPosts.filter((p) => p.status !== 'resolved');
    const resolvedPosts = allPosts.filter((p) => p.status === 'resolved');

    return (
        <AppLayout title="Profile - KOKODA">
            {/* Kontainer Utama */}
            <div className="px-6 py-8 bg-background min-h-screen w-full font-quicksand flex flex-col items-center">

                {/* Batasi lebar konten maksimal */}
                <div className="w-full max-w-4xl flex flex-col gap-8">

                    {/* ── CARD HEADER PROFILE ── */}
                    <div className="bg-secondary rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center sm:items-stretch gap-6 shadow-md relative">
                        {/* Bagian Kiri: Info User Asli dari DB */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                            {/* Avatar */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-base shrink-0 bg-white shadow-inner">
                                <img
                                    src={userAvatar}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Detail Teks */}
                            <div className="flex flex-col justify-center text-base text-center sm:text-left">
                                <h1 className="text-3xl font-bold mb-3 text-base">{user.name}</h1>

                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 opacity-90">
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>

                                <div className="flex items-center justify-center sm:justify-start gap-5 opacity-90 text-sm font-medium">
                                    {/* Lokasi */}
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                        <span>{userLocation}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-highlight fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                        <span>{userRating}</span>
                                    </div>

                                    {/* Points */}
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                        </svg>
                                        <span>{userPoints} Points</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bagian Kanan: Aksi Tombol Edit & Logout */}
                        <div className="flex sm:flex-col justify-between items-end w-full sm:w-auto gap-4 absolute sm:relative top-4 sm:top-0 right-4 sm:right-0">
                            {/* Tombol Edit Profile */}
                            <Link
                                href="/profile/edit"
                                className="w-10 h-10 rounded-full bg-base hover:bg-gray-100 flex items-center justify-center text-secondary shadow transition-all duration-200"
                                title="Edit Profile"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </Link>

                            {/* Tombol Logout */}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="mt-auto px-4 py-2 bg-label-lost hover:bg-red-500 text-base rounded-xl font-bold text-sm flex items-center gap-2 shadow transition-all duration-200 cursor-pointer"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                </svg>
                                <span>Logout</span>
                            </Link>
                        </div>
                    </div>


                    {/* ── TABS NAVIGATION ── */}
                    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />


                    {/* ── KONTEN LIST BERDASARKAN TAB ── */}
                    <div className="flex flex-col gap-6">

                        {/* TAB 1: REQUESTS */}
                        {activeTab === 'request' && (
                            <RequestTab incomingClaims={incomingClaims} sentClaims={sentClaims} />
                        )}

                        {/* TAB 2: MY POST */}
                        {activeTab === 'my_post' && <MyPostTab posts={myPosts} />}

                        {/* TAB 3: HISTORY */}
                        {activeTab === 'history' && <HistoryTab posts={resolvedPosts} />}

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
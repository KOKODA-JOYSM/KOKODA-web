import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import PostDetailModal from '@/Components/Home/PostDetailModal';
import { useTranslation } from '@/hooks/useTranslation';

const LOCALE_TAGS = { en: 'en-US', id: 'id-ID' };

export default function Show({ profileUser, posts = [] }) {
    const { t, locale } = useTranslation();
    const localeTag = LOCALE_TAGS[locale] || 'en-US';
    const [selectedPost, setSelectedPost] = useState(null);

    // Batasi lokasi maksimal 3 kata agar tidak memenuhi header profile
    const truncateWords = (text, max = 3) => {
        const words = String(text).trim().split(/\s+/);
        return words.length > max ? words.slice(0, max).join(' ') + '...' : text;
    };
    const userLocation = truncateWords(profileUser.location || t('profile.unknown'));
    const userRating = profileUser.rating > 0
        ? Number(profileUser.rating).toFixed(1) + '/5.0'
        : '0.0/5.0';
    const userPoints = profileUser.points ?? 0;
    const userAvatar = profileUser.profile_icon
        ? ('/' + profileUser.profile_icon)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=F4C799&color=311A05`;

    const myPosts = Array.isArray(posts) ? posts : (posts?.data || []);

    return (
        <AppLayout title={`${profileUser.name} - KOKODA`}>
            {/* Kontainer Utama */}
            <div className="px-6 py-8 bg-background min-h-screen w-full font-quicksand flex flex-col items-center">

                {/* Batasi lebar konten maksimal */}
                <div className="w-full max-w-4xl flex flex-col gap-8">

                    {/* ── CARD HEADER PROFILE ── */}
                    <div className="bg-secondary rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center sm:items-stretch gap-6 shadow-md relative">
                        {/* Bagian Kiri: Info User */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                            {/* Avatar */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-base shrink-0 bg-white shadow-inner">
                                <img
                                    src={userAvatar}
                                    alt={profileUser.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Detail Teks */}
                            <div className="flex flex-col justify-center text-base text-center sm:text-left">
                                <h1 className="text-4xl sm:text-5xl font-bold mb-1 text-base">{profileUser.name}</h1>
                                {profileUser.username && (
                                    <p className="text-sm font-medium opacity-70 mb-2">@{profileUser.username}</p>
                                )}

                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 opacity-90">
                                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    <span className="text-sm font-medium">{profileUser.email}</span>
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
                                    <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                                        <svg className="w-4 h-4 text-highlight fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                        <span>{userRating}</span>
                                    </div>

                                    {/* Points */}
                                    <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                        </svg>
                                        <span>{userPoints} {t('profile.points')}</span>
                                    </div>
                                </div>

                                {/* Description / Bio */}
                                {profileUser.description && (
                                    <p className="mt-3 text-sm opacity-80 whitespace-pre-line break-words max-w-xl">
                                        {profileUser.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* ── POSTINGAN USER ── */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-tertiary">
                                {t('profile.posts')}
                            </h2>
                            <p className="text-sm text-tertiary/70 font-medium">
                                {myPosts.length} {myPosts.length === 1 ? t('profile.post') : t('profile.posts')}
                            </p>
                        </div>

                        {myPosts.length === 0 ? (
                            <div className="text-center py-12 bg-secondary/10 rounded-2xl">
                                <p className="text-tertiary font-semibold text-lg mb-2">{t('profile.noPostsYet')}</p>
                                <p className="text-tertiary/60 text-sm">{t('profile.noPostsDesc')}</p>
                            </div>
                        ) : (
                            myPosts.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-secondary rounded-[20px] p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                    onClick={() => setSelectedPost(item)}
                                >
                                    <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">

                                        {/* Gambar */}
                                        <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative">
                                            <img
                                                src={item.image_url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop'}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Status badge di atas gambar */}
                                            <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-bold uppercase shadow ${
                                                item.status === 'resolved'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-yellow-400 text-tertiary'
                                            }`}>
                                                {item.status === 'resolved' ? t('profile.resolved') : t('profile.active')}
                                            </span>
                                        </div>

                                        {/* Konten */}
                                        <div className="flex flex-col justify-between flex-1 min-w-0">
                                            <div>
                                                {/* Title + Type Badge */}
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-tertiary leading-tight line-clamp-2 flex-1">
                                                        {item.title}
                                                    </h3>
                                                    <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                                                        item.type === 'lost'
                                                            ? 'bg-label-lost text-base'
                                                            : 'bg-label-found text-base'
                                                    }`}>
                                                        {item.type === 'lost' ? t('home.lost') : t('home.found')}
                                                    </span>
                                                </div>

                                                {/* Lokasi */}
                                                {item.location && (
                                                    <div className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                                        <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                        </svg>
                                                        <span>{typeof item.location === 'object' ? item.location?.place_name : item.location}</span>
                                                    </div>
                                                )}

                                                <p className="text-sm text-tertiary/75 line-clamp-2 font-medium mt-1">{item.description}</p>
                                            </div>

                                            {/* Tanggal */}
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xs text-tertiary/50 font-medium">
                                                    {new Date(item.created_at).toLocaleDateString(localeTag, {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </AppLayout>
    );
}

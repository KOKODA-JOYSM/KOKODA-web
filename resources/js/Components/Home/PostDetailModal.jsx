import React, { useState, useEffect } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, X, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import PostActionButtons from '@/Components/Posts/PostActionButtons';
import { useTranslation } from '@/hooks/useTranslation';
import Avatar from '@/Components/Common/Avatar';

const LOCALE_TAGS = { en: 'en-US', id: 'id-ID' };

export default function PostDetailModal({ post, onClose }) {
    const { t, locale } = useTranslation();
    const localeTag = LOCALE_TAGS[locale] || 'en-US';
    const { auth } = usePage().props;
    const [currentImage, setCurrentImage] = useState(0);

    // Hide hamburger navbar and lock background scroll when modal is open
    useEffect(() => {
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        };
    }, []);

    const isFounded = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found text-white' : 'bg-label-lost text-white';
    const labelText = isFounded ? t('profile.foundItem') : t('profile.lostItem');
    const buttonText = isFounded ? t('post.iFoundThisItem') : t('post.thisIsMyItem');
    const isOwnPost = auth?.user?.id === post.user_id;

    // Normalize images array — support single image_url or multiple
    const images = Array.isArray(post.images) && post.images.length > 0
        ? post.images
        : post.image_url
            ? [post.image_url]
            : ['/images/default.img.webp'];

    const formattedDate = post.created_at
        ? new Date(post.created_at).toLocaleDateString(localeTag, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '—';

    // Build Google Maps embed URL — no API key required
    const locationName = typeof post.location === 'object' ? post.location?.place_name : post.location;
    const mapsEmbedUrl = locationName
        ? `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
        : `https://maps.google.com/maps?q=Indonesia&t=&z=5&ie=UTF8&iwloc=&output=embed`;

    const mapsOpenUrl = locationName
        ? `https://www.google.com/maps/search/${encodeURIComponent(locationName)}`
        : null;

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImage((i) => (i - 1 + images.length) % images.length);
    };
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImage((i) => (i + 1) % images.length);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/60 z-50"
                style={{ animation: 'fadeIn 0.2s ease' }}
            />

            {/* Modal Container */}
            <div
                className="fixed z-50 bg-background shadow-2xl overflow-hidden"
                style={{
                    animation: 'slideUp 0.3s ease',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'min(95vw, 960px)',
                    maxHeight: '92vh',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Close Button — Desktop only, absolute top-right corner */}
                <button
                    onClick={onClose}
                    className="hidden md:flex absolute top-3 right-3 z-20 w-8 h-8 items-center justify-center rounded-full bg-white/80 hover:bg-white text-tertiary shadow transition-all"
                    aria-label={t('post.close')}
                >
                    <X size={18} />
                </button>

                {/* Inner layout: column on mobile, side-by-side on desktop */}
                <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-hidden flex-1 min-h-0">

                    {/* ── LEFT PANEL (Desktop) / TOP SECTION (Mobile) ── */}
                    <div className="w-full md:w-[48%] flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-gray-200">

                        {/* User info header — links to the author's profile */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 w-full">
                            {post.user?.id ? (
                                <Link
                                    href={`/profile/${post.user.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 min-w-0 flex-1 group/profile"
                                >
                                    <Avatar user={post.user} size={32} className="w-8 h-8" />
                                    <span className="font-quicksand font-semibold text-xs text-tertiary truncate group-hover/profile:underline">
                                        {post.user?.username ? `@${post.user.username}` : `@${post.user?.name || t('profile.unknown')}`}
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Avatar user={post.user} size={32} className="w-8 h-8" />
                                    <span className="font-quicksand font-semibold text-xs text-tertiary truncate">
                                        {post.user?.username ? `@${post.user.username}` : `@${post.user?.name || t('profile.unknown')}`}
                                    </span>
                                </div>
                            )}
                            <div className={`${labelColor} text-xs font-semibold font-quicksand px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0`}>
                                {labelText}
                            </div>
                            {/* Close Button — Mobile only, inline so it doesn't overlap badge */}
                            <button
                                onClick={onClose}
                                className="flex md:hidden flex-shrink-0 ml-1 w-7 h-7 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all"
                                aria-label={t('post.close')}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Image Carousel */}
                        <div className="relative bg-gray-200 overflow-hidden mx-3 mt-3 rounded-xl" style={{ aspectRatio: '4/3', flexShrink: 0 }}>
                            <img
                                src={images[currentImage]}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                    {/* Dots */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {images.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${i === currentImage ? 'bg-white' : 'bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Google Map — Desktop only (inside left panel, fills remaining space) */}
                        <div className="hidden md:flex flex-1 min-h-0 bg-gray-100 border-t border-gray-200 overflow-hidden relative mt-3 mb-3 mx-3 rounded-xl">
                            <iframe
                                title="location-map"
                                src={mapsEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '160px', display: 'block' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            {mapsOpenUrl && (
                                <a
                                    href={mapsOpenUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-2 left-2 flex items-center gap-1.5 bg-white text-[#2D1606] text-xs font-quicksand font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-yellow-50 transition-colors border border-gray-200"
                                >
                                    <ExternalLink size={12} />
                                    {t('post.openInMaps')}
                                </a>
                            )}
                        </div>

                    </div>

                    {/* ── RIGHT PANEL (Desktop) / CONTENT SECTION (Mobile) ── */}
                    <div className="w-full md:w-[52%] flex flex-col p-5 md:p-8 overflow-y-auto">

                        <div className="flex flex-col flex-1 border-l-[3px] border-secondary pl-5 md:pl-6 py-1 mb-6">
                            {/* Title */}
                            <h2
                                className="font-quicksand font-bold text-tertiary leading-tight mb-4 pr-6"
                                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                            >
                                {post.title}
                            </h2>

                            {/* Description */}
                            <p
                                className="leading-relaxed mb-8 text-sm md:text-base font-quicksand whitespace-pre-wrap"
                                style={{ color: '#311A05' }}
                            >
                                {post.description}
                            </p>

                            {/* Meta: Category & Date */}
                            <div className="flex flex-col gap-2 mt-auto">
                                {post.category && (
                                    <div className="flex items-center gap-2 text-base md:text-xl text-tertiary">
                                        <span className="font-quicksand font-medium">{t('post.category')}:</span>
                                        <span className="font-quicksand">{post.category}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-base md:text-xl text-tertiary">
                                    <span className="font-quicksand font-medium">
                                        {isFounded ? t('post.foundOn') : t('post.dateLost')}
                                    </span>
                                    <span className="font-quicksand">{formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── MOBILE ONLY: Map Section (appears after content, not sticky) ── */}
                        <div className="md:hidden mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center gap-1.5 font-quicksand font-semibold text-sm text-gray-500">
                                    <MapPin size={14} className="text-gray-400" strokeWidth={1.75} />
                                    {locationName || t('profile.location')}
                                </span>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '200px' }}>
                                <iframe
                                    title="location-map-mobile"
                                    src={mapsEmbedUrl}
                                    width="100%"
                                    height="200"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto pt-4 md:pt-2 md:pl-6 w-full">
                            {isOwnPost ? (
                                /* Owner: Edit & Delete */
                                <div className="flex gap-3 w-11/12 md:w-full max-w-lg mx-auto md:mx-0">
                                    <button
                                        onClick={() => router.visit(`/posts/${post.id}/edit`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl text-sm font-semibold font-quicksand transition-all duration-200 hover:opacity-90 active:scale-[0.97] cursor-pointer shadow-md"
                                    >
                                        <Pencil size={16} />
                                        {t('post.editPost')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(t('post.deletePostConfirm'))) {
                                                window.axios.delete(`/posts/${post.id}`).then(() => {
                                                    router.visit('/home');
                                                });
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-label-lost text-label-lost rounded-xl text-sm font-semibold font-quicksand transition-all duration-200 hover:bg-label-lost hover:text-white active:scale-[0.97] cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                        {t('profile.delete')}
                                    </button>
                                </div>
                            ) : (
                                /* Non-owner: Request & Chat */
                                <div className="w-11/12 md:w-full max-w-lg mx-auto md:mx-0">
                                    <PostActionButtons post={post} variant="compact" />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translate(-50%, -46%); }
                    to   { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
        </>
    );
}

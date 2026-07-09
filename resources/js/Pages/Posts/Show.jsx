import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import PostActionButtons from '@/Components/Posts/PostActionButtons';
import { useTranslation } from '@/hooks/useTranslation';

const LOCALE_TAGS = { en: 'en-US', id: 'id-ID' };

export default function Show({ post, auth }) {
    const { t, locale } = useTranslation();
    const localeTag = LOCALE_TAGS[locale] || 'en-US';
    const isFounded = post.type === 'found';
    const labelColor = isFounded ? 'bg-label-found' : 'bg-label-lost';
    const labelText = isFounded ? t('home.found').toUpperCase() : t('home.lost').toUpperCase();
    const isOwnPost = auth.user.id === post.user_id;

    const imageUrl = post.image_url || '/images/default.img.webp';

    return (
        <AppLayout title={`${post.title} - KOKODA`}>
            <div className="px-7 py-8 max-w-3xl mx-auto">

                {/* Main Container */}
                <div className="bg-base rounded-xl overflow-hidden shadow-md">

                    {/* Image */}
                    <div className="relative w-full h-96 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 right-4 ${labelColor} text-base px-4 py-2 rounded-full text-xs font-semibold font-quicksand uppercase tracking-wide`}>
                            {labelText}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">

                        {/* Header with Title */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-tertiary font-quicksand mb-3">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={16} className="text-tertiary flex-shrink-0" />
                                    {typeof post.location === 'object' ? post.location?.place_name : post.location}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-tertiary text-xs font-semibold tracking-wide">
                                    {new Date(post.created_at).toLocaleDateString(localeTag, {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-100 px-4 py-4 rounded-lg mb-6 border-l-4 border-label-lost">
                            <div className="font-semibold text-tertiary mb-1">
                                {t('post.postedBy')}: @{post.user.name}
                            </div>
                            <div className="text-xs text-gray-600">
                                {t('post.memberSince')} {new Date(post.user.created_at).toLocaleDateString(localeTag)}
                            </div>
                        </div>

                        {/* Category */}
                        {post.category && (
                            <div className="mb-6">
                                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    {t('post.category')}
                                </div>
                                <div className="inline-block bg-primary text-white px-4 py-2 rounded-2xl text-xs font-medium font-quicksand">
                                    {post.category}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                {t('post.description')}
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                {post.description}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="bg-gray-100 px-4 py-3 rounded-lg mb-6 text-xs text-gray-600">
                            <span className="font-semibold mr-2">{t('post.status')}:</span>
                            <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase ${post.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {post.status === 'active' ? t('profile.active') : t('profile.resolved')}
                            </span>
                        </div>

                        {/* Actions */}
                        {isOwnPost ? (
                            /* Owner: OK (confirm & back to profile) & Edit Post */
                            <div className="flex gap-3 pt-6 border-t border-gray-300">
                                <button
                                    onClick={() => router.visit('/profile')}
                                    className="flex-1 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-lg font-quicksand transition-all duration-200 hover:bg-secondary cursor-pointer"
                                >
                                    {t('post.ok')}
                                </button>
                                <button
                                    onClick={() => router.visit(`/posts/${post.id}/edit`)}
                                    className="flex-1 px-5 py-3 border-2 border-primary text-tertiary text-sm font-semibold rounded-lg font-quicksand transition-all duration-200 hover:bg-primary hover:text-white cursor-pointer"
                                >
                                    {t('post.editPost')}
                                </button>
                            </div>
                        ) : (
                            /* Non-owner: Request & Chat */
                            <div className="pt-6 border-t border-gray-300">
                                <PostActionButtons post={post} variant="default" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

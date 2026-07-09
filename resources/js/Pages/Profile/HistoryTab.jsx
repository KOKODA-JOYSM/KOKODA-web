import { useState } from 'react';
import PostDetailModal from '@/Components/Home/PostDetailModal';
import { useTranslation } from '@/hooks/useTranslation';

const LOCALE_TAGS = { en: 'en-US', id: 'id-ID' };

export default function HistoryTab({ posts = [] }) {
    const { t, locale } = useTranslation();
    const localeTag = LOCALE_TAGS[locale] || 'en-US';
    const [selectedPost, setSelectedPost] = useState(null);

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/10 rounded-2xl">
                <p className="text-tertiary font-semibold text-lg mb-2">{t('profile.noResolvedPostsYet')}</p>
                <p className="text-tertiary/60 text-sm">
                    {t('profile.noResolvedPostsDesc')}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">

                {posts.map((item) => (
                    <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedPost(item)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedPost(item);
                            }
                        }}
                        className="bg-secondary rounded-[20px] p-3 shadow-sm cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                        <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">

                            {/* Gambar */}
                            <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative">
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop'}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Status badge resolved */}
                                <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-bold uppercase shadow bg-green-500 text-white">
                                    {t('profile.resolved')}
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
                                        <div className="flex items-center gap-1.5 bg-tertiary/10 text-tertiary text-xs font-semibold px-3 py-1 rounded-full mb-2 max-w-full overflow-hidden">
                                            <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            <span className="truncate">{typeof item.location === 'object' ? item.location?.place_name : item.location}</span>
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
                                    <span className="text-xs text-green-600 font-bold">✓ {t('profile.completed')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </>
    );
}

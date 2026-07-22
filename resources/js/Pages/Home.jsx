import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PostCard from '@/Components/Home/PostCard';
import CreatePostModal from '@/Components/Home/CreatePostModal';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home({ posts }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Initial render always ranks by the default (Jakarta) location — the server
    // has no way to know the real position yet. Once the browser grants geolocation,
    // silently re-rank the feed against the user's actual coordinates.
    useEffect(() => {
        if (!navigator.geolocation) return;

        // getCurrentPosition can resolve well after the permission prompt closes —
        // if the user has already navigated away from Home, drop the result instead
        // of reloading a 'posts' prop against whatever page they're on now.
        let ignore = false;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (ignore) return;
                router.reload({
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    only: ['posts'],
                });
            },
            () => {
                // Denied or unavailable — keep the default Jakarta-ranked feed.
            }
        );

        return () => {
            ignore = true;
        };
    }, []);

    // Ambil data posts dari database via backend (PostController::index())
    // posts = Paginator object => posts.data = array of posts
    const postsData = posts?.data ?? [];

    // Filter posts berdasarkan type
    const filteredPosts = postsData.filter(post => {
        return filterType === 'all' || post.type === filterType;
    });

    // Toggle filter - if clicking same filter again, go back to 'all'
    const handleFilterClick = (type) => {
        if (filterType === type) {
            setFilterType('all');
        } else {
            setFilterType(type);
        }
    };

    return (
        <AppLayout title="Home - KOKODA">
            {/* Main Content Container */}
            <div className="px-4 py-5 pb-32 bg-background min-h-screen w-full">

                {/* Filter Buttons - LOST / FOUND */}
                <div className="flex gap-0 mb-8 justify-center">
                    <div className="flex bg-primary rounded-lg p-1.5 shadow-md gap-1.5">
                        {['lost', 'found'].map((type, index) => (
                            <div key={type} className="flex items-center">
                                <button
                                    onClick={() => handleFilterClick(type)}
                                    className={`px-12 py-3 rounded-lg border-none font-bold cursor-pointer font-quicksand transition-all duration-300 uppercase tracking-wide text-tertiary ${filterType === type
                                        ? 'bg-highlight shadow-sm'
                                        : 'bg-base'
                                        }`}
                                >
                                    {type === 'lost' ? t('home.lost') : t('home.found')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Feed - Vertical Scrollable */}
                {filteredPosts.length > 0 ? (
                    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-2 sm:px-4">
                        {filteredPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-16 bg-gray-100 rounded-xl">
                        <div className="text-5xl mb-4">
                            🔍
                        </div>
                        <h2 className="text-lg font-semibold text-tertiary font-quicksand mb-2">
                            {t('home.noItems')}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {t('home.beFirst')}
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Plus Button */}
            <button
                onClick={() => auth.user ? setShowCreateModal(true) : router.get('/login')}
                className="fixed bottom-8 right-8 w-[70px] h-[70px] rounded-2xl bg-primary text-background border-none text-5xl font-bold cursor-pointer shadow-md flex items-center justify-center transition-all duration-300 z-1 hover:scale-110 hover:shadow-lg"
            >
                +
            </button>

            {/* Create Post Modal */}
            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </AppLayout>
    );
}

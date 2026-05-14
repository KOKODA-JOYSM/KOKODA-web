import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PostCard from '@/Components/Home/PostCard';
import CreatePostModal from '@/Components/Home/CreatePostModal';

export default function Home({ posts }) {
    const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
    const [showCreateModal, setShowCreateModal] = useState(false);

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
                    <div className="flex bg-primary rounded-lg p-2 shadow-md gap-0">
                        {['lost', 'found'].map((type, index) => (
                            <div key={type} className="flex items-center">
                                <button
                                    onClick={() => handleFilterClick(type)}
                                    className={`px-12 py-3 rounded-lg border-none text-base font-bold cursor-pointer font-quicksand transition-all duration-300 uppercase tracking-wide ${filterType === type
                                        ? (type === 'lost' ? 'bg-label-lost text-base' : 'bg-label-found text-base')
                                        : 'bg-transparent text-background hover:bg-gray-200 hover:bg-opacity-20'
                                        }`}
                                >
                                    {type === 'lost' ? 'Lost' : 'Found'}
                                </button>
                                {index === 0 && (
                                    <div className="h-8 w-px rounded-lg bg-background"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Posts Feed - Vertical Scrollable */}
                {filteredPosts.length > 0 ? (
                    <div className="flex flex-col gap-20 w-full px-24">
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
                            No items found
                        </h2>
                        <p className="text-sm text-gray-600">
                            Be the first to post!
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Plus Button */}
            <button
                onClick={() => setShowCreateModal(true)}
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

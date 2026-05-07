import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PostCard from '@/Components/Home/PostCard';
import CreatePostModal from '@/Components/Home/CreatePostModal';

export default function Home({ posts }) {
    const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Dummy posts data for testing
    const dummyPosts = [
        {
            id: 1,
            title: 'Lost Golden Retriever',
            description: 'Missing since Monday afternoon near Central Park. Very friendly dog, answers to Max. Please call if spotted!',
            location: 'Central Park, New York',
            type: 'lost',
            category: 'Pet',
            user: { id: 1, name: 'John Doe' },
            created_at: '2024-05-05T10:30:00',
            image_url: null,
            status: 'active'
        },
        {
            id: 2,
            title: 'Found Blue Backpack',
            description: 'Found a blue North Face backpack at the coffee shop. Contains some books and a laptop charger. DM me to claim!',
            location: 'Coffee Shop Downtown',
            type: 'found',
            category: 'Bag',
            user: { id: 2, name: 'Jane Smith' },
            created_at: '2024-05-04T15:45:00',
            image_url: null,
            status: 'active'
        },
        {
            id: 3,
            title: 'Lost Silver Watch',
            description: 'Vintage Rolex watch lost at the mall. Has sentimental value. Reward offered for safe return.',
            location: 'Shopping Mall',
            type: 'lost',
            category: 'Accessory',
            user: { id: 3, name: 'Mike Johnson' },
            created_at: '2024-05-03T12:20:00',
            image_url: null,
            status: 'active'
        },
        {
            id: 4,
            title: 'Found House Keys',
            description: 'Found a set of house keys with a blue keychain near the bus stop. Please describe the keychain to claim.',
            location: 'Bus Stop Main Street',
            type: 'found',
            category: 'Key',
            user: { id: 4, name: 'Sarah Wilson' },
            created_at: '2024-05-02T09:15:00',
            image_url: null,
            status: 'active'
        },
    ];

    // Use dummy posts if no posts from server
    const postsData = posts && posts.data && posts.data.length > 0 ? posts : { data: dummyPosts };

    // Filter posts berdasarkan type
    const filteredPosts = postsData.data.filter(post => {
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

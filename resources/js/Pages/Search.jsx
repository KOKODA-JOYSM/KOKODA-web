import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SearchBar from '@/Components/Search/SearchBar';
import FilterLostFound from '@/Components/Search/FilterLostFound';
import FilterLocation from '@/Components/Search/FilterLocation';
import SearchResult from '@/Components/Search/SearchResult';
import PostDetailModal from '@/Components/Home/PostDetailModal';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationCoords, setLocationCoords] = useState(null);

    // Fetch posts from database
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);
                if (typeFilter !== 'all') params.append('type', typeFilter);
                if (locationFilter !== 'All Locations') params.append('location', locationFilter);
                
                // Add coordinates for radius search (if available)
                if (locationCoords) {
                    params.append('latitude', locationCoords.lat);
                    params.append('longitude', locationCoords.lng);
                    params.append('radius', 5); // 5km
                }

                const response = await fetch(`/api/search?${params}`);
                const data = await response.json();
                setPosts(data.data || []);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [searchQuery, typeFilter, locationFilter, locationCoords]);

    const handleLocationWithCoords = (locationName, coords) => {
        setLocationCoords(coords); // Can be null (fallback to name search)
        setLocationFilter(locationName);
    };

    return (
        <AppLayout title="Search">
            <div className="min-h-screen bg-background -mt-16 lg:mt-0 pt-20 lg:pt-10 px-4 md:px-8 flex justify-center">
                <div className="w-full max-w-3xl">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <FilterLostFound selected={typeFilter} onChange={setTypeFilter} />
                        <FilterLocation 
                            selected={locationFilter} 
                            onChange={setLocationFilter}
                            onLocationWithCoords={handleLocationWithCoords}
                        />
                    </div>

                    <div className="mb-6 text-gray-text-field font-quicksand font-semibold ml-2 text-sm">
                        {loading ? 'Loading...' : `${posts.length} result${locationCoords ? ' within 5km radius' : ''}`}
                    </div>

                    {/* Results Section */}
                    <div>
                        <SearchResult items={posts} onItemClick={setSelectedPost} />
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

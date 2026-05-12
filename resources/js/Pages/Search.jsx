import React, { useState, useMemo } from 'react';
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

    // Mock data for initial UI implementation
    const mockItems = [
        { id: 1, type: 'lost', title: 'Ayam Jerry', description: 'Lorem ipsum dolor sit amet consectetur. Accumsan turpis porttitor velit amet vitae pulvinar pretium amet.', location: 'Boyolali', created_at: '2023-10-24T10:00:00', user: { name: 'JerryOwner' }, category: 'Pet', image: null },
        { id: 2, type: 'found', title: 'Ayam Jerry', description: 'Lorem ipsum dolor sit amet consectetur. Accumsan turpis porttitor velit amet vitae pulvinar pretium amet.', location: 'Boyolali', created_at: '2023-10-25T10:00:00', user: { name: 'Finder123' }, category: 'Pet', image: null },
        { id: 3, type: 'lost', title: 'Mas Steven', description: 'Lorem ipsum dolor sit amet consectetur.', location: 'Jogja', created_at: '2023-10-22T10:00:00', user: { name: 'StevenFriend' }, category: 'Person', image: null },
        { id: 4, type: 'found', title: 'Silver Casio Watch', description: 'Found a digital watch near the entrance.', location: 'Jakarta', created_at: '2023-10-26T10:00:00', user: { name: 'SecurityGuard' }, category: 'Accessories', image: null },
        { id: 5, type: 'lost', title: 'MacBook Charger', description: 'Forgot my USB-C charger in a cafe.', location: 'Bandung', created_at: '2023-10-21T10:00:00', user: { name: 'CafeWorker' }, category: 'Electronics', image: null },
        { id: 6, type: 'found', title: 'Car Keys', description: 'Honda car keys found on the ground.', location: 'Surabaya', created_at: '2023-10-27T10:00:00', user: { name: 'GoodSamaritan' }, category: 'Keys', image: null },
    ];

    // Filter logic
    const filteredItems = useMemo(() => {
        return mockItems.filter(item => {
            // Text search
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Type filter
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            
            // Location filter
            const matchesLocation = locationFilter === 'All Locations' || item.location.toLowerCase() === locationFilter.toLowerCase();

            return matchesSearch && matchesType && matchesLocation;
        });
    }, [searchQuery, typeFilter, locationFilter, mockItems]);

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
                        <FilterLocation selected={locationFilter} onChange={setLocationFilter} />
                    </div>

                    <div className="mb-6 text-gray-text-field font-quicksand font-semibold ml-2 text-sm">
                        {filteredItems.length} result - {locationFilter === 'All Locations' ? 'Jogja' : locationFilter}
                    </div>

                    {/* Results Section */}
                    <div>
                        <SearchResult items={filteredItems} onItemClick={setSelectedPost} />
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

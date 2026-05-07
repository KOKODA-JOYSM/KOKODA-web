import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SearchBar from '@/Components/Search/SearchBar';
import FilterLostFound from '@/Components/Search/FilterLostFound';
import FilterLocation from '@/Components/Search/FilterLocation';
import SearchResult from '@/Components/Search/SearchResult';

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('All Locations');

    // Mock data for initial UI implementation
    const mockItems = [
        { id: 1, type: 'lost', name: 'Ayam Jerry', description: 'Lorem ipsum dolor sit amet consectetur. Accumsan turpis porttitor velit amet vitae pulvinar pretium amet.', location: 'Boyolali', date: 'Oct 24, 2023', image: null },
        { id: 2, type: 'found', name: 'Ayam Jerry', description: 'Lorem ipsum dolor sit amet consectetur. Accumsan turpis porttitor velit amet vitae pulvinar pretium amet.', location: 'Boyolali', date: 'Oct 25, 2023', image: null },
        { id: 3, type: 'lost', name: 'Mas Steven', description: 'Lorem ipsum dolor sit amet consectetur.', location: 'Jogja', date: 'Oct 22, 2023', image: null },
        { id: 4, type: 'found', name: 'Silver Casio Watch', description: 'Found a digital watch near the entrance.', location: 'Jakarta', date: 'Oct 26, 2023', image: null },
        { id: 5, type: 'lost', name: 'MacBook Charger', description: 'Forgot my USB-C charger in a cafe.', location: 'Bandung', date: 'Oct 21, 2023', image: null },
        { id: 6, type: 'found', name: 'Car Keys', description: 'Honda car keys found on the ground.', location: 'Surabaya', date: 'Oct 27, 2023', image: null },
    ];

    // Filter logic
    const filteredItems = useMemo(() => {
        return mockItems.filter(item => {
            // Text search
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Type filter
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            
            // Location filter
            const matchesLocation = locationFilter === 'All Locations' || item.location === locationFilter;

            return matchesSearch && matchesType && matchesLocation;
        });
    }, [searchQuery, typeFilter, locationFilter, mockItems]);

    return (
        <AppLayout title="Search">
            <div className="min-h-screen bg-background pt-10 px-4 md:px-8 flex justify-center">
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
                        <SearchResult items={filteredItems} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

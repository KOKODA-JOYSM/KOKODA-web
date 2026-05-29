import React, { useState, useEffect } from 'react';

export default function FilterLocation({ selected, onChange, onLocationWithCoords }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected === 'All Locations' ? '' : selected);
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapSearch, setMapSearch] = useState('');
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [geocodeError, setGeocodeError] = useState(null);

    // Fetch locations from database
    useEffect(() => {
        setLoading(true);
        fetch('/api/locations')
            .then(res => res.json())
            .then(data => {
                setLocations(data);
                setFilteredLocations(data);
            })
            .catch(err => {
                console.error('Failed to fetch locations:', err);
                // Tidak tampil error ke user, cukup diam
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter locations based on input
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setMapSearch(value);
        setGeocodeError(null);
        if (value.trim()) {
            setFilteredLocations(
                locations.filter(loc =>
                    loc.toLowerCase().includes(value.toLowerCase())
                )
            );
        } else {
            setFilteredLocations(locations);
        }
    };

    // Geocode place name to coordinates
    const geocodePlace = async (placeName) => {
        try {
            console.log('🔍 Geocoding:', placeName);
            
            // Coba nama lengkap dulu
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&countrycodes=id&limit=3`);
            let data = await response.json();
            console.log('Nominatim response (full):', data);
            
            if (data && data.length > 0) {
                const result = data[0];
                const coords = {
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    name: placeName,
                    displayName: result.display_name
                };
                console.log('✅ Geocoded successfully:', coords);
                setGeocodeError(null);
                return coords;
            }

            // Jika gagal, coba dengan kata-kata terakhir (biasanya nama kota)
            const words = placeName.trim().split(/\s+/);
            if (words.length > 1) {
                // Coba 2 kata terakhir
                const fallback1 = words.slice(-2).join(' ');
                console.log('🔄 Trying fallback 1:', fallback1);
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallback1)}&countrycodes=id&limit=3`);
                data = await response.json();
                if (data && data.length > 0) {
                    const result = data[0];
                    const coords = {
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        name: placeName,
                        displayName: result.display_name
                    };
                    console.log('✅ Geocoded via fallback 1:', coords);
                    setGeocodeError(null);
                    return coords;
                }

                // Coba kata terakhir saja (nama kota)
                const fallback2 = words[words.length - 1];
                console.log('🔄 Trying fallback 2 (city):', fallback2);
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallback2)}&countrycodes=id&limit=3`);
                data = await response.json();
                if (data && data.length > 0) {
                    const result = data[0];
                    const coords = {
                        lat: parseFloat(result.lat),
                        lng: parseFloat(result.lon),
                        name: placeName,
                        displayName: result.display_name
                    };
                    console.log('✅ Geocoded via city fallback:', coords);
                    setGeocodeError(null);
                    return coords;
                }
            }

            console.warn('⚠️ No results from Nominatim for any fallback');
            setGeocodeError(`Koordinat tidak ditemukan untuk "${placeName}". Akan mencari berdasarkan nama lokasi saja.`);
        } catch (err) {
            console.error('❌ Geocoding error:', err);
            setGeocodeError('Geocoding gagal. Mencari berdasarkan nama lokasi saja.');
        }
        return null;
    };

    const handleSelectLocation = async (location) => {
        setInputValue(location);
        setMapSearch(location);
        setLoading(true);
        setGeocodeError(null);

        // Get coordinates from OpenStreetMap Nominatim
        const coords = await geocodePlace(location);
        if (coords) {
            setSelectedCoords(coords);
            onChange(location);
            if (onLocationWithCoords) {
                onLocationWithCoords(location, coords);
            }
        } else {
            // Fallback: search by location name only (no radius)
            onChange(location);
            if (onLocationWithCoords) {
                onLocationWithCoords(location, null);
            }
        }
        setLoading(false);
        setIsOpen(false);
    };

    const handleApply = async () => {
        if (inputValue) {
            setLoading(true);
            setGeocodeError(null);
            const coords = await geocodePlace(inputValue);
            if (coords) {
                setSelectedCoords(coords);
                onChange(inputValue);
                if (onLocationWithCoords) {
                    onLocationWithCoords(inputValue, coords);
                }
            } else {
                // Fallback: search by location name only
                onChange(inputValue);
                if (onLocationWithCoords) {
                    onLocationWithCoords(inputValue, null);
                }
            }
            setLoading(false);
        } else {
            onChange('All Locations');
            if (onLocationWithCoords) {
                onLocationWithCoords('All Locations', null);
            }
        }
        setIsOpen(false);
    };

    return (
        <div className="flex">
            {/* The Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative bg-tertiary text-base rounded-full font-quicksand py-2 pl-10 pr-6 focus:outline-none shadow-md cursor-pointer font-semibold text-sm h-[40px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
                <div className="absolute left-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span>{selected}</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    {/* Modal Content */}
                    <div className="bg-base w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b-2 border-gray-200/50 bg-background">
                            <h2 className="text-2xl font-quicksand font-bold text-tertiary">Location</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-tertiary text-base rounded-lg p-1.5 hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">Search Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-tertiary">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Aeon, Magetan, Jakarta"
                                        className="w-full bg-white text-tertiary rounded-md py-2.5 pl-9 pr-3 font-quicksand text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-gray-text-field border border-secondary/20"
                                    />
                                </div>

                                {/* Locations Dropdown */}
                                {isOpen && filteredLocations.length > 0 && (
                                    <div className="mt-2 bg-white border border-secondary/20 rounded-md max-h-48 overflow-y-auto shadow-sm">
                                        {filteredLocations.map((location, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectLocation(location)}
                                                className="w-full text-left px-3 py-2 text-sm font-quicksand text-tertiary hover:bg-highlight/30 transition-colors border-b border-secondary/10 last:border-b-0"
                                            >
                                                {location}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {loading && (
                                    <div className="text-xs text-gray-text-field font-quicksand mt-1">Loading...</div>
                                )}

                                {geocodeError && (
                                    <div className="text-xs text-label-lost font-quicksand mt-1 bg-red-100/50 p-2 rounded">
                                        ⚠️ {geocodeError}
                                    </div>
                                )}

                                {selectedCoords && !geocodeError && (
                                    <div className="text-xs text-secondary font-quicksand mt-1 bg-highlight/20 p-2 rounded">
                                        📍 Coordinates: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                                        <br />
                                        <span className="text-tertiary font-bold">Radius: 5km</span>
                                    </div>
                                )}
                            </div>

                            {/* Map Container — default ke BCA Learning Institute, Sentul */}
                            <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden border border-secondary/20 relative bg-gray-100">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(inputValue || 'BCA Learning Institute Sentul')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-0 mt-2 bg-background border-t border-secondary/10">
                            <button
                                onClick={handleApply}
                                className="w-full bg-tertiary text-base rounded-xl py-3 font-quicksand font-bold text-base hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Apply & Search'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

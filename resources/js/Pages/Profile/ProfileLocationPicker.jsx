import React, { useState, useEffect } from 'react';

export default function ProfileLocationPicker({ selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected || '');
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapSearch, setMapSearch] = useState(selected || '');
    const [geocodeError, setGeocodeError] = useState(null);

    useEffect(() => {
        setInputValue(selected || '');
        setMapSearch(selected || '');
    }, [selected]);

    useEffect(() => {
        fetch('/api/locations')
            .then(res => res.json())
            .then(data => {
                setLocations(data);
                setFilteredLocations(data);
            })
            .catch(() => {});
    }, []);

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

    const geocodePlace = async (placeName) => {
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&countrycodes=id&limit=3`);
            let data = await response.json();

            if (data && data.length > 0) {
                setGeocodeError(null);
                return data[0];
            }

            const words = placeName.trim().split(/\s+/);
            if (words.length > 1) {
                const fallback1 = words.slice(-2).join(' ');
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallback1)}&countrycodes=id&limit=3`);
                data = await response.json();
                if (data && data.length > 0) {
                    setGeocodeError(null);
                    return data[0];
                }

                const fallback2 = words[words.length - 1];
                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallback2)}&countrycodes=id&limit=3`);
                data = await response.json();
                if (data && data.length > 0) {
                    setGeocodeError(null);
                    return data[0];
                }
            }

            setGeocodeError(`Lokasi "${placeName}" tidak ditemukan di peta, namun tetap disimpan.`);
        } catch {
            setGeocodeError('Gagal memuat peta. Lokasi tetap akan disimpan.');
        }
        return null;
    };

    const handleSelectLocation = async (location) => {
        setInputValue(location);
        setLoading(true);
        setGeocodeError(null);
        const result = await geocodePlace(location);
        if (result) {
            setMapSearch(result.display_name || location);
        }
        onChange(location);
        setLoading(false);
        setIsOpen(false);
    };

    const handleSave = async () => {
        if (!inputValue.trim()) {
            onChange('');
            setIsOpen(false);
            return;
        }
        setLoading(true);
        setGeocodeError(null);
        const result = await geocodePlace(inputValue);
        if (result) {
            setMapSearch(result.display_name || inputValue);
        }
        onChange(inputValue);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <>
            {/* Trigger — tampak seperti input form */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full bg-base text-left rounded-xl border-none px-4 py-3 text-sm shadow-sm flex items-center gap-2 hover:ring-2 hover:ring-tertiary transition-all focus:outline-none focus:ring-2 focus:ring-tertiary"
            >
                <svg className="w-4 h-4 text-tertiary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={selected ? 'text-tertiary' : 'text-gray-400'}>
                    {selected || 'Pilih lokasi Anda...'}
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-base w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b-2 border-gray-200/50 bg-background">
                            <h2 className="text-2xl font-quicksand font-bold text-tertiary">Pilih Lokasi</h2>
                            <button
                                type="button"
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
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">Cari Lokasi</label>
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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSave();
                                            }
                                        }}
                                        placeholder="Contoh: Tangerang, Jakarta, Bandung"
                                        className="w-full bg-white text-tertiary rounded-md py-2.5 pl-9 pr-3 font-quicksand text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-gray-text-field border border-secondary/20"
                                        autoFocus
                                    />
                                </div>

                                {/* Dropdown suggestions */}
                                {filteredLocations.length > 0 && (
                                    <div className="mt-2 bg-white border border-secondary/20 rounded-md max-h-48 overflow-y-auto shadow-sm">
                                        {filteredLocations.map((location, index) => (
                                            <button
                                                type="button"
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
                                    <div className="text-xs text-gray-text-field font-quicksand mt-1">Memuat...</div>
                                )}

                                {geocodeError && (
                                    <div className="text-xs text-label-lost font-quicksand mt-1 bg-red-100/50 p-2 rounded">
                                        ⚠️ {geocodeError}
                                    </div>
                                )}
                            </div>

                            {/* Map Preview */}
                            <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden border border-secondary/20 relative bg-gray-100">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapSearch || 'Indonesia')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-0 mt-2 bg-background border-t border-secondary/10">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full bg-tertiary text-base rounded-xl py-3 font-quicksand font-bold text-base hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

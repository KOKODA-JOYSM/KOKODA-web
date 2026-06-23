import React, { useState, useEffect } from 'react';
import GooglePlacesInput from '@/Components/Common/GooglePlacesInput';
import LeafletMap from '@/Components/Common/LeafletMap';

export default function FilterLocation({ selected, onChange, onLocationWithCoords }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected === 'All Locations' ? '' : selected);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [mapLoading, setMapLoading] = useState(false);

    const isFiltered = selected !== 'All Locations';

    // Sync jika prop selected berubah dari luar (misal saat clear)
    useEffect(() => {
        if (selected === 'All Locations') {
            setInputValue('');
            setSelectedCoords(null);
        } else {
            setInputValue(selected);
        }
    }, [selected]);

    // Dipanggil saat user pilih lokasi dari dropdown GooglePlacesInput
    const handleLocationSelect = ({ place_name, latitude, longitude }) => {
        if (!place_name) return;

        const coords = latitude && longitude
            ? { lat: latitude, lng: longitude }
            : null;

        setInputValue(place_name);
        setSelectedCoords(coords);
        onChange(place_name);
        if (onLocationWithCoords) {
            onLocationWithCoords(place_name, coords);
        }
    };

    // Dipanggil saat user klik di map (LeafletMap reverse geocode callback)
    const handleMapClick = ({ place_name, lat, lng, loading }) => {
        if (loading) {
            setMapLoading(true);
            return;
        }
        setMapLoading(false);

        if (!place_name) return;

        const coords = { lat, lng };
        setInputValue(place_name);
        setSelectedCoords(coords);
        onChange(place_name);
        if (onLocationWithCoords) {
            onLocationWithCoords(place_name, coords);
        }
    };

    // Apply dengan nama yang diketik manual (tanpa pilih dari list)
    const handleApply = () => {
        if (inputValue.trim()) {
            onChange(inputValue.trim());
            if (onLocationWithCoords) {
                onLocationWithCoords(inputValue.trim(), selectedCoords);
            }
        } else {
            handleClear();
            return;
        }
        setIsOpen(false);
    };

    // Reset semua filter lokasi
    const handleClear = () => {
        setInputValue('');
        setSelectedCoords(null);
        onChange('All Locations');
        if (onLocationWithCoords) {
            onLocationWithCoords('All Locations', null);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-1">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`relative font-quicksand py-2 pl-10 pr-6 focus:outline-none shadow-md cursor-pointer font-semibold text-sm h-[40px] flex items-center gap-2 hover:opacity-90 transition-opacity rounded-full ${
                    isFiltered
                        ? 'bg-highlight text-tertiary border-2 border-secondary'
                        : 'bg-tertiary text-base'
                }`}
            >
                <div className="absolute left-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span className="max-w-[120px] truncate">{selected}</span>
            </button>

            {/* Tombol X — hanya muncul kalau ada filter aktif */}
            {isFiltered && (
                <button
                    onClick={handleClear}
                    title="Clear location filter"
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-tertiary text-base hover:opacity-80 transition-opacity shadow-md flex-shrink-0"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
                        <div className="p-5 flex flex-col gap-3 overflow-y-auto">

                            {/* Search — sama seperti Create Post */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">
                                    Search Location
                                </label>
                                <GooglePlacesInput
                                    value={inputValue}
                                    onSelect={handleLocationSelect}
                                    placeholder="e.g. Aeon Mall, Magetan, Jakarta..."
                                    className="w-full bg-white text-tertiary rounded-md py-2.5 pr-3 font-quicksand text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-gray-text-field border border-secondary/20"
                                />
                            </div>

                            {/* Koordinat info */}
                            {selectedCoords && (
                                <div className="text-xs text-secondary font-quicksand bg-highlight/20 px-3 py-2 rounded-lg flex items-center justify-between">
                                    <span>{selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}</span>
                                    <span className="text-tertiary font-bold">Radius: 5 km</span>
                                </div>
                            )}

                            {/* Interactive Leaflet Map */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">
                                    Or tap on the map
                                </label>
                                <LeafletMap
                                    center={selectedCoords ? [selectedCoords.lat, selectedCoords.lng] : [-6.5833, 106.8]}
                                    markerPos={selectedCoords ? [selectedCoords.lat, selectedCoords.lng] : null}
                                    onMapClick={handleMapClick}
                                    loading={mapLoading}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-0 mt-2 bg-background border-t border-secondary/10 flex gap-3">
                            {isFiltered && (
                                <button
                                    onClick={handleClear}
                                    className="flex-none px-4 py-3 rounded-xl border-2 border-tertiary/30 text-tertiary font-quicksand font-bold text-sm hover:bg-tertiary/10 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={handleApply}
                                className="flex-1 bg-tertiary text-base rounded-xl py-3 font-quicksand font-bold text-base hover:opacity-90 transition-opacity shadow-md"
                            >
                                Apply & Search
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

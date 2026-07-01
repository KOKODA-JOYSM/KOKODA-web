import React, { useState, useEffect } from 'react';
import GooglePlacesInput from '@/Components/Common/GooglePlacesInput';
import LeafletMap from '@/Components/Common/LeafletMap';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileLocationPicker({ selected, onChange }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected || '');
    const [selectedCoords, setSelectedCoords] = useState(null);
    const [mapLoading, setMapLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setInputValue(selected || '');
        setSelectedCoords(null);
    }, [isOpen]);

    const handleLocationSelect = ({ place_name, latitude, longitude }) => {
        if (!place_name) return;
        setInputValue(place_name);
        setSelectedCoords(latitude && longitude ? { lat: latitude, lng: longitude } : null);
    };

    const handleMapClick = ({ place_name, lat, lng, loading }) => {
        if (loading) {
            setMapLoading(true);
            return;
        }
        setMapLoading(false);
        if (!place_name) return;
        setInputValue(place_name);
        setSelectedCoords({ lat, lng });
    };

    const handleSave = () => {
        onChange(inputValue.trim() || '');
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
                    {selected || t('profile.chooseLocation')}
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-base w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b-2 border-gray-200/50 bg-background">
                            <h2 className="text-2xl font-quicksand font-bold text-tertiary">{t('profile.chooseLocationTitle')}</h2>
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
                        <div className="p-5 flex flex-col gap-3 overflow-y-auto">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">
                                    {t('profile.searchLocation')}
                                </label>
                                <GooglePlacesInput
                                    value={inputValue}
                                    onSelect={handleLocationSelect}
                                    placeholder={t('profile.searchLocationPlaceholder')}
                                    className="w-full bg-white text-tertiary rounded-md py-2.5 pr-3 font-quicksand text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-gray-text-field border border-secondary/20"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-quicksand text-gray-text-field font-bold tracking-wide">
                                    {t('profile.orTapMap')}
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
                        <div className="p-5 pt-0 mt-2 bg-background border-t border-secondary/10">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full bg-tertiary text-base rounded-xl py-3 font-quicksand font-bold text-base hover:opacity-90 transition-opacity shadow-md"
                            >
                                {t('profile.saveLocation')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

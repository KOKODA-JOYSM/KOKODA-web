import React, { useEffect, useRef } from 'react';

/**
 * LeafletMap — interactive OpenStreetMap with click-to-select location.
 *
 * Props:
 *  - center      : [lat, lng]   – initial map center
 *  - markerPos   : [lat, lng]   – current marker position (nullable)
 *  - onMapClick  : fn({ place_name, lat, lng }) – called when user clicks map
 *  - loading     : bool – show loading overlay saat reverse geocoding
 */
export default function LeafletMap({ center, markerPos, onMapClick, loading }) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef   = useRef(null);
    const markerRef        = useRef(null);
    const leafletLoadedRef = useRef(false);

    // Load Leaflet CSS + JS dari CDN (sekali saja)
    useEffect(() => {
        if (leafletLoadedRef.current || window.L) {
            initMap();
            return;
        }

        // Inject CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id   = 'leaflet-css';
            link.rel  = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Inject JS
        if (!document.getElementById('leaflet-js')) {
            const script  = document.createElement('script');
            script.id     = 'leaflet-js';
            script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                leafletLoadedRef.current = true;
                initMap();
            };
            document.head.appendChild(script);
        }

        return () => {
            // Cleanup map instance saat komponen unmount
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-center + move marker kalau prop berubah
    useEffect(() => {
        if (!mapInstanceRef.current || !markerPos) return;
        const L = window.L;
        mapInstanceRef.current.setView(markerPos, 14, { animate: true });
        if (markerRef.current) {
            markerRef.current.setLatLng(markerPos);
        } else {
            markerRef.current = L.marker(markerPos).addTo(mapInstanceRef.current);
        }
    }, [markerPos]);

    function initMap() {
        if (mapInstanceRef.current || !mapContainerRef.current) return;
        const L = window.L;

        // Fix default icon path issue dengan bundler
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const initialCenter = center || [-6.5833, 106.8];
        const map = L.map(mapContainerRef.current, {
            center: initialCenter,
            zoom: 13,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);

        // Taruh marker awal kalau ada
        if (markerPos) {
            markerRef.current = L.marker(markerPos).addTo(map);
            map.setView(markerPos, 14);
        }

        // Klik di map → reverse geocode → auto fill
        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;

            // Pindahkan / buat marker
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }

            if (onMapClick) onMapClick({ place_name: null, lat, lng, loading: true });

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                    { headers: { 'Accept-Language': 'id,en' } }
                );
                const data = await res.json();
                const place_name = data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                if (onMapClick) onMapClick({ place_name, lat, lng, loading: false });
            } catch {
                const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                if (onMapClick) onMapClick({ place_name: fallback, lat, lng, loading: false });
            }
        });

        mapInstanceRef.current = map;
    }

    return (
        <div className="relative w-full h-52 md:h-60 rounded-xl overflow-hidden border border-secondary/20">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Loading overlay saat reverse geocoding */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl z-[500]">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow text-xs font-quicksand font-semibold text-tertiary">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Getting location...
                    </div>
                </div>
            )}

            {/* Hint overlay — hanya muncul saat belum ada marker */}
            {!markerPos && !loading && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
                    <div className="bg-white/90 text-tertiary text-xs font-quicksand font-semibold px-3 py-1.5 rounded-full shadow-md">
                        Tap on the map to select a location
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * LocationInput (formerly GooglePlacesInput)
 *
 * Uses Nominatim (OpenStreetMap) — free, no API key needed.
 *
 * Props:
 *  - value        : string  – displayed text (place_name)
 *  - onSelect     : fn({ place_name, latitude, longitude }) – called when user picks a suggestion
 *  - placeholder  : string
 *  - className    : extra Tailwind classes for the input element
 *  - inputStyle   : inline style object (for non-Tailwind pages like Create.jsx / Edit.jsx)
 *  - onFocus / onBlur: passthrough handlers
 *  - error        : error message string
 */
export default function GooglePlacesInput({
    value = '',
    onSelect,
    placeholder = 'Search location…',
    className = '',
    inputStyle = {},
    onFocus,
    onBlur,
    error,
}) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const debounceTimer = useRef(null);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Sync external value changes
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
                setActiveSuggestion(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&countrycodes=id`,
                {
                    headers: {
                        'Accept-Language': 'id,en',
                        'User-Agent': 'KOKODA-App/1.0',
                    },
                }
            );
            const data = await res.json();
            // Filter client-side: hanya tampilkan hasil dari Indonesia
            const indonesiaOnly = data.filter(
                (place) => place?.address?.country_code === 'id'
            ).slice(0, 6);
            setSuggestions(indonesiaOnly);
            setShowDropdown(indonesiaOnly.length > 0);
            setActiveSuggestion(-1);
        } catch (err) {
            setSuggestions([]);
            setShowDropdown(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        if (val === '' && onSelect) {
            onSelect({ place_name: '', latitude: null, longitude: null });
            setSuggestions([]);
            setShowDropdown(false);
        }

        // Debounce search
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(val);
        }, 350);
    };

    const handleSelect = (place) => {
        const place_name = place.display_name;
        const latitude = parseFloat(place.lat);
        const longitude = parseFloat(place.lon);

        setInputValue(place_name);
        setSuggestions([]);
        setShowDropdown(false);
        setActiveSuggestion(-1);

        if (onSelect) {
            onSelect({ place_name, latitude, longitude });
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestion >= 0) {
                handleSelect(suggestions[activeSuggestion]);
            }
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
            setActiveSuggestion(-1);
        }
    };

    const handleFocus = (e) => {
        if (suggestions.length > 0) setShowDropdown(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
        if (onBlur) onBlur(e);
    };

    // Get short label for a place
    const getShortLabel = (place) => {
        const addr = place.address || {};
        const parts = [
            addr.city || addr.town || addr.village || addr.county,
            addr.state || addr.region,
            addr.country,
        ].filter(Boolean);
        return parts.join(', ') || place.display_name;
    };

    return (
        <div ref={containerRef} className="relative w-full" style={{ position: 'relative' }}>
            {/* Map pin icon */}
            <span
                style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#9CA3AF',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </span>

            {/* Loading spinner */}
            {isLoading && (
                <span
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                >
                    <svg
                        style={{ animation: 'spin 1s linear infinite' }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            style={{ opacity: 0.25 }}
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            style={{ opacity: 0.75 }}
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </span>
            )}

            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
                className={`pl-9 ${className}`}
                style={inputStyle}
            />

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FEFBF6',
                        border: '1.5px solid #F4C799',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(45,22,6,0.13)',
                        zIndex: 9999,
                        padding: '4px 0',
                        margin: 0,
                        listStyle: 'none',
                        maxHeight: '260px',
                        overflowY: 'auto',
                    }}
                >
                    {suggestions.map((place, index) => (
                        <li
                            key={place.place_id}
                            onMouseDown={() => handleSelect(place)}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                padding: '10px 14px',
                                cursor: 'pointer',
                                backgroundColor:
                                    activeSuggestion === index ? '#FEF0DC' : 'transparent',
                                transition: 'background-color 0.15s ease',
                                borderBottom:
                                    index < suggestions.length - 1
                                        ? '1px solid rgba(244,199,153,0.4)'
                                        : 'none',
                            }}
                            onMouseEnter={() => setActiveSuggestion(index)}
                            onMouseLeave={() => setActiveSuggestion(-1)}
                        >
                            {/* Pin icon */}
                            <span style={{ color: '#C0976C', marginTop: '2px', flexShrink: 0 }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </span>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Short name */}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: '#311A05',
                                        fontFamily: "'Quicksand', sans-serif",
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {getShortLabel(place)}
                                </p>
                                {/* Full address */}
                                <p
                                    style={{
                                        margin: '2px 0 0 0',
                                        fontSize: '11px',
                                        color: 'rgba(49,26,5,0.55)',
                                        fontFamily: "'Quicksand', sans-serif",
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {place.display_name}
                                </p>
                            </div>
                        </li>
                    ))}

                    {/* Footer attribution - required by Nominatim ToS */}
                    <li
                        style={{
                            padding: '6px 14px',
                            textAlign: 'right',
                            fontSize: '10px',
                            color: '#BBA07A',
                            fontFamily: "'Quicksand', sans-serif",
                            borderTop: '1px solid rgba(244,199,153,0.3)',
                        }}
                    >
                        © OpenStreetMap contributors
                    </li>
                </ul>
            )}

            {error && (
                <p style={{ color: '#D56666', fontSize: '12px', marginTop: '4px' }}>{error}</p>
            )}
        </div>
    );
}

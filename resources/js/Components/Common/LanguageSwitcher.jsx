import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesia' },
    { value: 'ja', label: '日本語' },
];

export default function LanguageSwitcher({ className = '' }) {
    const { locale } = useTranslation();

    const handleChange = (e) => {
        window.location.href = `/lang/${e.target.value}`;
    };

    return (
        <select
            value={locale}
            onChange={handleChange}
            className={`bg-secondary/30 hover:border-secondary border border-transparent text-white text-xs font-bold rounded-xl px-3 py-2 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary ${className}`}
        >
            {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="text-tertiary bg-base">
                    {lang.label}
                </option>
            ))}
        </select>
    );
}

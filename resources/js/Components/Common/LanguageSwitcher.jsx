import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesia' },
    { value: 'ja', label: '日本語' },
];

const VARIANTS = {
    // For use on colorful/translucent backgrounds (sidebar, login, guest layout).
    default: 'bg-secondary/30 hover:border-secondary border border-transparent text-white',
    // For use on cards whose background matches the default variant's tint
    // (e.g. the secondary-colored card in Profile Edit), where the default
    // variant becomes nearly invisible. Mirrors the old solid button style.
    // (lang-switcher-solid class needed: app.css forces select text color
    // via !important, which would otherwise hide this text on a dark bg)
    solid: 'lang-switcher-solid bg-tertiary hover:bg-tertiary/90 border border-transparent text-base',
};

export default function LanguageSwitcher({ className = '', variant = 'default' }) {
    const { locale } = useTranslation();

    const handleChange = (e) => {
        window.location.href = `/lang/${e.target.value}`;
    };

    return (
        <select
            value={locale}
            onChange={handleChange}
            className={`${VARIANTS[variant]} text-xs font-bold rounded-xl px-3 py-2 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary ${className}`}
        >
            {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="text-tertiary bg-base">
                    {lang.label}
                </option>
            ))}
        </select>
    );
}

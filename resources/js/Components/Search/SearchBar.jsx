import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SearchBar({ value, onChange }) {
    const { t } = useTranslation();
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-tertiary font-bold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder={t('nav.search')}
                className="w-full pl-12 pr-4 py-3 bg-base border-2 border-transparent rounded-full font-quicksand text-tertiary focus:outline-none shadow-md text-lg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

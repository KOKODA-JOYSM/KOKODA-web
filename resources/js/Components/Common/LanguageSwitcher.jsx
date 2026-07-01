import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageSwitcher({ className = '' }) {
    const { locale } = useTranslation();

    return (
        <div className={`flex justify-between items-center bg-secondary/30 p-2 rounded-xl border border-transparent hover:border-secondary transition-colors duration-200 ${className}`}>
            <div className="flex bg-primary rounded-lg p-1 w-full justify-center">
                <a
                    href="/lang/en"
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        locale === 'en'
                            ? 'bg-secondary text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    EN
                </a>
                <a
                    href="/lang/id"
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        locale === 'id'
                            ? 'bg-secondary text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    ID
                </a>
            </div>
        </div>
    );
}

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
    { value: 'en', label: 'English', flag: 'fi-us' },
    { value: 'id', label: 'Indonesia', flag: 'fi-id' },
];

const VARIANTS = {
    // For use on colorful/translucent backgrounds (sidebar, login, guest layout).
    default: 'bg-secondary/30 hover:border-secondary border border-transparent text-white',
    // For use on cards whose background matches the default variant's tint
    // (e.g. the secondary-colored card in Profile Edit), where the default
    // variant becomes nearly invisible. Mirrors the old solid button style.
    solid: 'bg-tertiary hover:bg-tertiary/90 border border-transparent text-base',
};

export default function LanguageSwitcher({ className = '', variant = 'default' }) {
    const { locale } = useTranslation();

    const handleChange = (value) => {
        if (value !== locale) {
            window.location.href = `/lang/${value}`;
        }
    };

    const currentLang = LANGUAGES.find(l => l.value === locale) || LANGUAGES[0];

    return (
        <Menu as="div" className={`relative inline-block text-left ${className}`}>
            <div>
                <Menu.Button className={`${VARIANTS[variant]} flex items-center justify-between w-full text-xs font-bold rounded-xl px-3 py-2 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary gap-2`}>
                    <span className="flex items-center gap-2">
                        <span className={`fi ${currentLang.flag} rounded-sm text-base`}></span>
                        <span>{currentLang.label}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-50 mt-1 w-full min-w-[120px] origin-top-right rounded-xl bg-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                    <div className="py-1">
                        {LANGUAGES.map((lang) => (
                            <Menu.Item key={lang.value}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleChange(lang.value)}
                                        className={`${
                                            active ? 'bg-primary/10 text-secondary' : 'text-tertiary'
                                        } group flex w-full items-center px-3 py-2 text-xs font-bold transition-colors gap-2`}
                                    >
                                        <span className={`fi ${lang.flag} rounded-sm text-base`}></span>
                                        {lang.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

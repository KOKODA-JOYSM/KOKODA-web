import { usePage } from '@inertiajs/react';
import { translations } from '../lang';

export function useTranslation() {
    const { props } = usePage();
    const locale = props?.locale || 'en';
    const dict = translations[locale] || translations['en'];

    const t = (key) => {
        return dict[key] || key; // fallback to key if not found
    };

    return { t, locale };
}

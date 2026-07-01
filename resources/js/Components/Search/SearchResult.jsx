import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SearchResult({ items, onItemClick }) {
    const { t } = useTranslation();
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="font-quicksand font-bold text-tertiary text-xl">{t('home.noItems')}</p>
                <p className="font-quicksand text-gray-text-field mt-2">{t('search.tryAdjustingFilters')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full pb-12">
            {items.map((item) => (
                <div key={item.id}
                    onClick={() => onItemClick && onItemClick(item)}
                    className="bg-secondary rounded-[20px] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 ease-out cursor-pointer p-3 flex flex-col md:flex-row gap-3"
                >
                    {/* Image Section */}
                    <div className="w-full md:w-44 h-44 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-tertiary opacity-40 flex items-center justify-center">
                                <span className="font-quicksand text-white font-bold text-sm">{t('search.noImage')}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="bg-base rounded-xl p-4 flex-1 relative flex flex-col min-h-[176px] min-w-0">
                        <h3 className="font-quicksand font-bold text-tertiary text-xl truncate">{item.title}</h3>

                        <div className="inline-flex items-center bg-tertiary text-base rounded-full px-3 py-1 text-xs font-semibold mt-1 max-w-full">
                            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="truncate">{item.location?.place_name || t('profile.unknownLocation')}</span>
                        </div>

                        {item.distance !== undefined && (
                            <div className="flex items-center gap-1 text-xs font-quicksand text-secondary font-bold mt-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {item.distance.toFixed(2)} {t('search.kmAway')}
                            </div>
                        )}

                        <p className="font-roboto text-tertiary mt-2 text-sm pr-28 break-words line-clamp-2">
                            {item.description} <span className="font-bold cursor-pointer">....... {t('profile.readMore')}</span>
                        </p>

                        <div className={`absolute bottom-3 right-3 w-[100px] text-center px-3 py-1.5 rounded-lg text-white font-bold text-sm shadow-sm ${item.type === 'lost' ? 'bg-label-lost' : 'bg-label-found'}`}>
                            {item.type === 'lost' ? t('profile.lostItem') : t('profile.foundItem')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

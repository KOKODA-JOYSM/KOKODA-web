import React from 'react';

export default function SearchResult({ items }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="font-quicksand font-bold text-tertiary text-xl">No items found</p>
                <p className="font-quicksand text-gray-text-field mt-2">Try adjusting your filters or search term</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full pb-12">
            {items.map((item) => (
                <div key={item.id} className="bg-secondary rounded-[20px] shadow-md p-3 flex flex-col md:flex-row gap-3">
                    {/* Image Section */}
                    <div className="w-full md:w-44 h-44 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-tertiary opacity-40 flex items-center justify-center">
                                <span className="font-quicksand text-white font-bold text-sm">No Image</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="bg-base rounded-xl p-4 flex-1 relative flex flex-col min-h-[176px]">
                        <h3 className="font-quicksand font-bold text-tertiary text-xl">{item.name}</h3>
                        
                        <div className="inline-flex items-center bg-[#2D1606] text-white rounded-full px-3 py-1 text-xs font-semibold mt-1 w-max">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {item.location}
                        </div>
                        
                        <p className="font-roboto text-tertiary mt-2 text-sm pr-28">
                            {item.description} <span className="font-bold cursor-pointer">....... Read More</span>
                        </p>
                        
                        <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-white font-bold text-sm shadow-sm ${item.type === 'lost' ? 'bg-[#D56666]' : 'bg-[#5D8CAD]'}`}>
                            {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
